from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from app.core.settings import settings

# Create the async engine using the database URL from settings
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,
    connect_args={"statement_cache_size": 0, "prepared_statement_cache_size": 0}
)

# Create a sessionmaker bound to the engine
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Declarative base class for models
class Base(AsyncAttrs, DeclarativeBase):
    pass

# Dependency for FastAPI to get DB sessions
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
