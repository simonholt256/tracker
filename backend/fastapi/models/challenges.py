from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, Boolean, Enum
from sqlalchemy.sql import func
from database.database import Base

class Challenge(Base):
  __tablename__ = 'challenges'

  id = Column(Integer, primary_key=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  intention_id = Column(Integer, ForeignKey("intentions.id", ondelete="CASCADE"), nullable=False)

  start_date = Column(TIMESTAMP(timezone=True), nullable=False)
  duration_days = Column(Integer, nullable=False)
  end_date = Column(TIMESTAMP(timezone=True))

  target_count = Column(Integer, nullable=False)
  period_days = Column(Integer, nullable=False)

  strict = Column(Boolean, default=True)
  status = Column(Enum("active", "completed", "failed", "cancelled", name="challenge_status"), default="active", nullable=False)
  trophy_id = Column(Integer)
  created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
