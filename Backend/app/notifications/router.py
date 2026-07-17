from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from datetime import datetime, timezone
import uuid

from . import schemas, service
from app.core.database import get_db
# Assuming standard auth dependency mock as used in previous modules
from app.community.router import mock_get_current_user

router = APIRouter(tags=["Notifications"])

@router.get("/api/v1/notifications", response_model=schemas.NotificationListResponse)
async def get_notifications(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """Get user's notifications."""
    return await service.get_user_notifications_service(db, user_id=user["id"], limit=limit, offset=offset)

@router.patch("/api/v1/notifications/{id}/read", response_model=schemas.NotificationResponse)
async def mark_notification_read(
    id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """Mark a specific notification as read."""
    return await service.mark_notification_read_service(db, notification_id=id, user_id=user["id"])

@router.post("/api/v1/notifications/read-all")
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(mock_get_current_user)
):
    """Mark all user's notifications as read."""
    return await service.mark_all_user_notifications_read_service(db, user_id=user["id"])
