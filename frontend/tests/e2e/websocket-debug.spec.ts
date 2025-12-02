import { test, expect } from '@playwright/test';

/**
 * WebSocket Debug Test
 * Captures console logs to debug message flow
 */

test('Debug WebSocket message flow', async ({ page }) => {
  const consoleLogs: string[] = [];

  // Capture all console logs
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);

    // Print WebSocket related logs immediately
    if (text.includes('WebSocket') || text.includes('📨') || text.includes('✅') || text.includes('🔌')) {
      console.log(text);
    }
  });

  await page.goto('/');

  // Wait for WebSocket to connect
  await page.waitForTimeout(2000);

  // Click first example prompt
  await page.getByTestId('example-prompt-0').click();

  console.log('\n=== Waiting for response (20s) ===\n');

  // Wait for response
  await page.waitForTimeout(20000);

  // Take screenshot
  await page.screenshot({
    path: 'test-results/websocket-debug.png',
    fullPage: true
  });

  console.log('\n=== All WebSocket Logs ===');
  consoleLogs
    .filter(log => log.includes('WebSocket') || log.includes('📨') || log.includes('✅') || log.includes('🔌') || log.includes('📤'))
    .forEach(log => console.log(log));

  console.log('\n=== Screenshot saved: websocket-debug.png ===');
});
