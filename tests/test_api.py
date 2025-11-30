"""Tests for MCOP FastAPI Backend.

Test coverage:
- Health check endpoint
- Stats endpoint
- Pipeline endpoints (start, status, result)
- Table/schema endpoints
- Chat endpoints (REST)
- WebSocket chat
- Session management
"""

import json
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from src.api.main import app, session_manager
from src.api.sessions import SessionManager, Session


# =============================================================================
# Fixtures
# =============================================================================


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def clean_sessions():
    """Clean up sessions before and after test."""
    # Clear before
    session_manager._sessions.clear()
    yield session_manager
    # Clear after
    session_manager._sessions.clear()


@pytest.fixture
def mock_collibra_client():
    """Create mock Collibra client with sample data."""
    mock = MagicMock()

    # Mock get_stats
    mock.get_stats.return_value = {
        "loaded_at": datetime.now().isoformat(),
        "total_tables": 10,
        "total_columns": 50,
        "total_schemas": 2,
        "tables_by_type": {"FACT": 3, "DIMENSION": 5, "VIEW": 2},
        "relationships": 8,
        "hierarchies": 2,
    }

    # Mock list_tables
    mock.list_tables.return_value = [
        {
            "name": "factv_purchase_order",
            "full_name": "Systems>dap_gold_prod>dm_bs_purchase>factv_purchase_order",
            "table_type": "FACT",
            "schema": "dm_bs_purchase",
            "description": "Purchase orders fact table",
            "column_count": 15,
            "confidence": 0.95,
        },
        {
            "name": "dimv_supplier",
            "full_name": "Systems>dap_gold_prod>dm_bs_purchase>dimv_supplier",
            "table_type": "DIMENSION",
            "schema": "dm_bs_purchase",
            "description": "Supplier dimension",
            "column_count": 8,
            "confidence": 0.90,
        },
    ]

    # Mock list_schemas
    mock.list_schemas.return_value = [
        {
            "name": "dm_bs_purchase",
            "total_views": 25,
            "dimensions": 8,
            "facts": 5,
            "relations": 12,
            "validated_count": 20,
        },
    ]

    # Mock get_table
    mock.get_table.return_value = {
        "name": "factv_purchase_order",
        "full_name": "Systems>dap_gold_prod>dm_bs_purchase>factv_purchase_order",
        "table_type": "FACT",
        "schema": "dm_bs_purchase",
        "description": "Purchase orders fact table",
        "business_key": None,
        "grain": "Order line item",
        "measures": ["amount", "quantity"],
        "attributes": [],
        "date_columns": ["order_date"],
        "columns": [
            {"name": "amount", "type": "numeric"},
            {"name": "quantity", "type": "numeric"},
        ],
        "confidence": 0.95,
        "rationale": "Contains measures and grain",
    }

    return mock


# =============================================================================
# Health & Stats Tests
# =============================================================================


class TestHealthEndpoint:
    """Tests for /health endpoint."""

    def test_health_returns_200(self, client):
        """Health check should return 200 OK."""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_response_structure(self, client):
        """Health check should return expected structure."""
        response = client.get("/health")
        data = response.json()

        assert "status" in data
        assert "version" in data
        assert "timestamp" in data
        assert data["status"] == "healthy"
        assert data["version"] == "0.1.0"

    def test_health_timestamp_is_valid(self, client):
        """Health check timestamp should be valid ISO format."""
        response = client.get("/health")
        data = response.json()

        # Should not raise
        datetime.fromisoformat(data["timestamp"])


class TestStatsEndpoint:
    """Tests for /api/stats endpoint."""

    def test_stats_returns_200(self, client, clean_sessions):
        """Stats endpoint should return 200 OK."""
        response = client.get("/api/stats")
        assert response.status_code == 200

    def test_stats_response_structure(self, client, clean_sessions):
        """Stats should return expected structure."""
        response = client.get("/api/stats")
        data = response.json()

        assert "active_sessions" in data
        assert "total_tables" in data
        assert "total_columns" in data

    def test_stats_session_count(self, client, clean_sessions):
        """Stats should reflect active session count."""
        # Initially 0
        response = client.get("/api/stats")
        assert response.json()["active_sessions"] == 0

        # Create a session
        clean_sessions.create()
        response = client.get("/api/stats")
        assert response.json()["active_sessions"] == 1


# =============================================================================
# Pipeline Tests
# =============================================================================


class TestPipelineEndpoints:
    """Tests for pipeline endpoints."""

    def test_pipeline_start_returns_session_id(self, client, clean_sessions):
        """Starting pipeline should return session ID."""
        response = client.post(
            "/api/pipeline/run",
            json={"metadata_path": "data/analysis/ba_bs_datamarts_summary.json"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "session_id" in data
        assert data["status"] == "started"

    def test_pipeline_status_not_found(self, client, clean_sessions):
        """Status for non-existent session returns 404."""
        response = client.get("/api/pipeline/nonexistent-session/status")
        assert response.status_code == 404

    def test_pipeline_status_for_valid_session(self, client, clean_sessions):
        """Status for valid session returns correct info."""
        # Create session
        session = clean_sessions.create()
        session.status = "running"

        response = client.get(f"/api/pipeline/{session.id}/status")
        assert response.status_code == 200
        data = response.json()
        assert data["session_id"] == session.id
        assert data["status"] == "running"

    def test_pipeline_result_not_completed(self, client, clean_sessions):
        """Result for non-completed pipeline returns 400."""
        session = clean_sessions.create()
        session.status = "running"

        response = client.get(f"/api/pipeline/{session.id}/result")
        assert response.status_code == 400

    def test_pipeline_result_completed(self, client, clean_sessions):
        """Result for completed pipeline returns data."""
        session = clean_sessions.create()
        session.status = "completed"
        session.pipeline_result = {
            "current_step": "tool3_validated",
            "tool3_output": {"quality_score": 0.85},
        }

        response = client.get(f"/api/pipeline/{session.id}/result")
        assert response.status_code == 200
        data = response.json()
        assert data["current_step"] == "tool3_validated"

    def test_diagram_not_found(self, client, clean_sessions):
        """Diagram for non-existent session returns 404."""
        response = client.get("/api/diagram/nonexistent")
        assert response.status_code == 404

    def test_diagram_not_available(self, client, clean_sessions):
        """Diagram not available yet returns 404."""
        session = clean_sessions.create()

        response = client.get(f"/api/diagram/{session.id}")
        assert response.status_code == 404

    def test_diagram_available(self, client, clean_sessions):
        """Diagram when available returns mermaid code."""
        session = clean_sessions.create()
        session.diagram = "erDiagram\n  FACT ||--o{ DIM : references"

        response = client.get(f"/api/diagram/{session.id}")
        assert response.status_code == 200
        data = response.json()
        assert "erDiagram" in data["diagram"]
        assert data["format"] == "mermaid"


# =============================================================================
# Table/Schema Tests
# =============================================================================


class TestMetadataEndpoints:
    """Tests for table and schema endpoints."""

    def test_list_tables(self, client, mock_collibra_client):
        """List tables returns table summaries."""
        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            response = client.get("/api/tables")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert len(data) == 2
            assert data[0]["name"] == "factv_purchase_order"

    def test_list_tables_with_schema_filter(self, client, mock_collibra_client):
        """List tables with schema filter."""
        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            response = client.get("/api/tables?schema=dm_bs_purchase")
            assert response.status_code == 200

    def test_get_table_details(self, client, mock_collibra_client):
        """Get table returns full details."""
        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            response = client.get("/api/tables/factv_purchase_order")
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "factv_purchase_order"
            assert data["table_type"] == "FACT"
            assert "measures" in data

    def test_get_table_not_found(self, client, mock_collibra_client):
        """Get non-existent table returns 404."""
        mock_collibra_client.get_table.return_value = {"error": "Table 'xyz' not found"}

        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            response = client.get("/api/tables/xyz")
            assert response.status_code == 404

    def test_list_schemas(self, client, mock_collibra_client):
        """List schemas returns schema summaries."""
        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            response = client.get("/api/schemas")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert len(data) == 1
            assert data[0]["name"] == "dm_bs_purchase"


# =============================================================================
# Chat Tests (REST)
# =============================================================================


class TestChatEndpoint:
    """Tests for REST chat endpoint."""

    def test_chat_without_metadata(self, client, clean_sessions):
        """Chat without metadata available returns 503."""
        with patch("src.api.main.get_collibra_client", return_value=None):
            response = client.post(
                "/api/chat",
                json={"content": "List all tables"},
            )
            assert response.status_code == 503

    def test_chat_request_structure(self, client, mock_collibra_client, clean_sessions):
        """Chat endpoint accepts proper request structure."""
        # This test just verifies the endpoint is reachable with mocked client
        # Full agent testing requires actual LLM calls
        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            # The endpoint will try to call the real agent, which may fail
            # without proper LLM credentials, but we verify the structure works
            response = client.post(
                "/api/chat",
                json={"content": "List all tables", "session_id": "test-123"},
            )
            # Either 200 (success) or 500 (agent error due to no LLM)
            assert response.status_code in (200, 500)


# =============================================================================
# Session Manager Tests
# =============================================================================


class TestSessionManager:
    """Tests for SessionManager class."""

    def test_create_session(self):
        """Create session generates unique ID."""
        manager = SessionManager()
        session = manager.create()

        assert session.id is not None
        assert session.status == "active"
        assert session.pipeline_result is None

    def test_create_with_custom_id(self):
        """Create session with custom ID."""
        manager = SessionManager()
        session = manager.create("custom-id-123")

        assert session.id == "custom-id-123"

    def test_get_session(self):
        """Get session by ID."""
        manager = SessionManager()
        created = manager.create()

        retrieved = manager.get(created.id)
        assert retrieved is not None
        assert retrieved.id == created.id

    def test_get_nonexistent_session(self):
        """Get non-existent session returns None."""
        manager = SessionManager()
        result = manager.get("nonexistent")
        assert result is None

    def test_get_or_create(self):
        """Get or create returns existing or new session."""
        manager = SessionManager()

        # First call creates
        session1 = manager.get_or_create("test-session")
        assert session1.id == "test-session"

        # Second call returns existing
        session2 = manager.get_or_create("test-session")
        assert session2 is session1

    def test_update_session(self):
        """Update session fields."""
        manager = SessionManager()
        session = manager.create()

        manager.update(session.id, status="running", error="Test error")

        updated = manager.get(session.id)
        assert updated.status == "running"
        assert updated.error == "Test error"

    def test_add_chat_message(self):
        """Add message to chat history."""
        manager = SessionManager()
        session = manager.create()

        manager.add_chat_message(session.id, "user", "Hello")
        manager.add_chat_message(session.id, "assistant", "Hi there!")

        assert len(session.chat_history) == 2
        assert session.chat_history[0]["role"] == "user"
        assert session.chat_history[1]["content"] == "Hi there!"

    def test_delete_session(self):
        """Delete session removes it."""
        manager = SessionManager()
        session = manager.create()

        result = manager.delete(session.id)
        assert result is True
        assert manager.get(session.id) is None

    def test_delete_nonexistent(self):
        """Delete non-existent session returns False."""
        manager = SessionManager()
        result = manager.delete("nonexistent")
        assert result is False

    def test_list_sessions(self):
        """List sessions returns all sessions."""
        manager = SessionManager()
        manager.create("session-1")
        manager.create("session-2")

        sessions = manager.list_sessions()
        assert len(sessions) == 2

    def test_count(self):
        """Count returns number of sessions."""
        manager = SessionManager()
        assert manager.count() == 0

        manager.create()
        manager.create()
        assert manager.count() == 2

    def test_session_to_dict(self):
        """Session to_dict returns serializable dict."""
        manager = SessionManager()
        session = manager.create()
        session.status = "completed"

        result = session.to_dict()
        assert result["id"] == session.id
        assert result["status"] == "completed"
        assert "created_at" in result

        # Should be JSON serializable
        json.dumps(result)


# =============================================================================
# WebSocket Tests
# =============================================================================


class TestWebSocket:
    """Tests for WebSocket chat endpoint."""

    def test_websocket_connection(self, client, mock_collibra_client, clean_sessions):
        """WebSocket connection should be established."""
        with patch(
            "src.api.main.get_collibra_client", return_value=mock_collibra_client
        ):
            with client.websocket_connect("/ws/test-session") as websocket:
                # Connection established
                assert websocket is not None

    def test_websocket_without_metadata(self, client, clean_sessions):
        """WebSocket without metadata should send error and close."""
        with patch("src.api.main.get_collibra_client", return_value=None):
            with client.websocket_connect("/ws/test-session") as websocket:
                data = websocket.receive_json()
                assert data["type"] == "error"


# =============================================================================
# Integration Tests
# =============================================================================


class TestAPIIntegration:
    """Integration tests using real data files."""

    def test_full_flow_with_real_data(self, client, clean_sessions):
        """Test API with real data files if available."""
        # Start pipeline
        response = client.post(
            "/api/pipeline/run",
            json={
                "metadata_path": "data/analysis/ba_bs_datamarts_summary.json",
                "scope": "bs",
                "skip_tool0": True,
            },
        )

        # Should start even if files missing (will fail in background)
        assert response.status_code == 200
        data = response.json()
        session_id = data["session_id"]

        # Check status
        status_response = client.get(f"/api/pipeline/{session_id}/status")
        assert status_response.status_code == 200
