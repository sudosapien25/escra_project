from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    CREATOR = "creator"
    EDITOR = "editor"
    VIEWER = "viewer"

class UserBase(BaseModel):
    email: EmailStr
    firstName: str = Field(..., min_length=1, max_length=100)
    lastName: str = Field(..., min_length=1, max_length=100)
    role: UserRole = UserRole.VIEWER

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: str = Field(default_factory=lambda: str(datetime.now().timestamp()).replace('.', ''))
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = True

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None