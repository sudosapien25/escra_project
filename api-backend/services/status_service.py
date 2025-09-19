from typing import Optional, Dict, Any, List
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from ..models.status_tracking import StatusTracking, StatusChange, StatusDependency
from ..models.contract import Contract
from ..models.task import Task
from ..models.signature import Signature
from ..models.document import Document

class StatusService:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.status_collection = db.status_tracking
        self.contract_collection = db.contracts
        self.task_collection = db.tasks
        self.signature_collection = db.signatures
        self.document_collection = db.documents

    async def update_status(
        self,
        entity_type: str,
        entity_id: str,
        new_status: str,
        changed_by: str,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update the status of an entity and handle all related updates."""
        # Start a session for transaction
        async with await self.db.start_session() as session:
            async with session.start_transaction():
                # Get current status tracking
                status_tracking = await self.status_collection.find_one(
                    {"entity_type": entity_type, "entity_id": entity_id},
                    session=session
                )
                
                if not status_tracking:
                    status_tracking = StatusTracking(
                        entity_type=entity_type,
                        entity_id=entity_id,
                        current_status=new_status
                    )
                else:
                    status_tracking = StatusTracking(**status_tracking)

                # Check if status can be changed
                if not status_tracking.can_change_status(new_status):
                    raise ValueError(f"Cannot change status: {status_tracking.blocking_reason}")

                # Update the entity's status
                collection_map = {
                    "contract": self.contract_collection,
                    "task": self.task_collection,
                    "signature": self.signature_collection,
                    "document": self.document_collection
                }

                collection = collection_map.get(entity_type)
                if not collection:
                    raise ValueError(f"Invalid entity type: {entity_type}")

                # Update entity status
                await collection.update_one(
                    {"_id": entity_id},
                    {"$set": {"status": new_status}},
                    session=session
                )

                # Add status change to tracking
                status_tracking.add_status_change(new_status, changed_by, reason)
                
                # Update status tracking
                await self.status_collection.update_one(
                    {"entity_type": entity_type, "entity_id": entity_id},
                    {"$set": status_tracking.dict()},
                    upsert=True,
                    session=session
                )

                # Update dependent entities
                await self._update_dependent_entities(
                    entity_type,
                    entity_id,
                    new_status,
                    session
                )

                return status_tracking.dict()

    async def _update_dependent_entities(
        self,
        entity_type: str,
        entity_id: str,
        new_status: str,
        session
    ) -> None:
        """Update status of dependent entities."""
        # Find all status tracking records that depend on this entity
        dependent_records = await self.status_collection.find(
            {
                "dependencies": {
                    "$elemMatch": {
                        "entity_type": entity_type,
                        "entity_id": entity_id
                    }
                }
            },
            session=session
        ).to_list(None)

        for record in dependent_records:
            status_tracking = StatusTracking(**record)
            status_tracking.update_dependency(entity_type, entity_id, new_status)
            
            # If all dependencies are satisfied, update the entity's status
            if not status_tracking.is_blocked:
                collection_map = {
                    "contract": self.contract_collection,
                    "task": self.task_collection,
                    "signature": self.signature_collection,
                    "document": self.document_collection
                }
                
                collection = collection_map.get(status_tracking.entity_type)
                if collection:
                    await collection.update_one(
                        {"_id": status_tracking.entity_id},
                        {"$set": {"status": status_tracking.current_status}},
                        session=session
                    )

            # Update status tracking record
            await self.status_collection.update_one(
                {"_id": record["_id"]},
                {"$set": status_tracking.dict()},
                session=session
            )

    async def get_status_history(
        self,
        entity_type: str,
        entity_id: str
    ) -> List[Dict[str, Any]]:
        """Get the status history for an entity."""
        status_tracking = await self.status_collection.find_one({
            "entity_type": entity_type,
            "entity_id": entity_id
        })
        
        if not status_tracking:
            return []
        
        return status_tracking.get("status_history", [])

    async def add_dependency(
        self,
        entity_type: str,
        entity_id: str,
        dependency: StatusDependency
    ) -> None:
        """Add a dependency to an entity's status tracking."""
        await self.status_collection.update_one(
            {"entity_type": entity_type, "entity_id": entity_id},
            {"$push": {"dependencies": dependency.dict()}}
        )

    async def remove_dependency(
        self,
        entity_type: str,
        entity_id: str,
        dependency_entity_type: str,
        dependency_entity_id: str
    ) -> None:
        """Remove a dependency from an entity's status tracking."""
        await self.status_collection.update_one(
            {"entity_type": entity_type, "entity_id": entity_id},
            {
                "$pull": {
                    "dependencies": {
                        "entity_type": dependency_entity_type,
                        "entity_id": dependency_entity_id
                    }
                }
            }
        ) 