from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from uuid import UUID
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from . import repository, models, schemas

# Dummy user hydrator since Developer A hasn't built Auth/Users service yet
def hydrate_user_profile(user_id: str) -> dict:
    # In the future, this calls: auth.service.get_user(user_id)
    return {
        "user": f"User_{user_id[:5]}",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_id}",
        "city": "Unknown"
    }

def format_ts(dt: datetime) -> str:
    # For now, just return ISO format. Frontend can parse this or we return a relative string
    return dt.isoformat()

async def get_posts(db: AsyncSession, limit: int, offset: int, current_user_id: str = None) -> schemas.PaginatedPostResponse:
    posts = await repository.get_posts(db, limit=limit, offset=offset)
    
    # Pre-fetch the set of posts the current user has liked to avoid N+1 queries
    post_ids = [p.id for p in posts]
    liked_post_ids = set()
    if current_user_id and post_ids:
        liked_post_ids = await repository.get_user_likes_for_posts(db, current_user_id, post_ids)

    response_items = []
    for p in posts:
        profile = hydrate_user_profile(p.author_id)
        # If the author is the current dummy user, use their real name from the router's dummy auth
        if p.author_id == current_user_id:
            profile = {"user": "Tejesh", "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed=Tejesh", "city": "Mumbai"}
            
        comments = []
        for c in p.comments:
            c_profile = hydrate_user_profile(c.author_id)
            if c.author_id == current_user_id:
                c_profile = {"user": "Tejesh", "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed=Tejesh", "city": "Mumbai"}
            comments.append(schemas.CommentResponse(
                id=c.id,
                user=c_profile["user"],
                avatar=c_profile["avatar"],
                text=c.content,
                ts=format_ts(c.created_at)
            ))
            
        response_items.append(schemas.PostResponse(
            id=p.id,
            user=profile["user"],
            avatar=profile["avatar"],
            city=profile["city"],
            image=p.image_url,
            caption=p.caption,
            likes=p.like_count,
            liked=p.id in liked_post_ids,
            ts=format_ts(p.created_at),
            comments=comments
        ))

    # In a real app we would do a fast COUNT(*) query or rely on a generic cache
    # Returning 100 as total for now since offset pagination on feeds is often estimated
    return schemas.PaginatedPostResponse(
        items=response_items,
        total=100,
        limit=limit,
        offset=offset
    )

async def create_post(db: AsyncSession, request: schemas.PostCreate, current_user_id: str) -> schemas.PostResponse:
    new_post = models.Post(
        author_id=current_user_id,
        caption=request.caption,
        image_url=request.image
    )
    created_post = await repository.create_post(db, new_post)
    await db.commit()
    # No need to db.refresh since expire_on_commit is False in our config
    
    profile = {"user": "Tejesh", "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed=Tejesh", "city": "Mumbai"}
    return schemas.PostResponse(
        id=created_post.id,
        user=profile["user"],
        avatar=profile["avatar"],
        city=profile["city"],
        image=created_post.image_url,
        caption=created_post.caption,
        likes=created_post.like_count,
        liked=False,
        ts=format_ts(created_post.created_at),
        comments=[]
    )

async def add_comment(db: AsyncSession, post_id: UUID, request: schemas.CommentCreate, current_user_id: str) -> schemas.CommentResponse:
    post = await repository.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    new_comment = models.PostComment(
        post_id=post_id,
        author_id=current_user_id,
        content=request.text
    )
    
    # Increment counter atomically
    post.comment_count = models.Post.comment_count + 1
    
    created_comment = await repository.create_comment(db, new_comment)
    await db.commit()
    
    profile = {"user": "Tejesh", "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed=Tejesh", "city": "Mumbai"}
    return schemas.CommentResponse(
        id=created_comment.id,
        user=profile["user"],
        avatar=profile["avatar"],
        text=created_comment.content,
        ts=format_ts(created_comment.created_at)
    )

async def like_post(db: AsyncSession, post_id: UUID, current_user_id: str):
    post = await repository.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    new_like = models.PostLike(
        post_id=post_id,
        user_id=current_user_id
    )
    
    try:
        await repository.add_like(db, new_like)
        # Increment counter atomically
        post.like_count = models.Post.like_count + 1
        await db.commit()
    except IntegrityError:
        await db.rollback()
        # Already liked, which is fine (idempotent)
        pass

async def unlike_post(db: AsyncSession, post_id: UUID, current_user_id: str):
    post = await repository.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    removed = await repository.remove_like(db, post_id, current_user_id)
    if removed:
        # Decrement counter atomically
        post.like_count = models.Post.like_count - 1
        await db.commit()
