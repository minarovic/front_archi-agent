---
id: MCOP-S1-004
type: story
status: planned
priority: must-have
updated: 2025-11-30
sprint: sprint_1
effort: 8-12 hours
depends_on: [MCOP-S1-001, MCOP-S1-002]
blocks: [MCOP-S1-005]
---

# Explorer Agent s Mock Collibra Klientom

## Brief
Vytvor interaktívneho Explorer Agent-a pomocou Pydantic AI, ktorý umožňuje používateľovi preskúmať metadata v prirodzenom jazyku. Agent má prístup k mock Collibra klientovi, ktorý číta z JSON dump súboru.

## Business Value
- Používateľ môže klásť otázky ako "Aké dimenzie má fact_bs_purchase_order?"
- Agent odpovedá na základe skutočných metadata z Collibra exportu
- Základ pre budúcu integráciu s live Collibra API

## Acceptance Criteria

- [ ] `src/explorer/__init__.py` existuje
- [ ] `src/explorer/mock_client.py` obsahuje `CollibraAPIMock` class
- [ ] `src/explorer/agent.py` obsahuje Pydantic AI agent s nástrojmi
- [ ] Agent má aspoň 5 tools:
  - [ ] `list_tables()` - Zoznam všetkých tabuliek
  - [ ] `get_table_details(table_name)` - Detaily konkrétnej tabuľky
  - [ ] `find_relationships(table_name)` - FK vzťahy
  - [ ] `search_columns(pattern)` - Vyhľadávanie stĺpcov
  - [ ] `get_lineage(table_name)` - Data lineage info
- [ ] Mock client číta z `data/analysis/ba_bs_datamarts_summary_*.json`
- [ ] CLI demo: `python -m src.explorer.cli`
- [ ] Test `tests/test_explorer.py` prechádza

## Technical Notes

### Pydantic AI Agent Pattern
```python
# src/explorer/agent.py
from pydantic_ai import Agent, RunContext
from dataclasses import dataclass
from typing import Optional

from .mock_client import CollibraAPIMock

@dataclass
class ExplorerDeps:
    """Dependencies injected into agent tools."""
    collibra: CollibraAPIMock
    session_id: str

explorer_agent = Agent(
    model="openai:gpt-4o-mini",  # Azure deployment mapped via env
    deps_type=ExplorerDeps,
    system_prompt="""You are a metadata exploration assistant for MCOP.

You help users understand their data landscape by querying Collibra metadata.
When users ask about tables, columns, or relationships, use your tools to find accurate information.

Guidelines:
- Always use tools to get real data, don't guess
- Format responses clearly with markdown
- If a table doesn't exist, say so explicitly
- Suggest related tables when relevant
"""
)

@explorer_agent.tool
async def list_tables(ctx: RunContext[ExplorerDeps]) -> list[dict]:
    """List all available tables in the catalog.

    Returns a list of tables with their type (FACT/DIMENSION) and description.
    """
    return ctx.deps.collibra.list_tables()

@explorer_agent.tool
async def get_table_details(
    ctx: RunContext[ExplorerDeps],
    table_name: str
) -> dict:
    """Get detailed information about a specific table.

    Args:
        table_name: Exact name of the table (e.g., 'fact_bs_purchase_order')

    Returns table schema, columns, business description, and owner.
    """
    return ctx.deps.collibra.get_table(table_name)

@explorer_agent.tool
async def find_relationships(
    ctx: RunContext[ExplorerDeps],
    table_name: str
) -> list[dict]:
    """Find all foreign key relationships for a table.

    Args:
        table_name: Name of the table to find relationships for

    Returns list of related tables with relationship type.
    """
    return ctx.deps.collibra.get_relationships(table_name)

@explorer_agent.tool
async def search_columns(
    ctx: RunContext[ExplorerDeps],
    pattern: str
) -> list[dict]:
    """Search for columns matching a pattern across all tables.

    Args:
        pattern: Search pattern (supports wildcards: supplier*, *_id)

    Returns matching columns with their table and type.
    """
    return ctx.deps.collibra.search_columns(pattern)

@explorer_agent.tool
async def get_lineage(
    ctx: RunContext[ExplorerDeps],
    table_name: str
) -> dict:
    """Get data lineage information for a table.

    Args:
        table_name: Name of the table

    Returns upstream sources and downstream consumers.
    """
    return ctx.deps.collibra.get_lineage(table_name)
```

### Mock Collibra Client
```python
# src/explorer/mock_client.py
import json
import fnmatch
from pathlib import Path
from typing import Optional

class CollibraAPIMock:
    """Mock Collibra API client reading from JSON dump."""

    def __init__(self, data_path: str = "data/analysis/ba_bs_datamarts_summary_2025-10-30T23-10-10.json"):
        self.data = self._load_data(data_path)
        self._build_index()

    def _load_data(self, path: str) -> dict:
        """Load JSON dump from file."""
        file_path = Path(path)
        if not file_path.exists():
            # Try to find any matching file
            pattern = "data/analysis/ba_bs_datamarts_summary_*.json"
            files = list(Path(".").glob(pattern))
            if files:
                file_path = files[0]
            else:
                raise FileNotFoundError(f"No Collibra dump found at {path}")

        return json.loads(file_path.read_text())

    def _build_index(self):
        """Build lookup indexes for fast access."""
        self.tables_by_name = {}
        self.columns_index = []

        for table in self.data.get("tables", []):
            name = table.get("name", "").lower()
            self.tables_by_name[name] = table

            for col in table.get("columns", []):
                self.columns_index.append({
                    "table": name,
                    "column": col.get("name", ""),
                    "type": col.get("type", "unknown"),
                    "description": col.get("description", "")
                })

    def list_tables(self) -> list[dict]:
        """List all tables with summary info."""
        return [
            {
                "name": t.get("name"),
                "type": t.get("table_type", "UNKNOWN"),
                "description": t.get("description", "")[:100],
                "column_count": len(t.get("columns", []))
            }
            for t in self.data.get("tables", [])
        ]

    def get_table(self, name: str) -> dict:
        """Get full table details."""
        table = self.tables_by_name.get(name.lower())
        if not table:
            return {"error": f"Table '{name}' not found"}
        return table

    def get_relationships(self, table_name: str) -> list[dict]:
        """Get FK relationships for a table."""
        table = self.tables_by_name.get(table_name.lower())
        if not table:
            return []

        relationships = []
        for col in table.get("columns", []):
            if col.get("is_foreign_key"):
                relationships.append({
                    "column": col.get("name"),
                    "references": col.get("references", {}),
                    "type": "foreign_key"
                })

        return relationships

    def search_columns(self, pattern: str) -> list[dict]:
        """Search columns using wildcard pattern."""
        results = []
        pattern_lower = pattern.lower()

        for col_info in self.columns_index:
            if fnmatch.fnmatch(col_info["column"].lower(), pattern_lower):
                results.append(col_info)

        return results[:50]  # Limit results

    def get_lineage(self, table_name: str) -> dict:
        """Get lineage info (mock - from metadata if available)."""
        table = self.tables_by_name.get(table_name.lower())
        if not table:
            return {"error": f"Table '{table_name}' not found"}

        return {
            "table": table_name,
            "upstream": table.get("source_systems", ["Unknown"]),
            "downstream": table.get("consumers", ["Reports", "Dashboards"]),
            "refresh_frequency": table.get("refresh", "Daily")
        }
```

### CLI Interface
```python
# src/explorer/cli.py
import asyncio
import os
from dotenv import load_dotenv

from .agent import explorer_agent, ExplorerDeps
from .mock_client import CollibraAPIMock

load_dotenv()

async def main():
    # Initialize mock client
    collibra = CollibraAPIMock()
    deps = ExplorerDeps(collibra=collibra, session_id="cli-session")

    print("🔍 MCOP Explorer Agent")
    print("=" * 40)
    print("Ask questions about your metadata catalog.")
    print("Type 'quit' to exit.\n")

    while True:
        try:
            user_input = input("You: ").strip()
            if user_input.lower() in ("quit", "exit", "q"):
                print("Goodbye!")
                break

            if not user_input:
                continue

            # Run agent
            result = await explorer_agent.run(user_input, deps=deps)
            print(f"\nAgent: {result.data}\n")

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}\n")

if __name__ == "__main__":
    asyncio.run(main())
```

## Azure OpenAI Configuration

Agent uses environment variables for Azure:
```python
# In actual deployment, Pydantic AI reads from env:
# OPENAI_API_KEY, OPENAI_API_BASE, etc.
# Or configure explicitly:

import os
from pydantic_ai import Agent

agent = Agent(
    model="openai:gpt-4o-mini",
    # Azure mapping happens via OPENAI_API_BASE env var
)
```

Pre Azure AI Foundry, set v `.env`:
```
OPENAI_API_BASE=https://your-endpoint.openai.azure.com/
OPENAI_API_KEY=your-key
OPENAI_API_VERSION=2024-10-21
```

## Testing

### Unit Tests
```python
# tests/test_explorer.py
import pytest
from src.explorer.mock_client import CollibraAPIMock

@pytest.fixture
def mock_client(tmp_path):
    """Create mock client with test data."""
    test_data = {
        "tables": [
            {
                "name": "fact_orders",
                "table_type": "FACT",
                "description": "Order transactions",
                "columns": [
                    {"name": "order_id", "type": "string", "is_primary_key": True},
                    {"name": "customer_id", "type": "string", "is_foreign_key": True}
                ]
            },
            {
                "name": "dim_customer",
                "table_type": "DIMENSION",
                "columns": [
                    {"name": "customer_id", "type": "string", "is_primary_key": True},
                    {"name": "name", "type": "string"}
                ]
            }
        ]
    }

    data_file = tmp_path / "test_data.json"
    data_file.write_text(json.dumps(test_data))

    return CollibraAPIMock(str(data_file))

def test_list_tables(mock_client):
    """Test table listing."""
    tables = mock_client.list_tables()
    assert len(tables) == 2
    assert tables[0]["name"] == "fact_orders"
    assert tables[0]["type"] == "FACT"

def test_get_table_details(mock_client):
    """Test getting table details."""
    table = mock_client.get_table("fact_orders")
    assert table["name"] == "fact_orders"
    assert len(table["columns"]) == 2

def test_search_columns(mock_client):
    """Test column search with wildcard."""
    results = mock_client.search_columns("*_id")
    assert len(results) >= 2  # order_id, customer_id (x2)

def test_table_not_found(mock_client):
    """Test handling of non-existent table."""
    result = mock_client.get_table("nonexistent")
    assert "error" in result
```

### Integration Test (requires Azure credentials)
```python
# tests/test_explorer_integration.py
import pytest
import asyncio
from src.explorer.agent import explorer_agent, ExplorerDeps
from src.explorer.mock_client import CollibraAPIMock

@pytest.mark.integration
@pytest.mark.asyncio
async def test_agent_responds():
    """Test that agent can respond to a query."""
    collibra = CollibraAPIMock()
    deps = ExplorerDeps(collibra=collibra, session_id="test")

    result = await explorer_agent.run("List all tables", deps=deps)

    assert result.data is not None
    assert len(result.data) > 0
```

### Manual Testing
```bash
# Run CLI
python -m src.explorer.cli

# Example queries:
# - "List all tables"
# - "What columns does fact_bs_purchase_order have?"
# - "Find all columns containing 'supplier'"
# - "What are the relationships of dimv_bs_material?"
```

## Definition of Done
- [ ] Všetky AC splnené
- [ ] Mock client funguje s reálnym JSON dump
- [ ] Agent správne volá tools
- [ ] Unit testy prechádzajú
- [ ] CLI demo funguje lokálne
- [ ] Code review approved
