from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.auth import UserCreate, UserLogin, UserResponse, TokenResponse, UserInDB
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from db.mongodb import MongoDB
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    logger.info(f"Registration attempt for email: {user_data.email}")
    logger.info(f"Registration data: firstName={user_data.firstName}, lastName={user_data.lastName}, role={user_data.role}")
    
    try:
        db = MongoDB.get_database()
        users_collection = db.users
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user_data.email})
        if existing_user:
            logger.warning(f"Registration failed: Email {user_data.email} already registered")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_dict = user_data.dict()
        hashed_password = get_password_hash(user_dict.pop("password"))
        
        user_in_db = UserInDB(
            **user_dict,
            hashed_password=hashed_password
        )
        
        # Save to database
        user_doc = user_in_db.dict()
        logger.info(f"Saving user to database: {user_doc['email']}")
        result = await users_collection.insert_one(user_doc)
        
        if not result.inserted_id:
            logger.error(f"Failed to insert user {user_data.email} into database")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        logger.info(f"Successfully registered user: {user_data.email} with ID: {user_in_db.id}")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user_in_db.id, "email": user_in_db.email}
        )
        
        # Create response
        user_response = UserResponse(
            id=user_in_db.id,
            email=user_in_db.email,
            firstName=user_in_db.firstName,
            lastName=user_in_db.lastName,
            role=user_in_db.role,
            created_at=user_in_db.created_at,
            updated_at=user_in_db.updated_at,
            is_active=user_in_db.is_active
        )
        
        return TokenResponse(
            access_token=access_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login a user."""
    try:
        db = MongoDB.get_database()
        users_collection = db.users
        
        # Find user by email
        user = await users_collection.find_one({"email": credentials.email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["id"], "email": user["email"]}
        )
        
        # Create response
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            firstName=user["firstName"],
            lastName=user["lastName"],
            role=user.get("role", "viewer"),
            created_at=user["created_at"],
            updated_at=user["updated_at"],
            is_active=user.get("is_active", True)
        )
        
        return TokenResponse(
            access_token=access_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information."""
    try:
        db = MongoDB.get_database()
        users_collection = db.users
        
        # Find user by ID
        user = await users_collection.find_one({"id": current_user["user_id"]})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
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
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information"
        )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout a user (client should remove the token)."""
    # In a JWT-based system, logout is typically handled client-side
    # by removing the token. We can optionally blacklist tokens here.
    return {"message": "Successfully logged out"}

@router.put("/update-profile", response_model=UserResponse)
async def update_profile(
    firstName: str = None,
    lastName: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile."""
    try:
        db = MongoDB.get_database()
        users_collection = db.users
        
        # Prepare update data
        update_data = {}
        if firstName:
            update_data["firstName"] = firstName
        if lastName:
            update_data["lastName"] = lastName
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        update_data["updated_at"] = datetime.now()
        
        # Update user
        result = await users_collection.update_one(
            {"id": current_user["user_id"]},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get updated user
        user = await users_collection.find_one({"id": current_user["user_id"]})
        
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
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update profile error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )