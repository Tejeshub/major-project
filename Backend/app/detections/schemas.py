from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DetectionCreate(BaseModel):
    plant_id: int
    image_url: str

class DetectionResponse(BaseModel):
    id: int
    plant_id: int
    image_url: str
    disease_name: str
    confidence: float
    treatment_text: Optional[str] = None
    weather_snapshot: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UploadURLResponse(BaseModel):
    upload_url: str
    public_url: str
