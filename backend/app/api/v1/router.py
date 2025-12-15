from fastapi import APIRouter
from app.api.v1.endpoints import generator
from app.api.v1.endpoints import history # <-- Import the new history module

# Create the main API router for version 1
api_router = APIRouter()

# Include the generator endpoint router
api_router.include_router(generator.router, tags=["Generator"])

# Include the history endpoint router
api_router.include_router(history.router, tags=["History"], prefix="/history") # <-- Add the new router