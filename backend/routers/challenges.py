from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from database.database import get_db
from models.challenges import Challenge
from schemas.challenge import ChallengeCreate, ChallengeUpdate, ChallengeResponse
from models.intentions import Intention
from routers.auth.dependencies import get_current_user
from models.users import User


router = APIRouter(
    prefix="/challenges",
    tags=["Challenges"]
)


# --------------------
# Create a challenge
# --------------------
@router.post("/", response_model=ChallengeResponse)
def create_challenge(
    challenge: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Check the intention belongs to the current user
    intention = db.query(Intention).filter(
        Intention.id == challenge.intention_id,
        Intention.user_id == current_user.id
    ).first()

    if not intention:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intention not found"
        )

    # Calculate end date
    end_date = challenge.start_date + timedelta(days=challenge.duration_days - 1)

    db_challenge = Challenge(
        user_id=current_user.id,
        intention_id=challenge.intention_id,
        start_date=challenge.start_date,
        duration_days=challenge.duration_days,
        end_date=end_date,
        target_count=challenge.target_count,
        period_days=challenge.period_days,
        strict=challenge.strict,
        trophy_id=challenge.trophy_id
    )

    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)

    return db_challenge


# --------------------
# Get all challenges for the logged-in user
# --------------------
@router.get("/", response_model=List[ChallengeResponse])
def get_challenges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Challenge).filter(
        Challenge.user_id == current_user.id
    ).all()

# get challenge by intention

@router.get("/intention/{intention_id}", response_model=List[ChallengeResponse])
def get_challenges_for_intention(
    intention_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    challenges = db.query(Challenge).filter(
        Challenge.intention_id == intention_id,
        Challenge.user_id == current_user.id
    ).all()

    return challenges


# --------------------
# Get a single challenge
# --------------------
@router.get("/{challenge_id}", response_model=ChallengeResponse)
def get_challenge(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id,
        Challenge.user_id == current_user.id
    ).first()

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )

    return challenge


# --------------------
# Update a challenge
# --------------------
@router.put("/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    challenge_id: int,
    challenge_update: ChallengeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    db_challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id,
        Challenge.user_id == current_user.id
    ).first()

    if not db_challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )

    # Update fields sent in request
    for key, value in challenge_update.dict(exclude_unset=True).items():
        setattr(db_challenge, key, value)

    # Recalculate end_date if start_date or duration_days changed
    if db_challenge.start_date and db_challenge.duration_days:
        db_challenge.end_date = db_challenge.start_date + timedelta(days=db_challenge.duration_days)

    db.commit()
    db.refresh(db_challenge)

    return db_challenge


# --------------------
# Delete a challenge
# --------------------
@router.delete("/{challenge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_challenge(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    db_challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id,
        Challenge.user_id == current_user.id
    ).first()

    if not db_challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )

    db.delete(db_challenge)
    db.commit()

    return None