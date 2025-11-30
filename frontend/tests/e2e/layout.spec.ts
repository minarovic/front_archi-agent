import { test, expect } from '@playwright/test';

/**
 * Basic UI layout and component rendering tests
 */

test.describe('Layout and Components', () => {
  test('should display main layout with chat panel and canvas', async ({ page }) => {
    await page.goto('/');

    // Check that main components are visible
    await expect(page.locator('text=MCOP Explorer')).toBeVisible();
    await expect(page.locator('text=Metadata Copilot')).toBeVisible();
    await expect(page.locator('text=ER Diagram')).toBeVisible();
  });

  test('should display welcome message on initial load', async ({ page }) => {
    await page.goto('/');

    // Check welcome message
    await expect(page.locator('text=Welcome to MCOP Explorer!')).toBeVisible();
    await expect(page.locator('text=Ask me anything')).toBeVisible();
  });

  test('should show connection indicator', async ({ page }) => {
    await page.goto('/');

    // Wait for WebSocket connection
    await page.waitForTimeout(1000);

    // Check for either connected or disconnected state indicator
    const indicator = page.locator('[class*="h-2 w-2 rounded-full"]');
    await expect(indicator).toBeVisible();
  });

  test('should display message input field', async ({ page }) => {
    await page.goto('/');

    // Check message input
    const input = page.locator('input[placeholder*="Ask about"]');
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('should display send button', async ({ page }) => {
    await page.goto('/');

    // Check send button
    const sendButton = page.locator('button:has-text("Send")');
    await expect(sendButton).toBeVisible();
  });

  test('should show empty diagram placeholder', async ({ page }) => {
    await page.goto('/');

    // Check empty diagram state
    await expect(page.locator('text=No diagram to display')).toBeVisible();
  });

  test('should display example queries', async ({ page }) => {
    await page.goto('/');

    // Check that example queries are shown
    await expect(page.locator('text=What tables are available')).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/MCOP Explorer/);
  });
});

test.describe('Responsive Layout', () => {
  test('should display properly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Both panels should be visible side-by-side on large screens
    await expect(page.locator('text=Metadata Copilot')).toBeVisible();
    await expect(page.locator('text=ER Diagram')).toBeVisible();
  });

  test('should adapt to smaller viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Components should still be visible but possibly stacked
    await expect(page.locator('text=MCOP Explorer')).toBeVisible();
    await expect(page.locator('input[placeholder*="Ask about"]')).toBeVisible();
  });
});
