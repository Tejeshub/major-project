from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    id: str
    role: str
    email: str

class UserResponse(UserBase):
    created_at: datetime
    
    class Config:
        from_attributes = True
