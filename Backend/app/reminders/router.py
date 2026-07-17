from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import datetime
import uuid

from . import schemas, service
from app.core.database import get_db
# Assuming standard auth dependency mock as used in previous modules
from app.community.router import mock_get_current_user

router = APIRouter(tags=["Reminders"])

@router.get("/api/v1/reminders", response_model=schemas.ReminderListResponse)
async def get_reminders(
    limit: int = 20, 
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """
    Get user's active reminders.
    """
    return await service.get_user_reminders_service(db, user_id=user["id"], limit=limit, offset=offset)

@router.get("/api/v1/reminders/{id}", response_model=schemas.ReminderResponse)
async def get_reminder(
    id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """
    Get a specific reminder by ID.
    """
    try:
        import uuid
        r_uuid = uuid.UUID(id)
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid reminder ID format")
    
    reminder = await service.repository.get_reminder(db, r_uuid)
    if not reminder:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    if reminder.user_id != user["id"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not authorized to view this reminder")
        
    return reminder
@router.post("/api/v1/reminders", response_model=schemas.ReminderResponse, status_code=201)
async def create_reminder(
    reminder_in: schemas.ReminderCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """
    Create a new reminder for a specific plant.
    """
    return await service.create_reminder_service(db, reminder_in=reminder_in, user_id=user["id"])

@router.post("/api/v1/reminders/{id}/complete", response_model=schemas.ReminderResponse)
async def complete_reminder(
    id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """
    Mark a reminder as completed and automatically spawn the next recurrence.
    """
    return await service.complete_reminder_service(db, reminder_id=id, user_id=user["id"])

@router.patch("/api/v1/reminders/{id}", response_model=schemas.ReminderResponse)
async def edit_reminder(
    id: str,
    reminder_in: schemas.ReminderUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """
    Edit a specific reminder.
    """
    return await service.edit_reminder_service(db, reminder_id=id, reminder_in=reminder_in, user_id=user["id"])

@router.delete("/api/v1/reminders/{id}", status_code=204)
async def delete_reminder(
    id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """
    Delete a specific reminder.
    """
    await service.delete_reminder_service(db, reminder_id=id, user_id=user["id"])
