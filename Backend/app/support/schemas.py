from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class SupportTicketBase(BaseModel):
    subject: str
    description: str
    category: str
    priority: str = "normal"
    attachment_url: Optional[str] = None

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketResponse(SupportTicketBase):
    id: UUID
    user_id: str
    status: str
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SupportTicketListResponse(BaseModel):
    items: List[SupportTicketResponse]
    total: int
    limit: int
    offset: int
