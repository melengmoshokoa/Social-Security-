# test_api.py
import requests

API_URL = "http://localhost:8081"

# Test creating a user
test_data = {
    "firebase_uid": "test_uid_123",
    "username": "testuser",
    "email": "test@example.com"
}

try:
    response = requests.post(f"{API_URL}/users", json=test_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"Headers: {response.headers}")
except Exception as e:
    print(f"Error: {e}")