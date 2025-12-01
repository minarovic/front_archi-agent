# WebSocket Test Fixtures

Tieto fixtures slúžia pre Playwright E2E testy. Poskytujú mockované WebSocket responses.

## Použitie

```typescript
// tests/fixtures/ws/index.ts
import canvasTriggers from './canvas-triggers.json';
import metrics from './metrics.json';
import messages from './messages.json';
import errors from './errors.json';

export const WS_FIXTURES = {
  triggers: canvasTriggers,
  metrics,
  messages,
  errors
};
```

```typescript
// V teste
import { WS_FIXTURES } from '../fixtures/ws';

test('auto-switches on high confidence trigger', async ({ page }) => {
  const fixture = WS_FIXTURES.triggers.diagram_high_confidence;

  // Mock response
  await mockWebSocket(page, fixture);

  // Assertions
  expect(fixture.canvas_trigger.confidence).toBeGreaterThan(0.6);
});
```

## Súbory

| Fixture                | Scenáre | Popis                                                      |
| ---------------------- | ------- | ---------------------------------------------------------- |
| `canvas-triggers.json` | 7       | Canvas trigger responses (high/low confidence, no trigger) |
| `metrics.json`         | 4       | Pipeline metrics (full, partial, minimal, stale)           |
| `messages.json`        | 10      | Standard chat messages (user, agent, tool, system)         |
| `errors.json`          | 8       | Error responses (connection, auth, rate limit, timeout)    |

## Scenáre

### Canvas Triggers
- `diagram_high_confidence` - auto-switch, confidence 0.95
- `table_list_switch` - switch_view action
- `no_trigger` - fallback (action: none)
- `new_analysis_focus` - new_analysis action
- `low_confidence_no_switch` - confidence 0.45, no auto-switch
- `invalid_trigger_ignore` - malformed, ignored
- `low_confidence_manual` - confidence 0.55, user confirmation

### Metrics
- `full_metrics` - all fields populated
- `partial_metrics` - missing quality_score
- `minimal_metrics` - only total_tables, total_columns
- `stale_metrics` - as_of older than 5 minutes

### Errors
- `connection_error`, `connection_error_max_retries`
- `authentication_error`, `rate_limit_error`
- `backend_error`, `tool_error`
- `timeout_error`, `validation_error`
