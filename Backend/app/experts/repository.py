from uuid import UUID
from typing import Optional, Sequence
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from .models import ExpertProfile, Consultation, ConsultationMessage

# --- Expert Profiles ---

async def create_expert_profile(db: AsyncSession, profile: ExpertProfile) -> ExpertProfile:
    db.add(profile)
    await db.flush()
    return profile

async def get_expert_profile_by_id(db: AsyncSession, expert_id: UUID) -> Optional[ExpertProfile]:
    stmt = select(ExpertProfile).where(ExpertProfile.id == expert_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def get_expert_profiles(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0
) -> tuple[Sequence[ExpertProfile], int]:
    count_stmt = select(func.count(ExpertProfile.id))
    stmt = select(ExpertProfile).order_by(ExpertProfile.rating.desc(), ExpertProfile.consultations_count.desc())
    
    stmt = stmt.limit(limit).offset(offset)
    
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    items_result = await db.execute(stmt)
    items = items_result.scalars().all()
    
    return items, total

# --- Consultations ---

async def create_consultation(db: AsyncSession, consultation: Consultation) -> Consultation:
    db.add(consultation)
    await db.flush()
    return consultation

async def get_consultation_by_id(db: AsyncSession, consultation_id: UUID) -> Optional[Consultation]:
    # Eager load expert and messages
    stmt = (
        select(Consultation)
        .options(joinedload(Consultation.expert), joinedload(Consultation.messages))
        .where(Consultation.id == consultation_id)
    )
    result = await db.execute(stmt)
    return result.unique().scalar_one_or_none()

async def get_consultations_for_user(
    db: AsyncSession,
    user_id: str,
    limit: int = 20,
    offset: int = 0
) -> tuple[Sequence[Consultation], int]:
    """
    Fetch consultations where the user is either the gardener (user_id)
    or the expert (expert.user_id). Eager loads the expert profile and messages.
    """
    # Build condition
    condition = or_(
        Consultation.user_id == user_id,
        ExpertProfile.user_id == user_id
    )

    base_join = select(Consultation).join(ExpertProfile, Consultation.expert_id == ExpertProfile.id)
    
    count_stmt = select(func.count()).select_from(
        base_join.where(condition).with_only_columns(Consultation.id).subquery()
    )
    
    stmt = (
        base_join
        .where(condition)
        .options(joinedload(Consultation.expert), joinedload(Consultation.messages))
        .order_by(Consultation.booked_at.desc())
        .limit(limit)
        .offset(offset)
    )
    
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    items_result = await db.execute(stmt)
    items = items_result.unique().scalars().all()
    
    return items, total

async def update_consultation_status(db: AsyncSession, consultation: Consultation, new_status: str) -> Consultation:
    consultation.status = new_status
    await db.flush()
    return consultation

# --- Consultation Messages ---

async def create_message(db: AsyncSession, message: ConsultationMessage) -> ConsultationMessage:
    db.add(message)
    await db.flush()
    return message
