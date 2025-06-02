from fastapi import FastAPI, Depends
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="ESCRa Backend")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/escra_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to ESCRa Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add your routes and models here 