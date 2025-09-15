#!/usr/bin/env python3
"""
Script to promote a user to admin role.
Usage: python make_admin.py <email>
"""

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongoadmin:secret@localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "escra_db")

async def make_admin(email: str):
    """Promote a user to admin role by email."""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        users_collection = db.users
        
        # Find user by email
        user = await users_collection.find_one({"email": email})
        
        if not user:
            print(f"❌ User with email '{email}' not found")
            return False
        
        # Check if already admin
        if user.get("role") == "admin":
            print(f"ℹ️  User '{email}' is already an admin")
            return True
        
        # Update user role to admin
        result = await users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "role": "admin",
                    "updated_at": datetime.now()
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✅ Successfully promoted '{email}' to admin role")
            print(f"   User ID: {user['id']}")
            print(f"   Name: {user['firstName']} {user['lastName']}")
            return True
        else:
            print(f"❌ Failed to update user role")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        client.close()

async def list_users():
    """List all users and their roles."""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        users_collection = db.users
        
        # Get all users
        cursor = users_collection.find({})
        users = await cursor.to_list(length=100)
        
        if not users:
            print("No users found in the database")
            return
        
        print("\n📋 Current Users:")
        print("-" * 60)
        for user in users:
            role = user.get("role", "viewer")
            status = "✅" if user.get("is_active", True) else "❌"
            admin_badge = " 👑" if role == "admin" else ""
            print(f"{status} {user['email']:<30} {role:<10}{admin_badge}")
            print(f"   Name: {user['firstName']} {user['lastName']}")
            print(f"   ID: {user['id']}")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <email>")
        print("       python make_admin.py --list")
        print("\nExamples:")
        print("  python make_admin.py john.doe@example.com")
        print("  python make_admin.py --list")
        sys.exit(1)
    
    if sys.argv[1] == "--list":
        asyncio.run(list_users())
    else:
        email = sys.argv[1]
        success = asyncio.run(make_admin(email))
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()