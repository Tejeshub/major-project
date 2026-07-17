import httpx
import time

def test():
    print("Fetching reminders...")
    res1 = httpx.get("http://localhost:8000/api/v1/reminders")
    print("GET status:", res1.status_code)
    
    print("Creating reminder...")
    payload = {"plantId": 1, "task": "Water", "dueAt": "2026-07-20T00:00:00Z", "repeat": "none"}
    res2 = httpx.post("http://localhost:8000/api/v1/reminders", json=payload)
    print("POST status:", res2.status_code)
    
    print("Fetching reminders immediately after...")
    res3 = httpx.get("http://localhost:8000/api/v1/reminders")
    print("GET status:", res3.status_code)

test()
