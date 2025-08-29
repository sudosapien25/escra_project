from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    db = None

    @classmethod
    async def connect_to_database(cls):
        """Create database connection."""
        try:
            # Get MongoDB URI from environment variable
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
            database_name = os.getenv("MONGODB_DB_NAME", "escra_db")

            # Create async client
            cls.client = AsyncIOMotorClient(mongodb_uri)
            cls.db = cls.client[database_name]

            # Verify connection
            await cls.client.admin.command('ping')
            print("Successfully connected to MongoDB.")
            
            # Create indexes
            await cls.create_indexes()
            
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")
            raise

    @classmethod
    async def close_database_connection(cls):
        """Close database connection."""
        if cls.client is not None:
            cls.client.close()
            cls.client = None
            cls.db = None
            print("MongoDB connection closed.")

    @classmethod
    async def create_indexes(cls):
        """Create necessary indexes for collections."""
        try:
            # Contracts collection indexes
            await cls.db.contracts.create_index("code", unique=True)
            await cls.db.contracts.create_index("status")
            await cls.db.contracts.create_index("created_at")
            await cls.db.contracts.create_index("updated_at")
            await cls.db.contracts.create_index("parties.id")
            await cls.db.contracts.create_index("documents.id")
            await cls.db.contracts.create_index("tasks.id")
            await cls.db.contracts.create_index("signatures.id")

            # Tasks collection indexes
            await cls.db.tasks.create_index("code", unique=True)
            await cls.db.tasks.create_index("contract_id")
            await cls.db.tasks.create_index("status")
            await cls.db.tasks.create_index("assignee.id")
            await cls.db.tasks.create_index("due")
            await cls.db.tasks.create_index("created_at")
            await cls.db.tasks.create_index("updated_at")

            # Signatures collection indexes
            await cls.db.signatures.create_index("code", unique=True)
            await cls.db.signatures.create_index("document_id")
            await cls.db.signatures.create_index("contract_id")
            await cls.db.signatures.create_index("status")
            await cls.db.signatures.create_index("parties.id")
            await cls.db.signatures.create_index("dates.due")
            await cls.db.signatures.create_index("created_at")
            await cls.db.signatures.create_index("updated_at")

            # Documents collection indexes
            await cls.db.documents.create_index("code", unique=True)
            await cls.db.documents.create_index("contract_id")
            await cls.db.documents.create_index("status")
            await cls.db.documents.create_index("type")
            await cls.db.documents.create_index("created_at")
            await cls.db.documents.create_index("updated_at")

            # Status tracking collection indexes
            await cls.db.status_tracking.create_index("entity_id")
            await cls.db.status_tracking.create_index("entity_type")
            await cls.db.status_tracking.create_index("timestamp")
            await cls.db.status_tracking.create_index([("entity_id", 1), ("entity_type", 1), ("timestamp", -1)])

            print("Successfully created all indexes.")
        except Exception as e:
            print(f"Error creating indexes: {e}")
            raise

    @classmethod
    def get_database(cls):
        """Get database instance."""
        if cls.db is None:
            raise Exception("Database not initialized. Call connect_to_database first.")
        return cls.db 