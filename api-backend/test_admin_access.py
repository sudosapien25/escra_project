#!/usr/bin/env python3
import requests
import json

# Test admin access to contracts
def test_admin_access():
    url = "http://localhost:8000/api"
    
    # First, login as admin
    print("1. Logging in as admin...")
    login_response = requests.post(f"{url}/auth/login", json={
        "email": "dmetcalf@atcsecure.com",
        "password": "testpass123"  # You'll need to use your actual password
    })
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get user info
    print("\n2. Getting user info...")
    me_response = requests.get(f"{url}/auth/me", headers=headers)
    if me_response.status_code == 200:
        user = me_response.json()
        print(f"   User: {user['email']}")
        print(f"   Role: {user['role']}")
        print(f"   Admin: {'Yes' if user['role'] == 'admin' else 'No'}")
    
    # Get contracts
    print("\n3. Getting contracts...")
    contracts_response = requests.get(f"{url}/contracts", headers=headers)
    
    if contracts_response.status_code == 200:
        data = contracts_response.json()
        print(f"   Total contracts: {data['pagination']['total']}")
        print(f"   Contracts returned: {len(data['contracts'])}")
        
        for contract in data['contracts']:
            print(f"\n   Contract ID: {contract['id']}")
            print(f"   Title: {contract['title']}")
            print(f"   Created by: {contract.get('created_by', 'Not set')}")
            print(f"   Status: {contract['status']}")
    else:
        print(f"   Failed to get contracts: {contracts_response.status_code}")
        print(f"   {contracts_response.text}")

if __name__ == "__main__":
    print("Note: You need to enter your actual password in the script")
    print("Edit line 12 to set your password")
    test_admin_access()