from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings
from app.models.history import GenerationHistory # Important to import the model for table creation

# The engine connects to the database using the URL from your .env file
# pool_pre_ping=True helps maintain the connection health
engine = create_engine(settings.DATABASE_URL, echo=True, pool_pre_ping=True)

def init_db():
    """Initializes the database and creates all defined tables if they don't exist."""
    print("Attempting to initialize database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully (or already exist).")

def get_session():
    """Dependency function to yield a new database session for FastAPI routes."""
    with Session(engine) as session:
        yield session

# Note: Remember to uncomment `init_db` in main.py's startup event later!
# app.add_event_handler("startup", init_db)