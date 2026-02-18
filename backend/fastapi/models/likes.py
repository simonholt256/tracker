from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from database.database import Base

class Like(Base):
  __tablename__ = 'likes'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
  created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
  __table_args__ = (UniqueConstraint("user_id", "post_id", name="unique_like"),)

