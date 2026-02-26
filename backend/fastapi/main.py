from fastapi import FastAPI
from database.database import Base, engine
from routers import users, posts, likes
from routers.auth.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(posts.router)
app.include_router(likes.router)
app.include_router(auth_router)

@app.get("/")
def read_root():
  return {"message": "All is well, Captain!"}

