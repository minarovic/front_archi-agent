"""MCOP FastAPI Backend.

REST API and WebSocket endpoints for the Metadata Copilot pipeline.

Example:
    # Start server
    uvicorn src.api.main:app --reload --port 8000

    # Or run directly
    python -m src.api.main
"""

from src.api.main import app
from src.api.sessions import SessionManager, Session

__all__ = [
    "app",
    "SessionManager",
    "Session",
]
