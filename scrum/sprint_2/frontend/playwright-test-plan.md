# Sprint 2: Playwright Test Plan

**Dokument pre:** Frontend tím
**Sprint:** Sprint 2
**Coverage:** MCOP-FE-001 až MCOP-FE-006

---

## 📋 Prehľad Test Suites

| Suite          | Tests | Story       | Súbor                    |
| -------------- | ----- | ----------- | ------------------------ |
| Initial View   | 6     | MCOP-FE-001 | `initial-view.spec.ts`   |
| Canvas Trigger | 4     | MCOP-FE-002 | `canvas-trigger.spec.ts` |
| View Toggle    | 3     | MCOP-FE-003 | `view-toggle.spec.ts`    |
| Loading States | 4     | MCOP-FE-004 | `loading-states.spec.ts` |
| Metrics Header | 3     | MCOP-FE-005 | `metrics-header.spec.ts` |
| Message Badges | 2     | MCOP-FE-006 | `message-badges.spec.ts` |

**Celkovo: 22 testov**

---

## 🧪 Test Files

### 1. `tests/e2e/initial-view.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('MCOP-FE-001: InitialView', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays hero section with title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Metadata Copilot/i })).toBeVisible();
    await expect(page.getByText(/Explore your data catalog/i)).toBeVisible();
  });

  test('shows 4 example prompt buttons', async ({ page }) => {
    await expect(page.getByText(/Show me all FACT tables/i)).toBeVisible();
    await expect(page.getByText(/relationships for factv_purchase_order/i)).toBeVisible();
    await expect(page.getByText(/Generate an ER diagram/i)).toBeVisible();
    await expect(page.getByText(/Analyze data quality/i)).toBeVisible();
  });

  test('clicking example prompt sends message and navigates', async ({ page }) => {
    await page.click('button:has-text("Show me all FACT tables")');

    // Should navigate away from InitialView
    await expect(page.getByRole('heading', { name: /Metadata Copilot/i })).not.toBeVisible();

    // Message should appear in chat
    await expect(page.getByText(/Show me all FACT tables/i)).toBeVisible();
  });

  test('submitting custom query works', async ({ page }) => {
    await page.fill('input[placeholder*="Ask anything"]', 'List all schemas');
    await page.click('button:has-text("Analyze")');

    await expect(page.getByRole('heading', { name: /Metadata Copilot/i })).not.toBeVisible();
  });

  test('Load Sample Document button works', async ({ page }) => {
    await page.click('button:has-text("Load Sample Document")');

    // Should start analysis
    await expect(page.getByText(/Document loaded/i)).toBeVisible({ timeout: 10000 });
  });

  test('analyze button is disabled when input is empty', async ({ page }) => {
    const analyzeButton = page.getByRole('button', { name: /Analyze/i });
    await expect(analyzeButton).toBeDisabled();

    // Type something
    await page.fill('input[placeholder*="Ask anything"]', 'test');
    await expect(analyzeButton).not.toBeDisabled();
  });

});
```

### 2. `tests/e2e/canvas-trigger.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('MCOP-FE-002: Canvas Trigger', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to chat view
    await page.fill('input[placeholder*="Ask anything"]', 'Hello');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="chat-panel"]', { timeout: 10000 });
  });

  test('switches to ER diagram when backend triggers', async ({ page }) => {
    await page.fill('input[data-testid="chat-input"]', 'Show ER diagram for factv_purchase_order');
    await page.click('button[data-testid="send-button"]');

    // Canvas should switch to diagram view
    await expect(page.locator('[data-testid="canvas-view-er_diagram"]')).toBeVisible({
      timeout: 30000
    });
  });

  test('displays trigger reason in chat', async ({ page }) => {
    await page.fill('input[data-testid="chat-input"]', 'Generate diagram');
    await page.click('button[data-testid="send-button"]');

    // Reason message should appear
    await expect(page.getByText(/Prepínam|Switching/i)).toBeVisible({ timeout: 15000 });
  });

  test('handles missing canvas_trigger gracefully', async ({ page }) => {
    await page.fill('input[data-testid="chat-input"]', 'What is 2+2?');
    await page.click('button[data-testid="send-button"]');

    // Should not crash, canvas remains unchanged
    await expect(page.locator('[data-testid="canvas"]')).toBeVisible();
  });

  test('view persists after trigger', async ({ page }) => {
    // Trigger table list view
    await page.fill('input[data-testid="chat-input"]', 'List all tables');
    await page.click('button[data-testid="send-button"]');

    await expect(page.locator('[data-testid="canvas-view-table_list"]')).toBeVisible({
      timeout: 30000
    });

    // Send non-trigger message
    await page.fill('input[data-testid="chat-input"]', 'How many?');
    await page.click('button[data-testid="send-button"]');

    // View should remain table_list
    await expect(page.locator('[data-testid="canvas-view-table_list"]')).toBeVisible();
  });

});
```

### 3. `tests/e2e/view-toggle.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('MCOP-FE-003: View Mode Toggle', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[placeholder*="Ask anything"]', 'Show data');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="canvas"]');
  });

  test('toggles between Table and Diagram views', async ({ page }) => {
    // Default should be Diagram (active)
    const diagramBtn = page.getByRole('button', { name: /Diagram/i });
    const tableBtn = page.getByRole('button', { name: /Table/i });

    // Click Table
    await tableBtn.click();
    await expect(tableBtn).toHaveClass(/bg-\[#4BA82E\]/);
    await expect(diagramBtn).not.toHaveClass(/bg-\[#4BA82E\]/);

    // Click Diagram
    await diagramBtn.click();
    await expect(diagramBtn).toHaveClass(/bg-\[#4BA82E\]/);
    await expect(tableBtn).not.toHaveClass(/bg-\[#4BA82E\]/);
  });

  test('keyboard shortcut T switches to Table view', async ({ page }) => {
    await page.keyboard.press('t');

    const tableBtn = page.getByRole('button', { name: /Table/i });
    await expect(tableBtn).toHaveClass(/bg-\[#4BA82E\]/);
  });

  test('keyboard shortcut D switches to Diagram view', async ({ page }) => {
    // First switch to Table
    await page.keyboard.press('t');

    // Then switch back to Diagram
    await page.keyboard.press('d');

    const diagramBtn = page.getByRole('button', { name: /Diagram/i });
    await expect(diagramBtn).toHaveClass(/bg-\[#4BA82E\]/);
  });

});
```

### 4. `tests/e2e/loading-states.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('MCOP-FE-004: Loading Dots', () => {

  test('shows loading dots while waiting for response', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'List all tables');
    await page.click('button:has-text("Analyze")');

    // Loading dots should appear
    await expect(page.getByText('Thinking...')).toBeVisible();
  });

  test('loading dots have 3 animated elements', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'Test');
    await page.click('button:has-text("Analyze")');

    // Wait for loading state
    await page.waitForSelector('.animate-bounce');

    const dots = page.locator('.animate-bounce');
    await expect(dots).toHaveCount(3);
  });

  test('loading disappears after response', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'Hello');
    await page.click('button:has-text("Analyze")');

    // Wait for response
    await page.waitForSelector('[data-testid="agent-message"]', { timeout: 30000 });

    // Loading should be gone
    await expect(page.getByText('Thinking...')).not.toBeVisible();
  });

  test('canvas shows loading state during generation', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'Generate ER diagram');
    await page.click('button:has-text("Analyze")');

    // Canvas loading message
    await expect(page.getByText(/Generating|Loading/i)).toBeVisible();
  });

});
```

### 5. `tests/e2e/metrics-header.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('MCOP-FE-005: Metrics Header', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Run analysis to get metrics
    await page.fill('input[placeholder*="Ask anything"]', 'Analyze dm_bs_purchase');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="metrics-header"]', { timeout: 30000 });
  });

  test('displays 4 metric cards', async ({ page }) => {
    await expect(page.getByText('Tables')).toBeVisible();
    await expect(page.getByText('Columns')).toBeVisible();
    await expect(page.getByText('Quality')).toBeVisible();
    await expect(page.getByText('Relationships')).toBeVisible();
  });

  test('shows entity/schema name in header', async ({ page }) => {
    await expect(page.getByText(/dm_bs_purchase|Data Analysis/i)).toBeVisible();
  });

  test('metric values are displayed', async ({ page }) => {
    // Should have numeric values
    const metricsHeader = page.locator('[data-testid="metrics-header"]');

    // At least one number should be visible
    await expect(metricsHeader.getByText(/\d+/)).toBeVisible();
  });

});
```

### 6. `tests/e2e/message-badges.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('MCOP-FE-006: Follow-up Badge', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Send first message
    await page.fill('input[placeholder*="Ask anything"]', 'Show tables in dm_bs_purchase');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="agent-message"]', { timeout: 30000 });
  });

  test('shows follow-up badge on context-aware questions', async ({ page }) => {
    // Send follow-up
    await page.fill('input[data-testid="chat-input"]', 'Show relationships for that table');
    await page.click('button[data-testid="send-button"]');

    // Badge should appear
    await expect(page.getByText('Follow-up')).toBeVisible();
  });

  test('first message does not have follow-up badge', async ({ page }) => {
    // First user message should not have badge
    const firstUserMessage = page.locator('[data-testid="user-message"]').first();
    await expect(firstUserMessage.getByText('Follow-up')).not.toBeVisible();
  });

});
```

---

## ⚙️ Playwright Config

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📋 Test Data Requirements

### WebSocket Fixtures (JSON)

Používaj JSON fixtures z `tests/fixtures/ws/`:

| Súbor                  | Popis                    | Scenáre                                                         |
| ---------------------- | ------------------------ | --------------------------------------------------------------- |
| `canvas-triggers.json` | Canvas trigger responses | 7 scenárov (high/low confidence, no trigger, switch_view, etc.) |
| `metrics.json`         | Pipeline metrics         | 4 scenáre (full, partial, minimal, stale)                       |
| `messages.json`        | Chat messages            | user, agent, tool, system správy                                |
| `errors.json`          | Error responses          | 8 error typov (connection, auth, rate limit, etc.)              |

**Import v TypeScript:**

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

**Použitie v testoch:**

```typescript
import { WS_FIXTURES } from '../fixtures/ws';

test('handles high confidence diagram trigger', async ({ page }) => {
  const fixture = WS_FIXTURES.triggers.diagram_high_confidence;

  // Mock WebSocket response
  await page.evaluate((data) => {
    window.__mockWsResponse = data;
  }, fixture);

  // ...test logic
  expect(fixture.canvas_trigger.confidence).toBeGreaterThan(0.6);
});
```

### Mock WebSocket Server

Pre E2E testy s real-time WebSocket:

```typescript
// tests/mocks/websocket-mock.ts
import { WS_FIXTURES } from '../fixtures/ws';

export class MockWebSocket {
  private responses: Map<string, object> = new Map();

  constructor() {
    // Pre-populate with fixtures
    this.addResponse('ER diagram', WS_FIXTURES.triggers.diagram_high_confidence);
    this.addResponse('list tables', WS_FIXTURES.triggers.table_list_switch);
    this.addResponse('2+2', WS_FIXTURES.triggers.no_trigger);
  }

  addResponse(pattern: string, response: object) {
    this.responses.set(pattern, response);
  }

  getResponse(message: string): object {
    for (const [pattern, response] of this.responses) {
      if (message.toLowerCase().includes(pattern.toLowerCase())) {
        return response;
      }
    }
    return WS_FIXTURES.messages.agent_response;
  }
}
```

### Fixture Scenáre

**Canvas Triggers (`canvas-triggers.json`):**
- `diagram_high_confidence` - confidence 0.95, auto-switch
- `table_list_switch` - action: switch_view
- `no_trigger` - action: none (fallback)
- `new_analysis_focus` - action: new_analysis
- `low_confidence_no_switch` - confidence 0.45, no auto-switch
- `invalid_trigger_ignore` - malformed, should be ignored
- `low_confidence_manual` - confidence 0.55, user confirmation needed

**Metrics (`metrics.json`):**
- `full_metrics` - všetky fieldy vyplnené
- `partial_metrics` - chýba quality_score
- `minimal_metrics` - len total_tables a total_columns
- `stale_metrics` - as_of staršie ako 5 minút

**Errors (`errors.json`):**
- `connection_error`, `authentication_error`, `rate_limit_error`
- `backend_error`, `tool_error`, `timeout_error`, `validation_error`

---

## 🚀 Running Tests

```bash
# All tests
npx playwright test

# Specific suite
npx playwright test initial-view.spec.ts

# With UI
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

---

## ✅ Definition of Done

Pre každý test suite:
- [ ] Všetky testy prechádzajú na Chromium
- [ ] Testy sú stabilné (žiadne flaky testy)
- [ ] Screenshot on failure nastavený
- [ ] Trace collection pri retry
- [ ] Mobile viewport testovaný (aspoň 1 test)
