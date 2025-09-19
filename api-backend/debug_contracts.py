#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongoadmin:secret@localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "escra_db")

async def debug_contracts():
    """Debug contracts in database."""
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        contracts_collection = db.contracts
        
        # Count all contracts
        total = await contracts_collection.count_documents({})
        print(f"📊 Total contracts in database: {total}")
        
        # Get all contracts
        cursor = contracts_collection.find({})
        contracts = await cursor.to_list(length=100)
        
        print("\n📋 Contract Details:")
        print("-" * 60)
        for contract in contracts:
            print(f"ID: {contract.get('id', 'N/A')}")
            print(f"Title: {contract.get('title', 'N/A')}")
            print(f"Status: {contract.get('status', 'N/A')}")
            print(f"Created by: {contract.get('created_by', '❌ NOT SET (will be visible to admins only)')}")
            print(f"Shared with: {contract.get('shared_with', [])}")
            print(f"Buyer: {contract.get('buyer', 'N/A')}")
            print(f"Seller: {contract.get('seller', 'N/A')}")
            print(f"Created at: {contract.get('createdAt', 'N/A')}")
            print("-" * 60)
            
        # Test admin query
        print("\n🔍 Testing Admin Query (should return all):")
        admin_query = {}
        admin_count = await contracts_collection.count_documents(admin_query)
        print(f"   Admin sees: {admin_count} contracts")
        
        # Test user query
        print("\n🔍 Testing Regular User Query:")
        user_query = {
            "$or": [
                {"created_by": "test_user_id"},
                {"shared_with": "test_user_id"}
            ]
        }
        user_count = await contracts_collection.count_documents(user_query)
        print(f"   Regular user sees: {user_count} contracts")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(debug_contracts())