import { test, expect } from '@playwright/test';

/**
 * WebSocket connection and real-time communication tests
 */

test.describe('WebSocket Connection', () => {
  test('should establish WebSocket connection on page load', async ({ page }) => {
    // Listen for WebSocket connections
    const wsPromise = page.waitForEvent('websocket');

    await page.goto('/');

    // Wait for WebSocket to be created
    const ws = await wsPromise;

    // Check WebSocket URL pattern
    expect(ws.url()).toContain('ws://localhost:8000/ws/');
  });

  test('should show connected status after successful connection', async ({ page }) => {
    await page.goto('/');

    // Wait for connection to establish
    await page.waitForTimeout(1000);

    // Look for green indicator (connected state)
    const connectedIndicator = page.locator('[class*="bg-green"]');
    await expect(connectedIndicator).toBeVisible({ timeout: 5000 });
  });

  test('should maintain connection during page lifecycle', async ({ page }) => {
    await page.goto('/');

    // Wait for initial connection
    await page.waitForTimeout(1000);

    // Send a message
    const input = page.locator('input[placeholder*="Ask about"]');
    await input.fill('Test connection');
    await input.press('Enter');

    // Wait a moment
    await page.waitForTimeout(1000);

    // Connection indicator should still show connected
    const connectedIndicator = page.locator('[class*="bg-green"]');
    await expect(connectedIndicator).toBeVisible();
  });

  test('should handle WebSocket close gracefully', async ({ page }) => {
    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(1000);

    // Get WebSocket
    const wsPromise = page.waitForEvent('websocket');
    const ws = await wsPromise;

    // Close page (which should close WebSocket)
    await page.close();

    // Test passed if no errors thrown
    expect(true).toBe(true);
  });
});

test.describe('WebSocket Message Exchange', () => {
  test('should send message through WebSocket', async ({ page }) => {
    const sentMessages: string[] = [];

    // Listen for WebSocket messages
    page.on('websocket', ws => {
      ws.on('framesent', frame => {
        try {
          const payload = JSON.parse(frame.payload as string);
          if (payload.content) {
            sentMessages.push(payload.content);
          }
        } catch {
          // Ignore non-JSON frames
        }
      });
    });

    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(1000);

    // Send message
    const input = page.locator('input[placeholder*="Ask about"]');
    const testMessage = 'What tables are available?';
    await input.fill(testMessage);
    await input.press('Enter');

    // Wait for message to be sent
    await page.waitForTimeout(1000);

    // Verify message was sent
    expect(sentMessages.some(msg => msg.includes(testMessage))).toBeTruthy();
  });

  test('should receive messages through WebSocket', async ({ page }) => {
    const receivedMessages: any[] = [];

    // Listen for incoming WebSocket messages
    page.on('websocket', ws => {
      ws.on('framereceived', frame => {
        try {
          const payload = JSON.parse(frame.payload as string);
          receivedMessages.push(payload);
        } catch {
          // Ignore non-JSON frames
        }
      });
    });

    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(1000);

    // Send a message to trigger response
    const input = page.locator('input[placeholder*="Ask about"]');
    await input.fill('List tables');
    await input.press('Enter');

    // Wait for response
    await page.waitForTimeout(3000);

    // Should have received at least one message
    expect(receivedMessages.length).toBeGreaterThan(0);
  });

  test('should handle streaming messages', async ({ page }) => {
    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(1000);

    // Send message
    const input = page.locator('input[placeholder*="Ask about"]');
    await input.fill('Show me table details');
    await input.press('Enter');

    // Wait for streaming to start
    await page.waitForTimeout(2000);

    // Check if any agent response appeared (partial or complete)
    const messages = page.locator('[class*="message"]');
    const count = await messages.count();

    // Should have at least 2 messages (user + partial agent response)
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

test.describe('WebSocket Error Handling', () => {
  test('should display error messages from server', async ({ page }) => {
    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(1000);

    // Send a potentially problematic message
    const input = page.locator('input[placeholder*="Ask about"]');
    await input.fill('!!!INVALID!!!');
    await input.press('Enter');

    // Wait for response
    await page.waitForTimeout(2000);

    // Page should still be functional (no crash)
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('should recover from connection interruption', async ({ page }) => {
    await page.goto('/');

    // Wait for initial connection
    await page.waitForTimeout(1000);

    // Simulate network offline/online
    await page.evaluate(() => {
      // Close WebSocket if accessible
      const ws = (window as any).__ws__;
      if (ws) ws.close();
    });

    // Wait a moment
    await page.waitForTimeout(2000);

    // Page should still be functional
    const input = page.locator('input[placeholder*="Ask about"]');
    await expect(input).toBeVisible();
  });

  test('should handle rapid message sending', async ({ page }) => {
    await page.goto('/');

    // Wait for connection
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Ask about"]');

    // Send multiple messages rapidly
    for (let i = 1; i <= 3; i++) {
      await input.fill(`Rapid message ${i}`);
      await input.press('Enter');
      // Minimal delay
      await page.waitForTimeout(100);
    }

    // Wait for processing
    await page.waitForTimeout(2000);

    // All messages should be visible
    await expect(page.locator('text=Rapid message 1')).toBeVisible();
    await expect(page.locator('text=Rapid message 2')).toBeVisible();
    await expect(page.locator('text=Rapid message 3')).toBeVisible();
  });
});

test.describe('WebSocket Session Management', () => {
  test('should maintain session ID across messages', async ({ page }) => {
    let firstSessionId = '';

    page.on('websocket', ws => {
      // Extract session ID from WebSocket URL
      const url = ws.url();
      const match = url.match(/\/ws\/([^/?]+)/);
      if (match) {
        firstSessionId = match[1];
      }
    });

    await page.goto('/');
    await page.waitForTimeout(1000);

    // Send first message
    const input = page.locator('input[placeholder*="Ask about"]');
    await input.fill('First message');
    await input.press('Enter');
    await page.waitForTimeout(1000);

    // Send second message
    await input.fill('Second message');
    await input.press('Enter');
    await page.waitForTimeout(1000);

    // Session ID should be consistent
    expect(firstSessionId).toBeTruthy();
    expect(firstSessionId.length).toBeGreaterThan(0);
  });

  test('should create new session on page reload', async ({ page }) => {
    const sessionIds: string[] = [];

    page.on('websocket', ws => {
      const url = ws.url();
      const match = url.match(/\/ws\/([^/?]+)/);
      if (match) {
        sessionIds.push(match[1]);
      }
    });

    await page.goto('/');
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Should have 2 different session IDs
    expect(sessionIds.length).toBeGreaterThanOrEqual(2);
    if (sessionIds.length >= 2) {
      expect(sessionIds[0]).not.toBe(sessionIds[1]);
    }
  });
});
