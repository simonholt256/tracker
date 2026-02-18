from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from models.likes import Like
from schemas.like import LikeCreate, LikeResponse

router = APIRouter(
    prefix="/Likes",
    tags=["likes"]
)

############# LIKE CRUD ##############


# create like
@router.post("/", response_model=LikeResponse)
def like_post(like: LikeCreate, db: Session = Depends(get_db)):
    # Check if like already exists
    existing = db.query(Like).filter(
        Like.user_id == like.user_id,
        Like.post_id == like.post_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already liked")

    db_like = Like(user_id=like.user_id, post_id=like.post_id)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like

# delete like (unlike)
@router.delete("/")
def unlike_post(user_id: int, post_id: int, db: Session = Depends(get_db)):
    like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.post_id == post_id
    ).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(like)
    db.commit()
    return {"message": "Like removed successfully"}

# get all like from a posts

@router.get("/post/{post_id}", response_model=List[LikeResponse])
def get_post_likes(post_id: int, db: Session = Depends(get_db)):
    likes = db.query(Like).filter(Like.post_id == post_id).all()
    return likes