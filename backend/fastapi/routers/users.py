from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db

from models.users import User
from schemas.user import UserCreate, UserUpdate, UserResponse
from utils.security import hash_password
from routers.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

############# USER CRUD ###############

# get all users

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# protected route

@router.get("/me", response_model=UserResponse)
def read_own_profile(current_user: User = Depends(get_current_user)):
    return current_user

# get user by id

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# post user

@router.post("/signup", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(user.password)

    new_user = User(
        user_name=user.user_name,
        email=user.email,
        password_hash=hashed_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# put user (to edit)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, update: UserUpdate, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    
    if update.user_name is not None:
        db_user.user_name = update.user_name
    if update.email is not None:
        db_user.email = update.email
    if update.password is not None:
        db_user.password_hash = update.password  # hash 

    db.commit()
    db.refresh(db_user)
    return db_user

# delete user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

