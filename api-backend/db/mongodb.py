"""MongoDB connection helpers used by the ESCRa backend."""

from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()


class MongoDB:
    """Centralised MongoDB client manager."""

    client: Optional[AsyncIOMotorClient] = None
    db = None

    @classmethod
    async def connect_to_database(cls) -> None:
        """Create database connection and ensure indexes exist."""
        if cls.client is not None:
            return

        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        database_name = os.getenv("MONGODB_DB_NAME", "escra_db")

        try:
            cls.client = AsyncIOMotorClient(mongodb_uri)
            cls.db = cls.client[database_name]

            await cls.client.admin.command("ping")
            await cls.create_indexes()
        except ConnectionFailure as exc:
            cls.client = None
            cls.db = None
            raise ConnectionFailure(f"Could not connect to MongoDB: {exc}") from exc

    @classmethod
    async def close_database_connection(cls) -> None:
        """Close the shared MongoDB connection."""
        if cls.client is not None:
            cls.client.close()
            cls.client = None
            cls.db = None

    @classmethod
    async def create_indexes(cls) -> None:
        """Create indexes required by the application collections."""
        if cls.db is None:
            raise RuntimeError("Database not initialised. Call connect_to_database first.")

        try:
            await cls.db.contracts.create_index("id", unique=True)
            await cls.db.contracts.create_index("status")
            await cls.db.contracts.create_index("created_at")
            await cls.db.contracts.create_index("updated_at")
            await cls.db.contracts.create_index("parties.id")
            await cls.db.contracts.create_index("documents.id")
            await cls.db.contracts.create_index("tasks.id")
            await cls.db.contracts.create_index("signatures.id")
            await cls.db.contracts.create_index("created_by")
            await cls.db.contracts.create_index("shared_with")

            await cls.db.tasks.create_index("code", unique=True)
            await cls.db.tasks.create_index("contract_id")
            await cls.db.tasks.create_index("status")
            await cls.db.tasks.create_index("assignee.id")
            await cls.db.tasks.create_index("due")
            await cls.db.tasks.create_index("created_at")
            await cls.db.tasks.create_index("updated_at")

            await cls.db.signatures.create_index("code", unique=True)
            await cls.db.signatures.create_index("document_id")
            await cls.db.signatures.create_index("contract_id")
            await cls.db.signatures.create_index("status")
            await cls.db.signatures.create_index("parties.id")
            await cls.db.signatures.create_index("dates.due")
            await cls.db.signatures.create_index("created_at")
            await cls.db.signatures.create_index("updated_at")

            await cls.db.documents.create_index("code", unique=True)
            await cls.db.documents.create_index("contract_id")
            await cls.db.documents.create_index("status")
            await cls.db.documents.create_index("type")
            await cls.db.documents.create_index("created_at")
            await cls.db.documents.create_index("updated_at")

            await cls.db.status_tracking.create_index("entity_id")
            await cls.db.status_tracking.create_index("entity_type")
            await cls.db.status_tracking.create_index("timestamp")
            await cls.db.status_tracking.create_index(
                [("entity_id", 1), ("entity_type", 1), ("timestamp", -1)]
            )
        except Exception as exc:  # pragma: no cover - logging side effect
            raise RuntimeError(f"Error creating MongoDB indexes: {exc}") from exc

    @classmethod
    def get_database(cls):
        """Return the active Mongo database reference."""
        if cls.db is None:
            raise RuntimeError("Database not initialised. Call connect_to_database first.")
        return cls.db
