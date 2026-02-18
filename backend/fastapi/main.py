from fastapi import FastAPI
from database.database import Base, engine
from routers import users, posts, likes

app = FastAPI()


Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(posts.router)
app.include_router(likes.router)

@app.get("/")
def read_root():
  return {"message": "All is well, Captain!"}

