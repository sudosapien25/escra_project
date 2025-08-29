from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from db.mongodb import MongoDB

load_dotenv()

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Bearer token security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get the current user from the JWT token."""
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return {"user_id": user_id, "email": email}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def is_admin(current_user: dict = Depends(get_current_user)) -> bool:
    """Check if the current user is an admin."""
    db = MongoDB.get_database()
    users_collection = db.users
    
    user = await users_collection.find_one({"id": current_user["user_id"]})
    return user and user.get("role") == "admin"

async def get_current_user_with_role(current_user: dict = Depends(get_current_user)) -> dict:
    """Get the current user with their role."""
    db = MongoDB.get_database()
    users_collection = db.users
    
    user = await users_collection.find_one({"id": current_user["user_id"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "role": user.get("role", "viewer"),
        "is_admin": user.get("role") == "admin"
    }

async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Require the current user to be an admin."""
    db = MongoDB.get_database()
    users_collection = db.users
    
    user = await users_collection.find_one({"id": current_user["user_id"]})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user