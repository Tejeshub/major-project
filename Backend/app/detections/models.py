from sqlalchemy import String, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.core.database import Base

class Detection(Base):
    __tablename__ = "detections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    plant_id: Mapped[int] = mapped_column(Integer, ForeignKey("plant_profiles.id"), nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=False)
    disease_name: Mapped[str] = mapped_column(String, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    treatment_text: Mapped[str] = mapped_column(String, nullable=True)
    weather_snapshot: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
