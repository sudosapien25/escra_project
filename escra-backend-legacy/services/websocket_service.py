from typing import Dict, Set, Any
from fastapi import WebSocket
from motor.motor_asyncio import AsyncIOMotorClient
from ..models.status_tracking import StatusTracking

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "status_updates": set(),
            "contract_updates": set(),
            "task_updates": set(),
            "signature_updates": set(),
            "document_updates": set()
        }

    async def connect(self, websocket: WebSocket, channel: str):
        """Connect a client to a specific channel."""
        await websocket.accept()
        self.active_connections[channel].add(websocket)

    def disconnect(self, websocket: WebSocket, channel: str):
        """Disconnect a client from a specific channel."""
        self.active_connections[channel].remove(websocket)

    async def broadcast(self, channel: str, message: Dict[str, Any]):
        """Broadcast a message to all clients in a channel."""
        disconnected = set()
        for connection in self.active_connections[channel]:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for connection in disconnected:
            self.disconnect(connection, channel)

class WebSocketService:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.manager = WebSocketManager()
        self.status_collection = db.status_tracking

    async def start_status_change_stream(self):
        """Start watching for status changes in MongoDB."""
        pipeline = [
            {
                "$match": {
                    "operationType": {"$in": ["insert", "update"]},
                    "ns.coll": "status_tracking"
                }
            }
        ]

        try:
            async with self.status_collection.watch(pipeline) as stream:
                async for change in stream:
                    await self._handle_status_change(change)
        except Exception as e:
            print(f"Error in status change stream: {e}")
            # Implement reconnection logic here

    async def _handle_status_change(self, change: Dict[str, Any]):
        """Handle a status change event from MongoDB."""
        if change["operationType"] == "insert":
            status_tracking = StatusTracking(**change["fullDocument"])
            await self._broadcast_status_update(status_tracking)
        elif change["operationType"] == "update":
            if "fullDocument" in change:
                status_tracking = StatusTracking(**change["fullDocument"])
                await self._broadcast_status_update(status_tracking)

    async def _broadcast_status_update(self, status_tracking: StatusTracking):
        """Broadcast status updates to relevant channels."""
        # Broadcast to general status updates channel
        await self.manager.broadcast(
            "status_updates",
            {
                "type": "status_change",
                "entity_type": status_tracking.entity_type,
                "entity_id": status_tracking.entity_id,
                "current_status": status_tracking.current_status,
                "is_blocked": status_tracking.is_blocked,
                "blocking_reason": status_tracking.blocking_reason
            }
        )

        # Broadcast to specific entity type channel
        if status_tracking.entity_type in self.manager.active_connections:
            await self.manager.broadcast(
                f"{status_tracking.entity_type}_updates",
                {
                    "type": "status_change",
                    "entity_id": status_tracking.entity_id,
                    "current_status": status_tracking.current_status,
                    "is_blocked": status_tracking.is_blocked,
                    "blocking_reason": status_tracking.blocking_reason
                }
            )

    async def subscribe_to_entity(
        self,
        websocket: WebSocket,
        entity_type: str,
        entity_id: str
    ):
        """Subscribe to updates for a specific entity."""
        channel = f"{entity_type}_updates"
        await self.manager.connect(websocket, channel)
        
        # Send initial status
        status_tracking = await self.status_collection.find_one({
            "entity_type": entity_type,
            "entity_id": entity_id
        })
        
        if status_tracking:
            await websocket.send_json({
                "type": "initial_status",
                "current_status": status_tracking["current_status"],
                "is_blocked": status_tracking["is_blocked"],
                "blocking_reason": status_tracking["blocking_reason"]
            })

    async def unsubscribe_from_entity(
        self,
        websocket: WebSocket,
        entity_type: str
    ):
        """Unsubscribe from updates for a specific entity."""
        channel = f"{entity_type}_updates"
        self.manager.disconnect(websocket, channel) 