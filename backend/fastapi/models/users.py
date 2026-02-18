from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
  __tablename__ = 'users'

  id = Column(Integer, primary_key=True, index=True)
  user_name = Column(String, unique=True, index=True)
  email = Column(String, unique=True ,index=True)
  password_hash = Column(String)
  created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
  last_login = Column(TIMESTAMP(timezone=True), nullable=True)

