from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Foreign Keys
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plant_id: Mapped[int] = mapped_column(Integer, ForeignKey("plant_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Core Fields
    type: Mapped[str] = mapped_column(String, nullable=False) # e.g., "Water", "Fertilize", "Prune"
    due_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    repeat_rule: Mapped[str] = mapped_column(String, nullable=False, default="none")
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending") # "pending" or "completed"
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Note: We avoid bidirectional relationship backpopulates onto User/PlantProfile models 
    # directly here to prevent modifying previously completed modules.
