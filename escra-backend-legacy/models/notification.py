from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import Field
from .base import MongoBaseModel

class NotificationMeta(MongoBaseModel):
    """Notification metadata model"""
    contract_id: Optional[str] = Field(None, alias="contractId")
    user_id: Optional[str] = Field(None, alias="userId")
    role: Optional[str] = None
    deadline: Optional[datetime] = None
    amount: Optional[float] = None
    additional_data: Dict[str, Any] = Field(default_factory=dict)

class Notification(MongoBaseModel):
    """Notification model for MongoDB"""
    type: str = Field(
        description="Notification type: contract_signed, comment_added, wire_info_submitted, etc."
    )
    title: str
    message: str
    read: bool = False
    timestamp: datetime
    icon: Optional[str] = None
    link: Optional[str] = None
    meta: Optional[NotificationMeta] = None

    class Config:
        schema_extra = {
            "example": {
                "type": "contract_signed",
                "title": "Contract Signed",
                "message": "John Doe has signed the contract",
                "read": False,
                "timestamp": "2024-03-20T10:00:00",
                "icon": "check-circle",
                "link": "/contracts/123",
                "meta": {
                    "contractId": "contract123",
                    "userId": "user456",
                    "role": "signer"
                }
            }
        } 