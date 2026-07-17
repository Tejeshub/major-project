from fastapi import APIRouter, Depends, Query, status
from typing import Optional, Any
from uuid import uuid4, UUID
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

from . import service
from .schemas import (
    ProductCreate,
    ProductResponse,
    OrderCreate,
    OrderResponse,
    RazorpayVerifyRequest,
    PaginatedResponse,
    OrderItemResponse,
    OrderSummaryResponse
)

router = APIRouter(prefix="/api/v1", tags=["Marketplace"])

# TODO: Replace with actual auth dependency once Developer A completes auth module
async def mock_get_current_user() -> Any:
    return {"id": "dummy-seller-id", "role": "nursery"}


@router.get("/products", response_model=PaginatedResponse[ProductResponse])
async def get_products(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    category: Optional[str] = None,
    keyword: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Browse public product catalog."""
    items, total = await service.get_products(
        db=db, limit=limit, offset=offset, category=category, keyword=keyword
    )
    return PaginatedResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset
    )


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a single product by ID."""
    return await service.get_product_by_id(db=db, product_id=product_id)


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new product (Nursery role only)."""
    return await service.create_product(db=db, product_in=product_in, current_user=current_user)


@router.patch("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_in: dict, # Using dict for partial updates for now
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mock update product endpoint for Seller Dashboard."""
    # Note: Quick mock implementation to support frontend migration
    return {"id": product_id, **product_in, "seller_id": current_user["id"], "is_active": True, "created_at": datetime.now(), "updated_at": datetime.now(), "seller": "Mock Seller", "verified": True}


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: UUID,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mock delete product endpoint for Seller Dashboard."""
    return None


@router.post("/orders/summary", response_model=OrderSummaryResponse)
async def get_order_summary(
    order_in: OrderCreate,
    db: AsyncSession = Depends(get_db)
):
    """Calculate checkout totals dynamically from cart contents."""
    return await service.get_order_summary(db=db, order_in=order_in)


@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Checkout cart, compute exact pricing, and initialize Razorpay."""
    return await service.create_order(db=db, order_in=order_in, current_user=current_user)


@router.post("/orders/{order_id}/verify", response_model=OrderResponse)
async def verify_payment(
    order_id: UUID,
    verify_in: RazorpayVerifyRequest,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify Razorpay payment signature."""
    return await service.verify_payment(
        db=db, 
        order_id=order_id, 
        verify_in=verify_in, 
        current_user=current_user
    )


@router.get("/orders", response_model=PaginatedResponse[OrderResponse])
async def get_my_orders(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """View order history for a Buyer."""
    # Mock return for frontend migration
    return PaginatedResponse(items=[], total=0, limit=limit, offset=offset)

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a single order by ID."""
    # Note: quick mock for frontend migration
    return None

@router.get("/orders/seller", response_model=PaginatedResponse[OrderResponse])
async def get_seller_orders(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """View incoming orders for a Nursery."""
    items, total = await service.get_seller_orders(
        db=db, current_user=current_user, limit=limit, offset=offset
    )
    return PaginatedResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset
    )
