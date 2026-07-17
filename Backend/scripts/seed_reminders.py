import asyncio
import sys
import os
from datetime import datetime, timedelta

# Add Backend root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.auth.models import User
from app.plants.models import PlantProfile
from app.reminders import models, repository

async def seed_reminders():
    print("Seeding Reminders...")
    async with AsyncSessionLocal() as db:
        print("Clearing existing reminders...")
        await db.execute(models.Reminder.__table__.delete())
        
        # 1. Fetch Users
        users = (await db.execute(select(User))).scalars().all()
        if not users:
            print("No users found. Please seed users and plants first.")
            return
            
        print(f"Found {len(users)} users.")
        
        for user in users:
            # 2. Fetch User's Plants
            plants = (await db.execute(select(PlantProfile).where(PlantProfile.user_id == user.id))).scalars().all()
            if not plants:
                if user.email == "gardener@example.com":
                    from app.plants.schemas import PlantCreate
                    from app.plants.repository import create_plant
                    plant_in = PlantCreate(species="Monstera Deliciosa", nickname="Monty", location_type="indoor")
                    plant = await create_plant(db, user.id, plant_in)
                    plants = [plant]
                    print("Created 1 plant for gardener@example.com.")
                else:
                    print(f"User {user.email} has no plants. Skipping...")
                    continue
                
            print(f"Found {len(plants)} plants for user {user.email}.")
            
            # 3. Create Reminders for each plant
            now = datetime.utcnow()
            for plant in plants:
                # Reminder 1: Overdue
                r1 = models.Reminder(
                    user_id=user.id,
                    plant_id=plant.id,
                    type="Water",
                    due_date=now - timedelta(days=2),
                    repeat_rule="weekly",
                    status="pending"
                )
                
                # Reminder 2: Today
                r2 = models.Reminder(
                    user_id=user.id,
                    plant_id=plant.id,
                    type="Prune",
                    due_date=now,
                    repeat_rule="none",
                    status="pending"
                )
                
                # Reminder 3: Upcoming
                r3 = models.Reminder(
                    user_id=user.id,
                    plant_id=plant.id,
                    type="Fertilize",
                    due_date=now + timedelta(days=5),
                    repeat_rule="daily",
                    status="pending"
                )
                
                await repository.create_reminder(db, r1)
                await repository.create_reminder(db, r2)
                await repository.create_reminder(db, r3)
                
        print("✅ Reminders seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_reminders())
