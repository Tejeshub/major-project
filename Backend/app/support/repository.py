from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .models import SupportTicket
from typing import Sequence, Optional
import uuid

async def create_support_ticket(db: AsyncSession, ticket: SupportTicket) -> SupportTicket:
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket

async def get_user_support_tickets(db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0) -> Sequence[SupportTicket]:
    result = await db.execute(
        select(SupportTicket)
        .where(SupportTicket.user_id == user_id)
        .order_by(SupportTicket.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()

async def count_user_support_tickets(db: AsyncSession, user_id: str) -> int:
    from sqlalchemy import func
    result = await db.execute(
        select(func.count(SupportTicket.id))
        .where(SupportTicket.user_id == user_id)
    )
    return result.scalar() or 0

async def get_support_ticket_by_id(db: AsyncSession, ticket_id: uuid.UUID) -> Optional[SupportTicket]:
    return await db.get(SupportTicket, ticket_id)
