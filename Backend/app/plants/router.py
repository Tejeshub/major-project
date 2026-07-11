from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.auth.service import get_current_user
from app.auth.models import User
from . import schemas, service

router = APIRouter(prefix="/api/v1/plants", tags=["plants"])

@router.post("", response_model=schemas.PlantResponse)
async def create_plant(
    plant_in: schemas.PlantCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a new plant."""
    return await service.add_plant(db, current_user, plant_in)

@router.get("")
async def get_plants(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List current user's plants."""
    return await service.list_plants(db, current_user, limit, offset)

@router.patch("/{id}", response_model=schemas.PlantResponse)
async def update_plant(
    id: int,
    plant_update: schemas.PlantUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Edit plant details."""
    return await service.modify_plant(db, current_user, id, plant_update)
