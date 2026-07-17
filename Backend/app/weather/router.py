from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from . import schemas, service

router = APIRouter(
    prefix="/api/v1/weather",
    tags=["Weather"]
)

@router.get("", response_model=schemas.WeatherResponse)
async def get_weather(lat: float, lng: float, db: AsyncSession = Depends(get_db)):
    """
    Get weather for a location. Checks the database cache first.
    If the cache is expired or missing, fetches from Open-Meteo.
    """
    return await service.get_weather_snapshot(db, lat, lng)
