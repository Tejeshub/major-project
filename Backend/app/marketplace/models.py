import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, CheckConstraint, Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

# TODO: Developer A must create `backend/app/core/database.py` with `Base = declarative_base()`
# For now, we assume it will be available at `app.core.database`
try:
    from app.core.database import Base
except ImportError:
    # Dummy Base for standalone validation if core isn't ready
    from sqlalchemy.orm import declarative_base
    Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    # seller_id references the external users table managed by Supabase/Auth module
    seller_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Financial and Inventory (Strictly Integers)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    gst_rate: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("price >= 0", name="chk_product_price_positive"),
        CheckConstraint("stock >= 0", name="chk_product_stock_positive"),
        CheckConstraint("gst_rate >= 0 AND gst_rate <= 100", name="chk_product_gst_rate"),
        Index("ix_product_category_active", "category", "is_active")
    )


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    # buyer_id references the external users table managed by Supabase/Auth module
    buyer_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    
    # Valid statuses: 'placed', 'paid', 'shipped', 'cancelled'
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="placed")
    
    # Financial breakdown (Strictly Integers)
    total_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    base_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    gst_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    commission_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    
    razorpay_order_id: Mapped[str] = mapped_column(String, index=True, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship to order items
    items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem", 
        back_populates="order", 
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('placed', 'paid', 'shipped', 'cancelled')", 
            name="chk_order_status_valid"
        ),
        Index("ix_orders_buyer_created", "buyer_id", "created_at")
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    
    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), 
        index=True, 
        nullable=False
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="RESTRICT"), 
        index=True, 
        nullable=False
    )
    
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)  # Snapshot price at time of purchase

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product")

    __table_args__ = (
        CheckConstraint("quantity > 0", name="chk_order_item_qty_positive"),
        CheckConstraint("price >= 0", name="chk_order_item_price_positive"),
    )
