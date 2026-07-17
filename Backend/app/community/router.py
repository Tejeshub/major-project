from fastapi import APIRouter, Depends, Query, Path
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from . import schemas, service

# TODO: Dependency injection for auth to be implemented later by Developer A
def mock_get_current_user():
    # Use gardener@example.com UUID to satisfy foreign key constraints across modules
    return {"id": "4b31866c-a9d8-43ec-a539-66d8e973af79", "name": "Tejesh", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tejesh", "city": "Mumbai"}

router = APIRouter(
    prefix="/api/v1/posts",
    tags=["community"]
)

@router.get("", response_model=schemas.PaginatedPostResponse)
async def get_posts(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Get a paginated list of community posts."""
    # Assuming public feeds exist, but we still pass current_user to flag 'liked: bool'
    return await service.get_posts(db=db, limit=limit, offset=offset, current_user_id=current_user["id"])

@router.post("", response_model=schemas.PostResponse, status_code=201)
async def create_post(
    request: schemas.PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Create a new post."""
    return await service.create_post(db=db, request=request, current_user_id=current_user["id"])

@router.post("/{post_id}/comments", response_model=schemas.CommentResponse, status_code=201)
async def add_comment(
    request: schemas.CommentCreate,
    post_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Add a comment to a post."""
    return await service.add_comment(db=db, post_id=post_id, request=request, current_user_id=current_user["id"])

@router.post("/{post_id}/like", status_code=204)
async def like_post(
    post_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Like a post."""
    await service.like_post(db=db, post_id=post_id, current_user_id=current_user["id"])

@router.delete("/{post_id}/like", status_code=204)
async def unlike_post(
    post_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Unlike a post."""
    await service.unlike_post(db=db, post_id=post_id, current_user_id=current_user["id"])
