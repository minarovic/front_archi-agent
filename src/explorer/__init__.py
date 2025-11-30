# Explorer Agent - MCOP-S1-004
# Mock Collibra client + Pydantic AI agent for metadata exploration

from .mock_client import CollibraAPIMock
from .agent import create_explorer_agent, ExplorerDeps, explore

__all__ = [
    "CollibraAPIMock",
    "create_explorer_agent",
    "ExplorerDeps",
    "explore",
]
