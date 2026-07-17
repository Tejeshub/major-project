import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.marketplace.service import create_order
from app.marketplace.schemas import OrderCreate, OrderItemCreate
from uuid import UUID

async def test():
    async with AsyncSessionLocal() as db:
        order_in = OrderCreate(items=[OrderItemCreate(product_id="a95a5ae8-59bc-4012-86e9-ec96048ee31f", quantity=1)])
        current_user = {"id": "dummy-buyer", "role": "buyer"}
        await create_order(db, order_in, current_user)

asyncio.run(test())
