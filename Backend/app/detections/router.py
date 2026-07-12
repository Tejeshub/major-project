from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime
from app.core.database import get_db
from . import schemas, service, repository

router = APIRouter(prefix="/api/v1/detections", tags=["detections"])

@router.post("/upload-url", response_model=schemas.UploadURLResponse)
async def get_upload_url():
    """
    Returns a dummy signed URL for image upload.
    In Part 3, this will call Supabase Storage.
    """
    return await service.generate_upload_url()

@router.post("", response_model=schemas.DetectionResponse)
async def create_detection(detection_data: schemas.DetectionCreate, db: AsyncSession = Depends(get_db)):
    """
    Simulates triggering the AI disease detection pipeline.
    Saves the detection result to the database.
    """
    return await service.process_detection(db, detection_data)

@router.get("", response_model=List[schemas.DetectionResponse])
async def get_detections(plant_id: int, db: AsyncSession = Depends(get_db)):
    """
    Returns actual detection history from the database for a given plant.
    """
    return await repository.get_detections_by_plant_id(db, plant_id)
