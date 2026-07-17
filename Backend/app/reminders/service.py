from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from datetime import timedelta
import uuid

from app.reminders import schemas, repository, models
from app.plants.repository import get_plant_by_id

async def get_user_reminders_service(
    db: AsyncSession, 
    user_id: str, 
    limit: int = 50, 
    offset: int = 0
):
    """
    Fetch user reminders and format for the frontend.
    """
    items, total = await repository.get_user_reminders(db, user_id, limit, offset)
    return schemas.ReminderListResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset
    )

async def create_reminder_service(
    db: AsyncSession, 
    reminder_in: schemas.ReminderCreate, 
    user_id: str
):
    """
    Validate the plant ownership and create a new reminder.
    """
    # Validation: Ensure the plant exists and belongs to the user
    plant = await get_plant_by_id(db, reminder_in.plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    if plant.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to add reminders to this plant")
    
    new_reminder = models.Reminder(
        user_id=user_id,
        plant_id=reminder_in.plant_id,
        type=reminder_in.type,
        due_date=reminder_in.due_date,
        repeat_rule=reminder_in.repeat_rule,
        status="pending"
    )
    
    return await repository.create_reminder(db, new_reminder)

async def complete_reminder_service(db: AsyncSession, reminder_id: str, user_id: str):
    """
    Mark a reminder as completed and automatically schedule the next occurrence 
    if a repeat rule is defined.
    """
    # 1. Validation & Fetch
    try:
        r_uuid = uuid.UUID(reminder_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid reminder ID format")
        
    reminder = await repository.get_reminder(db, r_uuid)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    if reminder.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this reminder")
        
    if reminder.status == "completed":
        raise HTTPException(status_code=400, detail="Reminder is already completed")
        
    # 2. Mark as completed
    reminder.status = "completed"
    await repository.update_reminder(db, reminder)
    
    # 3. Repeat Rule Logic - Automatic Scheduling
    if reminder.repeat_rule != "none":
        days_to_add = 0
        if reminder.repeat_rule == "daily":
            days_to_add = 1
        elif reminder.repeat_rule == "2day":
            days_to_add = 2
        elif reminder.repeat_rule == "weekly":
            days_to_add = 7
            
        if days_to_add > 0:
            next_due_date = reminder.due_date + timedelta(days=days_to_add)
            
            new_reminder = models.Reminder(
                user_id=user_id,
                plant_id=reminder.plant_id,
                type=reminder.type,
                due_date=next_due_date,
                repeat_rule=reminder.repeat_rule,
                status="pending"
            )
            # Create the future occurrence
            await repository.create_reminder(db, new_reminder)
            
    # Return the newly updated (completed) reminder object
    return reminder

async def edit_reminder_service(db: AsyncSession, reminder_id: str, reminder_in: schemas.ReminderUpdate, user_id: str):
    try:
        r_uuid = uuid.UUID(reminder_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid reminder ID format")
        
    reminder = await repository.get_reminder(db, r_uuid)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    if reminder.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this reminder")
        
    if reminder_in.plant_id is not None:
        plant = await get_plant_by_id(db, reminder_in.plant_id)
        if not plant or plant.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to assign reminder to this plant")
        reminder.plant_id = reminder_in.plant_id
        
    if reminder_in.type is not None:
        reminder.type = reminder_in.type
    if reminder_in.due_date is not None:
        reminder.due_date = reminder_in.due_date
    if reminder_in.repeat_rule is not None:
        reminder.repeat_rule = reminder_in.repeat_rule
        
    return await repository.update_reminder(db, reminder)

async def delete_reminder_service(db: AsyncSession, reminder_id: str, user_id: str):
    try:
        r_uuid = uuid.UUID(reminder_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid reminder ID format")
        
    reminder = await repository.get_reminder(db, r_uuid)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    if reminder.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this reminder")
        
    await repository.delete_reminder(db, reminder)
