import { test } from '@playwright/test';

test.describe('Visual Design Verification', () => {
  test('should capture homepage design (Škoda Sprint 3.1)', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/sprint-3.1-homepage.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: test-results/sprint-3.1-homepage.png');

    // Log computed styles for verification
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Body background color:', bgColor);

    // Check primary button if visible
    const primaryButton = page.locator('.btn-primary').first();
    const buttonCount = await primaryButton.count();
    if (buttonCount > 0) {
      const btnBg = await primaryButton.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );
      const btnColor = await primaryButton.evaluate((el) =>
        window.getComputedStyle(el).color
      );
      console.log('Primary button - bg:', btnBg, ', color:', btnColor);
    }

    // Check header if visible
    const header = page.locator('.chat-header, .hero-header').first();
    const headerCount = await header.count();
    if (headerCount > 0) {
      const headerBg = await header.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );
      console.log('Header background color:', headerBg);
    }
  });

  test('should capture split layout design', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Take screenshot of viewport
    await page.screenshot({
      path: 'test-results/sprint-3.1-layout.png',
      fullPage: false
    });

    console.log('✅ Screenshot saved: test-results/sprint-3.1-layout.png');
  });
});
