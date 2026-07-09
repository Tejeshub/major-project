from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlantBase(BaseModel):
    species: str
    nickname: Optional[str] = None
    location_type: str  # balcony, indoor, terrace

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    species: Optional[str] = None
    nickname: Optional[str] = None
    location_type: Optional[str] = None

class PlantResponse(PlantBase):
    id: int
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
