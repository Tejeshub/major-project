import asyncio
import sys
import os
import uuid
from datetime import datetime, timedelta

# Add Backend to python path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.auth.models import User
from app.auth.repository import create_user
from app.experts.models import ExpertProfile, Consultation, ConsultationMessage
from app.experts import repository as expert_repo

SEED_EXPERTS_DATA = [
    {
        "name": "Dr. Anjali Mehta",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
        "specialisation": "Ornamental Plants",
        "rating": 4.9,
        "consultations": 412,
        "price": 299,
        "bio": "Horticulturist with 12+ years experience. Specializes in indoor plant care, aesthetic balcony setups, and urban jungles.",
        "tags": ["Indoor plants", "Air purifiers", "Balcony design"],
        "city": "Mumbai"
    },
    {
        "name": "Rajesh Kumar",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
        "specialisation": "Vegetables & Herbs",
        "rating": 4.8,
        "consultations": 305,
        "price": 199,
        "bio": "Organic farming advocate helping urban dwellers grow their own food on terraces and balconies.",
        "tags": ["Organic", "Terrace farming", "Pest management"],
        "city": "Bangalore"
    },
    {
        "name": "Priya Sharma",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        "specialisation": "Pest Control",
        "rating": 4.7,
        "consultations": 189,
        "price": 249,
        "bio": "Plant pathologist focusing on natural and chemical-free pest control methods for common house plants.",
        "tags": ["Disease diagnosis", "Natural remedies", "Plant health"],
        "city": "Delhi"
    }
]

async def get_or_create_user(db: AsyncSession, email: str, role: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        user_id = str(uuid.uuid4())
        new_user = User(
            id=user_id,
            email=email,
            role=role
        )
        user = await create_user(db, new_user)
        print(f"Created user: {email} (Role: {role})")
    return user

async def seed_experts():
    print("Starting Expert Module Seed...")
    async with AsyncSessionLocal() as db:
        
        # Clear existing experts data in correct order
        print("Clearing existing experts data...")
        await db.execute(ConsultationMessage.__table__.delete())
        await db.execute(Consultation.__table__.delete())
        await db.execute(ExpertProfile.__table__.delete())
        
        # 1. Create a dummy gardener (user) to book consultations
        gardener = await get_or_create_user(db, "gardener@example.com", "gardener")
        
        # 2. Seed Experts
        for data in SEED_EXPERTS_DATA:
            email = f"{data['name'].split()[0].lower()}@expert.com"
            expert_user = await get_or_create_user(db, email, "expert")
            
            # Assume profile needs recreation for seed script idempotency
            existing_profile = None
            
            if not existing_profile:
                profile = ExpertProfile(
                    user_id=expert_user.id,
                    name=data["name"],
                    avatar=data["avatar"],
                    specialisation=data["specialisation"],
                    rating=data["rating"],
                    consultations_count=data["consultations"],
                    price=data["price"],
                    bio=data["bio"],
                    tags=data["tags"],
                    city=data["city"]
                )
                created_profile = await expert_repo.create_expert_profile(db, profile)
                print(f"Created Expert Profile: {created_profile.name}")
                
                # 3. Seed a dummy consultation with this expert
                consultation = Consultation(
                    expert_id=created_profile.id,
                    user_id=gardener.id,
                    slot="Thu 4pm",
                    mode="Chat",
                    status="Completed",
                    price=created_profile.price,
                    booked_at=datetime.utcnow() - timedelta(days=2),
                    review_rating=5,
                    review_text="Excellent advice on my Monstera!"
                )
                created_consultation = await expert_repo.create_consultation(db, consultation)
                
                # 4. Seed Messages for this consultation
                msg1 = ConsultationMessage(
                    consultation_id=created_consultation.id,
                    sender_id=gardener.id,
                    text="Hi, my Monstera leaves are turning yellow."
                )
                await expert_repo.create_message(db, msg1)
                
                msg2 = ConsultationMessage(
                    consultation_id=created_consultation.id,
                    sender_id=expert_user.id,
                    text="Hello! That's usually a sign of overwatering. Let's check your soil drainage."
                )
                await expert_repo.create_message(db, msg2)
                print(f"  -> Seeded consultation and messages for {created_profile.name}")
        
        # Commit all transactions at the end
        await db.commit()
        print("Expert Module Seed complete!")

if __name__ == "__main__":
    asyncio.run(seed_experts())
