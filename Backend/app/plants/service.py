from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from . import repository, schemas
from app.auth.models import User

async def list_plants(db: AsyncSession, user: User, limit: int = 20, offset: int = 0):
    plants = await repository.get_plants_by_user_id(db, user.id, limit, offset)
    return {
        "items": plants,
        "total": len(plants), 
        "limit": limit,
        "offset": offset
    }

async def add_plant(db: AsyncSession, user: User, plant_in: schemas.PlantCreate):
    return await repository.create_plant(db, user.id, plant_in)

async def modify_plant(db: AsyncSession, user: User, plant_id: int, plant_update: schemas.PlantUpdate):
    plant = await repository.get_plant_by_id(db, plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    if plant.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this plant")
        
    return await repository.update_plant(db, plant, plant_update)
