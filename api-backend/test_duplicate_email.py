#!/usr/bin/env python3
import requests
import json

# Test registration with a duplicate email
def test_duplicate():
    url = "http://localhost:8000/api/auth/register"
    
    # Try to register with an email that might already exist
    test_email = "john.doe@example.com"
    
    print(f"Testing registration with email: {test_email}")
    
    data = {
        "email": test_email,
        "password": "testpass123",
        "firstName": "Another",
        "lastName": "User"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 422:
            print("Validation Error (422):")
            print(json.dumps(response.json(), indent=2))
        elif response.status_code == 400:
            print("Bad Request (400):")
            print(json.dumps(response.json(), indent=2))
        elif response.status_code == 200:
            print("Success! This email was not already registered.")
            result = response.json()
            print(f"User ID: {result['user']['id']}")
        else:
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_duplicate()