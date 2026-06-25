from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# create post

class IntentionCreate(BaseModel):
    intention: str
    to_quit: Optional[bool] = False
    note: Optional[str] = None

# update post

class IntentionUpdate(BaseModel):
    intention: Optional[str] = None
    to_quit: Optional[bool] = None
    note: Optional[str] = None

# returning post data

class IntentionResponse(BaseModel):
    id: int
    user_id: int
    intention: str
    to_quit: bool
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

