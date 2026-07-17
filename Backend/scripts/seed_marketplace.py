import asyncio
import os
import sys

# Add backend directory to sys path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.auth.models import User
from app.marketplace.models import Product, Order, OrderItem

PRODUCTS = [
  {"name": "Monstera Deliciosa (medium)", "category": "Plants", "price": 349, "gst_rate": 5, "stock": 12, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=70", "description": "Lush split-leaf monstera, perfect for bright indoor spots. Grown in our Dadar greenhouse."},
  {"name": "Tulsi (Holy Basil) Sapling", "category": "Plants", "price": 89, "gst_rate": 0, "stock": 40, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?auto=format&fit=crop&w=900&q=70", "description": "Sacred Tulsi plant — easy to care for, thrives in Indian sun."},
  {"name": "Neem Oil Spray 250ml", "category": "Fertilizers", "price": 199, "gst_rate": 18, "stock": 80, "rating": 4.5, "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=70", "description": "Cold-pressed neem oil — natural pest control for balcony plants."},
  {"name": "Terracotta Pot Set (3 pcs)", "category": "Pots", "price": 599, "gst_rate": 12, "stock": 25, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=70", "description": "Hand-thrown earthenware pots with drainage. 6/8/10 inch set."},
  {"name": "Tomato Seeds — Hybrid F1", "category": "Seeds", "price": 79, "gst_rate": 5, "stock": 200, "rating": 4.4, "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=70", "description": "High-yield tomato seeds, suited for balcony growbags."},
  {"name": "Vermicompost 5kg", "category": "Fertilizers", "price": 249, "gst_rate": 5, "stock": 60, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=70", "description": "Rich, dark vermicompost — boost any potted plant."},
  {"name": "Pruning Shears Pro", "category": "Tools", "price": 449, "gst_rate": 18, "stock": 30, "rating": 4.3, "image_url": "https://images.unsplash.com/photo-1599598425947-5b3afa9d8e0a?auto=format&fit=crop&w=900&q=70", "description": "Sharp, ergonomic shears for clean cuts on woody stems."},
  {"name": "Snake Plant (Sansevieria)", "category": "Plants", "price": 299, "gst_rate": 5, "stock": 18, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1599598425947-5b3afa9d8e0a?auto=format&fit=crop&w=900&q=70", "description": "Near-indestructible air-purifying plant. Low light tolerant."},
  {"name": "Coco Peat Block 5kg", "category": "Fertilizers", "price": 329, "gst_rate": 5, "stock": 50, "rating": 4.5, "image_url": "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=900&q=70", "description": "Expands to 75L — perfect potting medium."},
  {"name": "Coriander Seeds (Organic)", "category": "Seeds", "price": 49, "gst_rate": 0, "stock": 300, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1599909533730-1f7c7c54f4a9?auto=format&fit=crop&w=900&q=70", "description": "Organic dhaniya seeds — sprouts in 7 days."},
  {"name": "Hanging Macrame Planter", "category": "Pots", "price": 399, "gst_rate": 12, "stock": 0, "rating": 4.2, "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=70", "description": "Handwoven cotton macrame, fits 6 inch pot."},
  {"name": "Money Plant (Golden Pothos)", "category": "Plants", "price": 179, "gst_rate": 5, "stock": 35, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=900&q=70", "description": "Trailing pothos — brings good luck and clean air."},
  {"name": "Copper Fungicide Spray", "category": "Fertilizers", "price": 349, "gst_rate": 18, "stock": 22, "rating": 4.4, "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=70", "description": "Controls leaf spot, blight, mildew. Safe for edibles."},
  {"name": "Self-Watering Pot 8\"", "category": "Pots", "price": 549, "gst_rate": 18, "stock": 14, "rating": 4.5, "image_url": "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=900&q=70", "description": "Reservoir base keeps plants hydrated for 7+ days."},
  {"name": "Chilli Seeds — Bhut Jolokia", "category": "Seeds", "price": 99, "gst_rate": 5, "stock": 150, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=900&q=70", "description": "Ghost pepper seeds — for the brave gardener."},
  {"name": "Drip Irrigation Kit (10 pots)", "category": "Tools", "price": 899, "gst_rate": 18, "stock": 8, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=70", "description": "Automate watering for your whole balcony."},
  {"name": "Peace Lily (Spathiphyllum)", "category": "Plants", "price": 399, "gst_rate": 5, "stock": 11, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=900&q=70", "description": "Elegant white blooms, removes indoor toxins."},
  {"name": "Mustard Cake Powder 1kg", "category": "Fertilizers", "price": 149, "gst_rate": 5, "stock": 70, "rating": 4.5, "image_url": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=70", "description": "Slow-release organic nitrogen feed."},
  {"name": "Garden Gloves (Pair)", "category": "Tools", "price": 199, "gst_rate": 12, "stock": 100, "rating": 4.3, "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=70", "description": "Breathable nitrile-coated gloves."},
  {"name": "Succulent Mix Pack (5 pcs)", "category": "Plants", "price": 499, "gst_rate": 5, "stock": 20, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=70", "description": "Five assorted succulents, ready to display."},
]

async def seed_marketplace():
    print("Starting Marketplace seed process...")
    async with AsyncSessionLocal() as db:
        # 1. Fetch a real user to act as the seller
        result = await db.execute(select(User).limit(1))
        first_user = result.scalar_one_or_none()
        
        if not first_user:
            print("WARNING: No users found in the database.")
            print("Using a dummy seller_id for seeding.")
            seller_id = "dummy-seller-id"
        else:
            seller_id = str(first_user.id)
            print(f"Mapping products to seller ID: {seller_id} ({first_user.email})")

        # 2. Clear existing products (must delete dependent tables first)
        await db.execute(OrderItem.__table__.delete())
        await db.execute(Order.__table__.delete())
        await db.execute(Product.__table__.delete())
        print("Cleared existing products, orders, and order_items from the database.")

        # 3. Insert new products
        products_to_insert = []
        for p in PRODUCTS:
            product_model = Product(
                seller_id=seller_id,
                name=p["name"],
                category=p["category"],
                # Convert price to paise (multiply by 100)
                price=p["price"] * 100,
                stock=p["stock"],
                gst_rate=p["gst_rate"],
                image_url=p["image_url"],
                description=p["description"],
                rating=p["rating"],
                is_active=True
            )
            products_to_insert.append(product_model)
        
        db.add_all(products_to_insert)
        await db.commit()
        
        print(f"Successfully seeded {len(products_to_insert)} products!")

if __name__ == "__main__":
    asyncio.run(seed_marketplace())
