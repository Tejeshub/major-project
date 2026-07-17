import asyncio
import os
import sys

# Add the parent directory to sys.path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.auth.models import User
from app.notifications.models import Notification
from sqlalchemy import select
import uuid
from datetime import datetime, timezone, timedelta

async def seed_notifications():
    async with AsyncSessionLocal() as db:
        print("Fetching users...")
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        if not users:
            print("No users found. Please run a user seeder or register a user first.")
            return
        
        print("Clearing existing notifications...")
        await db.execute(Notification.__table__.delete())
        
        print("Seeding notifications...")
        user_id = users[0].id
        now = datetime.now(timezone.utc)
        
        notifications_data = [
            Notification(
                user_id=user_id,
                title="Order Shipped",
                message="Your marketplace order #10023 for Neem Oil has shipped.",
                type="marketplace",
                priority="high",
                is_read=False,
                action_url="/orders/10023",
                created_at=now - timedelta(hours=2)
            ),
            Notification(
                user_id=user_id,
                title="Reminder Due",
                message="Time to water your Monstera Deliciosa.",
                type="reminder",
                priority="normal",
                is_read=False,
                action_url="/dashboard",
                created_at=now - timedelta(hours=24)
            ),
            Notification(
                user_id=user_id,
                title="Consultation Confirmed",
                message="Your expert consultation with Dr. Green has been confirmed for tomorrow at 10 AM.",
                type="consultation",
                priority="high",
                is_read=True,
                read_at=now - timedelta(hours=48),
                action_url="/consultations",
                created_at=now - timedelta(days=2)
            ),
            Notification(
                user_id=user_id,
                title="Disease Detected",
                message="Our AI has identified 'Powdery Mildew' on your recent scan. Click to view treatment.",
                type="detection",
                priority="high",
                is_read=False,
                action_url="/detect",
                created_at=now - timedelta(minutes=15)
            ),
            Notification(
                user_id=user_id,
                title="System Update",
                message="Welcome to the new PlantNest Community feature!",
                type="system",
                priority="low",
                is_read=True,
                read_at=now - timedelta(days=5),
                action_url="/community",
                created_at=now - timedelta(days=6)
            )
        ]
        
        db.add_all(notifications_data)
        await db.commit()
        print("Successfully seeded notifications.")

if __name__ == "__main__":
    asyncio.run(seed_notifications())
