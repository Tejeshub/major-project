from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# --- Backend Base Schemas ---

class ReminderBase(BaseModel):
    # We use aliases to seamlessly map between the frontend's naming convention
    # (e.g., 'plantId', 'task', 'dueAt', 'repeat') and our PostgreSQL columns.
    plant_id: int = Field(..., alias="plantId")
    type: str = Field(..., alias="task")
    due_date: datetime = Field(..., alias="dueAt")
    repeat_rule: str = Field(default="none", alias="repeat")

    model_config = ConfigDict(populate_by_name=True)

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    plant_id: Optional[int] = Field(default=None, alias="plantId")
    type: Optional[str] = Field(default=None, alias="task")
    due_date: Optional[datetime] = Field(default=None, alias="dueAt")
    repeat_rule: Optional[str] = Field(default=None, alias="repeat")

    model_config = ConfigDict(populate_by_name=True)

class ReminderResponse(ReminderBase):
    id: UUID
    user_id: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# --- Frontend specific List Response ---

class ReminderListResponse(BaseModel):
    items: List[ReminderResponse]
    total: int
    limit: int
    offset: int
