from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.sql import func
from database.database import Base

class Star(Base):
  __tablename__ = 'stars'

  id = Column(Integer, primary_key=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
  habit_id = Column(Integer, ForeignKey("intentions.id", ondelete="CASCADE"))
  date_checked = Column(Date, nullable=False)
  check_level = Column(Integer)   # 1, 2, 3, 4, for amounts of star?
  comment = Column(String, nullable=True)
  