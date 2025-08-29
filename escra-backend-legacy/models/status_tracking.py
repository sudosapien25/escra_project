from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import Field, BaseModel
from .base import MongoBaseModel, PyObjectId

class StatusChange(BaseModel):
    """Represents a single status change event"""
    old_status: str
    new_status: str
    changed_by: str
    changed_at: datetime = Field(default_factory=datetime.utcnow)
    reason: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class StatusDependency(BaseModel):
    """Represents a dependency between statuses of different entities"""
    entity_type: str  # 'contract', 'task', 'signature', 'document'
    entity_id: str
    required_status: str
    is_satisfied: bool = False
    satisfied_at: Optional[datetime] = None

class StatusTracking(MongoBaseModel):
    """Tracks status changes and dependencies across all entities"""
    entity_type: str = Field(..., description="Type of entity (contract, task, signature, document)")
    entity_id: str = Field(..., description="ID of the entity")
    current_status: str
    status_history: List[StatusChange] = Field(default_factory=list)
    dependencies: List[StatusDependency] = Field(default_factory=list)
    is_blocked: bool = Field(default=False, description="Whether status changes are blocked due to dependencies")
    blocking_reason: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "entity_type": "contract",
                "entity_id": "CNT-001",
                "current_status": "Active",
                "status_history": [
                    {
                        "old_status": "Draft",
                        "new_status": "Review",
                        "changed_by": "U001",
                        "changed_at": "2024-03-20T10:00:00Z",
                        "reason": "Initial review started"
                    }
                ],
                "dependencies": [
                    {
                        "entity_type": "task",
                        "entity_id": "TASK-001",
                        "required_status": "Completed",
                        "is_satisfied": True,
                        "satisfied_at": "2024-03-20T11:00:00Z"
                    }
                ],
                "is_blocked": False
            }
        }

    def add_status_change(self, new_status: str, changed_by: str, reason: Optional[str] = None) -> None:
        """Add a new status change to the history."""
        if self.status_history:
            old_status = self.current_status
        else:
            old_status = "Initial"

        change = StatusChange(
            old_status=old_status,
            new_status=new_status,
            changed_by=changed_by,
            reason=reason
        )
        
        self.status_history.append(change)
        self.current_status = new_status

    def check_dependencies(self) -> bool:
        """Check if all dependencies are satisfied."""
        all_satisfied = True
        for dep in self.dependencies:
            if not dep.is_satisfied:
                all_satisfied = False
                self.is_blocked = True
                self.blocking_reason = f"Waiting for {dep.entity_type} {dep.entity_id} to reach status {dep.required_status}"
                break
        
        if all_satisfied:
            self.is_blocked = False
            self.blocking_reason = None
        
        return all_satisfied

    def update_dependency(self, entity_type: str, entity_id: str, new_status: str) -> None:
        """Update a dependency's status."""
        for dep in self.dependencies:
            if dep.entity_type == entity_type and dep.entity_id == entity_id:
                dep.is_satisfied = new_status == dep.required_status
                if dep.is_satisfied:
                    dep.satisfied_at = datetime.utcnow()
                break
        
        self.check_dependencies()

    def can_change_status(self, new_status: str) -> bool:
        """Check if the status can be changed."""
        if self.is_blocked:
            return False
        
        # Add any additional status transition validation logic here
        return True 