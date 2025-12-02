# Playwright Testing Strategy - MCOP Frontend

## Súhrn aktuálneho stavu

### Pokrytie testov
- **9 spec súborov** v `tests/e2e/`
- **3 browsery**: Chromium, Firefox, WebKit
- **CI**: Retry 2×, 1 worker, HTML reporter

### Existujúce testy

| Test súbor                 | Účel                             | Počet testov | Stav                |
| -------------------------- | -------------------------------- | ------------ | ------------------- |
| `websocket.spec.ts`        | WebSocket pripojenie, session ID | 4            | ✅ Stabilné          |
| `chat.spec.ts`             | Chat UI, input, welcome message  | 7            | ⚠️ Závisí na backend |
| `canvas-trigger.spec.ts`   | Auto-switch Table/Diagram        | 3            | 🐛 Debug režim       |
| `layout.spec.ts`           | Layout, responsive design        | 10           | ✅ Stabilné          |
| `visual.spec.ts`           | Screenshot Škoda design          | 2            | ✅ Vizuálne testy    |
| `diagram.spec.ts`          | ER Diagram panel, empty state    | 3            | ✅ Stabilné          |
| `chat-integration.spec.ts` | Railway backend, LLM responses   | 3            | ⚠️ Pomalé (30-60s)   |
| `websocket-debug.spec.ts`  | Debug WebSocket logs             | ?            | 🔍 Debug             |
| `css-diagnostic.spec.ts`   | CSS diagnostika                  | ?            | 🔍 Debug             |

## 🚨 Identifikované problémy

### 1. **Backend závislosť**
- Testy `chat.spec.ts` a `chat-integration.spec.ts` vyžadujú bežiacu Railway API
- Hardcoded `http://localhost:8000` pre WebSocket
- Zlyhajú ak backend nie je dostupný
- **Riešenie:** Mock WebSocket pre unit testy, integration testy označiť tagom `@integration`

### 2. **Pomalé LLM testy**
- `chat-integration.spec.ts` čaká 30-60s na LLM odpoveď
- Použitie `waitForTimeout()` namiesto inteligentného čakania
- **Riešenie:**
  - Použiť `expect().toBeVisible({ timeout: 60000 })`
  - Mock LLM responses pre rýchle testy
  - Reálne LLM testy len v nightly runs

### 3. **Chýbajúce web-first assertions**
```typescript
// ❌ Zlé
const isDisabled = await input.isDisabled();
if (!isDisabled) { ... }

// ✅ Správne
await expect(input).toBeEnabled();
```

### 4. **Debug testy v produkcii**
- `websocket-debug.spec.ts` a `css-diagnostic.spec.ts` sú diagnostické
- Nepatria do main test suite
- **Riešenie:** Presunúť do `tests/debug/` alebo odstrániť

### 5. **Chybajúce Page Object Model**
- Všetky selektory priamo v testoch
- Duplikácia kódu (napr. `page.getByRole('textbox')`)
- **Riešenie:** Vytvoriť POM pre opakované patterns

### 6. **Žiadne fixtures**
- Každý test má vlastný `beforeEach` setup
- **Riešenie:** Centralizované fixtures pre WebSocket, auth, backend state

### 7. **Nekonzistentné čakanie**
```typescript
await page.waitForTimeout(2000);  // ❌ Arbitrary timeouts
await expect(element).toBeVisible({ timeout: 5000 }); // ✅ Better
```

### 8. **Chýbajúce API mocking**
- Žiadne použitie `page.route()` pre mock backend responses
- Všetky testy závisia na reálnej API

### 9. **Visual regression len screenshots**
- `visual.spec.ts` robí len screenshots bez `toHaveScreenshot()` assertions
- Nie sú reference images pre porovnanie

### 10. **Žiadne parallel/sharding**
- Config má `fullyParallel: true` ale CI používa `workers: 1`
- Pomalé testy (3-5 min) kvôli serial execution

## ✅ Odporúčané vylepšenia

### Priorita 1: Stabilita a rýchlosť

#### 1.1 Implementovať Page Object Model
```typescript
// tests/pages/ChatPage.ts
export class ChatPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.waitForConnection();
  }

  async waitForConnection() {
    await expect(this.page.locator('text=Connected'))
      .toBeVisible({ timeout: 10000 });
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  get messageInput() { return this.page.getByRole('textbox'); }
  get sendButton() { return this.page.getByRole('button', { name: 'Send' }); }
}
```

#### 1.2 Vytvoriť fixtures pre setup
```typescript
// tests/fixtures.ts
export const test = base.extend<{ chatPage: ChatPage }>({
  chatPage: async ({ page }, use) => {
    const chatPage = new ChatPage(page);
    await chatPage.goto();
    await use(chatPage);
  },
});
```

#### 1.3 Mock WebSocket pre unit testy
```typescript
test('should send message', async ({ page }) => {
  // Mock WebSocket responses
  await page.route('ws://localhost:8000/ws/**', route => {
    // Return mock message stream
  });

  await page.goto('/');
  // Test UI without backend
});
```

#### 1.4 Tagovať integration testy
```typescript
test.describe('Integration @integration', () => {
  test('should connect to Railway backend', async ({ page }) => {
    // Requires live backend
  });
});
```

Spustiť: `npx playwright test --grep-invert @integration`

### Priorita 2: Coverage gaps

#### 2.1 API client testy
- `src/api/client.ts` nemá testy
- Pridať testy pre error handling, retry logic

#### 2.2 Store (Zustand) testy
- `src/store/useStore.ts` nemá unit testy
- Testovať actions, state mutations

#### 2.3 WebSocket reconnection
- Test pre disconnect/reconnect scenáre
- Simulate network failures

#### 2.4 Canvas view toggle
- Test pre klávesové skratky (T/D)
- Test pre pin/unpin functionality

### Priorita 3: Visual regression

#### 3.1 Použiť toHaveScreenshot()
```typescript
test('should match Škoda design', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
    animations: 'disabled'
  });
});
```

#### 3.2 Maskovať dynamické elementy
```typescript
await expect(page).toHaveScreenshot({
  mask: [
    page.locator('.timestamp'),
    page.locator('.session-id')
  ]
});
```

### Priorita 4: CI optimizácia

#### 4.1 Sharding pre paralelizáciu
```yaml
# .github/workflows/playwright.yml
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4]
    shardTotal: [4]
steps:
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

#### 4.2 Rozdeliť testy na kategórie
- **Smoke tests** (2 min): Critical path, každý commit
- **Integration tests** (10 min): Backend dependent, pre PR
- **Visual tests** (5 min): Screenshot comparisons
- **E2E full** (30 min): Kompletné scenáre, nightly

## 📊 Odporúčaná štruktúra

```
tests/
├── e2e/
│   ├── smoke/              # Rýchle, kritické testy
│   │   ├── homepage.spec.ts
│   │   └── layout.spec.ts
│   ├── integration/        # Backend-dependent
│   │   ├── chat-backend.spec.ts
│   │   └── websocket-live.spec.ts
│   └── visual/             # Visual regression
│       └── design.spec.ts
├── unit/                   # Komponenty bez DOM
│   ├── store.spec.ts
│   └── utils.spec.ts
├── fixtures/               # Reusable fixtures
│   ├── chat.fixture.ts
│   └── backend-mock.fixture.ts
├── pages/                  # Page Object Models
│   ├── ChatPage.ts
│   ├── CanvasPage.ts
│   └── DiagramPage.ts
└── helpers/                # Test utilities
    ├── websocket-mock.ts
    └── assertions.ts
```

## 🎯 Metriky úspechu

| Metrika             | Aktuálne           | Cieľ                             |
| ------------------- | ------------------ | -------------------------------- |
| Test execution time | 3-5 min            | < 2 min (smoke), < 10 min (full) |
| Flaky tests         | 20% (backend deps) | < 5%                             |
| Coverage            | ~40% UI            | > 80% UI + 60% logic             |
| Visual regression   | 0 assertions       | 10+ key screens                  |
| Parallel workers    | 1 (CI)             | 4 shards                         |

## 🔧 Konkrétne akcie

1. **Tento týždeň:**
   - [ ] Vytvoriť `ChatPage` POM
   - [ ] Implementovať `test.extend()` fixtures
   - [ ] Mock WebSocket pre unit testy
   - [ ] Tagovať `@integration` testy

2. **Budúci týždeň:**
   - [ ] Pridať `toHaveScreenshot()` assertions
   - [ ] Nastaviť sharding v CI
   - [ ] Rozdeliť smoke/integration/visual tests
   - [ ] Unit testy pre store a client

3. **Sprint 3.2:**
   - [ ] Kompletný POM pre všetky stránky
   - [ ] 80% test coverage
   - [ ] Visual regression baseline
   - [ ] Nightly E2E runs

## 📚 Referencie

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [API Mocking](https://playwright.dev/docs/mock)
- [Parallelization](https://playwright.dev/docs/test-parallel)
