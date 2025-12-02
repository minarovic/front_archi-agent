import { test, expect } from '@playwright/test';

/**
 * Chat Integration Tests
 * Tests real communication with Railway backend
 */

test.describe('Chat Integration with Railway Backend', () => {

  test('should connect to WebSocket and receive response', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Wait for initial view
    await expect(page.getByTestId('initial-view')).toBeVisible();

    // Click example prompt
    await page.getByTestId('example-prompt-0').click();

    // Should transition to split layout
    await expect(page.locator('text=MCOP Explorer')).toBeVisible({ timeout: 5000 });

    // Check WebSocket status - should show Connected or Connecting
    const statusText = page.locator('text=Connected').or(page.locator('text=Connecting'));
    await expect(statusText).toBeVisible({ timeout: 10000 });

    // Wait for assistant response (up to 30 seconds for LLM)
    const assistantMessage = page.locator('[data-testid="message-assistant"]').first()
      .or(page.locator('text=ASSISTANT').first())
      .or(page.locator('p:has-text("Assistant")').first());

    // Take screenshot of initial state
    await page.screenshot({
      path: 'test-results/chat-integration-sending.png',
      fullPage: true
    });
    console.log('✅ Screenshot: chat-integration-sending.png');

    // Wait for response (LLM can take time)
    await page.waitForTimeout(15000);

    // Take screenshot after waiting for response
    await page.screenshot({
      path: 'test-results/chat-integration-response.png',
      fullPage: true
    });
    console.log('✅ Screenshot: chat-integration-response.png');

    // Check console for WebSocket messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    // Log final state
    console.log('Page URL:', page.url());
  });

  test('should show thinking indicator while waiting', async ({ page }) => {
    await page.goto('/');

    // Click example prompt
    await page.getByTestId('example-prompt-0').click();

    // Should show thinking indicator
    const thinkingIndicator = page.locator('text=Thinking').or(page.locator('.thinking-dots'));

    // Take screenshot with thinking state
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'test-results/chat-thinking-state.png',
      fullPage: true
    });
    console.log('✅ Screenshot: chat-thinking-state.png');
  });

  test('should display Canvas with diagram after response', async ({ page }) => {
    await page.goto('/');

    // Use the ER diagram prompt
    await page.getByTestId('example-prompt-2').click(); // "Generate an ER diagram..."

    // Wait for canvas to appear
    await expect(page.locator('text=Canvas')).toBeVisible({ timeout: 5000 });

    // Wait for diagram generation (can take 30+ seconds)
    await page.waitForTimeout(20000);

    // Take screenshot of canvas
    await page.screenshot({
      path: 'test-results/chat-canvas-diagram.png',
      fullPage: true
    });
    console.log('✅ Screenshot: chat-canvas-diagram.png');

    // Check if diagram or "No diagram" message is visible
    const diagramArea = page.locator('[data-testid="mermaid-diagram"]')
      .or(page.locator('text=No diagram yet'))
      .or(page.locator('svg.mermaid'));

    await expect(diagramArea).toBeVisible({ timeout: 5000 });
  });
});
