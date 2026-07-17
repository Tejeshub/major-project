from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# --- Expert Profile Schemas ---

class ExpertProfileBase(BaseModel):
    name: str = Field(..., max_length=100)
    avatar: str = Field(..., max_length=500)
    specialisation: str = Field(..., max_length=100)
    rating: float = Field(default=5.0)
    consultations_count: int = Field(default=0)
    price: int = Field(..., ge=0)
    bio: str = Field(..., max_length=1000)
    tags: List[str] = Field(default_factory=list)
    city: str = Field(..., max_length=100)

class ExpertProfileCreate(ExpertProfileBase):
    pass

class ExpertProfileResponse(ExpertProfileBase):
    id: UUID
    user_id: str
    
    # Map backend name to frontend name if necessary, but we'll use ConfigDict alias or manually map in service.
    # Frontend expects `consultations` instead of `consultations_count`. We can handle this mapping in the service response.
    
    model_config = ConfigDict(from_attributes=True)

class ExpertProfileListResponse(BaseModel):
    items: List[ExpertProfileResponse]
    total: int
    limit: int
    offset: int

# --- Consultation Messages Schemas ---

class ConsultationMessageBase(BaseModel):
    text: str = Field(..., max_length=1000)

class ConsultationMessageCreate(ConsultationMessageBase):
    pass

class ConsultationMessageResponse(ConsultationMessageBase):
    id: UUID
    consultation_id: UUID
    sender_id: str
    # Frontend expects: `from: "user" | "expert"` and `ts: str`
    # We will map `sender_id` to "user" | "expert" in the service layer.
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FrontendConsultationMessage(BaseModel):
    id: str
    sender_from: str = Field(..., alias="from") # "user" or "expert"
    text: str
    ts: str

    model_config = ConfigDict(populate_by_name=True)

# --- Consultation Schemas ---

class ConsultationReview(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    text: str = Field(..., max_length=500)

class ConsultationBase(BaseModel):
    expert_id: UUID
    slot: str = Field(..., max_length=100)
    mode: str = Field(default="Chat")

class ConsultationCreate(ConsultationBase):
    pass

class ConsultationResponse(BaseModel):
    id: UUID
    expert_id: UUID
    user_id: str
    slot: str
    mode: str
    status: str
    price: int
    booked_at: datetime
    review_rating: Optional[int] = None
    review_text: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- Frontend-specific Consultation Response (matching dummy data shape) ---
class FrontendConsultationResponse(BaseModel):
    id: str
    expertId: str
    expertName: str
    expertAvatar: str
    specialisation: str
    slot: str
    mode: str
    status: str
    price: int
    bookedAt: str
    messages: List[FrontendConsultationMessage]
    review: Optional[dict] = None # Will map to {rating, text} if review exists

class ConsultationListResponse(BaseModel):
    items: List[FrontendConsultationResponse]
    total: int
    limit: int
    offset: int
