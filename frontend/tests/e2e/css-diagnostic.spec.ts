import { test, expect } from '@playwright/test';

test.describe('CSS Diagnostic - Sprint 3.1 Design System', () => {
  test('verify CSS variables are loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Check :root CSS variables
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        primaryColor: styles.getPropertyValue('--color-primary').trim(),
        primaryDark: styles.getPropertyValue('--color-primary-dark').trim(),
        primaryLight: styles.getPropertyValue('--color-primary-light').trim(),
      };
    });

    console.log('CSS Variables loaded:', cssVars);

    expect(cssVars.primaryColor).toBe('#4BA82E');
    expect(cssVars.primaryDark).toBe('#0E3A2F');
    expect(cssVars.primaryLight).toBe('#78FAAE');
  });

  test('verify btn-prompt class styles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const promptButton = page.locator('.btn-prompt').first();
    await expect(promptButton).toBeVisible();

    const styles = await promptButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        border: computed.border,
        borderWidth: computed.borderWidth,
        borderStyle: computed.borderStyle,
        borderColor: computed.borderColor,
        padding: computed.padding,
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    console.log('btn-prompt computed styles:', JSON.stringify(styles, null, 2));

    // Should have border
    expect(styles.borderWidth).toBe('1px');
    expect(styles.borderStyle).toBe('solid');
  });

  test('verify btn-primary class styles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const primaryButton = page.locator('.btn-primary').first();

    if (await primaryButton.count() > 0) {
      const styles = await primaryButton.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          padding: computed.padding,
        };
      });

      console.log('btn-primary computed styles:', JSON.stringify(styles, null, 2));

      // Should be Škoda dark green: rgb(14, 58, 47) = #0E3A2F
      expect(styles.backgroundColor).toBe('rgb(14, 58, 47)');
      expect(styles.color).toBe('rgb(255, 255, 255)');
    }
  });

  test('verify input class styles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const input = page.locator('input.input').first();
    await expect(input).toBeVisible();

    const styles = await input.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        border: computed.border,
        borderWidth: computed.borderWidth,
        borderStyle: computed.borderStyle,
        borderColor: computed.borderColor,
        padding: computed.padding,
      };
    });

    console.log('input computed styles:', JSON.stringify(styles, null, 2));

    expect(styles.borderWidth).toBe('1px');
    expect(styles.borderStyle).toBe('solid');
  });

  test('take annotated screenshot showing styles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Highlight styled elements by adding red borders temporarily
    await page.evaluate(() => {
      document.querySelectorAll('.btn-prompt').forEach((el: any) => {
        el.style.outline = '3px solid red';
      });
      document.querySelectorAll('.btn-primary').forEach((el: any) => {
        el.style.outline = '3px solid blue';
      });
      document.querySelectorAll('.input').forEach((el: any) => {
        el.style.outline = '3px solid green';
      });
    });

    await page.screenshot({
      path: 'test-results/css-diagnostic-highlighted.png',
      fullPage: true
    });

    console.log('✅ Highlighted screenshot saved: test-results/css-diagnostic-highlighted.png');
    console.log('   Red = .btn-prompt, Blue = .btn-primary, Green = .input');
  });
});
