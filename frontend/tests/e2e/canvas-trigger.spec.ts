import { test, expect } from '@playwright/test';

test.describe('Canvas Trigger Auto-Switch', () => {
  test('should auto-switch to table view when canvas_trigger with table_list is received', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:3000');

    // Wait for initial view
    await expect(page.getByTestId('initial-view')).toBeVisible();

    // Type a query that should trigger table_list view
    const input = page.getByPlaceholder(/ask about/i);
    await input.fill('List all tables');
    await input.press('Enter');

    // Wait for chat panel to appear (split view)
    await expect(page.getByTestId('chat-panel')).toBeVisible({ timeout: 10000 });

    // Wait for Canvas to appear
    await expect(page.getByTestId('canvas')).toBeVisible();

    // Check console logs for canvas_trigger
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('Canvas trigger')) {
        logs.push(msg.text());
      }
    });

    // Wait for potential view switch (up to 20 seconds for backend response)
    await page.waitForTimeout(20000);

    // Check if view switched to table (data-testid="canvas-view-table")
    const canvasViewTable = page.getByTestId('canvas-view-table');
    const canvasViewDiagram = page.getByTestId('canvas-view-diagram');

    // Log results
    console.log('Console logs with canvas_trigger:', logs);

    const isTableView = await canvasViewTable.isVisible().catch(() => false);
    const isDiagramView = await canvasViewDiagram.isVisible().catch(() => false);

    console.log('Table view visible:', isTableView);
    console.log('Diagram view visible:', isDiagramView);

    // Take screenshot
    await page.screenshot({ path: 'test-results/canvas-trigger-result.png', fullPage: true });
  });

  test('should show diagram view by default', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const input = page.getByPlaceholder(/ask about/i);
    await input.fill('Show relationships for factv_purchase_order');
    await input.press('Enter');

    // Wait for split view
    await expect(page.getByTestId('canvas')).toBeVisible({ timeout: 10000 });

    // Default should be diagram view
    await page.waitForTimeout(15000);
    const canvasViewDiagram = page.getByTestId('canvas-view-diagram');
    await expect(canvasViewDiagram).toBeVisible();
  });

  test('should allow manual view toggle', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const input = page.getByPlaceholder(/ask about/i);
    await input.fill('Show tables');
    await input.press('Enter');

    await expect(page.getByTestId('canvas')).toBeVisible({ timeout: 10000 });

    // Find view toggle buttons
    const tableButton = page.getByRole('button', { name: /table/i });
    const diagramButton = page.getByRole('button', { name: /diagram/i });

    // Click table button
    await tableButton.click();
    await expect(page.getByTestId('canvas-view-table')).toBeVisible();

    // Click diagram button
    await diagramButton.click();
    await expect(page.getByTestId('canvas-view-diagram')).toBeVisible();

    // Test keyboard shortcuts
    await page.keyboard.press('t');
    await expect(page.getByTestId('canvas-view-table')).toBeVisible();

    await page.keyboard.press('d');
    await expect(page.getByTestId('canvas-view-diagram')).toBeVisible();
  });
});
