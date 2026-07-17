from sqlalchemy import Column, Integer, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    lat = Column(Float, nullable=False, index=True)
    lng = Column(Float, nullable=False, index=True)
    payload = Column(JSON, nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
