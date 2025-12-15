from sqlmodel import SQLModel, Field, JSON, Column
from datetime import datetime
from typing import Optional, Any
from app.models.spec import FiboSpec # Import the spec model

# Use Column(JSON) to store the Pydantic FiboSpec object directly as JSON in Postgres
class GenerationHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Unique ID for API lookup (e.g., gen-12345)
    uuid: str = Field(..., index=True) 

    # The exact JSON specification used for this generation (CRITICAL FOR DIFF VIEW)
    spec: dict = Field(..., sa_column=Column(JSON), description="The exact FiboSpec JSON used.")
    
    # The image output
    generated_image_url: str = Field(..., description="Public URL to the generated image file.")
    
    # Metadata
    status: str = Field("success", description="Status of the generation (success, failed).")
    created_at: datetime = Field(default_factory=datetime.utcnow)