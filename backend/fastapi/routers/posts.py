from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db

from models.posts import Post
from schemas.post import PostCreate, PostUpdate, PostResponse

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)



############# POST CRUD ##############

# GET all posts
@router.get("/", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

# GET single post
@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# CREATE post
@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(user_id=post.user_id, content=post.content)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# UPDATE post
@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, update: PostUpdate, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    if update.content is not None:
        db_post.content = update.content
    db.commit()
    db.refresh(db_post)
    return db_post

# DELETE post
@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted successfully"}


