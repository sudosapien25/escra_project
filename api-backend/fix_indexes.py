#!/usr/bin/env python3
import asyncio
from db.mongodb import MongoDB

async def fix_indexes():
    # Connect to the database
    await MongoDB.connect_to_database()
    
    db = MongoDB.get_database()
    
    try:
        # Drop the incorrect 'code' index from contracts collection
        print("Dropping incorrect 'code_1' index from contracts collection...")
        await db.contracts.drop_index("code_1")
        print("Successfully dropped 'code_1' index")
    except Exception as e:
        print(f"Could not drop index (may not exist): {e}")
    
    try:
        # Create the correct indexes
        print("\nCreating correct indexes...")
        await MongoDB.create_indexes()
        print("Successfully created all indexes")
    except Exception as e:
        print(f"Error creating indexes: {e}")
    
    # List current indexes
    print("\nCurrent indexes on contracts collection:")
    indexes = await db.contracts.list_indexes().to_list(length=None)
    for index in indexes:
        print(f"  - {index}")

if __name__ == "__main__":
    asyncio.run(fix_indexes())