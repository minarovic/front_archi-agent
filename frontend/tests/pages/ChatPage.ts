import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Chat Panel
 * Centralizes all chat-related selectors and actions
 */
export class ChatPage {
  readonly page: Page;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly homeButton: Locator;
  readonly messages: Locator;
  readonly thinkingDots: Locator;
  readonly initialView: Locator;

  constructor(page: Page) {
    this.page = page;
    this.messageInput = page.getByPlaceholder(/ask about/i);
    this.sendButton = page.getByRole('button', { name: /send/i });
    this.homeButton = page.getByRole('button', { name: /home/i });
    this.messages = page.locator('[data-testid$="-message"]');
    this.thinkingDots = page.getByText(/thinking/i);
    this.initialView = page.getByTestId('initial-view');
  }

  /**
   * Navigate to homepage
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Wait for WebSocket connection (max 10s)
   * Waits for input to be enabled, which means connection is ready
   */
  async waitForConnection(timeout = 10000) {
    await expect(this.messageInput)
      .toBeEnabled({ timeout });
    // Additional check: placeholder should say "Ask about" not "Connecting"
    await expect(this.messageInput)
      .not.toHaveAttribute('placeholder', /connecting/i);
  }

  /**
   * Send a message in chat
   * @param text Message to send
   */
  async sendMessage(text: string) {
    await expect(this.messageInput).toBeEnabled();
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  /**
   * Wait for agent response (with configurable timeout for LLM)
   * @param timeout Max time to wait (default 120s for Railway backend)
   */
  async waitForResponse(timeout = 120000) {
    // Wait for thinking dots to disappear
    await expect(this.thinkingDots)
      .not.toBeVisible({ timeout });

    // Wait for at least one assistant message to appear
    await expect(this.page.locator('[data-testid="agent-message"]').first())
      .toBeVisible({ timeout: 5000 });
  }

  /**
   * Get last message content
   */
  async getLastMessageText(): Promise<string> {
    const lastMessage = this.messages.last();
    const text = await lastMessage.textContent();
    return text || '';
  }

  /**
   * Count total messages
   */
  async getMessageCount(): Promise<number> {
    return this.messages.count();
  }

  /**
   * Check if input is enabled
   */
  async isInputEnabled(): Promise<boolean> {
    return this.messageInput.isEnabled();
  }

  /**
   * Go back to home (clear session)
   */
  async goHome() {
    await this.homeButton.click();
    await expect(this.initialView).toBeVisible();
  }

  /**
   * Check if initial view is visible
   */
  async isInitialViewVisible(): Promise<boolean> {
    return this.initialView.isVisible();
  }
}
