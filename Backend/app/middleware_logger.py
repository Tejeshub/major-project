from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class Log404Middleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if response.status_code == 404:
            with open("404_logs.txt", "a") as f:
                f.write(f"404: {request.method} {request.url}\n")
        return response
