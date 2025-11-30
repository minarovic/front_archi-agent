"""Session management for MCOP API.

In-memory session storage for MVP - can be replaced with Redis for production.

Example:
    >>> manager = SessionManager()
    >>> session = manager.create()
    >>> manager.get(session.id)
    Session(id='abc123', status='active', ...)
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional
import uuid


@dataclass
class Session:
    """Session state for a user interaction.

    Attributes:
        id: Unique session identifier
        created_at: When session was created
        status: Current status (active, running, completed, failed, chat)
        pipeline_result: Result from pipeline execution
        diagram: Generated Mermaid diagram
        chat_history: History of chat messages
        error: Error message if failed
    """

    id: str
    created_at: datetime = field(default_factory=datetime.now)
    status: str = "active"
    pipeline_result: Optional[dict] = None
    diagram: Optional[str] = None
    chat_history: list[dict] = field(default_factory=list)
    error: Optional[str] = None

    def to_dict(self) -> dict:
        """Convert session to dictionary for JSON serialization."""
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat(),
            "status": self.status,
            "has_result": self.pipeline_result is not None,
            "has_diagram": self.diagram is not None,
            "message_count": len(self.chat_history),
            "error": self.error,
        }


class SessionManager:
    """In-memory session manager (MVP - no Redis).

    Thread-safe for single-worker deployments.
    For production, replace with Redis-backed implementation.

    Example:
        >>> manager = SessionManager()
        >>> session = manager.create()
        >>> print(session.id)
        'a1b2c3d4-...'

        >>> manager.update(session.id, status="running")
        >>> manager.get(session.id).status
        'running'
    """

    def __init__(self):
        """Initialize empty session store."""
        self._sessions: dict[str, Session] = {}

    def create(self, session_id: Optional[str] = None) -> Session:
        """Create new session.

        Args:
            session_id: Optional specific ID, generates UUID if not provided

        Returns:
            New Session instance
        """
        sid = session_id or str(uuid.uuid4())
        session = Session(id=sid)
        self._sessions[sid] = session
        return session

    def get(self, session_id: str) -> Optional[Session]:
        """Get session by ID.

        Args:
            session_id: Session identifier

        Returns:
            Session if found, None otherwise
        """
        return self._sessions.get(session_id)

    def get_or_create(self, session_id: str) -> Session:
        """Get existing session or create new one.

        Args:
            session_id: Session identifier

        Returns:
            Existing or new Session
        """
        if session_id not in self._sessions:
            return self.create(session_id)
        return self._sessions[session_id]

    def update(self, session_id: str, **kwargs) -> Optional[Session]:
        """Update session fields.

        Args:
            session_id: Session identifier
            **kwargs: Fields to update

        Returns:
            Updated Session or None if not found
        """
        session = self._sessions.get(session_id)
        if session:
            for key, value in kwargs.items():
                if hasattr(session, key):
                    setattr(session, key, value)
        return session

    def add_chat_message(
        self,
        session_id: str,
        role: str,
        content: str,
        **extras: Any,
    ) -> Optional[Session]:
        """Add message to chat history.

        Args:
            session_id: Session identifier
            role: Message role (user, assistant, tool)
            content: Message content
            **extras: Additional message fields

        Returns:
            Updated Session or None if not found
        """
        session = self._sessions.get(session_id)
        if session:
            message = {
                "role": role,
                "content": content,
                "timestamp": datetime.now().isoformat(),
                **extras,
            }
            session.chat_history.append(message)
        return session

    def delete(self, session_id: str) -> bool:
        """Delete session.

        Args:
            session_id: Session identifier

        Returns:
            True if deleted, False if not found
        """
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False

    def list_sessions(self) -> list[Session]:
        """List all active sessions.

        Returns:
            List of all sessions
        """
        return list(self._sessions.values())

    def cleanup_old(self, max_age_hours: int = 24) -> int:
        """Remove sessions older than max_age_hours.

        Args:
            max_age_hours: Maximum session age in hours

        Returns:
            Number of sessions removed
        """
        now = datetime.now()
        to_delete = []

        for sid, session in self._sessions.items():
            age = (now - session.created_at).total_seconds() / 3600
            if age > max_age_hours:
                to_delete.append(sid)

        for sid in to_delete:
            del self._sessions[sid]

        return len(to_delete)

    def count(self) -> int:
        """Get total number of sessions.

        Returns:
            Session count
        """
        return len(self._sessions)
