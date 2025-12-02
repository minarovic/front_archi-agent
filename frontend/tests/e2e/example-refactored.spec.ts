import { test, expect } from '../fixtures/pages.fixture';

/**
 * Example: Refactored test using Page Object Model
 *
 * BEFORE (old style):
 * - Selectors scattered in test
 * - Manual waiting with timeouts
 * - Hard to maintain
 *
 * AFTER (POM style):
 * - Clean, readable API
 * - Centralized selectors
 * - Easy to maintain
 */

test.describe('Chat - Refactored with POM', () => {
  test('should send message and receive response', async ({ chatPage, canvasPage }) => {
    // BEFORE:
    // await page.goto('/');
    // await expect(page.locator('text=Connected')).toBeVisible({ timeout: 10000 });
    // await page.getByRole('textbox').fill('List all tables');
    // await page.getByRole('button', { name: 'Send' }).click();
    // await page.waitForTimeout(30000);

    // AFTER (using fixtures - chatPage already initialized):
    await chatPage.sendMessage('List all tables');
    await chatPage.waitForResponse(); // Smart wait, ends when response arrives

    const messageCount = await chatPage.getMessageCount();
    expect(messageCount).toBeGreaterThan(1);

    // Verify canvas appeared
    expect(await canvasPage.isVisible()).toBeTruthy();
  });

  test('should switch canvas view', async ({ chatPage, canvasPage }) => {
    // Send initial message
    await chatPage.sendMessage('Show ER diagram');
    await chatPage.waitForResponse();

    // BEFORE:
    // await page.getByRole('button', { name: /diagram/i }).click();
    // await page.waitForTimeout(2000);
    // const isDiagram = await page.getByTestId('canvas-view-diagram').isVisible();

    // AFTER:
    await canvasPage.switchToView('diagram');
    expect(await canvasPage.getCurrentView()).toBe('diagram');

    // Test keyboard shortcut
    await canvasPage.switchViaKeyboard('table');
    expect(await canvasPage.getCurrentView()).toBe('table');
  });

  test('should display diagram after query', async ({ chatPage, canvasPage }) => {
    await chatPage.sendMessage('Generate ER diagram for customers table');
    await chatPage.waitForResponse(60000); // LLM can take up to 60s

    // BEFORE:
    // await page.waitForTimeout(60000);
    // const diagram = await page.locator('.mermaid').isVisible();

    // AFTER:
    await canvasPage.waitForDiagram(60000); // Ends immediately when diagram appears
    expect(await canvasPage.hasDiagram()).toBeTruthy();
    expect(await canvasPage.hasEmptyState()).toBeFalsy();
  });

  test('should go back to home', async ({ chatPage, canvasPage }) => {
    await chatPage.sendMessage('Test message');
    await chatPage.waitForResponse();

    // BEFORE:
    // await page.getByRole('button', { name: /home/i }).click();
    // await page.waitForTimeout(1000);
    // const initialView = await page.getByTestId('initial-view').isVisible();

    // AFTER:
    await chatPage.goHome();
    expect(await chatPage.isInitialViewVisible()).toBeTruthy();
  });
});

/**
 * Benefits of POM approach:
 *
 * 1. MAINTAINABILITY:
 *    - Selector changed? Update in 1 place (ChatPage.ts) instead of 10 tests
 *
 * 2. READABILITY:
 *    - chatPage.sendMessage() is clearer than 3 lines of Playwright API
 *
 * 3. REUSABILITY:
 *    - waitForResponse() logic is centralized, no copy-paste
 *
 * 4. TYPE SAFETY:
 *    - TypeScript autocomplete for all methods
 *
 * 5. SMART WAITS:
 *    - No more waitForTimeout(30000), uses web-first assertions
 */
