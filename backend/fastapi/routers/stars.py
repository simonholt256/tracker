from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from database.database import get_db
from models.stars import Star
from schemas.star import StarCreate, StarUpdate, StarResponse
from routers.auth.dependencies import get_current_user
from models.users import User

router = APIRouter(
    prefix="/stars",
    tags=["Stars"]
)


# Create a star

@router.post("/", response_model=StarResponse)
def create_star(
    star: StarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Star).filter(
        Star.user_id == current_user.id,
        Star.habit_id == star.habit_id,
        Star.date_checked == star.date_checked
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Star already exists for this habit and date")

    db_star = Star(
        user_id=current_user.id,
        habit_id=star.habit_id,
        date_checked=star.date_checked,
        check_level=star.check_level,
        comment=star.comment
    )
    db.add(db_star)
    db.commit()
    db.refresh(db_star)
    return db_star


# Get all stars for the current user

@router.get("/", response_model=List[StarResponse])
def get_stars(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stars = db.query(Star).filter(Star.user_id == current_user.id).all()
    return stars


# Get a single star by ID

@router.get("/{star_id}", response_model=StarResponse)
def get_star(
    star_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    star = db.query(Star).filter(
        Star.id == star_id,
        Star.user_id == current_user.id
    ).first()
    if not star:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Star not found")
    return star


# Update a star

@router.put("/{star_id}", response_model=StarResponse)
def update_star(
    star_id: int,
    star_update: StarUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_star = db.query(Star).filter(
        Star.id == star_id,
        Star.user_id == current_user.id
    ).first()
    if not db_star:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Star not found")

    for key, value in star_update.dict(exclude_unset=True).items():
        setattr(db_star, key, value)

    db.commit()
    db.refresh(db_star)
    return db_star

# Delete a star

@router.delete("/{star_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_star(
    star_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_star = db.query(Star).filter(
        Star.id == star_id,
        Star.user_id == current_user.id
    ).first()
    if not db_star:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Star not found")

    db.delete(db_star)
    db.commit()
    return None