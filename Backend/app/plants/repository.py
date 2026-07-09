from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .models import PlantProfile
from .schemas import PlantCreate, PlantUpdate

async def get_plants_by_user_id(db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0):
    query = select(PlantProfile).where(PlantProfile.user_id == user_id).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()

async def get_plant_by_id(db: AsyncSession, plant_id: int) -> PlantProfile | None:
    result = await db.execute(select(PlantProfile).where(PlantProfile.id == plant_id))
    return result.scalars().first()

async def create_plant(db: AsyncSession, user_id: str, plant_in: PlantCreate) -> PlantProfile:
    new_plant = PlantProfile(
        user_id=user_id,
        species=plant_in.species,
        nickname=plant_in.nickname,
        location_type=plant_in.location_type
    )
    db.add(new_plant)
    await db.commit()
    await db.refresh(new_plant)
    return new_plant

async def update_plant(db: AsyncSession, db_plant: PlantProfile, plant_update: PlantUpdate) -> PlantProfile:
    update_data = plant_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_plant, key, value)
        
    db.add(db_plant)
    await db.commit()
    await db.refresh(db_plant)
    return db_plant
