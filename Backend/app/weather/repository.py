from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta, timezone
from typing import Optional
from .models import WeatherCache

async def get_valid_weather_cache(db: AsyncSession, lat: float, lng: float, ttl_hours: int = 1) -> Optional[WeatherCache]:
    # Set a small bounding box for coordinates to catch near matches if needed,
    # but for simplicity, exact match rounding to 2 decimal places is good enough.
    # In real apps, you might use PostGIS or rounding. We'll round before querying.
    lat = round(lat, 2)
    lng = round(lng, 2)
    
    cutoff = datetime.now(timezone.utc) - timedelta(hours=ttl_hours)
    
    result = await db.execute(
        select(WeatherCache)
        .where(WeatherCache.lat == lat)
        .where(WeatherCache.lng == lng)
        .where(WeatherCache.fetched_at >= cutoff)
        .order_by(WeatherCache.fetched_at.desc())
    )
    return result.scalars().first()

async def save_weather_cache(db: AsyncSession, lat: float, lng: float, payload: dict) -> WeatherCache:
    lat = round(lat, 2)
    lng = round(lng, 2)
    
    cache_entry = WeatherCache(
        lat=lat,
        lng=lng,
        payload=payload
    )
    db.add(cache_entry)
    await db.commit()
    await db.refresh(cache_entry)
    return cache_entry
