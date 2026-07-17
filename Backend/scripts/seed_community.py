import asyncio
import os
import sys
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4

# Add backend directory to sys path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.community.models import Post, PostComment, PostLike

# Realistic seed data derived from frontend/src/data/seed.ts
SEED_POSTS = [
    {
        "author_id": "riya123",
        "caption": "My tulsi is finally thriving after the repot 🌿 Took me 3 tries to get the soil mix right.",
        "image_url": "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?auto=format&fit=crop&w=900&q=70",
        "comments": [
            {"author_id": "anand456", "content": "Looks beautiful! What soil mix did you end up with?"},
            {"author_id": "meera789", "content": "Where did you buy the pot from?"}
        ]
    },
    {
        "author_id": "arjun123",
        "caption": "First tomato harvest from my balcony 🍅 4kg in one go!",
        "image_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=70",
        "comments": [
            {"author_id": "priya456", "content": "Amazing! Which variety?"}
        ]
    },
    {
        "author_id": "sneha123",
        "caption": "New leaf unfurling on my Monstera 💚 The fenestrations are gorgeous.",
        "image_url": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=70",
        "comments": []
    },
    {
        "author_id": "kabir123",
        "caption": "Roses are finally blooming after the winter prune. Patience paid off!",
        "image_url": "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=900&q=70",
        "comments": [
            {"author_id": "ravi456", "content": "Which variety is this?"}
        ]
    }
]

async def seed_community():
    print("Starting Community Seed...")
    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)
        
        print("Clearing existing posts, comments, and likes...")
        await db.execute(PostLike.__table__.delete())
        await db.execute(PostComment.__table__.delete())
        await db.execute(Post.__table__.delete())
        
        # We assume the database has already run migrations
        for idx, p_data in enumerate(SEED_POSTS):
            post_id = uuid4()
            post = Post(
                id=post_id,
                author_id=p_data["author_id"],
                caption=p_data["caption"],
                image_url=p_data["image_url"],
                like_count=0,
                comment_count=len(p_data["comments"]),
                created_at=now - timedelta(hours=(idx * 2)) # Stagger timestamps
            )
            db.add(post)
            
            for c_idx, c_data in enumerate(p_data["comments"]):
                comment = PostComment(
                    id=uuid4(),
                    post_id=post_id,
                    author_id=c_data["author_id"],
                    content=c_data["content"],
                    created_at=now - timedelta(hours=(idx * 2), minutes=(c_idx * 15 + 10))
                )
                db.add(comment)
        
        await db.commit()
        print(f"Successfully seeded {len(SEED_POSTS)} posts.")

if __name__ == "__main__":
    asyncio.run(seed_community())
