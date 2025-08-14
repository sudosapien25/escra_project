from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import os
import time
from dotenv import load_dotenv
from routes.mongo_routes import router as mongo_router
from routes.contracts import router as contracts_router
from routes.auth import router as auth_router
from db.mongodb import MongoDB
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    # Startup
    await MongoDB.connect_to_database()
    print("Application startup complete")
    yield
    # Shutdown
    await MongoDB.close_database_connection()
    print("Application shutdown complete")

# Initialize FastAPI with lifespan
app = FastAPI(
    title="ESCRa Backend",
    description="Backend API for ESCRa Contract Management System",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

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

# Custom middleware for process time
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Include routers
app.include_router(mongo_router)
app.include_router(contracts_router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to ESCRa Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    try:
        # Check MongoDB connection
        db = MongoDB.get_database()
        await db.command("ping")
        mongo_status = "healthy"
    except Exception:
        mongo_status = "unhealthy"
    
    return {
        "status": "healthy",
        "mongodb": mongo_status,
        "version": "1.0.0"
    }

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 