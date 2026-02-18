from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# create user
class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str  # raw password; hash it before storing

# update user
class UserUpdate(BaseModel):
    user_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

# returning user data (response)
class UserResponse(BaseModel):
    id: int
    user_name: str
    email: EmailStr
    created_at: Optional[datetime]
    last_login: Optional[datetime]

    class Config:
        orm_mode = True  