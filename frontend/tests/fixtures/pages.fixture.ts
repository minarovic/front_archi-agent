import { test as base } from '@playwright/test';
import { ChatPage } from '../pages/ChatPage';
import { CanvasPage } from '../pages/CanvasPage';

/**
 * Test fixtures for Page Object Models
 * Automatically creates and initializes page objects
 */
type PageFixtures = {
  chatPage: ChatPage;
  canvasPage: CanvasPage;
};

export const test = base.extend<PageFixtures>({
  /**
   * ChatPage fixture - auto-navigates and waits for connection
   */
  chatPage: async ({ page }, use) => {
    const chatPage = new ChatPage(page);
    await chatPage.goto();
    await chatPage.waitForConnection();
    await use(chatPage);
  },

  /**
   * CanvasPage fixture - ready to use after navigation
   */
  canvasPage: async ({ page }, use) => {
    const canvasPage = new CanvasPage(page);
    await use(canvasPage);
  },
});

export { expect } from '@playwright/test';
