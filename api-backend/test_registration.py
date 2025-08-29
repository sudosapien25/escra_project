#!/usr/bin/env python3
import requests
import json
import sys
from datetime import datetime

# Test registration endpoint with various inputs
def test_registration():
    url = "http://localhost:8000/api/auth/register"
    
    # Test cases that might cause 422
    test_cases = [
        {
            "name": "Valid registration",
            "data": {
                "email": f"test_{datetime.now().timestamp()}@example.com",
                "password": "testpass123",
                "firstName": "Test",
                "lastName": "User"
            }
        },
        {
            "name": "Missing firstName",
            "data": {
                "email": f"test2_{datetime.now().timestamp()}@example.com",
                "password": "testpass123",
                "lastName": "User"
            }
        },
        {
            "name": "Empty firstName",
            "data": {
                "email": f"test3_{datetime.now().timestamp()}@example.com",
                "password": "testpass123",
                "firstName": "",
                "lastName": "User"
            }
        },
        {
            "name": "Short password",
            "data": {
                "email": f"test4_{datetime.now().timestamp()}@example.com",
                "password": "12345",
                "firstName": "Test",
                "lastName": "User"
            }
        },
        {
            "name": "Invalid email",
            "data": {
                "email": "not-an-email",
                "password": "testpass123",
                "firstName": "Test",
                "lastName": "User"
            }
        },
        {
            "name": "With explicit role",
            "data": {
                "email": f"test5_{datetime.now().timestamp()}@example.com",
                "password": "testpass123",
                "firstName": "Test",
                "lastName": "User",
                "role": "admin"
            }
        }
    ]
    
    for test in test_cases:
        print(f"\n{'='*50}")
        print(f"Testing: {test['name']}")
        print(f"Data: {json.dumps(test['data'], indent=2)}")
        
        try:
            response = requests.post(url, json=test['data'])
            print(f"Status: {response.status_code}")
            
            if response.status_code == 422:
                print("Validation Error Details:")
                print(json.dumps(response.json(), indent=2))
            elif response.status_code == 200:
                result = response.json()
                print(f"Success! User ID: {result['user']['id']}")
            else:
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_registration()