import asyncio
import os
import sys

# Add the parent directory to sys.path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.auth.models import User
from app.support.models import SupportTicket
from sqlalchemy import select
from datetime import datetime, timezone, timedelta

async def seed_support_tickets():
    async with AsyncSessionLocal() as db:
        print("Fetching users...")
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        if not users:
            print("No users found. Please run a user seeder or register a user first.")
            return
        
        print("Clearing existing support tickets...")
        await db.execute(SupportTicket.__table__.delete())
        
        print("Seeding support tickets...")
        user_id = users[0].id
        now = datetime.now(timezone.utc)
        
        tickets_data = [
            SupportTicket(
                user_id=user_id,
                subject="Payment failed for marketplace order",
                description="I tried to buy Neem Oil but the Razorpay modal closed unexpectedly and I was charged but no order shows up.",
                category="payment",
                priority="high",
                status="open",
                attachment_url=None,
                created_at=now - timedelta(hours=5),
                updated_at=now - timedelta(hours=5)
            ),
            SupportTicket(
                user_id=user_id,
                subject="Consultation link not working",
                description="When I click 'Join Video' for my consultation with Dr. Green, it says the room doesn't exist.",
                category="consultation",
                priority="urgent",
                status="in_progress",
                assigned_to="Admin Sarah",
                created_at=now - timedelta(days=1),
                updated_at=now - timedelta(hours=12)
            ),
            SupportTicket(
                user_id=user_id,
                subject="Reminder bug for Monstera",
                description="My watering reminder keeps showing up even after I mark it as done.",
                category="technical",
                priority="normal",
                status="resolved",
                resolution="We found a bug in the recurrence generation logic. It has been patched. Your reminders should work normally now.",
                created_at=now - timedelta(days=5),
                updated_at=now - timedelta(days=2)
            ),
            SupportTicket(
                user_id=user_id,
                subject="Plant disease AI is stuck",
                description="I uploaded a photo of my tomato plant but the 'Detecting...' spinner never finishes.",
                category="technical",
                priority="high",
                status="open",
                attachment_url="https://example.com/screenshot.png",
                created_at=now - timedelta(minutes=30),
                updated_at=now - timedelta(minutes=30)
            )
        ]
        
        db.add_all(tickets_data)
        await db.commit()
        print("Successfully seeded support tickets.")

if __name__ == "__main__":
    asyncio.run(seed_support_tickets())
