import asyncio, sys, os
sys.path.append(os.path.abspath('.'))
from app.core.database import AsyncSessionLocal
from app.reminders.models import Reminder
from app.plants.models import PlantProfile
from datetime import datetime, timezone

async def seed():
    async with AsyncSessionLocal() as db:
        plant = PlantProfile(user_id='dummy-user-id', species='Test', nickname='Test', location_type='indoor')
        db.add(plant)
        await db.commit()
        await db.refresh(plant)
        rem = Reminder(user_id='dummy-user-id', plant_id=plant.id, type='Water', due_date=datetime.now(timezone.utc), repeat_rule='none')
        db.add(rem)
        await db.commit()
asyncio.run(seed())
