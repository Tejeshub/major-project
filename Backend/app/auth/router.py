from fastapi import APIRouter, Depends
from . import schemas, service, models

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.get("/me", response_model=schemas.UserResponse)
async def get_me(current_user: models.User = Depends(service.get_current_user)):
    """
    Get the currently authenticated user's profile.
    This also auto-creates the user if they don't exist yet.
    """
    return current_user
