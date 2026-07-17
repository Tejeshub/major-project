from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID

# --- Requests ---

class PostCreate(BaseModel):
    caption: str = Field(..., max_length=2200, description="The text content of the post.")
    image: str = Field(..., description="The URL of the uploaded image.")

class CommentCreate(BaseModel):
    text: str = Field(..., max_length=500, description="The content of the comment.")

# --- Responses ---

class CommentResponse(BaseModel):
    id: UUID
    user: str
    avatar: str
    text: str
    ts: str  # 'Just now', '2h ago', or ISO string mapped by frontend

    model_config = ConfigDict(from_attributes=True)

class PostResponse(BaseModel):
    id: UUID
    user: str
    avatar: str
    city: str
    image: str
    caption: str
    likes: int
    liked: bool
    ts: str
    comments: list[CommentResponse]

    model_config = ConfigDict(from_attributes=True)

class PaginatedPostResponse(BaseModel):
    items: list[PostResponse]
    total: int
    limit: int
    offset: int
