from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import Optional
from ..services.status_service import StatusService
from ..services.websocket_service import WebSocketService
from ..models.status_tracking import StatusDependency
from ..database.mongodb import get_database
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/api/status", tags=["status"])

def get_status_service(db: AsyncIOMotorClient = Depends(get_database)) -> StatusService:
    return StatusService(db)

def get_websocket_service(db: AsyncIOMotorClient = Depends(get_database)) -> WebSocketService:
    return WebSocketService(db)

@router.put("/{entity_type}/{entity_id}")
async def update_status(
    entity_type: str,
    entity_id: str,
    new_status: str,
    changed_by: str,
    reason: Optional[str] = None,
    status_service: StatusService = Depends(get_status_service)
):
    """Update the status of an entity."""
    try:
        result = await status_service.update_status(
            entity_type=entity_type,
            entity_id=entity_id,
            new_status=new_status,
            changed_by=changed_by,
            reason=reason
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{entity_type}/{entity_id}/history")
async def get_status_history(
    entity_type: str,
    entity_id: str,
    status_service: StatusService = Depends(get_status_service)
):
    """Get the status history for an entity."""
    try:
        history = await status_service.get_status_history(
            entity_type=entity_type,
            entity_id=entity_id
        )
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{entity_type}/{entity_id}/dependencies")
async def add_dependency(
    entity_type: str,
    entity_id: str,
    dependency: StatusDependency,
    status_service: StatusService = Depends(get_status_service)
):
    """Add a dependency to an entity's status tracking."""
    try:
        await status_service.add_dependency(
            entity_type=entity_type,
            entity_id=entity_id,
            dependency=dependency
        )
        return {"message": "Dependency added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{entity_type}/{entity_id}/dependencies/{dependency_entity_type}/{dependency_entity_id}")
async def remove_dependency(
    entity_type: str,
    entity_id: str,
    dependency_entity_type: str,
    dependency_entity_id: str,
    status_service: StatusService = Depends(get_status_service)
):
    """Remove a dependency from an entity's status tracking."""
    try:
        await status_service.remove_dependency(
            entity_type=entity_type,
            entity_id=entity_id,
            dependency_entity_type=dependency_entity_type,
            dependency_entity_id=dependency_entity_id
        )
        return {"message": "Dependency removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/{entity_type}/{entity_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    entity_type: str,
    entity_id: str,
    websocket_service: WebSocketService = Depends(get_websocket_service)
):
    """WebSocket endpoint for real-time status updates."""
    try:
        await websocket_service.subscribe_to_entity(
            websocket=websocket,
            entity_type=entity_type,
            entity_id=entity_id
        )
        
        while True:
            try:
                # Keep the connection alive and handle any client messages
                data = await websocket.receive_text()
                # Handle any client messages if needed
            except WebSocketDisconnect:
                websocket_service.unsubscribe_from_entity(
                    websocket=websocket,
                    entity_type=entity_type
                )
                break
    except Exception as e:
        if not websocket.client_state.DISCONNECTED:
            await websocket.close(code=1000)
        raise HTTPException(status_code=500, detail=str(e)) 