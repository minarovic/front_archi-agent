# Pydantic AI Tools Pattern

Tento dokument popisuje vzory pre implementáciu Pydantic AI agentov v MCOP projekte.

## Základný vzor

### Agent s Dependencies

```python
from pydantic_ai import Agent, RunContext
from dataclasses import dataclass

@dataclass
class MyDeps:
    """Dependencies injected into agent tools."""
    db_client: DatabaseClient
    session_id: str
    config: dict

my_agent = Agent(
    model="openai:gpt-4o-mini",
    deps_type=MyDeps,
    system_prompt="You are a helpful assistant."
)
```

### Tool s RunContext

```python
@my_agent.tool
async def search_database(
    ctx: RunContext[MyDeps],
    query: str,
    limit: int = 10
) -> list[dict]:
    """Search the database for matching records.

    Args:
        query: Search query string
        limit: Maximum number of results

    Returns:
        List of matching records
    """
    # Access dependencies via ctx.deps
    results = await ctx.deps.db_client.search(query, limit=limit)
    return results
```

### Tool Plain (bez dependencies)

```python
@my_agent.tool_plain
def format_date(date_str: str, format: str = "%Y-%m-%d") -> str:
    """Format a date string.

    Args:
        date_str: Input date string
        format: Output format

    Returns:
        Formatted date string
    """
    from datetime import datetime
    dt = datetime.fromisoformat(date_str)
    return dt.strftime(format)
```

## MCOP Explorer Agent Pattern

### Complete Implementation

```python
# src/explorer/agent.py
from pydantic_ai import Agent, RunContext
from dataclasses import dataclass
from typing import Optional

from .mock_client import CollibraAPIMock

@dataclass
class ExplorerDeps:
    """Dependencies for Explorer Agent."""
    collibra: CollibraAPIMock
    session_id: str

# Agent definition with system prompt
explorer_agent = Agent(
    model="openai:gpt-4o-mini",
    deps_type=ExplorerDeps,
    system_prompt="""You are a metadata exploration assistant for MCOP.

You help users understand their data landscape by querying Collibra metadata.
When users ask about tables, columns, or relationships, use your tools to find accurate information.

Guidelines:
- Always use tools to get real data, don't guess
- Format responses clearly with markdown
- If a table doesn't exist, say so explicitly
- Suggest related tables when relevant

Available tools:
- list_tables: Get all available tables
- get_table_details: Get schema and columns for a specific table
- find_relationships: Get FK relationships for a table
- search_columns: Search for columns by pattern
- get_lineage: Get data lineage information
"""
)

# Tool implementations
@explorer_agent.tool
async def list_tables(ctx: RunContext[ExplorerDeps]) -> list[dict]:
    """List all available tables in the catalog."""
    return ctx.deps.collibra.list_tables()

@explorer_agent.tool
async def get_table_details(
    ctx: RunContext[ExplorerDeps],
    table_name: str
) -> dict:
    """Get detailed information about a specific table.

    Args:
        table_name: Exact name of the table (e.g., 'fact_bs_purchase_order')
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
    """
    return ctx.deps.collibra.get_lineage(table_name)
```

### Usage

```python
import asyncio
from src.explorer.agent import explorer_agent, ExplorerDeps
from src.explorer.mock_client import CollibraAPIMock

async def main():
    # Initialize dependencies
    collibra = CollibraAPIMock()
    deps = ExplorerDeps(collibra=collibra, session_id="demo")

    # Run agent
    result = await explorer_agent.run(
        "What tables are available?",
        deps=deps
    )

    print(result.data)

asyncio.run(main())
```

### Streaming Responses

```python
async def stream_response(user_message: str, deps: ExplorerDeps):
    """Stream agent response for real-time UI updates."""
    async with explorer_agent.run_stream(user_message, deps=deps) as stream:
        # Stream partial text
        async for chunk in stream.stream_text():
            yield {"type": "partial", "content": chunk}

        # Get final result
        result = await stream.get_data()
        yield {"type": "final", "content": result}
```

## Best Practices

### 1. Docstrings sú dôležité

LLM používa docstringy na pochopenie, kedy a ako použiť tool:

```python
@agent.tool
async def bad_tool(ctx: RunContext[Deps], x: str) -> str:
    return x  # ❌ No docstring

@agent.tool
async def good_tool(ctx: RunContext[Deps], query: str) -> list[dict]:
    """Search for items matching the query.

    Use this when the user asks to find or search for something.

    Args:
        query: Search term or pattern (supports wildcards like *)

    Returns:
        List of matching items with name, type, and description
    """
    return ctx.deps.client.search(query)  # ✅ Clear documentation
```

### 2. Return types pre lepšie odpovede

```python
from pydantic import BaseModel

class TableInfo(BaseModel):
    """Structured table information."""
    name: str
    type: str
    column_count: int
    description: str

@agent.tool
async def get_table_info(
    ctx: RunContext[Deps],
    table_name: str
) -> TableInfo:  # ✅ Typed return
    """Get structured table information."""
    data = ctx.deps.client.get_table(table_name)
    return TableInfo(**data)
```

### 3. Error handling

```python
@agent.tool
async def safe_search(
    ctx: RunContext[Deps],
    query: str
) -> dict:
    """Search with error handling."""
    try:
        results = await ctx.deps.client.search(query)
        return {"success": True, "results": results}
    except Exception as e:
        return {"success": False, "error": str(e)}
```

### 4. Validácia vstupov

```python
from pydantic import Field

@agent.tool
async def limited_search(
    ctx: RunContext[Deps],
    query: str = Field(min_length=2, max_length=100),
    limit: int = Field(default=10, ge=1, le=100)
) -> list[dict]:
    """Search with validated inputs."""
    return ctx.deps.client.search(query, limit=limit)
```

## Azure OpenAI Configuration

Pre Azure AI Foundry, Pydantic AI číta z environment variables:

```bash
# .env
OPENAI_API_BASE=https://your-endpoint.openai.azure.com/
OPENAI_API_KEY=your-key
OPENAI_API_VERSION=2024-10-21
```

Agent potom používa:

```python
# Model name mapuje na deployment
agent = Agent(
    model="openai:gpt-4o-mini",  # Maps to Azure deployment
    deps_type=MyDeps,
)
```

## Testing Agents

```python
import pytest
from unittest.mock import Mock, AsyncMock

@pytest.fixture
def mock_deps():
    """Create mock dependencies."""
    collibra = Mock()
    collibra.list_tables.return_value = [
        {"name": "test_table", "type": "FACT"}
    ]
    return ExplorerDeps(collibra=collibra, session_id="test")

@pytest.mark.asyncio
async def test_list_tables_tool(mock_deps):
    """Test list_tables tool directly."""
    from src.explorer.agent import list_tables

    # Create mock context
    ctx = Mock()
    ctx.deps = mock_deps

    result = await list_tables(ctx)

    assert len(result) == 1
    assert result[0]["name"] == "test_table"
```

## Referencie

- [Pydantic AI Documentation](https://ai.pydantic.dev/)
- [Pydantic AI Tools](https://ai.pydantic.dev/tools/)
- [RunContext API](https://ai.pydantic.dev/api/agent/#pydantic_ai.RunContext)
