from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from . import schemas, service

# TODO: Dependency injection for auth to be implemented later by Developer A
def mock_get_current_user():
    return {"id": "dummy-user-id", "name": "Tejesh", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tejesh", "city": "Mumbai"}

router = APIRouter(tags=["Experts"])

@router.get("/api/v1/experts", response_model=schemas.ExpertProfileListResponse)
async def get_experts(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Get a paginated list of expert profiles."""
    return await service.get_experts(db=db, limit=limit, offset=offset)

@router.get("/api/v1/experts/{id}", response_model=schemas.ExpertProfileResponse)
async def get_expert(
    id: UUID = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific expert profile."""
    return await service.get_expert(db=db, expert_id=id)

@router.get("/api/v1/consultations", response_model=schemas.ConsultationListResponse)
async def get_consultations(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Get all consultations for the current user."""
    return await service.get_consultations(db=db, current_user_id=current_user["id"], limit=limit, offset=offset)

@router.get("/api/v1/consultations/{id}", response_model=schemas.FrontendConsultationResponse)
async def get_consultation(
    id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Get a specific consultation for the current user."""
    return await service.get_consultation(db=db, consultation_id=id, current_user_id=current_user["id"])

@router.post("/api/v1/consultations", response_model=schemas.FrontendConsultationResponse, status_code=201)
async def create_consultation(
    payload: schemas.ConsultationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Book a new consultation."""
    return await service.create_consultation(db=db, request=payload, current_user_id=current_user["id"])

@router.get("/api/v1/consultations/{id}/messages", response_model=List[schemas.FrontendConsultationMessage])
async def get_consultation_messages(
    id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Get chat messages for a specific consultation."""
    return await service.get_consultation_messages(db=db, consultation_id=id, current_user_id=current_user["id"])

@router.post("/api/v1/consultations/{id}/messages", response_model=schemas.FrontendConsultationMessage, status_code=201)
async def send_consultation_message(
    payload: schemas.ConsultationMessageCreate,
    id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(mock_get_current_user)
):
    """Send a chat message within a consultation."""
    return await service.send_consultation_message(db=db, consultation_id=id, request=payload, current_user_id=current_user["id"])

