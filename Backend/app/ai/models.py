import uuid
from sqlalchemy import Column, String, Text, ForeignKey, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    disease_name = Column(String(255), index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(768)) # Gemini Flash creates 768-dim embeddings
    source = Column(String(255))

class AgentMemory(Base):
    __tablename__ = "agent_memory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    plant_id = Column(Integer, ForeignKey("plant_profiles.id", ondelete="CASCADE"), index=True)
    memory_type = Column(String(50), nullable=False) # e.g. "care_history", "diagnosis_history"
    content = Column(JSONB, nullable=False)
