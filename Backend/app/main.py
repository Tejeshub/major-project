from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.settings import settings

app = FastAPI(
    title="PlantNest API",
    description="Backend API for PlantNest",
    version="1.0.0",
)

from app.auth.router import router as auth_router
from app.plants.router import router as plants_router
app.include_router(auth_router)
app.include_router(plants_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # In a real app, you would log the exception and parse specific FastAPI exceptions.
    # We are returning a standard format as requested.
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "internal_error",
                "message": "An unexpected error occurred."
            }
        },
    )

# Health check endpoint
@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}
