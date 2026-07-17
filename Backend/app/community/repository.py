from uuid import UUID
from typing import Sequence, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Post, PostComment, PostLike

async def create_post(db: AsyncSession, post: Post) -> Post:
    db.add(post)
    await db.flush()
    return post

async def get_posts(db: AsyncSession, limit: int, offset: int) -> Sequence[Post]:
    stmt = (
        select(Post)
        .options(selectinload(Post.comments))
        .order_by(Post.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_post_by_id(db: AsyncSession, post_id: UUID) -> Optional[Post]:
    stmt = select(Post).options(selectinload(Post.comments)).where(Post.id == post_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def create_comment(db: AsyncSession, comment: PostComment) -> PostComment:
    db.add(comment)
    await db.flush()
    return comment

async def add_like(db: AsyncSession, post_like: PostLike) -> PostLike:
    db.add(post_like)
    await db.flush()
    return post_like

async def remove_like(db: AsyncSession, post_id: UUID, user_id: str) -> bool:
    stmt = delete(PostLike).where(PostLike.post_id == post_id, PostLike.user_id == user_id)
    result = await db.execute(stmt)
    return result.rowcount > 0

async def get_user_likes_for_posts(db: AsyncSession, user_id: str, post_ids: list[UUID]) -> set[UUID]:
    if not post_ids:
        return set()
    stmt = select(PostLike.post_id).where(PostLike.user_id == user_id, PostLike.post_id.in_(post_ids))
    result = await db.execute(stmt)
    return set(result.scalars().all())
