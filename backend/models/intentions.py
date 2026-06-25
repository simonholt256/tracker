from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Boolean
from sqlalchemy.sql import func
from database.database import Base

class Intention(Base):
  __tablename__ = 'intentions'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  intention = Column(String, nullable=False)
  to_quit = Column(Boolean, default=False)
  note = Column(String, nullable=True)
  created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
  