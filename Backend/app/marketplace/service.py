from uuid import UUID
from typing import Optional, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import os
import hmac
import hashlib

from . import repository
from .schemas import ProductCreate, ProductResponse, OrderCreate, RazorpayVerifyRequest
from .models import Product, Order, OrderItem


async def create_product(
    db: AsyncSession, 
    product_in: ProductCreate, 
    current_user: dict[str, Any]
) -> Product:
    """Business logic for creating a product."""
    
    # 1. Enforce Role Validation
    if current_user.get("role") != "nursery":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only verified nurseries can create products."
        )
    
    # 2. Call Repository
    try:
        product = await repository.create_product(
            db=db, 
            product_in=product_in, 
            seller_id=current_user["id"]
        )
        
        # 3. Commit Transaction
        await db.commit()
        await db.refresh(product)
        return product
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create product."
        )


async def get_products(
    db: AsyncSession, 
    limit: int, 
    offset: int, 
    category: Optional[str] = None, 
    keyword: Optional[str] = None
) -> tuple[list[Product], int]:
    """Business logic for fetching products."""
    # Pass-through to repository, no complex business rules needed for reading public data
    items, total = await repository.get_products(
        db=db, 
        limit=limit, 
        offset=offset, 
        category=category, 
        keyword=keyword
    )
    return list(items), total


async def search_products_for_ai(
    db: AsyncSession, 
    keyword: str, 
    limit: int = 3
) -> list[dict[str, Any]]:
    """
    Dedicated interface for Developer A's AI Recommendation Agent.
    Returns highly stripped-down dictionaries to save LLM context window tokens.
    """
    items, _ = await repository.get_products(db=db, limit=limit, offset=0, keyword=keyword)
    
    # Return minimal data for the LLM
    return [
        {
            "id": str(item.id),
            "name": item.name,
            "price_inr": item.price / 100,  # Convert paise to INR for LLM readability
            "rating": "4.5" # Dummy metric until reviews are implemented
        }
        for item in items
    ]


async def create_order(
    db: AsyncSession, 
    order_in: OrderCreate, 
    current_user: dict[str, Any]
) -> Order:
    """Business logic for atomic checkout and pricing."""
    
    # 1. Extract IDs and quantities
    requested_items = {item.product_id: item.quantity for item in order_in.items}
    product_ids = list(requested_items.keys())
    
    try:
        # 2. Lock the specific product rows to prevent concurrent overselling
        locked_products = await repository.get_products_for_update(db, product_ids)
        
        if len(locked_products) != len(product_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more products in the cart do not exist or are inactive."
            )

        total_base = 0
        total_gst = 0
        total_commission = 0
        order_items = []

        # 3. Calculate math and deduct stock
        for product in locked_products:
            requested_qty = requested_items[product.id]
            
            if product.stock < requested_qty:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {product.name}. Available: {product.stock}"
                )
            
            # Deduct stock (since the row is locked, this is safe)
            product.stock -= requested_qty
            
            # Financial Math (all in integers/paise)
            item_base = product.price * requested_qty
            item_gst = (item_base * product.gst_rate) // 100
            item_commission = (item_base * 10) // 100 # Assuming flat 10% platform commission
            
            total_base += item_base
            total_gst += item_gst
            total_commission += item_commission
            
            # Create snapshot item
            order_items.append(
                OrderItem(
                    product_id=product.id,
                    quantity=requested_qty,
                    price=product.price
                )
            )

        # 4. Construct the Order
        total_amount = total_base + total_gst + total_commission
        
        new_order = Order(
            buyer_id=current_user["id"],
            status="placed",
            total_amount=total_amount,
            base_amount=total_base,
            gst_amount=total_gst,
            commission_amount=total_commission,
            items=order_items,
            # TODO: Part 7C will replace this with real Razorpay API call
            razorpay_order_id=f"rzp_mock_{uuid4().hex[:8]}" 
        )
        
        # 5. Save and commit transaction
        created_order = await repository.create_order(db, new_order)
        await db.commit()
        await db.refresh(created_order)
        return created_order

    except HTTPException:
        # Re-raise HTTP exceptions (like out of stock) after rollback
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process checkout."
        )


async def get_seller_orders(
    db: AsyncSession, 
    current_user: dict[str, Any], 
    limit: int, 
    offset: int
) -> tuple[list[Order], int]:
    """Fetch orders for a specific nursery."""
    if current_user.get("role") != "nursery":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only verified nurseries can view incoming orders."
        )
        
    items, total = await repository.get_orders_by_seller(
        db=db, 
        seller_id=current_user["id"], 
        limit=limit, 
        offset=offset
    )
    return list(items), total


async def verify_payment(
    db: AsyncSession,
    order_id: UUID,
    verify_in: RazorpayVerifyRequest,
    current_user: dict[str, Any]
) -> Order:
    """Verify Razorpay payment signature and update order status."""
    
    # 1. Fetch Order
    order = await repository.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found."
        )
        
    # Security: Ensure only the buyer can verify their own order
    if order.buyer_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to verify this order."
        )
        
    # 2. Idempotency Check
    if order.status == "paid":
        return order
        
    if order.status != "placed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot verify order in {order.status} state."
        )
        
    # 3. Signature Verification
    # Note: In a real app, read from core.settings. For now, reading from os.env.
    razorpay_secret = os.environ.get("RAZORPAY_KEY_SECRET", "dummy_secret_for_local_dev")
    
    message = f"{verify_in.razorpay_order_id}|{verify_in.razorpay_payment_id}"
    generated_signature = hmac.new(
        key=razorpay_secret.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()
    
    # Use hmac.compare_digest to prevent timing attacks
    if not hmac.compare_digest(generated_signature, verify_in.razorpay_signature):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment signature."
        )
        
    # 4. Update Status & Commit
    try:
        updated_order = await repository.update_order_status(
            db=db, 
            order=order, 
            new_status="paid"
        )
        await db.commit()
        await db.refresh(updated_order)
        
        # TODO: Trigger BackgroundTask to call notifications.service.send_notification(updated_order)
        
        return updated_order
    except Exception:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update order status."
        )
