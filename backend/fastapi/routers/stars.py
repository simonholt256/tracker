from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from math import ceil
from datetime import date, timedelta

from database.database import get_db
from models.stars import Star
from schemas.star import StarCreate, StarUpdate, StarResponse
from routers.auth.dependencies import get_current_user
from models.users import User
from models.challenges import Challenge

router = APIRouter(
    prefix="/stars",
    tags=["Stars"]
)

# evaluating challenges when star is changed

def evaluate_challenges(db: Session, current_user: User, habit_id: int):

    challenges = db.query(Challenge).filter(
        Challenge.user_id == current_user.id,
        Challenge.intention_id == habit_id,
        Challenge.status.in_(["active", "completed"])
    ).all()

    for challenge in challenges:

        start = challenge.start_date
        end = challenge.end_date

        total_days = (end - start).days + 1

        periods_count = (total_days + challenge.period_days - 1) // challenge.period_days

        completed_periods = 0


        for i in range(periods_count):

            period_start = start + timedelta(days=i * challenge.period_days)
            period_end = min(period_start + timedelta(days=challenge.period_days - 1), end)

            actual_period_days = (period_end - period_start).days + 1

            adjusted_target = ceil(
                challenge.target_count * (actual_period_days / challenge.period_days)
            )

            stars_done = db.query(Star).filter(
                Star.user_id == current_user.id,
                Star.habit_id == challenge.intention_id,
                func.date(Star.date_checked) >= period_start,
                func.date(Star.date_checked) <= period_end
            ).count()

            if stars_done >= adjusted_target:
                completed_periods += 1

        print("Completed periods:", completed_periods)
        print("Total periods:", periods_count)

        if completed_periods == periods_count:
            challenge.status = "completed"
        else:
            challenge.status = "active"
    

    db.commit()

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

    evaluate_challenges(db, current_user, star.habit_id)

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

    evaluate_challenges(db, current_user, db_star.habit_id)

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

    habit_id = db_star.habit_id


    db.delete(db_star)
    db.commit()

    evaluate_challenges(db, current_user, habit_id)

    return None