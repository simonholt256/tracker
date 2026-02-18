from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from database.database import Base

class Post(Base):
  __tablename__ = 'posts'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  content = Column(String, nullable=False)
  created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
