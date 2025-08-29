from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import Field, BaseModel
from .base import MongoBaseModel, PyObjectId

class Subtask(BaseModel):
    id: str
    title: str
    completed: bool = False
    due: Optional[datetime] = None
    assignee: Optional[str] = None

class Assignee(BaseModel):
    id: str
    name: str
    initials: str
    color: str
    email: Optional[str] = None

class Task(MongoBaseModel):
    """Task model for MongoDB"""
    code: str = Field(..., description="Unique task code (e.g., TSK-001)")
    contract_id: str = Field(..., description="Reference to the associated contract")
    title: str
    description: str
    status: str = Field(
        default="To Do",
        description="Task status: To Do, Blocked, On Hold, In Progress, In Review, Done, Canceled"
    )
    type: str
    assignee: Assignee
    due: datetime
    subtasks: List[Subtask] = Field(default_factory=list)
    progress: float = Field(default=0.0, ge=0.0, le=100.0)
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata for the task"
    )

    class Config:
        schema_extra = {
            "example": {
                "code": "TSK-001",
                "contract_id": "CNT-001",
                "title": "Review Contract Terms",
                "description": "Review and verify all contract terms and conditions",
                "status": "To Do",
                "type": "review",
                "assignee": {
                    "id": "U001",
                    "name": "John Doe",
                    "initials": "JD",
                    "color": "#FF5733",
                    "email": "john@example.com"
                },
                "due": "2024-03-25T23:59:59Z",
                "subtasks": [
                    {
                        "id": "ST001",
                        "title": "Check legal terms",
                        "completed": False,
                        "due": "2024-03-23T23:59:59Z"
                    }
                ],
                "progress": 0.0
            }
        }

    def calculate_progress(self) -> float:
        """Calculate task progress based on completed subtasks."""
        if not self.subtasks:
            return 0.0
        completed = sum(1 for st in self.subtasks if st.completed)
        return (completed / len(self.subtasks)) * 100 