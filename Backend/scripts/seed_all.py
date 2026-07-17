import asyncio
import os
import sys

# Add the parent directory to sys.path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.seed_marketplace import seed_marketplace
from scripts.seed_community import seed_community
from scripts.seed_experts import seed_experts
from scripts.seed_reminders import seed_reminders
from scripts.seed_notifications import seed_notifications
from scripts.seed_support import seed_support_tickets

async def seed_all():
    print("========================================")
    print("STARTING SEED PROCESS")
    print("========================================")
    
    try:
        print("\n--- Seeding Marketplace ---")
        await seed_marketplace()
        
        print("\n--- Seeding Community ---")
        await seed_community()
        
        print("\n--- Seeding Experts ---")
        await seed_experts()
        
        print("\n--- Seeding Reminders ---")
        await seed_reminders()
        
        print("\n--- Seeding Notifications ---")
        await seed_notifications()
        
        print("\n--- Seeding Support Tickets ---")
        await seed_support_tickets()
        
        print("\n========================================")
        print("SEED PROCESS COMPLETED SUCCESSFULLY")
        print("========================================")
    except Exception as e:
        print("\n========================================")
        print(f"SEED PROCESS FAILED: {str(e)}")
        print("========================================")

if __name__ == "__main__":
    asyncio.run(seed_all())
