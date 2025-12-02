# Playwright Test Improvement Plan

**Status:** Implementačný plán (BEZ mockovania)
**Cieľ:** Zlepšiť maintainability a stabilitu testov
**Doba:** 4-6 hodín práce

---

## ✅ Čo sme implementovali

### 1. Page Object Model
- ✅ `tests/pages/ChatPage.ts` - Centralizácia chat selektorov
- ✅ `tests/pages/CanvasPage.ts` - Centralizácia canvas selektorov
- ✅ `tests/fixtures/pages.fixture.ts` - Automatický setup
- ✅ `tests/e2e/example-refactored.spec.ts` - Príklad použitia

### Výhody:
```typescript
// PRED (každý test):
await page.goto('/');
await expect(page.locator('text=Connected')).toBeVisible({ timeout: 10000 });
await page.getByRole('textbox').fill('message');
await page.getByRole('button', { name: 'Send' }).click();

// PO (s fixtures):
await chatPage.sendMessage('message'); // 1 riadok!
```

---

## 🎯 FÁZA 2: Test Tagging (1-2 hodiny)

### Cieľ: Oddeliť rýchle smoke testy od pomalých LLM testov

### 2.1 Pridať tagy do testov
```typescript
// tests/e2e/smoke/layout.spec.ts
test.describe('Layout @smoke', () => {
  test('should render header', async ({ page }) => {
    // Rýchly test bez backend calls
  });
});

// tests/e2e/integration/chat-llm.spec.ts
test.describe('Chat with LLM @integration', () => {
  test('should get diagram from backend', async ({ chatPage }) => {
    // Pomalý test s LLM (30-60s)
  });
});
```

### 2.2 Aktualizovať playwright.config.ts
```typescript
export default defineConfig({
  // ... existing config

  // Filter tests based on tags
  grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : undefined,
});
```

### 2.3 Aktualizovať package.json scripts
```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "TEST_TAGS=@smoke playwright test",
    "test:integration": "TEST_TAGS=@integration playwright test",
    "test:all": "playwright test"
  }
}
```

### Použitie:
```bash
# PR checks - len rýchle testy (2-3 min)
npm run test:smoke

# Nightly - všetky testy vrátane LLM (30-60 min)
npm run test:all

# Lokálne - všetko
npm test
```

---

## 🚀 FÁZA 3: CI Optimalizácia (1 hodina)

### 3.1 Presunúť debug testy
```bash
# Vytvoriť debug adresár
mkdir -p tests/debug

# Presunúť debug testy
mv tests/e2e/css-diagnostic.spec.ts tests/debug/
mv tests/e2e/websocket-debug.spec.ts tests/debug/
```

### 3.2 Aktualizovať playwright.config.ts pre sharding
```typescript
export default defineConfig({
  // ... existing config

  // CI optimizations
  workers: process.env.CI ? 4 : undefined, // 4 parallel workers in CI

  // Exclude debug tests from main suite
  testIgnore: '**/debug/**',
});
```

### 3.3 Setup GitHub Actions sharding
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Install Playwright
        run: cd frontend && npx playwright install --with-deps
      - name: Run Playwright tests
        run: cd frontend && npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shardIndex }}
          path: frontend/playwright-report/
```

---

## 📋 Refactoring Checklist

### Migrovať existujúce testy na POM:

- [ ] `chat.spec.ts` → použiť ChatPage
- [ ] `canvas-trigger.spec.ts` → použiť CanvasPage
- [ ] `diagram.spec.ts` → použiť CanvasPage
- [ ] `chat-integration.spec.ts` → použiť ChatPage + @integration tag
- [ ] `websocket.spec.ts` → použiť ChatPage
- [ ] `layout.spec.ts` → použiť @smoke tag
- [ ] `visual.spec.ts` → použiť @smoke tag

### Vyčistiť deprecated patterns:

- [ ] Nahradiť všetky `waitForTimeout()` → web-first assertions
- [ ] Presunúť debug testy do `tests/debug/`
- [ ] Pridať @smoke alebo @integration tag ku každému testu

---

## 📊 Očakávané výsledky

| Metrika                 | Pred      | Po        | Zlepšenie |
| ----------------------- | --------- | --------- | --------- |
| Test maintenance        | 5 miest   | 1 miesto  | **80%**   |
| Test readability        | Low       | High      | **+100%** |
| PR check time (smoke)   | 5-10 min  | 2-3 min   | **60%**   |
| CI time (w/ sharding)   | 30-60 min | 10-15 min | **70%**   |
| Flaky rate              | 20%       | 10%       | **50%**   |
| Test coverage (quality) | Medium    | High      | **+50%**  |

---

## 🛠️ Implementačné kroky (next steps)

### Tento týždeň (Priorita 1):
1. ✅ Vytvoriť Page Object Models (HOTOVO)
2. ✅ Vytvoriť fixtures (HOTOVO)
3. ✅ Príklad refactorovaného testu (HOTOVO)
4. [ ] Refaktorovať `chat.spec.ts` na POM
5. [ ] Refaktorovať `canvas-trigger.spec.ts` na POM

### Budúci týždeň (Priorita 2):
6. [ ] Pridať @smoke a @integration tagy
7. [ ] Aktualizovať playwright.config.ts
8. [ ] Presunúť debug testy
9. [ ] Setup CI sharding

### Sprint 3.2 (Priorita 3):
10. [ ] Migrovať všetky testy na POM
11. [ ] Dokumentovať test stratégiu
12. [ ] Review a optimalizácia

---

## 📚 Príklady použitia

### Starý štýl (pred POM):
```typescript
test('old style', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  await page.getByRole('textbox').fill('message');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.waitForTimeout(30000);
  const messages = page.locator('[data-testid^="message-"]');
  expect(await messages.count()).toBeGreaterThan(0);
});
```

### Nový štýl (s POM + fixtures):
```typescript
test('new style', async ({ chatPage }) => {
  await chatPage.sendMessage('message');
  await chatPage.waitForResponse();
  expect(await chatPage.getMessageCount()).toBeGreaterThan(0);
});
```

**Výsledok:** 8 riadkov → 3 riadky, žiadne timeouty, čitateľnejšie!

---

## ⚠️ Čo NEROBÍME

❌ WebSocket mocking (user nechce)
❌ API route mocking (user nechce)
❌ HAR file recording (user nechce)

✅ Všetky testy voči reálnemu Railway backendu
✅ Plná E2E integrita zachovaná
✅ Len zlepšenie štruktúry a optimalizácia

---

## 🎓 Dokumentácia

- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Test Retry & Timeouts](https://playwright.dev/docs/test-timeouts)
- [Sharding](https://playwright.dev/docs/test-parallel)

---

**Začni s:** `tests/e2e/example-refactored.spec.ts` - príklad ako to funguje!
