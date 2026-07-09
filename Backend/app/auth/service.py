from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError
import httpx
from typing import Optional

from app.core.database import get_db
from app.core.settings import settings
from . import repository, models

security = HTTPBearer()

async def get_jwks():
    async with httpx.AsyncClient() as client:
        response = await client.get(settings.SUPABASE_JWKS_URL)
        response.raise_for_status()
        return response.json()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> models.User:
    token = credentials.credentials
    try:
        # Fetch JWKS to verify the token signature
        jwks = await get_jwks()
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience="authenticated",
            options={"verify_aud": False}
        )
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role", "gardener")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
            
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user exists, if not auto-create
    user = await repository.get_user_by_id(db, user_id)
    if not user:
        new_user = models.User(id=user_id, email=email, role=role)
        user = await repository.create_user(db, new_user)
        
    return user
