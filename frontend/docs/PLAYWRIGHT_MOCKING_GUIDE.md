# Playwright API Mocking Guide

## Prečo mockať API?

### Výhody
✅ **Rýchlosť**: Testy bežia 10× rýchlejšie bez HTTP latency
✅ **Stabilita**: Nie sú závislé na backend dostupnosti
✅ **Deterministické**: Vždy rovnaký výstup → žiadne flaky tests
✅ **Edge cases**: Jednoduché testovanie error stavov
✅ **Offline**: Testy fungujú bez siete

### Kedy mockať vs reálne API
| Typ testu         | Mock                    | Reálne API  |
| ----------------- | ----------------------- | ----------- |
| Unit tests        | ✅ Vždy                  | ❌           |
| Smoke tests       | ✅ Rýchle základné testy | ❌           |
| Integration tests | ⚠️ Komplexné scenáre     | ✅           |
| E2E (nightly)     | ❌                       | ✅ Plná flow |

---

## 1. Basic API Mocking

### HTTP Endpoint mock
```typescript
import { test, expect } from '@playwright/test';

test('should display tables from mocked API', async ({ page }) => {
  // Mock /api/tables endpoint
  await page.route('**/api/tables', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        tables: [
          { id: 1, name: 'customers', columns: 5 },
          { id: 2, name: 'orders', columns: 8 }
        ]
      })
    });
  });

  await page.goto('/');

  // Verify UI shows mocked data
  await expect(page.getByText('customers')).toBeVisible();
  await expect(page.getByText('orders')).toBeVisible();
});
```

### Conditional mocking
```typescript
await page.route('**/api/**', async route => {
  const request = route.request();

  if (request.method() === 'POST' && request.postData()?.includes('error')) {
    // Mock error response
    await route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    });
  } else {
    // Let real API handle it
    await route.continue();
  }
});
```

---

## 2. WebSocket Mocking

### Problém: MCOP používa WebSocket pre chat
```typescript
// Aktuálne v testoch
await page.waitForTimeout(30000); // ❌ Čaká na LLM response
```

### Riešenie: Mock WebSocket messages
```typescript
// tests/helpers/websocket-mock.ts
export class WebSocketMock {
  constructor(private page: Page) {}

  async setupMock() {
    await this.page.addInitScript(() => {
      class MockWebSocket {
        url: string;
        onopen: ((event: Event) => void) | null = null;
        onmessage: ((event: MessageEvent) => void) | null = null;
        onerror: ((event: Event) => void) | null = null;
        onclose: ((event: CloseEvent) => void) | null = null;

        constructor(url: string) {
          this.url = url;
          // Simulate connection after 100ms
          setTimeout(() => {
            if (this.onopen) {
              this.onopen(new Event('open'));
            }
          }, 100);
        }

        send(data: string) {
          // Simulate server response after 500ms
          setTimeout(() => {
            if (this.onmessage) {
              const mockResponse = {
                type: 'assistant_message',
                content: 'Mocked response from LLM',
                done: true
              };
              this.onmessage(new MessageEvent('message', {
                data: JSON.stringify(mockResponse)
              }));
            }
          }, 500);
        }

        close() {
          if (this.onclose) {
            this.onclose(new CloseEvent('close'));
          }
        }
      }

      // Replace native WebSocket
      (window as any).WebSocket = MockWebSocket;
    });
  }

  async simulateMessage(message: any) {
    await this.page.evaluate((msg) => {
      const event = new MessageEvent('message', {
        data: JSON.stringify(msg)
      });
      // Trigger onmessage handlers
      window.dispatchEvent(event);
    }, message);
  }
}
```

**Použitie:**
```typescript
import { WebSocketMock } from '../helpers/websocket-mock';

test('should handle WebSocket message', async ({ page }) => {
  const wsMock = new WebSocketMock(page);
  await wsMock.setupMock();

  await page.goto('/');

  // Wait for connection (now instant)
  await expect(page.getByText('Connected')).toBeVisible({ timeout: 2000 });

  // Send message
  await page.getByRole('textbox').fill('List tables');
  await page.getByRole('button', { name: 'Send' }).click();

  // Wait for mocked response (500ms instead of 30s)
  await expect(page.getByText('Mocked response from LLM')).toBeVisible({ timeout: 2000 });
});
```

---

## 3. Mock pre MCOP scenáre

### 3.1 Mock pre table list response
```typescript
// tests/fixtures/backend-mock.ts
export async function mockTableListResponse(page: Page) {
  await page.addInitScript(() => {
    class MockWebSocket {
      onopen: any;
      onmessage: any;

      constructor(url: string) {
        setTimeout(() => this.onopen?.({}), 100);
      }

      send(data: string) {
        const request = JSON.parse(data);

        if (request.message?.toLowerCase().includes('list tables')) {
          setTimeout(() => {
            this.onmessage?.({
              data: JSON.stringify({
                type: 'assistant_message',
                content: 'Here are the available tables:\n\n1. customers\n2. orders\n3. products',
                canvas_trigger: { confidence: 0.8, view: 'table' },
                done: true
              })
            });
          }, 500);
        }
      }

      close() {}
    }

    (window as any).WebSocket = MockWebSocket;
  });
}
```

**Test:**
```typescript
test('should show table list', async ({ page }) => {
  await mockTableListResponse(page);

  await page.goto('/');
  await page.getByRole('textbox').fill('List tables');
  await page.getByRole('button', { name: 'Send' }).click();

  // Response in 500ms instead of 30s
  await expect(page.getByText('customers')).toBeVisible({ timeout: 2000 });
  await expect(page.getByText('orders')).toBeVisible();

  // Verify canvas auto-switched to table view
  await expect(page.getByTestId('canvas-view-table')).toBeVisible();
});
```

### 3.2 Mock pre ER diagram response
```typescript
export async function mockDiagramResponse(page: Page) {
  await page.addInitScript(() => {
    class MockWebSocket {
      onopen: any;
      onmessage: any;

      constructor(url: string) {
        setTimeout(() => this.onopen?.({}), 100);
      }

      send(data: string) {
        const request = JSON.parse(data);

        if (request.message?.toLowerCase().includes('diagram')) {
          setTimeout(() => {
            this.onmessage?.({
              data: JSON.stringify({
                type: 'assistant_message',
                content: 'Generating ER diagram...',
                diagram: {
                  mermaid: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }`
                },
                canvas_trigger: { confidence: 0.9, view: 'diagram' },
                done: true
              })
            });
          }, 500);
        }
      }

      close() {}
    }

    (window as any).WebSocket = MockWebSocket;
  });
}
```

**Test:**
```typescript
test('should render mermaid diagram', async ({ page }) => {
  await mockDiagramResponse(page);

  await page.goto('/');
  await page.getByRole('textbox').fill('Generate ER diagram');
  await page.getByRole('button', { name: 'Send' }).click();

  // Mermaid diagram appears in 500ms
  await expect(page.locator('.mermaid')).toBeVisible({ timeout: 2000 });
  await expect(page.getByText('CUSTOMER')).toBeVisible();
  await expect(page.getByText('ORDER')).toBeVisible();
});
```

### 3.3 Mock error states
```typescript
export async function mockErrorResponse(page: Page) {
  await page.addInitScript(() => {
    class MockWebSocket {
      onopen: any;
      onerror: any;

      constructor(url: string) {
        // Simulate connection error
        setTimeout(() => {
          this.onerror?.({ error: 'Connection failed' });
        }, 100);
      }

      send() {}
      close() {}
    }

    (window as any).WebSocket = MockWebSocket;
  });
}
```

**Test:**
```typescript
test('should show error when WebSocket fails', async ({ page }) => {
  await mockErrorResponse(page);

  await page.goto('/');

  // Should show connection error
  await expect(page.getByText('Connection error')).toBeVisible({ timeout: 2000 });
  await expect(page.getByRole('textbox')).toBeDisabled();
});
```

---

## 4. HAR File Mocking (Recording real responses)

### Nahrať real API responses
```bash
# Record HAR file z production
npx playwright test --headed --save-har=tests/fixtures/api-responses.har
```

### Použiť HAR v testoch
```typescript
test('should use recorded API responses', async ({ page }) => {
  // Replay recorded responses
  await page.routeFromHAR('tests/fixtures/api-responses.har', {
    url: '**/api/**',
    update: false // Use recorded data
  });

  await page.goto('/');
  // Uses recorded responses → fast and deterministic
});
```

### Update HAR file
```typescript
await page.routeFromHAR('tests/fixtures/api-responses.har', {
  url: '**/api/**',
  update: true // Re-record responses
});
```

---

## 5. Fixture pre mocking

```typescript
// tests/fixtures/backend-mock.fixture.ts
import { test as base } from '@playwright/test';
import { mockTableListResponse, mockDiagramResponse } from './backend-mock';

type MockFixtures = {
  mockBackend: {
    tableList: () => Promise<void>;
    diagram: () => Promise<void>;
    error: () => Promise<void>;
  };
};

export const test = base.extend<MockFixtures>({
  mockBackend: async ({ page }, use) => {
    const api = {
      tableList: () => mockTableListResponse(page),
      diagram: () => mockDiagramResponse(page),
      error: () => mockErrorResponse(page),
    };
    await use(api);
  },
});
```

**Použitie:**
```typescript
import { test, expect } from '../fixtures/backend-mock.fixture';

test('should work with mocked backend', async ({ page, mockBackend }) => {
  await mockBackend.tableList();

  await page.goto('/');
  await page.getByRole('textbox').fill('List tables');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByText('customers')).toBeVisible({ timeout: 2000 });
});
```

---

## 6. Migračný plán

### Fáza 1: Smoke tests s mockom (2 dni)
```typescript
// tests/e2e/smoke/chat.spec.ts
test.describe('Chat Smoke Tests (Mocked)', () => {
  test('should send and receive message', async ({ page, mockBackend }) => {
    await mockBackend.tableList();
    // Test completes in 2s instead of 30s
  });
});
```

### Fáza 2: Integration tests (tagged) (3 dni)
```typescript
// tests/e2e/integration/chat-backend.spec.ts
test.describe('Chat Integration @integration', () => {
  test('should connect to real Railway backend', async ({ page }) => {
    // Requires live backend
    // Only runs on: npx playwright test --grep @integration
  });
});
```

### Fáza 3: Nightly E2E (1 deň)
```yaml
# .github/workflows/playwright-nightly.yml
name: E2E Nightly
on:
  schedule:
    - cron: '0 2 * * *' # 2 AM daily
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test --grep @integration
```

---

## 7. Porovnanie: Pred vs Po

### Pred (aktuálny stav)
```typescript
test('chat integration', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000); // ❌ WebSocket connection
  await page.getByRole('textbox').fill('List tables');
  await page.getByRole('button').click();
  await page.waitForTimeout(30000); // ❌ LLM response
  // Test trvá 33 sekúnd ❌
});
```

### Po (s mockom)
```typescript
test('chat smoke', async ({ page, mockBackend }) => {
  await mockBackend.tableList();
  await page.goto('/');
  await page.getByRole('textbox').fill('List tables');
  await page.getByRole('button').click();
  await expect(page.getByText('customers')).toBeVisible({ timeout: 2000 });
  // Test trvá 2 sekundy ✅
});
```

**Výsledok:** 15× rýchlejšie testy + 0% flakiness

---

## 8. Best Practices

### ✅ Správne
```typescript
// Mock pre smoke tests
test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ mockBackend }) => {
    await mockBackend.tableList();
  });

  test('should work', async ({ page }) => {
    // Fast & stable
  });
});

// Real API pre integration tests
test.describe('Integration @integration', () => {
  test('should work with real backend', async ({ page }) => {
    // Slow but comprehensive
  });
});
```

### ❌ Nesprávne
```typescript
// Všetky testy s real API
test('smoke test', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(30000); // ❌ Slow
});

// Mock bez fixtures (duplikácia)
test('test 1', async ({ page }) => {
  await page.addInitScript(() => { /* mock */ }); // ❌ Copy-paste
});

test('test 2', async ({ page }) => {
  await page.addInitScript(() => { /* same mock */ }); // ❌ Duplicate
});
```

---

## 9. Metriky úspechu

| Metrika        | Pred     | Po (Mock) | Zlepšenie             |
| -------------- | -------- | --------- | --------------------- |
| Test execution | 33s/test | 2s/test   | **94% rýchlejšie**    |
| Flaky rate     | 20%      | 0%        | **100% stabilnejšie** |
| CI time        | 5 min    | 30s       | **90% úspora**        |
| Offline tests  | 0%       | 100%      | **Pracuje všade**     |

---

## 10. Implementačné kroky

### Týždeň 1
- [ ] Vytvoriť `tests/helpers/websocket-mock.ts`
- [ ] Implementovať `mockTableListResponse()`
- [ ] Refaktorovať 1 test na mock

### Týždeň 2
- [ ] Vytvoriť `backend-mock.fixture.ts`
- [ ] Mock pre všetky MCOP response types
- [ ] Migrovať smoke tests na mock

### Týždeň 3
- [ ] Tag integration tests `@integration`
- [ ] Setup nightly E2E workflow
- [ ] HAR recording pre complex scenarios

**Celkový čas:** 3 týždne
**ROI:** 90% redukcia CI času, 0% flaky tests
