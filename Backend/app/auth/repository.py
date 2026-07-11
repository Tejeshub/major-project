from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .models import User

async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: User) -> User:
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
