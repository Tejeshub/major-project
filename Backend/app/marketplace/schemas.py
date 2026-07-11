from pydantic import BaseModel, Field, ConfigDict, AnyUrl
from typing import Optional, TypeVar, Generic
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    """Base fields shared across multiple product schemas."""
    name: str = Field(..., min_length=2, max_length=150, description="Name of the product")
    category: str = Field(..., min_length=2, max_length=50, description="Category (e.g., fertilizer, tools, plants)")
    price: int = Field(..., ge=0, description="Price in paise/cents to avoid float rounding errors")
    stock: int = Field(..., ge=0, description="Available inventory count")
    gst_rate: int = Field(..., ge=0, le=100, description="GST rate percentage (e.g., 5, 12, 18)")
    image_url: Optional[str] = Field(None, max_length=500, description="Supabase storage path or URL")

class ProductCreate(ProductBase):
    """Schema for POST /api/v1/products (Nursery role only)."""
    pass

class ProductUpdate(BaseModel):
    """Schema for PATCH /api/v1/products/{id} (Partial updates)."""
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    price: Optional[int] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)
    gst_rate: Optional[int] = Field(None, ge=0, le=100)
    image_url: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = Field(None, description="Set to false to soft-delete the product")

class ProductResponse(ProductBase):
    """Schema for data returned to the client."""
    id: UUID
    seller_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    # This config tells Pydantic to read data even if it's not a dict, but an ORM model
    model_config = ConfigDict(from_attributes=True)

# ----------------------------------------------------
# Order & Cart Schemas
# ----------------------------------------------------

class OrderItemCreate(BaseModel):
    """Schema for a single item in the cart when creating an order."""
    product_id: UUID = Field(..., description="The ID of the product being purchased")
    quantity: int = Field(..., gt=0, description="Quantity must be at least 1")

class OrderCreate(BaseModel):
    """Schema for POST /api/v1/orders (Checkout payload)."""
    items: list[OrderItemCreate] = Field(..., min_length=1, description="List of items in the cart")

class OrderItemResponse(BaseModel):
    """Schema for an individual item inside an Order response."""
    id: UUID
    product_id: UUID
    quantity: int
    price: int  # Historical price at time of purchase
    
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    """Schema for returning order details."""
    id: UUID
    buyer_id: str
    status: str
    total_amount: int
    base_amount: int
    gst_amount: int
    commission_amount: int
    razorpay_order_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)

# ----------------------------------------------------
# Payment Schemas
# ----------------------------------------------------

class RazorpayVerifyRequest(BaseModel):
    """Schema for verifying a successful Razorpay payment callback."""
    razorpay_payment_id: str = Field(..., min_length=1)
    razorpay_order_id: str = Field(..., min_length=1)
    razorpay_signature: str = Field(..., min_length=1)

# ----------------------------------------------------
# Pagination Envelopes
# ----------------------------------------------------

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """
    Standard generic pagination envelope.
    Ensures all lists returned by the API have the exact same structure.
    Usage: PaginatedResponse[ProductResponse]
    """
    items: list[T]
    total: int = Field(..., ge=0, description="Total number of items across all pages")
    limit: int = Field(..., ge=1, description="Number of items returned in this page")
    offset: int = Field(..., ge=0, description="Offset used for this page")
