# WebSocket Response Enrichment

**Status:** ✅ Implemented (2025-12-02)
**Endpoints:** WebSocket `/ws/{session_id}` only (REST `/api/chat` pending)

## Overview

Backend now sends enriched responses with `diagram`, `canvas_trigger`, and `metrics` fields to enable frontend Canvas visualization.

## Response Structure

```json
{
  "type": "agent",
  "content": "Found 3 FACT tables with relationships...",
  "diagram": "erDiagram\n    factv_purchase_order ||--o{ dimv_supplier : references",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "reason": "Showing ER diagram for relationships",
    "confidence": 0.85
  },
  "metrics": {
    "total_tables": 5,
    "total_columns": 42,
    "facts_count": 3,
    "dimensions_count": 2,
    "relationships_count": 4,
    "schema_name": "dm_bs_purchase",
    "as_of": "2025-12-02T13:40:00Z",
    "is_stale": false
  },
  "timestamp": "2025-12-02T13:40:05.123456"
}
```

## Detection Logic

### Diagram Intent

**Triggers diagram generation when user query or agent response contains:**
- `relationship`, `diagram`, `schema`, `structure`, `visual`
- `show me`, `tables`, `connect`, `link`, `fk`, `foreign key`

**Example queries:**
- ✅ "Show me relationships for factv_purchase_order"
- ✅ "What's the schema structure?"
- ✅ "Display diagram of tables"
- ❌ "What is metadata?" (too general)

### Canvas Trigger

**View Switching Logic:**

| User Query Pattern                   | View Type    | Confidence | Action      |
| ------------------------------------ | ------------ | ---------- | ----------- |
| `relationship`, `diagram`, `connect` | `er_diagram` | 0.85       | Auto-switch |
| `list`, `show tables`, `what tables` | `table_list` | 0.75       | Auto-switch |
| Response has "fact" + "dimension"    | `er_diagram` | 0.65       | Auto-switch |
| General query                        | N/A          | N/A        | No action   |

**Frontend Behavior:**
- `confidence >= 0.6` → Auto-switches to view
- `confidence < 0.6` → Shows confirmation chip
- View pinned → Always shows confirmation chip

### Metrics

**Always included when Collibra client is available:**
- `total_tables` - Sum of facts + dimensions + views
- `total_columns` - All columns across tables
- `facts_count` - Number of FACT tables
- `dimensions_count` - Number of DIMENSION tables
- `relationships_count` - FK relationships
- `schema_name` - First schema name
- `as_of` - Data timestamp
- `is_stale` - True if data > 1 hour old

## Implementation Details

**File:** `src/api/websocket_enrichment.py`

### Functions

```python
def detect_diagram_intent(user_message: str, agent_response: str) -> bool:
    """Check if user wants a diagram."""

def generate_canvas_trigger(
    user_message: str,
    agent_response: str,
    entity_name: Optional[str] = None
) -> Optional[CanvasTrigger]:
    """Generate view switching trigger."""

def generate_metrics(collibra_client) -> Optional[PipelineMetrics]:
    """Extract metrics from Collibra client."""

def generate_diagram_from_client(collibra_client) -> Optional[str]:
    """Generate Mermaid ER diagram."""
```

### Pydantic Models

```python
class CanvasTrigger(BaseModel):
    action: Literal["switch_view", "new_analysis", "none"]
    view_type: Optional[Literal["er_diagram", "table_list", "relationship_graph"]]
    entity_name: Optional[str]
    query: Optional[str]
    reason: str
    confidence: Optional[float]  # 0.0-1.0

class PipelineMetrics(BaseModel):
    total_tables: int
    total_columns: int
    facts_count: int
    dimensions_count: int
    quality_score: Optional[int]  # 0-100
    relationships_count: Optional[int]
    schema_name: Optional[str]
    as_of: Optional[datetime]
    is_stale: Optional[bool]
```

## Testing

**Test file:** `tests/test_websocket_enrichment.py`

**Coverage:**
- ✅ Diagram intent detection (3 tests)
- ✅ Canvas trigger generation (4 tests)
- ✅ Metrics generation (3 tests)
- ✅ Diagram generation (3 tests)
- ✅ Pydantic model validation (4 tests)

**Total:** 17 tests, 100% passing

## Example Queries

### ER Diagram (confidence 0.85)
```
User: "Show relationships for factv_purchase_order"
→ Canvas switches to ER diagram
→ Diagram includes all FK relationships
```

### Table List (confidence 0.75)
```
User: "List all tables in dm_bs_purchase"
→ Canvas switches to table list view
→ Metrics show counts
```

### General Query (no action)
```
User: "What is data quality?"
→ Canvas stays on current view
→ No diagram generated
```

## Known Limitations

1. **REST endpoint `/api/chat` not enriched** - only WebSocket has enrichment
2. **Diagram always includes all tables** - no filtering by entity yet
3. **Confidence scoring is rule-based** - not ML-based (future: fine-tune LLM)
4. **Quality score always None** - Tool 3 integration pending

## Next Steps

1. Add enrichment to REST `/api/chat` endpoint
2. Implement entity-specific diagram filtering
3. Add Tool 3 quality_score integration
4. Fine-tune confidence scoring with user feedback
5. Add `is_follow_up` field for conversation context

## Frontend Integration

Frontend should handle:
```typescript
interface WebSocketMessage {
  type: 'agent';
  content: string;
  diagram?: string;  // Mermaid syntax
  canvas_trigger?: {
    action: string;
    view_type?: string;
    reason: string;
    confidence?: number;
  };
  metrics?: {
    total_tables: number;
    total_columns: number;
    facts_count: number;
    dimensions_count: number;
    // ... other fields
  };
  timestamp: string;
}
```

**Frontend repos:**
- https://github.com/minarovic/front_archi-agent

**Deployed:** https://practical-quietude-production.up.railway.app
