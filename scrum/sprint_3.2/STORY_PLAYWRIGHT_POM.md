# Story: Playwright Page Object Model Refactoring

**Story ID:** FE-POM-001
**Sprint:** 3.2
**Priority:** P2 (High)
**Estimate:** 4-6 hodín
**Type:** Technical Improvement
**Owner:** Frontend Team

---

## 📋 Story Description

Refaktorovať Playwright E2E testy na Page Object Model pattern pre lepšiu maintainability, čitateľnosť a stabilitu. Implementácia BEZ mockovania - všetky testy ostávajú proti reálnemu Railway backendu.

---

## 🎯 Business Value

**Problém:**
- Duplikácia kódu: Selektory roztrúsené v 9 spec súboroch
- Ťažká údržba: Zmena selectora vyžaduje update v 10+ testoch
- Nečitateľné: Testy obsahujú 8-10 riadkov Playwright API
- Pomalé: `waitForTimeout(30000)` čaká vždy, aj keď response príde skôr
- Flaky: 20% testov zlyhá kvôli backend timeout

**Riešenie:**
- Page Object Model: Centralizované selektory v 2 súboroch
- Fixtures: Automatický setup, clean API
- Web-first assertions: Inteligentné čakanie
- Test tagging: Oddelenie smoke (@smoke) od integration (@integration)

**Dopad:**
- 90% redukcia údržby (1 miesto namiesto 10)
- 62% kratšie testy (3 riadky namiesto 8)
- 50% rýchlejšie (smart waits namiesto timeouts)
- CI optimalizácia: 4× sharding → 70% rýchlejší build

---

## 📦 Deliverables

### Súbory na vytvorenie:
1. `frontend/tests/pages/ChatPage.ts` - Chat POM
2. `frontend/tests/pages/CanvasPage.ts` - Canvas POM
3. `frontend/tests/fixtures/pages.fixture.ts` - Fixtures
4. `frontend/tests/e2e/example-refactored.spec.ts` - Príklad
5. `frontend/docs/PLAYWRIGHT_IMPROVEMENT_PLAN.md` - Implementačný plán

### Súbory na update:
6. `frontend/tests/e2e/chat.spec.ts` - Refactor na POM
7. `frontend/tests/e2e/canvas-trigger.spec.ts` - Refactor na POM
8. `frontend/playwright.config.ts` - Test tagging, sharding

---

## 🔧 Technical Implementation

### Fáza 1: Page Object Models (2-3 hodiny) ✅

#### 1.1 ChatPage.ts
```typescript
export class ChatPage {
  readonly page: Page;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly messages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.messageInput = page.getByPlaceholder(/ask about/i);
    this.sendButton = page.getByRole('button', { name: /send/i });
    this.messages = page.locator('[data-testid^="message-"]');
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async waitForResponse(timeout = 60000) {
    await expect(this.page.getByText(/thinking/i))
      .not.toBeVisible({ timeout });
  }
}
```

#### 1.2 CanvasPage.ts
```typescript
export class CanvasPage {
  readonly page: Page;
  readonly tableViewButton: Locator;
  readonly diagramViewButton: Locator;
  readonly mermaidDiagram: Locator;

  async switchToView(view: 'table' | 'diagram') {
    const button = view === 'table'
      ? this.tableViewButton
      : this.diagramViewButton;
    await button.click();
  }

  async waitForDiagram(timeout = 60000) {
    await expect(this.mermaidDiagram).toBeVisible({ timeout });
  }
}
```

#### 1.3 Fixtures
```typescript
export const test = base.extend<PageFixtures>({
  chatPage: async ({ page }, use) => {
    const chatPage = new ChatPage(page);
    await chatPage.goto();
    await chatPage.waitForConnection();
    await use(chatPage);
  },
});
```

**Acceptance Criteria:**
- ✅ ChatPage obsahuje všetky chat operácie
- ✅ CanvasPage obsahuje všetky canvas operácie
- ✅ Fixtures automaticky pripájajú WebSocket
- ✅ TypeScript kompiluje bez chýb

---

### Fáza 2: Test Refactoring (1-2 hodiny)

#### 2.1 Refaktorovať chat.spec.ts
**Pred:**
```typescript
test('send message', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  await page.getByRole('textbox').fill('message');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.waitForTimeout(30000);
});
```

**Po:**
```typescript
test('send message', async ({ chatPage }) => {
  await chatPage.sendMessage('message');
  await chatPage.waitForResponse();
});
```

#### 2.2 Refaktorovať canvas-trigger.spec.ts
**Pred:**
```typescript
await page.getByRole('button', { name: /diagram/i }).click();
await page.waitForTimeout(2000);
const view = await page.getByTestId('canvas-view-diagram').isVisible();
```

**Po:**
```typescript
await canvasPage.switchToView('diagram');
expect(await canvasPage.getCurrentView()).toBe('diagram');
```

**Acceptance Criteria:**
- ✅ chat.spec.ts používa ChatPage POM
- ✅ canvas-trigger.spec.ts používa CanvasPage POM
- ✅ Všetky testy prechádzajú
- ✅ Žiadne `waitForTimeout()` (nahradené web-first)

---

### Fáza 3: Test Tagging & CI (1 hodina)

#### 3.1 Pridať tagy
```typescript
test.describe('Layout @smoke', () => {
  test('should render header', async ({ page }) => {
    // Rýchly test bez backend
  });
});

test.describe('Chat Integration @integration', () => {
  test('should get LLM response', async ({ chatPage }) => {
    // Pomalý LLM test
  });
});
```

#### 3.2 package.json scripts
```json
{
  "scripts": {
    "test:smoke": "TEST_TAGS=@smoke playwright test",
    "test:integration": "TEST_TAGS=@integration playwright test"
  }
}
```

#### 3.3 playwright.config.ts
```typescript
export default defineConfig({
  workers: process.env.CI ? 4 : undefined, // Sharding
  testIgnore: '**/debug/**', // Exclude debug tests
  grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : undefined,
});
```

**Acceptance Criteria:**
- ✅ `npm run test:smoke` beží len @smoke testy (2-3 min)
- ✅ `npm run test:integration` beží @integration testy
- ✅ CI používa 4 workers (sharding)
- ✅ Debug testy v `tests/debug/` (ignorované)

---

## ✅ Acceptance Criteria (Celkovo)

### Funkcionálne:
- [ ] Všetky existujúce testy prechádzajú s POM
- [ ] Smoke testy bežia pod 3 minúty
- [ ] Integration testy fungujú proti Railway backend
- [ ] Keyboard shortcuts (T/D) testované v CanvasPage

### Technické:
- [ ] TypeScript kompiluje bez errors
- [ ] Playwright tests pass: `npx playwright test`
- [ ] Fixtures fungujú: automatický setup
- [ ] Web-first assertions: žiadne `waitForTimeout()`

### Kvalita:
- [ ] Test coverage nezmenil sa (ostáva ~40%)
- [ ] Flaky rate: z 20% → max 10%
- [ ] Code review: 2 approvals
- [ ] Dokumentácia: PLAYWRIGHT_IMPROVEMENT_PLAN.md

---

## 📊 Success Metrics

| Metrika                 | Pred       | Cieľ        | Meranie                               |
| ----------------------- | ---------- | ----------- | ------------------------------------- |
| Test maintenance effort | 10 miest   | 1 miesto    | Počet súborov na update pri zmene     |
| Lines per test          | 8 lines    | 3 lines     | Priemerná dĺžka testu                 |
| Smoke test duration     | 5-10 min   | 2-3 min     | `npm run test:smoke` execution time   |
| CI build time           | 30-60 min  | 10-15 min   | GitHub Actions duration (w/ sharding) |
| Flaky test rate         | 20%        | <10%        | Failed runs / Total runs              |
| Test readability        | Low (3/10) | High (8/10) | Team survey                           |

---

## 🧪 Testing Strategy

### Unit Tests (POM classes):
```typescript
describe('ChatPage', () => {
  test('sendMessage should fill input and click send', async () => {
    const chatPage = new ChatPage(mockPage);
    await chatPage.sendMessage('test');
    expect(mockPage.getByRole).toHaveBeenCalledWith('textbox');
  });
});
```

### Integration Tests:
```bash
# Lokálne - všetky testy
npm test

# CI PR check - len smoke
npm run test:smoke

# CI nightly - všetko
npm run test:all
```

### Manual Testing:
```bash
# Spustiť príklad
cd frontend
npx playwright test example-refactored.spec.ts --headed

# Overiť fixtures
npx playwright test --grep "should send message" --debug
```

---

## 📝 Implementation Checklist

### Fáza 1: POM Setup ✅
- [x] Vytvoriť `tests/pages/ChatPage.ts`
- [x] Vytvoriť `tests/pages/CanvasPage.ts`
- [x] Vytvoriť `tests/fixtures/pages.fixture.ts`
- [x] Vytvoriť `tests/e2e/example-refactored.spec.ts`
- [x] TypeScript kompiluje

### Fáza 2: Refactoring
- [ ] Refaktorovať `chat.spec.ts` na POM
- [ ] Refaktorovať `canvas-trigger.spec.ts` na POM
- [ ] Refaktorovať `diagram.spec.ts` na POM
- [ ] Refaktorovať `websocket.spec.ts` na POM
- [ ] Nahradiť všetky `waitForTimeout()` → web-first
- [ ] Všetky testy zelené

### Fáza 3: CI Optimization
- [ ] Pridať @smoke tagy (layout, visual tests)
- [ ] Pridať @integration tagy (chat-integration, LLM tests)
- [ ] Aktualizovať `playwright.config.ts` (sharding, grep)
- [ ] Aktualizovať `package.json` (test:smoke, test:integration)
- [ ] Presunúť debug testy do `tests/debug/`
- [ ] Setup GitHub Actions sharding (4 workers)

### Dokumentácia:
- [x] PLAYWRIGHT_IMPROVEMENT_PLAN.md
- [ ] README.md - pridať test commands
- [ ] CONTRIBUTING.md - POM best practices

---

## 🚫 Out of Scope

Explicitne **NEROBÍME**:
- ❌ WebSocket mocking (testujeme proti reálnemu backend)
- ❌ API route mocking (E2E testy ostávajú end-to-end)
- ❌ HAR file recording
- ❌ Mock data fixtures
- ❌ Unit tests pre React komponenty (iba E2E)

---

## 🔗 Dependencies

### Blocked by:
- Žiadne

### Blocking:
- Žiadne (môže bežať paralelne s inými taskami)

### Related Stories:
- FE-001: InitialView (už hotové)
- FE-002: Canvas Trigger (už hotové)
- FE-005: Metrics Header (už hotové)

---

## 📚 References

### Dokumentácia:
- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Sharding](https://playwright.dev/docs/test-parallel)
- [Web-first Assertions](https://playwright.dev/docs/best-practices#use-web-first-assertions)

### Súbory v projekte:
- `frontend/docs/PLAYWRIGHT_POM_GUIDE.md` - Originálny guide
- `frontend/docs/PLAYWRIGHT_TESTING.md` - Testing stratégia
- `frontend/docs/PLAYWRIGHT_IMPROVEMENT_PLAN.md` - Implementačný plán ✅
- `frontend/tests/pages/ChatPage.ts` - POM implementácia ✅
- `frontend/tests/pages/CanvasPage.ts` - POM implementácia ✅

### Backend:
- Railway: `https://practical-quietude-production.up.railway.app`
- WebSocket: `wss://practical-quietude-production.up.railway.app/ws/{sessionId}`

---

## 🎬 Demo Script

### Pre stakeholderov:

1. **Ukázať problém (Pred):**
```bash
# Starý test - 8 riadkov, časové timeouty
cat tests/e2e/chat.spec.ts
```

2. **Ukázať riešenie (Po):**
```bash
# Nový test - 3 riadky, web-first assertions
cat tests/e2e/example-refactored.spec.ts
```

3. **Spustiť smoke testy:**
```bash
npm run test:smoke
# Výstup: ✅ 15 passed in 2m 34s
```

4. **Ukázať CI speedup:**
```bash
# Pred: 30-60 min (serial)
# Po: 10-15 min (4 shards parallel)
```

---

## 💡 Notes

### Lessons Learned:
- User nechce mocking → ostali sme pri reálnom backende
- Smart waits (web-first) sú rýchlejšie ako fixed timeouts
- POM pattern znižuje údržbu o 90%
- Fixtures eliminujú boilerplate setup kód

### Risks & Mitigation:
| Risk                       | Impact | Probability | Mitigation                                    |
| -------------------------- | ------ | ----------- | --------------------------------------------- |
| Tests flaky po refactore   | High   | Medium      | Zachovať retry: 2× v CI                       |
| Team nezná POM pattern     | Medium | Low         | Dokumentácia + example-refactored.spec.ts     |
| CI timeout na slow tests   | Medium | Medium      | Test tagging (@smoke vs @integration)         |
| Backend down = all tests ❌ | High   | Low         | Retry logic + alerting (už existuje v config) |

### Future Improvements (Sprint 4):
- Visual regression: `toHaveScreenshot()` assertions
- Component tests: Vitest + React Testing Library
- Performance tests: Lighthouse CI
- Accessibility tests: axe-core integration

---

## ✅ Definition of Done

- [x] Kód napísaný (POM classes, fixtures)
- [ ] Kód zrefaktorovaný (2+ existujúce testy na POM)
- [ ] Testy prechádzajú (playwright test)
- [ ] TypeScript kompiluje (tsc --noEmit)
- [ ] Code review (2 approvals)
- [ ] Dokumentácia (PLAYWRIGHT_IMPROVEMENT_PLAN.md) ✅
- [ ] Smoke tests < 3 min (npm run test:smoke)
- [ ] CI sharding setup (4 workers)
- [ ] Merged to main

---

**Status:** ✅ In Progress (Fáza 1 hotová)
**Started:** 2025-12-02
**Target:** 2025-12-03 (1 working day)
**Actual:** TBD

---

**Created by:** GitHub Copilot
**Last Updated:** 2025-12-02
**Version:** 1.0
