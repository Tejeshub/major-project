from fastapi import APIRouter, Depends, Query, status
from typing import Optional, Any
from uuid import uuid4
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from . import service
from .schemas import (
    ProductCreate,
    ProductResponse,
    OrderCreate,
    OrderResponse,
    RazorpayVerifyRequest,
    PaginatedResponse,
    OrderItemResponse
)

router = APIRouter(prefix="/api/v1", tags=["Marketplace"])

# TODO: Replace with actual auth dependency once Developer A completes auth module
async def mock_get_current_user() -> Any:
    return {"id": "user-uuid-123", "role": "nursery"}

# TODO: Replace with actual db dependency from core module
async def mock_get_db_session() -> AsyncSession:
    pass


@router.get("/products", response_model=PaginatedResponse[ProductResponse])
async def get_products(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    category: Optional[str] = None,
    keyword: Optional[str] = None,
    db: AsyncSession = Depends(mock_get_db_session)
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


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(mock_get_db_session)
):
    """Create a new product (Nursery role only)."""
    return await service.create_product(db=db, product_in=product_in, current_user=current_user)


@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(mock_get_db_session)
):
    """Checkout cart, compute exact pricing, and initialize Razorpay."""
    return await service.create_order(db=db, order_in=order_in, current_user=current_user)


@router.post("/orders/{order_id}/verify", response_model=OrderResponse)
async def verify_payment(
    order_id: UUID,
    verify_in: RazorpayVerifyRequest,
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(mock_get_db_session)
):
    """Verify Razorpay payment signature."""
    return await service.verify_payment(
        db=db, 
        order_id=order_id, 
        verify_in=verify_in, 
        current_user=current_user
    )


@router.get("/orders/seller", response_model=PaginatedResponse[OrderResponse])
async def get_seller_orders(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Any = Depends(mock_get_current_user),
    db: AsyncSession = Depends(mock_get_db_session)
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
