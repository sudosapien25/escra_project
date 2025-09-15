from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import Field, BaseModel
from .base import MongoBaseModel, PyObjectId

class Party(BaseModel):
    id: str
    name: str
    role: str
    type: str = Field(..., description="buyer, seller, agent, or other")
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class DocumentReference(BaseModel):
    id: str
    type: str
    status: str
    url: str
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TaskReference(BaseModel):
    id: str
    status: str
    title: str
    due: datetime

class SignatureReference(BaseModel):
    id: str
    status: str
    document_id: str

class Contract(MongoBaseModel):
    """Contract model for MongoDB"""
    code: str = Field(..., description="Unique contract code (e.g., CNT-001)")
    title: str
    type: str
    status: str = Field(
        default="Initiation",
        description="Contract status: Initiation, Preparation, Wire Details, In Review, Signatures, Funds Disbursed, Complete"
    )
    parties: List[Party]
    value: Optional[float] = None
    dates: Dict[str, datetime] = Field(
        default_factory=lambda: {
            "created": datetime.utcnow(),
            "updated": datetime.utcnow(),
            "effective": datetime.utcnow()
        }
    )
    documents: List[DocumentReference] = Field(default_factory=list)
    tasks: List[TaskReference] = Field(default_factory=list)
    signatures: List[SignatureReference] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata for the contract"
    )

    class Config:
        schema_extra = {
            "example": {
                "code": "CNT-001",
                "title": "Property Purchase Agreement",
                "type": "Property Sale",
                "status": "Initiation",
                "parties": [
                    {
                        "id": "P001",
                        "name": "John Doe",
                        "role": "Buyer",
                        "type": "buyer",
                        "email": "john@example.com"
                    },
                    {
                        "id": "P002",
                        "name": "Jane Smith",
                        "role": "Seller",
                        "type": "seller",
                        "email": "jane@example.com"
                    }
                ],
                "value": 500000.00,
                "dates": {
                    "created": "2024-03-20T10:00:00Z",
                    "updated": "2024-03-20T10:00:00Z",
                    "effective": "2024-03-20T10:00:00Z"
                }
            }
        } 