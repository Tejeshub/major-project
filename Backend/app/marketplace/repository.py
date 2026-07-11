from uuid import UUID
from typing import Optional, Sequence
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Product, Order, OrderItem
from .schemas import ProductCreate


async def create_product(db: AsyncSession, product_in: ProductCreate, seller_id: str) -> Product:
    """Insert a new product into the database."""
    db_product = Product(
        seller_id=seller_id,
        name=product_in.name,
        category=product_in.category,
        price=product_in.price,
        stock=product_in.stock,
        gst_rate=product_in.gst_rate,
        image_url=product_in.image_url,
        is_active=True
    )
    db.add(db_product)
    # Note: We flush but do not commit. The Service layer is responsible for committing transactions.
    await db.flush()
    return db_product


async def get_product_by_id(db: AsyncSession, product_id: UUID) -> Optional[Product]:
    """Fetch a single product by ID. Can return inactive products (needed for past order history)."""
    stmt = select(Product).where(Product.id == product_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_products(
    db: AsyncSession, 
    limit: int = 20, 
    offset: int = 0, 
    category: Optional[str] = None, 
    keyword: Optional[str] = None
) -> tuple[Sequence[Product], int]:
    """
    Fetch active products with pagination, optional category, and keyword search.
    Returns a tuple of (items, total_count).
    """
    # Base query for counting totals
    count_stmt = select(func.count(Product.id)).where(Product.is_active == True)
    
    # Base query for fetching items
    stmt = select(Product).where(Product.is_active == True)
    
    # Apply category filter
    if category:
        count_stmt = count_stmt.where(Product.category == category)
        stmt = stmt.where(Product.category == category)
        
    # Apply keyword search (ILIKE is Postgres-specific for case-insensitive search)
    if keyword:
        search_pattern = f"%{keyword}%"
        condition = or_(
            Product.name.ilike(search_pattern),
            Product.category.ilike(search_pattern)
        )
        count_stmt = count_stmt.where(condition)
        stmt = stmt.where(condition)
        
    # Deterministic sorting for reliable pagination
    stmt = stmt.order_by(Product.created_at.desc(), Product.id.asc())
    
    # Apply pagination
    stmt = stmt.limit(limit).offset(offset)
    
    # Execute both queries
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    items_result = await db.execute(stmt)
    items = items_result.scalars().all()
    
    return items, total

# ----------------------------------------------------
# Order & Cart Operations
# ----------------------------------------------------
from sqlalchemy.orm import joinedload

async def get_products_for_update(db: AsyncSession, product_ids: list[UUID]) -> Sequence[Product]:
    """
    Fetch products and apply a ROW-LEVEL LOCK (Pessimistic Locking).
    This prevents race conditions when two users checkout the same item simultaneously.
    """
    stmt = select(Product).where(Product.id.in_(product_ids)).with_for_update()
    result = await db.execute(stmt)
    return result.scalars().all()


async def create_order(db: AsyncSession, order: Order) -> Order:
    """
    Insert the Order and its associated OrderItems into the database.
    Assumes `order.items` is already populated with OrderItem instances.
    """
    db.add(order)
    await db.flush()
    return order


async def get_order_by_id(db: AsyncSession, order_id: UUID) -> Optional[Order]:
    """Fetch a single order, eager-loading its items to prevent N+1 queries."""
    stmt = select(Order).options(joinedload(Order.items)).where(Order.id == order_id)
    result = await db.execute(stmt)
    return result.unique().scalar_one_or_none()


async def update_order_status(db: AsyncSession, order: Order, new_status: str, razorpay_order_id: Optional[str] = None) -> Order:
    """Update order status (e.g., from placed to paid)."""
    order.status = new_status
    if razorpay_order_id:
        order.razorpay_order_id = razorpay_order_id
    await db.flush()
    return order


async def get_orders_by_seller(
    db: AsyncSession, 
    seller_id: str, 
    limit: int = 20, 
    offset: int = 0
) -> tuple[Sequence[Order], int]:
    """
    Fetch orders that contain items sold by a specific nursery/seller.
    Requires joining Order -> OrderItem -> Product.
    """
    # Base joins
    base_join = (
        select(Order)
        .join(OrderItem, Order.id == OrderItem.order_id)
        .join(Product, OrderItem.product_id == Product.id)
        .where(Product.seller_id == seller_id)
    )
    
    # Count total distinct orders
    count_stmt = select(func.count(Order.id.distinct())).select_from(
        base_join.subquery()
    )
    
    # Fetch distinct orders with pagination and eager-load items
    stmt = (
        base_join
        .options(joinedload(Order.items))
        .distinct()
        .order_by(Order.created_at.desc(), Order.id.asc())
        .limit(limit)
        .offset(offset)
    )
    
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    items_result = await db.execute(stmt)
    items = items_result.unique().scalars().all()
    
    return items, total
