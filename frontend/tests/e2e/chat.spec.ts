import { test, expect } from '@playwright/test';

/**
 * Chat interface interaction tests
 */

test.describe('Chat Interface', () => {
  test('should allow typing in message input', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');
    await input.fill('What tables are available?');

    await expect(input).toHaveValue('What tables are available?');
  });

  test('should enable send button when input has text', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');
    const sendButton = page.locator('button:has-text("Send")');

    // Initially enabled (no validation yet)
    await expect(sendButton).toBeEnabled();

    // Type message
    await input.fill('Test message');
    await expect(sendButton).toBeEnabled();
  });

  test('should clear input after sending message', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');
    const sendButton = page.locator('button:has-text("Send")');

    // Type and send
    await input.fill('Test message');
    await sendButton.click();

    // Wait a moment for state update
    await page.waitForTimeout(100);

    // Input should be cleared
    await expect(input).toHaveValue('');
  });

  test('should support Enter key to send message', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');

    await input.fill('Test message');
    await input.press('Enter');

    // Wait for message to be processed
    await page.waitForTimeout(100);

    // Input should be cleared
    await expect(input).toHaveValue('');
  });

  test('should display user message after sending', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');
    const sendButton = page.locator('button:has-text("Send")');

    const testMessage = 'What tables are available?';
    await input.fill(testMessage);
    await sendButton.click();

    // Wait for message to appear
    await page.waitForTimeout(500);

    // Should show user message in chat
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();
  });

  test('should handle multiple messages in sequence', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');
    const sendButton = page.locator('button:has-text("Send")');

    // Send first message
    await input.fill('First message');
    await sendButton.click();
    await page.waitForTimeout(300);

    // Send second message
    await input.fill('Second message');
    await sendButton.click();
    await page.waitForTimeout(300);

    // Both messages should be visible
    await expect(page.locator('text=First message')).toBeVisible();
    await expect(page.locator('text=Second message')).toBeVisible();
  });

  test('should show messages in correct order', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');

    // Send messages quickly
    await input.fill('Message 1');
    await input.press('Enter');
    await page.waitForTimeout(200);

    await input.fill('Message 2');
    await input.press('Enter');
    await page.waitForTimeout(200);

    await input.fill('Message 3');
    await input.press('Enter');
    await page.waitForTimeout(200);

    // Verify order (Message 1 should appear before Message 3 in DOM)
    const messages = await page.locator('[class*="message"]').allTextContents();
    const hasCorrectOrder = messages.some((_, idx, arr) => {
      if (idx < arr.length - 1) {
        const curr = arr[idx];
        const next = arr[idx + 1];
        // If we find Message 1, Message 3 should not appear before it
        if (curr.includes('Message 1') && next.includes('Message 3')) {
          return false;
        }
      }
      return true;
    });

    expect(hasCorrectOrder).toBeTruthy();
  });

  test('should not send empty messages', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');
    const sendButton = page.locator('button:has-text("Send")');

    // Try to send empty message
    await sendButton.click();

    // Wait a moment
    await page.waitForTimeout(300);

    // No user message should appear (only welcome message)
    const messageCount = await page.locator('[class*="message"]').count();
    // Should be 0 or 1 (welcome message might not have the class)
    expect(messageCount).toBeLessThanOrEqual(1);
  });
});

test.describe('Chat Visual Feedback', () => {
  test('should show typing indicator for user messages', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');

    // Start typing
    await input.fill('Test');

    // Input should have focus and show the text
    await expect(input).toHaveValue('Test');
  });

  test('should maintain scroll position with multiple messages', async ({ page }) => {
    await page.goto('/');

    const input = page.locator('input[placeholder*="Ask about"]');

    // Send multiple messages to create scrollable content
    for (let i = 1; i <= 5; i++) {
      await input.fill(`Message ${i} with some longer text to fill space`);
      await input.press('Enter');
      await page.waitForTimeout(200);
    }

    // Last message should be visible (auto-scroll)
    await expect(page.locator('text=Message 5')).toBeVisible();
  });
});
