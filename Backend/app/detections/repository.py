from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from . import models, schemas

async def create_detection(db: AsyncSession, detection_data: dict) -> models.Detection:
    db_detection = models.Detection(**detection_data)
    db.add(db_detection)
    await db.commit()
    await db.refresh(db_detection)
    return db_detection

async def get_detections_by_plant_id(db: AsyncSession, plant_id: int) -> List[models.Detection]:
    result = await db.execute(
        select(models.Detection).where(models.Detection.plant_id == plant_id).order_by(models.Detection.created_at.desc())
    )
    return list(result.scalars().all())
