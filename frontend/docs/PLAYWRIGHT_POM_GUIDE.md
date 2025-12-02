# Playwright Page Object Model - Implementačný plán

## 1. ChatPage

```typescript
// tests/pages/ChatPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class ChatPage {
  readonly page: Page;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly connectionStatus: Locator;
  readonly messages: Locator;
  readonly welcomeMessage: Locator;
  readonly examplePrompts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.messageInput = page.getByRole('textbox');
    this.sendButton = page.getByRole('button', { name: 'Send' });
    this.connectionStatus = page.locator('text=Connected').or(page.locator('text=Connecting'));
    this.messages = page.locator('[data-testid^="message-"]');
    this.welcomeMessage = page.getByText("Hi! I'm the MCOP Explorer Agent");
    this.examplePrompts = page.locator('[data-testid^="example-prompt-"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForConnection(timeout = 10000) {
    await expect(this.connectionStatus).toBeVisible({ timeout });
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async clickExamplePrompt(index: number) {
    await this.examplePrompts.nth(index).click();
  }

  async waitForResponse(timeout = 30000) {
    // Wait for assistant message or thinking indicator to disappear
    await expect(this.messages.filter({ hasText: 'ASSISTANT' }))
      .toHaveCount(1, { timeout });
  }

  async getLastMessage() {
    return this.messages.last();
  }

  async isInputEnabled() {
    return this.messageInput.isEnabled();
  }

  async getMessageCount() {
    return this.messages.count();
  }
}
```

**Použitie:**
```typescript
test('should send message', async ({ page }) => {
  const chatPage = new ChatPage(page);
  await chatPage.goto();
  await chatPage.waitForConnection();
  await chatPage.sendMessage('List all tables');
  await chatPage.waitForResponse();
  expect(await chatPage.getMessageCount()).toBeGreaterThan(0);
});
```

---

## 2. CanvasPage

```typescript
// tests/pages/CanvasPage.ts
import { Page, Locator, expect } from '@playwright/test';

export type CanvasView = 'table' | 'diagram';

export class CanvasPage {
  readonly page: Page;
  readonly canvasContainer: Locator;
  readonly tableViewButton: Locator;
  readonly diagramViewButton: Locator;
  readonly tableView: Locator;
  readonly diagramView: Locator;
  readonly debugPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvasContainer = page.getByTestId('canvas');
    this.tableViewButton = page.getByRole('button', { name: /table/i });
    this.diagramViewButton = page.getByRole('button', { name: /diagram/i });
    this.tableView = page.getByTestId('canvas-view-table');
    this.diagramView = page.getByTestId('canvas-view-diagram');
    this.debugPanel = page.locator('text=Canvas View:');
  }

  async isVisible() {
    return this.canvasContainer.isVisible();
  }

  async switchToView(view: CanvasView) {
    if (view === 'table') {
      await this.tableViewButton.click();
    } else {
      await this.diagramViewButton.click();
    }
  }

  async switchViaKeyboard(view: CanvasView) {
    await this.page.keyboard.press(view === 'table' ? 't' : 'd');
  }

  async getCurrentView(): Promise<CanvasView> {
    const isTableVisible = await this.tableView.isVisible();
    const isDiagramVisible = await this.diagramView.isVisible();

    if (isTableVisible) return 'table';
    if (isDiagramVisible) return 'diagram';
    throw new Error('No view is visible');
  }

  async waitForViewSwitch(expectedView: CanvasView, timeout = 5000) {
    const targetView = expectedView === 'table' ? this.tableView : this.diagramView;
    await expect(targetView).toBeVisible({ timeout });
  }

  async isDebugPanelVisible() {
    return this.debugPanel.isVisible();
  }

  async getDebugPanelText() {
    return this.debugPanel.textContent();
  }
}
```

**Použitie:**
```typescript
test('should switch views', async ({ page }) => {
  const canvasPage = new CanvasPage(page);
  await canvasPage.switchToView('table');
  expect(await canvasPage.getCurrentView()).toBe('table');

  await canvasPage.switchViaKeyboard('diagram');
  await canvasPage.waitForViewSwitch('diagram');
  expect(await canvasPage.getCurrentView()).toBe('diagram');
});
```

---

## 3. DiagramPage

```typescript
// tests/pages/DiagramPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DiagramPage {
  readonly page: Page;
  readonly diagramHeading: Locator;
  readonly emptyState: Locator;
  readonly mermaidDiagram: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.diagramHeading = page.getByRole('heading', { name: 'ER Diagram' });
    this.emptyState = page.getByText('No diagram yet');
    this.mermaidDiagram = page.locator('.mermaid');
    this.loadingIndicator = page.locator('text=Generating');
  }

  async isVisible() {
    return this.diagramHeading.isVisible();
  }

  async hasEmptyState() {
    return this.emptyState.isVisible();
  }

  async hasDiagram() {
    return this.mermaidDiagram.isVisible();
  }

  async waitForDiagram(timeout = 30000) {
    await expect(this.mermaidDiagram).toBeVisible({ timeout });
  }

  async isLoading() {
    return this.loadingIndicator.isVisible();
  }

  async getDiagramPosition() {
    return this.diagramHeading.boundingBox();
  }
}
```

**Použitie:**
```typescript
test('should show diagram after query', async ({ page }) => {
  const chatPage = new ChatPage(page);
  const diagramPage = new DiagramPage(page);

  await chatPage.goto();
  await chatPage.sendMessage('Generate ER diagram');
  await diagramPage.waitForDiagram();

  expect(await diagramPage.hasDiagram()).toBeTruthy();
  expect(await diagramPage.hasEmptyState()).toBeFalsy();
});
```

---

## 4. InitialViewPage

```typescript
// tests/pages/InitialViewPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class InitialViewPage {
  readonly page: Page;
  readonly container: Locator;
  readonly heroTitle: Locator;
  readonly subtitle: Locator;
  readonly examplePrompts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('initial-view');
    this.heroTitle = page.getByRole('heading', { name: /metadata copilot/i });
    this.subtitle = page.getByText(/explore your metadata/i);
    this.examplePrompts = page.locator('[data-testid^="example-prompt-"]');
  }

  async isVisible() {
    return this.container.isVisible();
  }

  async clickExamplePrompt(index: number) {
    await this.examplePrompts.nth(index).click();
  }

  async getExamplePromptCount() {
    return this.examplePrompts.count();
  }

  async waitForTransitionToSplitView(timeout = 5000) {
    await expect(this.container).not.toBeVisible({ timeout });
  }
}
```

---

## 5. Kombinovaný workflow test

```typescript
// tests/e2e/complete-workflow.spec.ts
import { test, expect } from '@playwright/test';
import { InitialViewPage } from '../pages/InitialViewPage';
import { ChatPage } from '../pages/ChatPage';
import { CanvasPage } from '../pages/CanvasPage';
import { DiagramPage } from '../pages/DiagramPage';

test.describe('Complete User Workflow', () => {
  test('should complete full exploration journey', async ({ page }) => {
    // Step 1: Start from initial view
    const initialView = new InitialViewPage(page);
    await page.goto('/');
    await expect(initialView.container).toBeVisible();

    // Step 2: Click example prompt
    await initialView.clickExamplePrompt(0);
    await initialView.waitForTransitionToSplitView();

    // Step 3: Verify chat panel appeared
    const chatPage = new ChatPage(page);
    await chatPage.waitForConnection();
    expect(await chatPage.getMessageCount()).toBeGreaterThan(0);

    // Step 4: Send another message
    await chatPage.sendMessage('Show table relationships');
    await chatPage.waitForResponse();

    // Step 5: Check canvas appears
    const canvasPage = new CanvasPage(page);
    await expect(canvasPage.canvasContainer).toBeVisible();

    // Step 6: Switch to table view
    await canvasPage.switchToView('table');
    expect(await canvasPage.getCurrentView()).toBe('table');

    // Step 7: Verify diagram panel
    const diagramPage = new DiagramPage(page);
    expect(await diagramPage.isVisible()).toBeTruthy();
  });
});
```

---

## 6. Fixtures integrácia

```typescript
// tests/fixtures/pages.ts
import { test as base } from '@playwright/test';
import { ChatPage } from '../pages/ChatPage';
import { CanvasPage } from '../pages/CanvasPage';
import { DiagramPage } from '../pages/DiagramPage';
import { InitialViewPage } from '../pages/InitialViewPage';

type PageFixtures = {
  chatPage: ChatPage;
  canvasPage: CanvasPage;
  diagramPage: DiagramPage;
  initialView: InitialViewPage;
};

export const test = base.extend<PageFixtures>({
  chatPage: async ({ page }, use) => {
    const chatPage = new ChatPage(page);
    await use(chatPage);
  },

  canvasPage: async ({ page }, use) => {
    const canvasPage = new CanvasPage(page);
    await use(canvasPage);
  },

  diagramPage: async ({ page }, use) => {
    const diagramPage = new DiagramPage(page);
    await use(diagramPage);
  },

  initialView: async ({ page }, use) => {
    const initialView = new InitialViewPage(page);
    await use(initialView);
  },
});

export { expect } from '@playwright/test';
```

**Použitie s fixtures:**
```typescript
import { test, expect } from '../fixtures/pages';

test('should work with fixtures', async ({ page, chatPage, canvasPage }) => {
  await page.goto('/');
  await chatPage.waitForConnection();
  await chatPage.sendMessage('List tables');
  await expect(canvasPage.canvasContainer).toBeVisible();
});
```

---

## 7. Implementačné kroky

### Týždeň 1: Základy
1. ✅ Vytvoriť `tests/pages/` adresár
2. ✅ Implementovať `ChatPage.ts`
3. ✅ Refaktorovať `chat.spec.ts` na použitie POM
4. ✅ Unit test pre ChatPage metódy

### Týždeň 2: Canvas a Diagram
5. ✅ Implementovať `CanvasPage.ts`
6. ✅ Implementovať `DiagramPage.ts`
7. ✅ Refaktorovať `canvas-trigger.spec.ts`
8. ✅ Refaktorovať `diagram.spec.ts`

### Týždeň 3: Fixtures a workflows
9. ✅ Vytvoriť `tests/fixtures/pages.ts`
10. ✅ Implementovať `InitialViewPage.ts`
11. ✅ Vytvoriť `complete-workflow.spec.ts`
12. ✅ Dokumentácia a príklady

---

## 8. Výhody POM

| Pred POM                                 | Po POM                                    |
| ---------------------------------------- | ----------------------------------------- |
| `page.getByRole('textbox')` v 10 testoch | `chatPage.messageInput` (centralizované)  |
| Duplikácia waitForConnection logiky      | `chatPage.waitForConnection()` (reusable) |
| Ťažké refaktorovanie pri zmenách UI      | Zmena len v jednom súbore                 |
| Nečitateľné testy s množstvom locatorov  | Expresívne: `chatPage.sendMessage()`      |
| Ťažké testovanie view switching          | `canvasPage.switchToView('table')`        |

---

## 9. Best Practices

### ✅ Správne
```typescript
// Expressive API
await chatPage.sendMessage('query');
await canvasPage.switchToView('table');

// Assertions on POM methods
expect(await canvasPage.getCurrentView()).toBe('table');

// Reusable wait logic
await chatPage.waitForConnection();
```

### ❌ Nesprávne
```typescript
// Locators mimo POM
const input = page.getByRole('textbox');

// Business logic v testoch
await input.fill(text);
await page.getByRole('button').click();
await page.waitForTimeout(2000);

// Duplikovaná logika
// (rovnaký kód v 5 testoch)
```

---

## 10. Migračný plán

### Fáza 1: Smoke tests (1 deň)
- Migrovať `layout.spec.ts` → použiť POM
- Vytvoriť `LayoutPage.ts` pre header, sidebar

### Fáza 2: Chat tests (2 dni)
- Migrovať `chat.spec.ts`
- Migrovať `chat-integration.spec.ts`

### Fáza 3: Canvas tests (2 dni)
- Migrovať `canvas-trigger.spec.ts`
- Migrovať `diagram.spec.ts`

### Fáza 4: Visual tests (1 deň)
- Aktualizovať `visual.spec.ts` na POM

**Celkový čas:** 6 pracovných dní
**ROI:** 50% redukcia test maintenance času
