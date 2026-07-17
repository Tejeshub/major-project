from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from .models import Notification
from typing import Sequence, Optional
import uuid

async def create_notification(db: AsyncSession, notification: Notification) -> Notification:
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification

async def get_user_notifications(db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0) -> Sequence[Notification]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()

async def count_user_notifications(db: AsyncSession, user_id: str) -> int:
    from sqlalchemy import func
    result = await db.execute(
        select(func.count(Notification.id))
        .where(Notification.user_id == user_id)
    )
    return result.scalar() or 0

async def get_notification_by_id(db: AsyncSession, notification_id: uuid.UUID) -> Optional[Notification]:
    return await db.get(Notification, notification_id)

async def mark_notification_read(db: AsyncSession, notification: Notification) -> Notification:
    from datetime import datetime, timezone
    notification.is_read = True
    notification.read_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(notification)
    return notification

async def mark_all_user_notifications_read(db: AsyncSession, user_id: str):
    from datetime import datetime, timezone
    await db.execute(
        update(Notification)
        .where(Notification.user_id == user_id)
        .where(Notification.is_read == False)
        .values(is_read=True, read_at=datetime.now(timezone.utc))
    )
    await db.commit()
