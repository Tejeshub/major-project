import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Index, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

try:
    from app.core.database import Base
except ImportError:
    from sqlalchemy.orm import declarative_base
    Base = declarative_base()

class ExpertProfile(Base):
    __tablename__ = "expert_profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=False)
    specialisation: Mapped[str] = mapped_column(String(100), nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    consultations_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    city: Mapped[str] = mapped_column(String(100), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    consultations: Mapped[list["Consultation"]] = relationship(
        "Consultation",
        back_populates="expert",
        cascade="all, delete-orphan",
        order_by="desc(Consultation.booked_at)"
    )

    __table_args__ = (
        CheckConstraint("rating >= 0 AND rating <= 5", name="chk_expert_rating_range"),
        CheckConstraint("price >= 0", name="chk_expert_price_positive"),
        CheckConstraint("consultations_count >= 0", name="chk_expert_consultations_count_positive"),
        Index("ix_expert_profiles_specialisation", "specialisation"),
    )


class Consultation(Base):
    __tablename__ = "consultations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    expert_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("expert_profiles.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    slot: Mapped[str] = mapped_column(String(100), nullable=False)
    mode: Mapped[str] = mapped_column(String(50), default="Chat", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Pending", nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    booked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    review_rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    review_text: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    expert: Mapped["ExpertProfile"] = relationship("ExpertProfile", back_populates="consultations")
    messages: Mapped[list["ConsultationMessage"]] = relationship(
        "ConsultationMessage",
        back_populates="consultation",
        cascade="all, delete-orphan",
        order_by="asc(ConsultationMessage.created_at)"
    )

    __table_args__ = (
        CheckConstraint("status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')", name="chk_consultation_status"),
        CheckConstraint("mode IN ('Chat', 'Video')", name="chk_consultation_mode"),
        CheckConstraint("review_rating IS NULL OR (review_rating >= 1 AND review_rating <= 5)", name="chk_consultation_review_rating"),
        Index("ix_consultations_user_id_status", "user_id", "status"),
    )


class ConsultationMessage(Base):
    __tablename__ = "consultation_messages"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    consultation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("consultations.id", ondelete="CASCADE"), index=True, nullable=False)
    sender_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    text: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    consultation: Mapped["Consultation"] = relationship("Consultation", back_populates="messages")
