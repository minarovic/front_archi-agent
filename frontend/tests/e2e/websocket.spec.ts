import { test, expect } from '@playwright/test';

/**
 * WebSocket connection tests
 * Updated to match actual MCOP Explorer implementation
 */

test.describe('WebSocket Connection', () => {
  test('should attempt WebSocket connection on page load', async ({ page }) => {
    // Listen for WebSocket connections - filter for backend WS, not Vite HMR
    let backendWs: any = null;

    page.on('websocket', ws => {
      if (ws.url().includes('/ws/') && !ws.url().includes('token=')) {
        backendWs = ws;
      }
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Check that we connected to backend WebSocket
    expect(backendWs).toBeTruthy();
    expect(backendWs.url()).toContain('ws://localhost:8000/ws/');
  });

  test('should show connection status indicator', async ({ page }) => {
    await page.goto('/');

    // Wait for connection attempt
    await page.waitForTimeout(2000);

    // Should show either Connected or Connecting...
    const connected = page.getByText('Connected');
    const connecting = page.getByText('Connecting...');

    await expect(connected.or(connecting)).toBeVisible();
  });

  test('should generate unique session ID', async ({ page }) => {
    const sessionIds: string[] = [];

    page.on('websocket', ws => {
      const url = ws.url();
      const match = url.match(/\/ws\/([^/?]+)/);
      if (match) {
        sessionIds.push(match[1]);
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Should have captured a session ID
    expect(sessionIds.length).toBeGreaterThan(0);
    // Session ID should be UUID format
    expect(sessionIds[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});

test.describe('WebSocket Reconnection', () => {
  test('should handle page reload with new session', async ({ page }) => {
    const sessionIds: string[] = [];

    page.on('websocket', ws => {
      const url = ws.url();
      const match = url.match(/\/ws\/([^/?]+)/);
      if (match && !sessionIds.includes(match[1])) {
        sessionIds.push(match[1]);
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Should have 2 different session IDs
    expect(sessionIds.length).toBe(2);
    expect(sessionIds[0]).not.toBe(sessionIds[1]);
  });
});
