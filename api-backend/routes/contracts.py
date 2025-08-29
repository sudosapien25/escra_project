from fastapi import APIRouter, HTTPException, Query, Depends, UploadFile, File
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime, date, timedelta
from db.mongodb import MongoDB
from utils.auth import get_current_user, get_current_user_with_role
import json
from bson import ObjectId

router = APIRouter(prefix="/api/contracts", tags=["contracts"])

# Helper function to format relative time
def format_relative_time(dt: datetime) -> str:
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days > 14:
        return f"{diff.days // 7} weeks ago"
    elif diff.days > 1:
        return f"{diff.days} days ago"
    elif diff.days == 1:
        return "1 day ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "just now"

# Helper function to format currency
def format_currency(value: Optional[float]) -> str:
    if not value:
        return "$0"
    return f"${value:,.0f}"

# Pydantic Models
class ContractParty(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    email: Optional[EmailStr] = None
    role: str  # buyer, seller, agent
    phone: Optional[str] = None
    address: Optional[str] = None

class ContractTask(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    title: str
    description: Optional[str] = None
    status: str = "pending"  # pending, in_progress, completed
    assignee: Optional[str] = None
    dueDate: Optional[date] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ContractDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    type: str
    status: str = "pending"
    size: int = 0
    url: Optional[str] = None
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)

class ContractSignature(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    party: str
    partyId: str
    status: str = "pending"  # pending, signed, rejected
    signedAt: Optional[datetime] = None
    ipAddress: Optional[str] = None

class ContractComment(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    author: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    avatarColor: str = "#4B5563"
    textColor: str = "#FFFFFF"

class ActivityLogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    action: str
    user: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    details: Optional[str] = None

class ContractBase(BaseModel):
    title: str
    type: str  # Property Sale, Commercial Lease, Construction Escrow, Investment Property
    status: str = "Initiation"
    
    # Party Information
    buyer: str
    buyerEmail: Optional[EmailStr] = None
    seller: str
    sellerEmail: Optional[EmailStr] = None
    agent: Optional[str] = None
    agentEmail: Optional[EmailStr] = None
    
    # Property Details
    propertyAddress: Optional[str] = None
    propertyType: Optional[str] = None
    escrowNumber: Optional[str] = None
    
    # Financial Details
    value: Optional[float] = None
    earnestMoney: Optional[float] = None
    downPayment: Optional[float] = None
    loanAmount: Optional[float] = None
    interestRate: Optional[float] = None
    loanTerm: Optional[int] = None
    lenderName: Optional[str] = None
    
    # Banking Details
    sellerFinancialInstitution: Optional[str] = None
    buyerFinancialInstitution: Optional[str] = None
    buyerAccountNumber: Optional[str] = None
    sellerAccountNumber: Optional[str] = None
    buyerFinancialInstitutionRoutingNumber: Optional[str] = None
    sellerFinancialInstitutionRoutingNumber: Optional[str] = None
    
    # Additional Details
    titleCompany: Optional[str] = None
    insuranceCompany: Optional[str] = None
    inspectionPeriod: Optional[str] = None
    contingencies: Optional[str] = None
    specialProvisions: Optional[str] = None
    milestone: Optional[str] = None
    notes: Optional[str] = None
    
    # Dates
    closingDate: Optional[date] = None
    dueDate: Optional[date] = None
    
    @validator('type')
    def validate_type(cls, v):
        valid_types = ['Property Sale', 'Commercial Lease', 'Construction Escrow', 'Investment Property']
        if v not in valid_types:
            raise ValueError(f'Type must be one of {valid_types}')
        return v
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['Initiation', 'Preparation', 'Wire Details', 'In Review', 'Signatures', 'Funds Disbursed', 'Complete']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of {valid_statuses}')
        return v
    
    @validator('interestRate')
    def validate_interest_rate(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Interest rate must be between 0 and 100')
        return v

class Contract(ContractBase):
    id: str = Field(default_factory=lambda: f"CNT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    # User association
    created_by: Optional[str] = None  # User ID who created the contract
    shared_with: List[str] = []  # List of user IDs who can access this contract
    
    # Related Data
    tasks: List[ContractTask] = []
    documentsList: List[ContractDocument] = []
    signatures: List[ContractSignature] = []
    comments: List[ContractComment] = []
    activityLog: List[ActivityLogEntry] = []
    
    # Computed fields for response
    parties: Optional[str] = None
    updated: Optional[str] = None
    documents: Optional[int] = None

class ContractListResponse(BaseModel):
    contracts: List[Dict[str, Any]]
    pagination: Dict[str, int]

class ContractCreateRequest(ContractBase):
    pass

class ContractUpdateRequest(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    buyer: Optional[str] = None
    buyerEmail: Optional[EmailStr] = None
    seller: Optional[str] = None
    sellerEmail: Optional[EmailStr] = None
    agent: Optional[str] = None
    agentEmail: Optional[EmailStr] = None
    propertyAddress: Optional[str] = None
    propertyType: Optional[str] = None
    value: Optional[float] = None
    closingDate: Optional[date] = None
    dueDate: Optional[date] = None
    milestone: Optional[str] = None
    notes: Optional[str] = None

class ContractFieldUpdateRequest(BaseModel):
    field: str
    value: Any

class StatusUpdateRequest(BaseModel):
    status: str
    reason: Optional[str] = None

# Routes

@router.get("", response_model=ContractListResponse)
async def get_contracts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    sortBy: str = "updatedAt",
    sortOrder: str = "desc",
    current_user: dict = Depends(get_current_user_with_role)
):
    """Get list of contracts with pagination and filtering - admins see all, others see only their contracts"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Build query - admins see all, others see filtered
    if current_user["is_admin"]:
        query = {}
    else:
        query = {
            "$or": [
                {"created_by": current_user["user_id"]},
                {"shared_with": current_user["user_id"]}
            ]
        }
    
    # Add additional filters
    if status:
        query["status"] = status
    if type:
        query["type"] = type
    if search:
        search_filter = {
            "$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"buyer": {"$regex": search, "$options": "i"}},
                {"seller": {"$regex": search, "$options": "i"}},
                {"agent": {"$regex": search, "$options": "i"}}
            ]
        }
        
        if current_user["is_admin"]:
            query.update(search_filter)
        else:
            # Combine user filter with search filter
            user_filter = query.get("$or", [])
            query = {
                "$and": [
                    {"$or": user_filter},
                    search_filter
                ]
            }
        
        if status and not current_user["is_admin"]:
            query["status"] = status
        if type and not current_user["is_admin"]:
            query["type"] = type
    
    # Get total count
    total = await contracts_collection.count_documents(query)
    
    # Calculate pagination
    skip = (page - 1) * limit
    sort_direction = -1 if sortOrder == "desc" else 1
    
    # Fetch contracts
    cursor = contracts_collection.find(query).sort(sortBy, sort_direction).skip(skip).limit(limit)
    contracts = await cursor.to_list(length=limit)
    
    # Format contracts for response
    formatted_contracts = []
    for contract in contracts:
        # Format parties string
        parties = []
        if contract.get("buyer"):
            parties.append(contract["buyer"])
        if contract.get("seller"):
            parties.append(contract["seller"])
        if contract.get("agent"):
            parties.append(contract["agent"])
        parties_str = " & ".join(parties) if parties else "No parties"
        
        # Format updated time
        updated_at = contract.get("updatedAt", datetime.utcnow())
        updated_str = format_relative_time(updated_at)
        
        # Format value
        value_str = format_currency(contract.get("value"))
        
        # Count documents
        doc_count = len(contract.get("documentsList", []))
        
        formatted_contract = {
            "id": contract.get("id", str(contract.get("_id", ""))),
            "title": contract.get("title", ""),
            "parties": parties_str,
            "status": contract.get("status", "Initiation"),
            "updated": updated_str,
            "updatedAt": updated_at.isoformat(),
            "value": value_str,
            "documents": doc_count,
            "type": contract.get("type", ""),
            "milestone": contract.get("milestone", ""),
            "closingDate": contract.get("closingDate", ""),
            "dueDate": contract.get("dueDate", "")
        }
        formatted_contracts.append(formatted_contract)
    
    return ContractListResponse(
        contracts=formatted_contracts,
        pagination={
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    )

@router.get("/{contract_id}")
async def get_contract(contract_id: str, current_user: dict = Depends(get_current_user_with_role)):
    """Get contract details by ID - admins can see all, others need access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Find contract - admins can see all, others need access
    if current_user["is_admin"]:
        contract = await contracts_collection.find_one({"id": contract_id})
    else:
        contract = await contracts_collection.find_one({
            "id": contract_id,
            "$or": [
                {"created_by": current_user["user_id"]},
                {"shared_with": current_user["user_id"]}
            ]
        })
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Remove MongoDB _id field
    contract.pop("_id", None)
    
    # Format parties string
    parties = []
    if contract.get("buyer"):
        parties.append(contract["buyer"])
    if contract.get("seller"):
        parties.append(contract["seller"])
    if contract.get("agent"):
        parties.append(contract["agent"])
    contract["parties"] = " & ".join(parties) if parties else "No parties"
    
    # Format dates
    contract["updated"] = format_relative_time(contract.get("updatedAt", datetime.utcnow()))
    contract["documents"] = len(contract.get("documentsList", []))
    
    return contract

@router.post("", response_model=Contract)
async def create_contract(contract_data: ContractCreateRequest, current_user: dict = Depends(get_current_user)):
    """Create a new contract"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Create contract with generated ID and user association
    contract = Contract(**contract_data.dict())
    contract.created_by = current_user["user_id"]
    
    # Add initial activity log entry
    contract.activityLog.append(
        ActivityLogEntry(
            action="Contract created",
            user="System",
            details=f"Contract '{contract.title}' was created"
        )
    )
    
    # Convert to dict and insert
    contract_dict = contract.dict()
    
    # Convert date objects to strings for MongoDB
    if contract_dict.get("closingDate"):
        contract_dict["closingDate"] = contract_dict["closingDate"].isoformat()
    if contract_dict.get("dueDate"):
        contract_dict["dueDate"] = contract_dict["dueDate"].isoformat()
    
    result = await contracts_collection.insert_one(contract_dict)
    
    # Format response
    contract_dict["parties"] = f"{contract.buyer} & {contract.seller}"
    contract_dict["updated"] = "just now"
    contract_dict["documents"] = 0
    
    return contract_dict

@router.put("/{contract_id}")
async def update_contract(contract_id: str, updates: ContractUpdateRequest, current_user: dict = Depends(get_current_user_with_role)):
    """Update a contract - admins can update all, others need access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Get existing contract - admins can update all, others need access
    if current_user["is_admin"]:
        existing = await contracts_collection.find_one({"id": contract_id})
    else:
        existing = await contracts_collection.find_one({
            "id": contract_id,
            "$or": [
                {"created_by": current_user["user_id"]},
                {"shared_with": current_user["user_id"]}
            ]
        })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Prepare updates
    update_dict = {k: v for k, v in updates.dict().items() if v is not None}
    update_dict["updatedAt"] = datetime.utcnow()
    
    # Convert dates to strings
    if "closingDate" in update_dict and update_dict["closingDate"]:
        update_dict["closingDate"] = update_dict["closingDate"].isoformat()
    if "dueDate" in update_dict and update_dict["dueDate"]:
        update_dict["dueDate"] = update_dict["dueDate"].isoformat()
    
    # Add activity log entry
    if "activityLog" not in existing:
        existing["activityLog"] = []
    
    existing["activityLog"].append({
        "id": str(ObjectId()),
        "action": "Contract updated",
        "user": "System",
        "timestamp": datetime.utcnow(),
        "details": f"Updated fields: {', '.join(update_dict.keys())}"
    })
    
    # Update contract
    update_dict["activityLog"] = existing["activityLog"]
    
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update contract")
    
    # Return updated contract
    updated = await contracts_collection.find_one({"id": contract_id})
    updated.pop("_id", None)
    return updated

@router.patch("/{contract_id}")
async def update_contract_field(contract_id: str, update: ContractFieldUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Update a single field of a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check if contract exists and user has access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Update the field
    update_dict = {
        update.field: update.value,
        "updatedAt": datetime.utcnow()
    }
    
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update contract field")
    
    return {
        "success": True,
        "message": "Contract updated successfully",
        "updated": {
            "field": update.field,
            "value": update.value
        }
    }

@router.delete("/{contract_id}")
async def delete_contract(contract_id: str, current_user: dict = Depends(get_current_user_with_role)):
    """Delete a contract - admins can delete any, others only their own"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Admins can delete any contract, others only their own
    if current_user["is_admin"]:
        result = await contracts_collection.delete_one({"id": contract_id})
    else:
        result = await contracts_collection.delete_one({
            "id": contract_id,
            "created_by": current_user["user_id"]
        })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    return {
        "success": True,
        "message": "Contract deleted successfully"
    }

@router.put("/{contract_id}/status")
async def update_contract_status(contract_id: str, status_update: StatusUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Update contract status with validation - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Get existing contract and check user access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Validate status transition
    valid_transitions = {
        "Initiation": ["Preparation"],
        "Preparation": ["Wire Details"],
        "Wire Details": ["In Review"],
        "In Review": ["Signatures"],
        "Signatures": ["Funds Disbursed"],
        "Funds Disbursed": ["Complete"]
    }
    
    current_status = existing.get("status", "Initiation")
    if status_update.status not in valid_transitions.get(current_status, []):
        if status_update.status != current_status:  # Allow same status update
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status transition from {current_status} to {status_update.status}"
            )
    
    # Update status
    update_dict = {
        "status": status_update.status,
        "updatedAt": datetime.utcnow()
    }
    
    # Add activity log
    if "activityLog" not in existing:
        existing["activityLog"] = []
    
    existing["activityLog"].append({
        "id": str(ObjectId()),
        "action": "Status updated",
        "user": "System",
        "timestamp": datetime.utcnow(),
        "details": f"Status changed from {current_status} to {status_update.status}"
    })
    
    update_dict["activityLog"] = existing["activityLog"]
    
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update status")
    
    # Return updated contract
    updated = await contracts_collection.find_one({"id": contract_id})
    updated.pop("_id", None)
    
    return {
        "success": True,
        "message": "Status updated successfully",
        "contract": updated
    }

@router.post("/{contract_id}/comments")
async def add_contract_comment(contract_id: str, content: str, current_user: dict = Depends(get_current_user)):
    """Add a comment to a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check if contract exists and user has access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Create comment
    comment = ContractComment(
        content=content,
        author="Current User"  # This should come from authentication
    )
    
    # Add comment to contract
    if "comments" not in existing:
        existing["comments"] = []
    
    existing["comments"].append(comment.dict())
    
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": {"comments": existing["comments"], "updatedAt": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to add comment")
    
    return comment.dict()

@router.get("/{contract_id}/tasks")
async def get_contract_tasks(contract_id: str, current_user: dict = Depends(get_current_user)):
    """Get tasks for a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check access
    contract = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    tasks = contract.get("tasks", [])
    
    return {"tasks": tasks}

@router.post("/{contract_id}/tasks")
async def create_contract_task(
    contract_id: str,
    task_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Create a new task for a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check if contract exists and user has access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Generate task ID
    task_id = f"TSK-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{contract_id[:4]}"
    
    # Create task with minimal structure
    task = {
        "id": task_id,
        "code": task_id,
        "title": task_data.get("title", ""),
        "description": task_data.get("description", ""),
        "status": task_data.get("status", "To Do"),
        "type": task_data.get("type", "Task"),
        "assignee": task_data.get("assignee", "Unassigned"),
        "dueDate": task_data.get("dueDate"),
        "subtasks": task_data.get("subtasks", []),
        "progress": "0 of 0",
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    # Add task to contract
    tasks = existing.get("tasks", [])
    tasks.append(task)
    
    # Update contract with new task
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": {"tasks": tasks, "updatedAt": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to create task")
    
    return task

@router.put("/{contract_id}/tasks/{task_id}")
async def update_contract_task(
    contract_id: str,
    task_id: str,
    task_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update a task for a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check if contract exists and user has access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Find and update task
    tasks = existing.get("tasks", [])
    task_found = False
    
    for i, task in enumerate(tasks):
        if task.get("id") == task_id:
            # Update task fields
            tasks[i].update({
                "title": task_data.get("title", task.get("title")),
                "description": task_data.get("description", task.get("description")),
                "status": task_data.get("status", task.get("status")),
                "type": task_data.get("type", task.get("type")),
                "assignee": task_data.get("assignee", task.get("assignee")),
                "dueDate": task_data.get("dueDate", task.get("dueDate")),
                "subtasks": task_data.get("subtasks", task.get("subtasks")),
                "updatedAt": datetime.utcnow().isoformat()
            })
            task_found = True
            updated_task = tasks[i]
            break
    
    if not task_found:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update contract with modified tasks
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": {"tasks": tasks, "updatedAt": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update task")
    
    return updated_task

@router.delete("/{contract_id}/tasks/{task_id}")
async def delete_contract_task(
    contract_id: str,
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a task from a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check if contract exists and user has access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Filter out the task to delete
    tasks = existing.get("tasks", [])
    original_count = len(tasks)
    tasks = [task for task in tasks if task.get("id") != task_id]
    
    if len(tasks) == original_count:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update contract with filtered tasks
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": {"tasks": tasks, "updatedAt": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to delete task")
    
    return {"detail": "Task deleted successfully"}

@router.post("/{contract_id}/documents")
async def upload_contract_document(
    contract_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a document for a contract - only if user has access"""
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Check if contract exists and user has access
    existing = await contracts_collection.find_one({
        "id": contract_id,
        "$or": [
            {"created_by": current_user["user_id"]},
            {"shared_with": current_user["user_id"]}
        ]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Create document record
    document = ContractDocument(
        name=file.filename,
        type=file.content_type,
        size=file.size,
        status="uploaded",
        url=f"/api/contracts/{contract_id}/documents/{file.filename}"  # This would be a real file storage URL
    )
    
    # Add document to contract
    if "documentsList" not in existing:
        existing["documentsList"] = []
    
    existing["documentsList"].append(document.dict())
    
    result = await contracts_collection.update_one(
        {"id": contract_id},
        {"$set": {"documentsList": existing["documentsList"], "updatedAt": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to add document")
    
    return document.dict()