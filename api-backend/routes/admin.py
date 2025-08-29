from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from db.mongodb import MongoDB
from utils.auth import require_admin, get_password_hash
from models.auth import UserRole, UserResponse
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["admin"])

class UserUpdateRequest(BaseModel):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int

class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str
    role: UserRole = UserRole.VIEWER

@router.get("/users", response_model=UserListResponse)
async def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[str] = None,
    current_admin: dict = Depends(require_admin)
):
    """Get all users - admin only"""
    db = MongoDB.get_database()
    users_collection = db.users
    
    # Build query
    query = {}
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}}
        ]
    if role:
        query["role"] = role
    
    # Get total count
    total = await users_collection.count_documents(query)
    
    # Get paginated users
    skip = (page - 1) * limit
    cursor = users_collection.find(query).skip(skip).limit(limit)
    users = []
    
    async for user in cursor:
        users.append(UserResponse(
            id=user["id"],
            email=user["email"],
            firstName=user["firstName"],
            lastName=user["lastName"],
            role=user.get("role", "viewer"),
            created_at=user["created_at"],
            updated_at=user["updated_at"],
            is_active=user.get("is_active", True)
        ))
    
    return UserListResponse(users=users, total=total)

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_admin: dict = Depends(require_admin)):
    """Get a specific user - admin only"""
    db = MongoDB.get_database()
    users_collection = db.users
    
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        firstName=user["firstName"],
        lastName=user["lastName"],
        role=user.get("role", "viewer"),
        created_at=user["created_at"],
        updated_at=user["updated_at"],
        is_active=user.get("is_active", True)
    )

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str, 
    updates: UserUpdateRequest,
    current_admin: dict = Depends(require_admin)
):
    """Update a user's role or status - admin only"""
    db = MongoDB.get_database()
    users_collection = db.users
    
    # Check if user exists
    existing = await users_collection.find_one({"id": user_id})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prepare update data
    update_data = {}
    if updates.role is not None:
        update_data["role"] = updates.role
    if updates.is_active is not None:
        update_data["is_active"] = updates.is_active
    if updates.firstName is not None:
        update_data["firstName"] = updates.firstName
    if updates.lastName is not None:
        update_data["lastName"] = updates.lastName
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updated_at"] = datetime.now()
    
    # Update user
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update user")
    
    # Get updated user
    updated_user = await users_collection.find_one({"id": user_id})
    
    return UserResponse(
        id=updated_user["id"],
        email=updated_user["email"],
        firstName=updated_user["firstName"],
        lastName=updated_user["lastName"],
        role=updated_user.get("role", "viewer"),
        created_at=updated_user["created_at"],
        updated_at=updated_user["updated_at"],
        is_active=updated_user.get("is_active", True)
    )

@router.post("/users", response_model=UserResponse)
async def create_user_as_admin(
    user_data: AdminUserCreate,
    current_admin: dict = Depends(require_admin)
):
    """Create a new user with specified role - admin only"""
    db = MongoDB.get_database()
    users_collection = db.users
    
    # Check if user already exists
    existing = await users_collection.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = {
        "id": str(datetime.now().timestamp()).replace('.', ''),
        "email": user_data.email,
        "firstName": user_data.firstName,
        "lastName": user_data.lastName,
        "role": user_data.role,
        "hashed_password": get_password_hash(user_data.password),
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "is_active": True
    }
    
    result = await users_collection.insert_one(new_user)
    
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    return UserResponse(
        id=new_user["id"],
        email=new_user["email"],
        firstName=new_user["firstName"],
        lastName=new_user["lastName"],
        role=new_user["role"],
        created_at=new_user["created_at"],
        updated_at=new_user["updated_at"],
        is_active=new_user["is_active"]
    )

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_admin: dict = Depends(require_admin)):
    """Delete a user - admin only"""
    db = MongoDB.get_database()
    users_collection = db.users
    
    # Don't allow admin to delete themselves
    if user_id == current_admin["user_id"]:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    result = await users_collection.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "message": "User deleted successfully"}

@router.post("/make-admin/{user_id}")
async def make_user_admin(user_id: str, current_admin: dict = Depends(require_admin)):
    """Promote a user to admin role - admin only"""
    db = MongoDB.get_database()
    users_collection = db.users
    
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": {"role": "admin", "updated_at": datetime.now()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or already admin")
    
    return {"success": True, "message": "User promoted to admin"}