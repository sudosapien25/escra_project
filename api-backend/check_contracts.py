#!/usr/bin/env python3
import asyncio
from db.mongodb import MongoDB

async def check_contracts():
    # First connect to the database
    await MongoDB.connect_to_database()
    
    db = MongoDB.get_database()
    contracts_collection = db.contracts
    
    # Get all contracts
    contracts = await contracts_collection.find().to_list(length=100)
    
    print(f"Total contracts in database: {len(contracts)}")
    print("-" * 50)
    
    if contracts:
        # Show last 3 contracts
        print("Last 3 contracts:")
        for contract in contracts[-3:]:
            print(f"  Title: {contract.get('title', 'Unknown')}")
            print(f"  Type: {contract.get('type', 'Unknown')}")
            print(f"  Status: {contract.get('status', 'Unknown')}")
            print(f"  Buyer: {contract.get('buyer', 'Unknown')}")
            print(f"  Seller: {contract.get('seller', 'Unknown')}")
            print(f"  Value: {contract.get('value', 'Unknown')}")
            print(f"  ID: {contract.get('id', 'Unknown')}")
            print("-" * 30)
    else:
        print("No contracts found in database")

if __name__ == "__main__":
    asyncio.run(check_contracts())