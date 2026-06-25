from pydantic import BaseModel
from datetime import date
from typing import Optional


class StarCreate(BaseModel):
    habit_id: int
    date_checked: date
    check_level: int
    comment: Optional[str] = None


class StarUpdate(BaseModel):
    date_checked: Optional[date] = None
    check_level: Optional[int] = None
    comment: Optional[str] = None


class StarResponse(BaseModel):
    id: int
    user_id: int
    habit_id: int
    date_checked: date
    check_level: int
    comment: Optional[str]

    class Config:
        from_attributes = True  