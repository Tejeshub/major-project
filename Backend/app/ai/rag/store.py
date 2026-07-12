from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.ai.models import KnowledgeChunk
from agno.embedder.google import GeminiEmbedder
from app.core.settings import settings

# We use the text-embedding-004 model (which outputs 768 dims)
embedder = GeminiEmbedder(
    id="models/text-embedding-004",
    api_key=settings.GEMINI_API_KEY
)

async def search_knowledge(db: AsyncSession, query: str, limit: int = 3):
    """
    Embeds the search query using Gemini, and performs a cosine similarity search
    against the KnowledgeChunks table to retrieve the best context.
    """
    # Get the embedding for the query string
    embedding_response = embedder.get_embedding(query)
    
    # Perform cosine similarity search (using <=> operator in pgvector via SQLAlchemy)
    stmt = (
        select(KnowledgeChunk)
        .order_by(KnowledgeChunk.embedding.cosine_distance(embedding_response))
        .limit(limit)
    )
    
    result = await db.execute(stmt)
    return result.scalars().all()
