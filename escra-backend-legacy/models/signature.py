from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import Field, BaseModel
from .base import MongoBaseModel, PyObjectId

class SignatureParty(BaseModel):
    id: str
    name: str
    role: str
    status: str = Field(
        default="Pending",
        description="Signature status: Pending, Signed, Rejected"
    )
    signed_at: Optional[datetime] = None
    signature_data: Optional[Dict[str, Any]] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class Assignee(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    role: Optional[str] = None

class Reminder(BaseModel):
    sent_at: datetime
    sent_to: str
    type: str = Field(..., description="email or sms")
    status: str = Field(..., description="sent or failed")
    response: Optional[str] = None

class Signature(MongoBaseModel):
    """Signature model for MongoDB"""
    code: str = Field(..., description="Unique signature code (e.g., SIG-001)")
    document_id: str = Field(..., description="Reference to the associated document")
    contract_id: str = Field(..., description="Reference to the associated contract")
    status: str = Field(
        default="Pending",
        description="Signature status: Pending, Completed, Expired, Rejected, Voided"
    )
    parties: List[SignatureParty]
    assignee: Assignee
    dates: Dict[str, datetime] = Field(
        default_factory=lambda: {
            "sent": datetime.utcnow(),
            "due": datetime.utcnow()
        }
    )
    reminders: List[Reminder] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata for the signature"
    )

    class Config:
        schema_extra = {
            "example": {
                "code": "SIG-001",
                "document_id": "DOC-001",
                "contract_id": "CNT-001",
                "status": "Pending",
                "parties": [
                    {
                        "id": "P001",
                        "name": "John Doe",
                        "role": "Buyer",
                        "status": "Pending",
                        "email": "john@example.com"
                    },
                    {
                        "id": "P002",
                        "name": "Jane Smith",
                        "role": "Seller",
                        "status": "Pending",
                        "email": "jane@example.com"
                    }
                ],
                "assignee": {
                    "id": "U001",
                    "name": "Mike Johnson",
                    "email": "mike@example.com",
                    "role": "Escrow Officer"
                },
                "dates": {
                    "sent": "2024-03-20T10:00:00Z",
                    "due": "2024-03-25T23:59:59Z"
                }
            }
        }

    def is_complete(self) -> bool:
        """Check if all parties have signed."""
        return all(party.status == "Signed" for party in self.parties)

    def is_expired(self) -> bool:
        """Check if the signature request has expired."""
        return datetime.utcnow() > self.dates["due"]

    def get_pending_parties(self) -> List[SignatureParty]:
        """Get list of parties who haven't signed yet."""
        return [party for party in self.parties if party.status == "Pending"] 