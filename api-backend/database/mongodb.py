"""FastAPI dependency helpers for MongoDB."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from ..db.mongodb import MongoDB


def get_database() -> AsyncIOMotorDatabase:
    """Return the active MongoDB database instance for dependency injection."""
    return MongoDB.get_database()
