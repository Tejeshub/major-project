from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Sequence
import uuid

from .models import Reminder

async def get_user_reminders(
    db: AsyncSession, 
    user_id: str, 
    limit: int = 50, 
    offset: int = 0
) -> tuple[Sequence[Reminder], int]:
    """
    Get all active reminders for a user, sorted by due_date ascending (closest first).
    """
    base_query = select(Reminder).where(Reminder.user_id == user_id)
    
    # Get total count
    count_stmt = select(func.count()).select_from(base_query.with_only_columns(Reminder.id).subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one_or_none() or 0
    
    # Get paginated items
    stmt = base_query.order_by(Reminder.due_date.asc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    items = result.scalars().all()
    
    return items, total

async def create_reminder(db: AsyncSession, reminder: Reminder) -> Reminder:
    """
    Persist a new reminder to the database.
    """
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder

async def get_reminder(db: AsyncSession, reminder_id: uuid.UUID) -> Reminder | None:
    """
    Fetch a single reminder by ID.
    """
    result = await db.execute(select(Reminder).where(Reminder.id == reminder_id))
    return result.scalars().first()

async def update_reminder(db: AsyncSession, reminder: Reminder) -> Reminder:
    """
    Commit changes made to an existing reminder object.
    """
    await db.commit()
    await db.refresh(reminder)
    return reminder

async def delete_reminder(db: AsyncSession, reminder: Reminder) -> None:
    """
    Delete a reminder from the database.
    """
    await db.delete(reminder)
    await db.commit()
