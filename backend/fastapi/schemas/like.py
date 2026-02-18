from pydantic import BaseModel
from datetime import datetime

# create like

class LikeCreate(BaseModel):
    user_id: int
    post_id: int

# returning like data

class LikeResponse(BaseModel):
    id: int
    user_id: int
    post_id: int
    created_at: datetime

    class Config:
        orm_mode = True