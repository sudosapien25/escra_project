from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import Field, BaseModel
from .base import MongoBaseModel, PyObjectId

class DocumentMetadata(BaseModel):
    size: int
    mime_type: str
    hash: str
    original_name: str
    uploaded_by: str
    version: int = 1
    pages: Optional[int] = None
    dimensions: Optional[Dict[str, int]] = None
    ocr_text: Optional[str] = None

class Document(MongoBaseModel):
    """Document model for MongoDB"""
    code: str = Field(..., description="Unique document code (e.g., DOC-001)")
    contract_id: str = Field(..., description="Reference to the associated contract")
    name: str
    type: str
    status: str = Field(
        default="Draft",
        description="Document status: Draft, Active, Archived, Voided"
    )
    url: str
    metadata: DocumentMetadata
    version_history: List[Dict[str, Any]] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    custom_fields: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional custom fields for the document"
    )

    class Config:
        schema_extra = {
            "example": {
                "code": "DOC-001",
                "contract_id": "CNT-001",
                "name": "Purchase Agreement",
                "type": "contract",
                "status": "Active",
                "url": "https://storage.example.com/documents/DOC-001.pdf",
                "metadata": {
                    "size": 1024000,
                    "mime_type": "application/pdf",
                    "hash": "a1b2c3d4e5f6g7h8i9j0",
                    "original_name": "purchase_agreement.pdf",
                    "uploaded_by": "U001",
                    "version": 1,
                    "pages": 10
                },
                "tags": ["contract", "legal", "important"],
                "custom_fields": {
                    "category": "legal",
                    "priority": "high"
                }
            }
        }

    def add_version(self, new_url: str, uploaded_by: str, changes: Dict[str, Any]) -> None:
        """Add a new version to the document's version history."""
        self.version_history.append({
            "version": self.metadata.version + 1,
            "url": new_url,
            "uploaded_by": uploaded_by,
            "uploaded_at": datetime.utcnow(),
            "changes": changes
        })
        self.metadata.version += 1
        self.url = new_url

    def get_latest_version(self) -> Dict[str, Any]:
        """Get the latest version information."""
        if not self.version_history:
            return {
                "version": self.metadata.version,
                "url": self.url,
                "uploaded_by": self.metadata.uploaded_by,
                "uploaded_at": self.created_at
            }
        return self.version_history[-1] 