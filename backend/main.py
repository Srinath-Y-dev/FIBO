from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import init_db # <-- Import the DB initialization function

def get_application():
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
    )
    
    app.add_event_handler("startup", init_db) # <-- UNCOMMENT THIS LINE
    
    app.include_router(api_router, prefix="/api/v1")
    
    return app

app = get_application()