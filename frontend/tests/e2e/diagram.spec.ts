import { test, expect } from '@playwright/test';

/**
 * ER Diagram display tests
 * Updated to match actual MCOP Explorer UI
 */

test.describe('Diagram Display', () => {
  test('should show ER Diagram panel', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'ER Diagram' })).toBeVisible();
    await expect(page.getByText('Entity relationships visualization')).toBeVisible();
  });

  test('should show empty state when no diagram', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('No diagram yet')).toBeVisible();
    await expect(page.getByText('Run the pipeline or ask about table relationships')).toBeVisible();
  });

  test('should have chart emoji in empty state', async ({ page }) => {
    await page.goto('/');

    // Check for chart emoji
    await expect(page.getByText('📊')).toBeVisible();
  });
});

test.describe('Diagram Layout', () => {
  test('should display diagram panel on right side', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // ER Diagram should be visible
    const diagramHeading = page.getByRole('heading', { name: 'ER Diagram' });
    await expect(diagramHeading).toBeVisible();

    // Get bounding box to verify position
    const box = await diagramHeading.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      // Should be on the right side (x > 400px on 1920px screen)
      expect(box.x).toBeGreaterThan(400);
    }
  });
});
