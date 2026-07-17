from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from datetime import datetime, timezone
import uuid

from . import schemas, service
from app.core.database import get_db
# Assuming standard auth dependency mock as used in previous modules
from app.community.router import mock_get_current_user

router = APIRouter(tags=["Support"])

@router.get("/api/v1/support/tickets", response_model=schemas.SupportTicketListResponse)
async def get_support_tickets(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """Get user's support tickets."""
    return await service.get_user_support_tickets_service(db, user_id=user["id"], limit=limit, offset=offset)

@router.get("/api/v1/support/tickets/{id}", response_model=schemas.SupportTicketResponse)
async def get_support_ticket(
    id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """Get a specific support ticket."""
    return await service.get_support_ticket_service(db, ticket_id=id, user_id=user["id"])

@router.post("/api/v1/support/tickets", response_model=schemas.SupportTicketResponse, status_code=201)
async def create_support_ticket(
    ticket_in: schemas.SupportTicketCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """Create a new support ticket."""
    return await service.create_support_ticket_service(db, ticket_in=ticket_in, user_id=user["id"])
