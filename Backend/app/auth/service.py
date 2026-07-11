from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

import httpx
from typing import Optional

from app.core.database import get_db
from app.core.settings import settings
from . import repository, models

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> models.User:
    token = credentials.credentials
    try:
        # Fetch user details directly from Supabase to validate the token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {token}"
                }
            )
            response.raise_for_status()
            user_data = response.json()
            
        user_id = user_data.get("id")
        email = user_data.get("email")
        role = user_data.get("role", "gardener")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user exists, if not auto-create
    user = await repository.get_user_by_id(db, user_id)
    if not user:
        new_user = models.User(id=user_id, email=email, role=role)
        user = await repository.create_user(db, new_user)
        
    return user
