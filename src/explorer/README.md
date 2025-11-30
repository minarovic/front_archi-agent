# Explorer Agent - MCOP-S1-004

A Pydantic AI agent for exploring Collibra metadata using natural language queries.

## Components

### Mock Collibra Client (`mock_client.py`)

Simulates Collibra API by reading from local JSON exports:

```python
from src.explorer import CollibraAPIMock

client = CollibraAPIMock()

# List all tables
tables = client.list_tables()

# Get table details
details = client.get_table("dimv_supplier")

# Find relationships
rels = client.get_relationships("factv_purchase_order")

# Search columns
cols = client.search_columns("*supplier*")

# Get lineage
lineage = client.get_lineage("factv_orders")
```

### Explorer Agent (`agent.py`)

Pydantic AI agent with 5 tools for metadata exploration:

| Tool                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `list_tables`        | List all tables, optionally filtered by schema |
| `get_table_details`  | Get full details for a specific table          |
| `find_relationships` | Find FK and hierarchy relationships            |
| `search_columns`     | Search columns by wildcard pattern             |
| `get_lineage`        | Get upstream/downstream lineage                |

```python
from src.explorer import create_explorer_agent, ExplorerDeps, CollibraAPIMock

client = CollibraAPIMock()
deps = ExplorerDeps(collibra=client, session_id="my-session")
agent = create_explorer_agent()

# Run async
result = await agent.run("List all fact tables", deps=deps)
print(result.output)
```

### CLI (`cli.py`)

Interactive command-line interface:

```bash
# Interactive mode
python -m src.explorer.cli

# Single query
python -m src.explorer.cli --query "What tables are in dm_bs_purchase?"

# With custom data paths
python -m src.explorer.cli --summary path/to/summary.json
```

## Data Sources

The mock client reads from:
1. `data/analysis/ba_bs_datamarts_summary.json` - Schemas and aggregated metrics
2. `data/tool2/structure.json` - Classified facts, dimensions, relationships

## Environment Variables

For agent LLM calls:
```bash
# Azure OpenAI (preferred)
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini

# Or OpenAI
OPENAI_API_KEY=your-key
```

## Running Tests

```bash
.venv/bin/python3 -m pytest tests/test_explorer.py -v
```

## Example Session

```
$ python -m src.explorer.cli

╔═══════════════════════════════════════════════════════════════╗
║           MCOP Metadata Explorer Agent                        ║
╚═══════════════════════════════════════════════════════════════╝

Loaded 5 tables, 37 columns
Tables by type: {'FACT': 2, 'DIMENSION': 2, 'VIEW': 1}

You> List all fact tables
Thinking...

Agent> Found 2 tables:
  [FACT      ] factv_purchase_order: 8 columns, confidence=0.95
  [FACT      ] factv_delivery_performance: 8 columns, confidence=0.88

You> What columns does dimv_supplier have?
Thinking...

Agent> Table: dimv_supplier
Type: DIMENSION
Business Key: supplier_id
Attributes: supplier_name, supplier_country, supplier_rating
...

You> quit
Goodbye!
```
