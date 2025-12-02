import { test, expect } from '@playwright/test';

test.describe('Canvas Trigger Auto-Switch', () => {
  test('should show canvas_trigger logs and debug panel state', async ({ page }) => {
    // Collect all console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(`[${msg.type()}] ${text}`);
      console.log(`[${msg.type()}] ${text}`);
    });

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

    // Check if DebugPanel is visible
    const debugPanel = page.locator('text=Canvas View:');
    const debugPanelVisible = await debugPanel.isVisible().catch(() => false);
    console.log('🐛 Debug Panel visible:', debugPanelVisible);

    if (debugPanelVisible) {
      const debugPanelText = await debugPanel.textContent();
      console.log('🐛 Debug Panel content:', debugPanelText);
    }

    // Wait for WebSocket response and potential view switch (30 seconds)
    await page.waitForTimeout(30000);

    // Filter logs for canvas_trigger
    const canvasTriggerLogs = consoleLogs.filter(log =>
      log.includes('canvas_trigger') ||
      log.includes('Canvas trigger') ||
      log.includes('Auto-switching')
    );

    console.log('\n📋 All Canvas Trigger Related Logs:');
    canvasTriggerLogs.forEach(log => console.log(log));

    // Check current view state
    const canvasViewTable = page.getByTestId('canvas-view-table');
    const canvasViewDiagram = page.getByTestId('canvas-view-diagram');

    const isTableView = await canvasViewTable.isVisible().catch(() => false);
    const isDiagramView = await canvasViewDiagram.isVisible().catch(() => false);

    console.log('\n📊 Final View State:');
    console.log('Table view visible:', isTableView);
    console.log('Diagram view visible:', isDiagramView);

    // Check debug panel final state
    if (debugPanelVisible) {
      const finalDebugText = await debugPanel.textContent();
      console.log('Debug Panel final state:', finalDebugText);
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/canvas-trigger-debug.png', fullPage: true });

    // Report summary
    console.log('\n✅ TEST SUMMARY:');
    console.log(`- Found ${canvasTriggerLogs.length} canvas_trigger related logs`);
    console.log(`- Debug Panel visible: ${debugPanelVisible}`);
    console.log(`- Current view: ${isTableView ? 'TABLE' : isDiagramView ? 'DIAGRAM' : 'UNKNOWN'}`);
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
