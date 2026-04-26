from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'launchpad.db')

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# ── Tables ────────────────────────────────────────────────────

class Task(Base):
    __tablename__ = "tasks"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String, nullable=False)
    subject    = Column(String, default="")
    priority   = Column(String, default="medium")  # low / medium / high
    due_date   = Column(String, default="")
    done       = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# create all tables
Base.metadata.create_all(bind=engine)

# dependency — gives a db session to each route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
class Note(Base):
    __tablename__ = "notes"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String, nullable=False)
    content    = Column(String, default="")
    summary    = Column(String, default="")
    tags       = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Job(Base):
    __tablename__ = "jobs"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    company     = Column(String, default="")
    location    = Column(String, default="")
    type        = Column(String, default="internship")  # internship | fulltime
    status      = Column(String, default="saved")       # saved | applied | interviewing | offered | rejected
    url         = Column(String, default="")
    notes       = Column(String, default="")
    created_at  = Column(DateTime, default=datetime.utcnow)