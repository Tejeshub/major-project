from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from typing import Dict, Any, Optional
import uuid
from . import repository, models, schemas

async def get_user_notifications_service(db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0):
    notifications = await repository.get_user_notifications(db, user_id, limit, offset)
    total = await repository.count_user_notifications(db, user_id)
    return schemas.NotificationListResponse(
        items=notifications,
        total=total,
        limit=limit,
        offset=offset
    )

async def mark_notification_read_service(db: AsyncSession, notification_id: str, user_id: str):
    try:
        n_uuid = uuid.UUID(notification_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid notification ID format")
        
    notification = await repository.get_notification_by_id(db, n_uuid)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    if notification.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this notification")
        
    return await repository.mark_notification_read(db, notification)

async def mark_all_user_notifications_read_service(db: AsyncSession, user_id: str):
    await repository.mark_all_user_notifications_read(db, user_id)
    return {"status": "success", "message": "All notifications marked as read"}

async def send_notification(
    db: AsyncSession, 
    user_id: str, 
    title: str, 
    message: str, 
    type: str, 
    priority: str = "normal", 
    action_url: Optional[str] = None, 
    metadata: Optional[Dict[str, Any]] = None
):
    """
    Universal notification entry point.
    Currently inserts into the database. Future implementation will 
    add Web Push, Email, and SMS support here without changing callers.
    """
    new_notification = models.Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        priority=priority,
        action_url=action_url,
        metadata_payload=metadata
    )
    return await repository.create_notification(db, new_notification)
