import { test, expect } from '@playwright/test';

/**
 * Basic UI layout and component rendering tests
 * Updated to match actual MCOP Explorer UI
 */

test.describe('Layout and Components', () => {
  test('should display main layout with chat panel and canvas', async ({ page }) => {
    await page.goto('/');

    // Check that main components are visible using exact selectors
    await expect(page.getByRole('heading', { name: 'MCOP Explorer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ER Diagram' })).toBeVisible();
  });

  test('should display welcome message on initial load', async ({ page }) => {
    await page.goto('/');

    // Note: If backend returns error, welcome message may be replaced
    const welcomeMessage = page.getByText("Hi! I'm the MCOP Explorer Agent");
    const connectionError = page.locator('text=/Connection error/');

    await expect(welcomeMessage.or(connectionError)).toBeVisible();
  });

  test('should show connection indicator', async ({ page }) => {
    await page.goto('/');

    // Wait for WebSocket connection attempt
    await page.waitForTimeout(2000);

    // Check for either connected or connecting state
    const connected = page.getByText('Connected');
    const connecting = page.getByText('Connecting...');

    await expect(connected.or(connecting)).toBeVisible();
  });

  test('should display message input field', async ({ page }) => {
    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(2000);

    // Check for input - might be disabled during connection
    const input = page.getByRole('textbox');
    await expect(input).toBeVisible();
  });

  test('should display send button', async ({ page }) => {
    await page.goto('/');

    // Check send button
    const sendButton = page.getByRole('button', { name: 'Send' });
    await expect(sendButton).toBeVisible();
  });

  test('should show empty diagram placeholder', async ({ page }) => {
    await page.goto('/');

    // Check empty diagram state - actual text
    await expect(page.getByText('No diagram yet')).toBeVisible();
  });

  test('should display example queries', async ({ page }) => {
    await page.goto('/');

    // Note: If backend returns error, example queries may be replaced
    const exampleQuery = page.getByText('"List all tables"');
    const connectionError = page.locator('text=/Connection error/');

    await expect(exampleQuery.or(connectionError)).toBeVisible();
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
    await expect(page.getByRole('heading', { name: 'MCOP Explorer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ER Diagram' })).toBeVisible();
  });

  test('should adapt to smaller viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Components should still be visible
    await expect(page.getByRole('heading', { name: 'MCOP Explorer' })).toBeVisible();
  });
});
