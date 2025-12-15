from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.models.history import GenerationHistory
from app.core.database import get_session
from typing import List, Any

router = APIRouter()

# Define the response model for a single history item (can be GenerationHistory itself)
# We can also define a route to fetch all history, helpful for a dashboard/sidebar.

@router.get(
    "/{uuid}",
    response_model=GenerationHistory,
    summary="Retrieve a specific generation history record by UUID"
)
def get_history_by_uuid(
    uuid: str, # FastAPI automatically parses this from the path
    session: Session = Depends(get_session)
) -> Any:
    """
    Fetches the GenerationHistory record, including the exact JSON spec, 
    for a given unique generation UUID.
    """
    # 1. Query the database
    # Use select() to build the query and .exec() to execute it
    statement = select(GenerationHistory).where(GenerationHistory.uuid == uuid)
    history_item = session.exec(statement).first()

    # 2. Handle Not Found case
    if not history_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Generation history with UUID '{uuid}' not found."
        )

    # 3. Return the item
    # Since history_item is a SQLModel instance, it is automatically converted to the 
    # JSON response model (GenerationHistory)
    return history_item

@router.get(
    "/",
    response_model=List[GenerationHistory],
    summary="Retrieve all generation history (for UI sidebar/dashboard)"
)
def get_all_history(
    session: Session = Depends(get_session)
) -> List[GenerationHistory]:
    """
    Fetches a list of all recorded generation history items.
    """
    # Query all records, ordered by creation time
    statement = select(GenerationHistory).order_by(GenerationHistory.created_at.desc())
    history_list = session.exec(statement).all()
    
    return history_list