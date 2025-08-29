from fastapi import APIRouter, HTTPException
from db.mongodb import MongoDB
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter(prefix="/api/mongo", tags=["mongodb"])

# Pydantic models for request/response
class Assignee(BaseModel):
    assignee_id: str
    name: str
    email: Optional[str] = None
    created_at: datetime = datetime.utcnow()

class Status(BaseModel):
    status_id: str
    name: str
    description: Optional[str] = None

class Document(BaseModel):
    document_id: str
    contract_id: str
    name: str
    status: str
    assignee_id: Optional[str] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class Party(BaseModel):
    id: str
    name: str
    role: str
    type: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class Contract(BaseModel):
    id: str = Field(default_factory=lambda: f"CNT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}")
    code: str = Field(default_factory=lambda: f"CNT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}")
    title: str
    type: str
    status: str = Field(default="Initiation")
    parties: List[Party]
    value: Optional[float] = None
    dates: Dict[str, datetime] = Field(
        default_factory=lambda: {
            "created": datetime.utcnow(),
            "updated": datetime.utcnow(),
            "effective": datetime.utcnow()
        }
    )
    documents: List[str] = Field(default_factory=list)
    tasks: List[str] = Field(default_factory=list)
    signatures: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

# Assignee routes
@router.post("/assignees", response_model=Assignee)
async def create_assignee(assignee: Assignee):
    db = MongoDB.get_database()
    assignees_collection = db.assignees
    try:
        result = await assignees_collection.insert_one(assignee.dict())
        return assignee
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/assignees", response_model=List[Assignee])
async def get_assignees():
    db = MongoDB.get_database()
    assignees_collection = db.assignees
    try:
        assignees = await assignees_collection.find().to_list(length=100)
        return assignees
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/assignees/{assignee_id}")
async def delete_assignee(assignee_id: str):
    db = MongoDB.get_database()
    assignees_collection = db.assignees
    try:
        result = await assignees_collection.delete_one({"assignee_id": assignee_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Assignee not found")
        return {"message": "Assignee deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Status routes
@router.post("/status", response_model=Status)
async def create_status(status: Status):
    db = MongoDB.get_database()
    status_collection = db.status
    try:
        result = await status_collection.insert_one(status.dict())
        return status
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status", response_model=List[Status])
async def get_statuses():
    db = MongoDB.get_database()
    status_collection = db.status
    try:
        statuses = await status_collection.find().to_list(length=100)
        return statuses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/status/{status_id}")
async def delete_status(status_id: str):
    db = MongoDB.get_database()
    status_collection = db.status
    try:
        result = await status_collection.delete_one({"status_id": status_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Status not found")
        return {"message": "Status deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Document routes
@router.post("/documents", response_model=Document)
async def create_document(document: Document):
    db = MongoDB.get_database()
    documents_collection = db.documents
    try:
        result = await documents_collection.insert_one(document.dict())
        return document
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/documents", response_model=List[Document])
async def get_documents():
    db = MongoDB.get_database()
    documents_collection = db.documents
    try:
        documents = await documents_collection.find().to_list(length=100)
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    db = MongoDB.get_database()
    documents_collection = db.documents
    try:
        result = await documents_collection.delete_one({"document_id": document_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Contract routes
@router.post("/contracts", response_model=Contract)
async def create_contract(contract: Contract):
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    try:
        result = await contracts_collection.insert_one(contract.dict())
        return contract
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/contracts", response_model=List[Contract])
async def get_contracts():
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    try:
        contracts = await contracts_collection.find().to_list(length=100)
        return contracts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contracts/{contract_id}", response_model=Contract)
async def get_contract(contract_id: str):
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    try:
        contract = await contracts_collection.find_one({"id": contract_id})
        if not contract:
            raise HTTPException(status_code=404, detail="Contract not found")
        return contract
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/contracts/{contract_id}", response_model=Contract)
async def update_contract(contract_id: str, contract: Contract):
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    try:
        result = await contracts_collection.update_one(
            {"id": contract_id},
            {"$set": contract.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Contract not found")
        return contract
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/contracts/{contract_id}")
async def delete_contract(contract_id: str):
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    try:
        result = await contracts_collection.delete_one({"id": contract_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Contract not found")
        return {"message": "Contract deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# We'll add more routes as needed, but let's start with these basic ones 