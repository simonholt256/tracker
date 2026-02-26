from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# create post

class PostCreate(BaseModel):
    content: str

# update post

class PostUpdate(BaseModel):
    content: Optional[str] = None

# returning post data

class PostResponse(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

