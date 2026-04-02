from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from models.intentions import Intention
from schemas.intention import IntentionCreate, IntentionUpdate, IntentionResponse
from routers.auth.dependencies import get_current_user
from models.users import User

router = APIRouter(
    prefix="/intentions",
    tags=["Intentions"]
)


# --------------------
# Create an intention
# --------------------
@router.post("/", response_model=IntentionResponse)
def create_intention(
    intention: IntentionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_intention = Intention(
        user_id=current_user.id,
        intention=intention.intention,
        to_quit=intention.to_quit,
        note=intention.note
    )
    db.add(db_intention)
    db.commit()
    db.refresh(db_intention)
    return db_intention


# --------------------
# Get all intentions for the logged-in user
# --------------------
@router.get("/", response_model=List[IntentionResponse])
def get_intentions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Intention).filter(Intention.user_id == current_user.id).all()


# --------------------
# Get a single intention by ID
# --------------------
@router.get("/{intention_id}", response_model=IntentionResponse)
def get_intention(
    intention_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    intention = db.query(Intention).filter(
        Intention.id == intention_id,
        Intention.user_id == current_user.id
    ).first()

    if not intention:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intention not found")
    
    return intention


# --------------------
# Update an intention
# --------------------
@router.put("/{intention_id}", response_model=IntentionResponse)
def update_intention(
    intention_id: int,
    intention_update: IntentionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_intention = db.query(Intention).filter(
        Intention.id == intention_id,
        Intention.user_id == current_user.id
    ).first()

    if not db_intention:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intention not found")

    # Update only fields sent
    for key, value in intention_update.dict(exclude_unset=True).items():
        setattr(db_intention, key, value)

    db.commit()
    db.refresh(db_intention)
    return db_intention


# --------------------
# Delete an intention
# --------------------
@router.delete("/{intention_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_intention(
    intention_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_intention = db.query(Intention).filter(
        Intention.id == intention_id,
        Intention.user_id == current_user.id
    ).first()

    if not db_intention:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intention not found")

    db.delete(db_intention)
    db.commit()
    return None