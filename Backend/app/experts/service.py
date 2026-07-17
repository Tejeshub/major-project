from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from uuid import UUID

from . import repository, models, schemas

def format_ts(dt) -> str:
    return dt.isoformat() if dt else ""

async def get_experts(db: AsyncSession, limit: int, offset: int) -> schemas.ExpertProfileListResponse:
    items, total = await repository.get_expert_profiles(db, limit=limit, offset=offset)
    
    response_items = []
    for p in items:
        response_items.append(schemas.ExpertProfileResponse(
            id=p.id,
            user_id=p.user_id,
            name=p.name,
            avatar=p.avatar,
            specialisation=p.specialisation,
            rating=p.rating,
            consultations_count=p.consultations_count,
            price=p.price,
            bio=p.bio,
            tags=p.tags,
            city=p.city
        ))
        
    return schemas.ExpertProfileListResponse(
        items=response_items,
        total=total,
        limit=limit,
        offset=offset
    )

async def get_expert(db: AsyncSession, expert_id: UUID) -> schemas.ExpertProfileResponse:
    p = await repository.get_expert_profile_by_id(db, expert_id)
    if not p:
        raise HTTPException(status_code=404, detail="Expert not found")
        
    return schemas.ExpertProfileResponse(
        id=p.id,
        user_id=p.user_id,
        name=p.name,
        avatar=p.avatar,
        specialisation=p.specialisation,
        rating=p.rating,
        consultations_count=p.consultations_count,
        price=p.price,
        bio=p.bio,
        tags=p.tags,
        city=p.city
    )

def _build_frontend_consultation(c: models.Consultation) -> schemas.FrontendConsultationResponse:
    messages = []
    for m in c.messages:
        # Determine if the sender was the user (gardener) or the expert
        sender_role = "user" if m.sender_id == c.user_id else "expert"
        
        messages.append(schemas.FrontendConsultationMessage(
            id=str(m.id),
            sender_from=sender_role,
            text=m.text,
            ts=format_ts(m.created_at)
        ))
    
    review = None
    if c.review_rating:
        review = {"rating": c.review_rating, "text": c.review_text or ""}
        
    return schemas.FrontendConsultationResponse(
        id=str(c.id),
        expertId=str(c.expert_id),
        expertName=c.expert.name,
        expertAvatar=c.expert.avatar,
        specialisation=c.expert.specialisation,
        slot=c.slot,
        mode=c.mode,
        status=c.status,
        price=c.price,
        bookedAt=format_ts(c.booked_at),
        messages=messages,
        review=review
    )

async def get_consultations(db: AsyncSession, current_user_id: str, limit: int, offset: int) -> schemas.ConsultationListResponse:
    items, total = await repository.get_consultations_for_user(db, current_user_id, limit, offset)
    
    response_items = [_build_frontend_consultation(c) for c in items]
    
    return schemas.ConsultationListResponse(
        items=response_items,
        total=total,
        limit=limit,
        offset=offset
    )

async def get_consultation(db: AsyncSession, consultation_id: UUID, current_user_id: str) -> schemas.FrontendConsultationResponse:
    c = await repository.get_consultation_by_id(db, consultation_id)
    if not c:
        raise HTTPException(status_code=404, detail="Consultation not found")
        
    if current_user_id not in [c.user_id, c.expert.user_id]:
        raise HTTPException(status_code=403, detail="Not authorized to view this consultation")
        
    return _build_frontend_consultation(c)

async def create_consultation(db: AsyncSession, request: schemas.ConsultationCreate, current_user_id: str) -> schemas.FrontendConsultationResponse:
    # Verify expert exists
    expert = await repository.get_expert_profile_by_id(db, request.expert_id)
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
        
    # Prevent booking oneself
    if expert.user_id == current_user_id:
        raise HTTPException(status_code=400, detail="You cannot book a consultation with yourself")

    new_consultation = models.Consultation(
        expert_id=request.expert_id,
        user_id=current_user_id,
        slot=request.slot,
        mode=request.mode,
        price=expert.price, # Snapshot current price
        status="Pending"
    )
    
    created = await repository.create_consultation(db, new_consultation)
    
    # Increment expert's consultation count
    expert.consultations_count += 1
    
    await db.commit()
    # No need to refresh due to expire_on_commit=False, but we need the expert attached for the response
    created.expert = expert 
    created.messages = []
    
    return _build_frontend_consultation(created)

async def get_consultation_messages(db: AsyncSession, consultation_id: UUID, current_user_id: str) -> list[schemas.FrontendConsultationMessage]:
    consultation = await repository.get_consultation_by_id(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
        
    # Security: Ensure only the involved gardener or expert can read the messages
    if current_user_id not in [consultation.user_id, consultation.expert.user_id]:
        raise HTTPException(status_code=403, detail="Not authorized to view these messages")
        
    response = _build_frontend_consultation(consultation)
    return response.messages

async def send_consultation_message(db: AsyncSession, consultation_id: UUID, request: schemas.ConsultationMessageCreate, current_user_id: str) -> schemas.FrontendConsultationMessage:
    consultation = await repository.get_consultation_by_id(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
        
    if current_user_id not in [consultation.user_id, consultation.expert.user_id]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages to this consultation")
        
    new_message = models.ConsultationMessage(
        consultation_id=consultation_id,
        sender_id=current_user_id,
        text=request.text
    )
    
    created = await repository.create_message(db, new_message)
    await db.commit()
    
    sender_role = "user" if current_user_id == consultation.user_id else "expert"
    
    return schemas.FrontendConsultationMessage(
        id=str(created.id),
        sender_from=sender_role,
        text=created.text,
        ts=format_ts(created.created_at)
    )
