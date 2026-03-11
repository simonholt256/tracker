from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# create challenge

class ChallengeCreate(BaseModel):
    intention_id: int
    start_date: datetime
    duration_days: int

    target_count: int
    period_days: int

    strict: Optional[bool] = True
    trophy_id: Optional[int] = None


# update challenge

class ChallengeUpdate(BaseModel):
    start_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    end_date: Optional[datetime] = None

    target_count: Optional[int] = None
    period_days: Optional[int] = None

    strict: Optional[bool] = None
    status: Optional[str] = None
    trophy_id: Optional[int] = None


# returning challenge data

class ChallengeResponse(BaseModel):
    id: int
    user_id: int
    intention_id: int

    start_date: datetime
    duration_days: int
    end_date: Optional[datetime]

    target_count: int
    period_days: int

    strict: bool
    status: str
    trophy_id: Optional[int]

    created_at: datetime

    class Config:
        from_attributes = True