import { Page, Locator, expect } from '@playwright/test';

export type ViewMode = 'table' | 'diagram';

/**
 * Page Object Model for Canvas Panel
 * Handles view switching, diagram display, metrics
 */
export class CanvasPage {
  readonly page: Page;
  readonly canvas: Locator;
  readonly tableViewButton: Locator;
  readonly diagramViewButton: Locator;
  readonly tableView: Locator;
  readonly diagramView: Locator;
  readonly mermaidDiagram: Locator;
  readonly metricsHeader: Locator;
  readonly debugPanel: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.getByTestId('canvas');
    this.tableViewButton = page.getByRole('button', { name: /table/i });
    this.diagramViewButton = page.getByRole('button', { name: /diagram/i });
    this.tableView = page.getByTestId('canvas-view-table');
    this.diagramView = page.getByTestId('canvas-view-diagram');
    this.mermaidDiagram = page.locator('.mermaid');
    this.metricsHeader = page.getByTestId('metrics-header');
    this.debugPanel = page.locator('text=Canvas View:');
    this.emptyState = page.getByText(/no diagram yet/i);
  }

  /**
   * Check if canvas is visible
   */
  async isVisible(): Promise<boolean> {
    return this.canvas.isVisible();
  }

  /**
   * Switch to specific view using buttons
   * @param view 'table' or 'diagram'
   */
  async switchToView(view: ViewMode) {
    const button = view === 'table' ? this.tableViewButton : this.diagramViewButton;
    await button.click();
    await this.waitForViewSwitch(view);
  }

  /**
   * Switch view using keyboard shortcut
   * @param view 'table' (T key) or 'diagram' (D key)
   */
  async switchViaKeyboard(view: ViewMode) {
    const key = view === 'table' ? 't' : 'd';
    await this.page.keyboard.press(key);
    await this.waitForViewSwitch(view);
  }

  /**
   * Wait for view to switch
   * @param expectedView Expected view mode
   * @param timeout Max wait time
   */
  async waitForViewSwitch(expectedView: ViewMode, timeout = 5000) {
    const targetView = expectedView === 'table' ? this.tableView : this.diagramView;
    await expect(targetView).toBeVisible({ timeout });
  }

  /**
   * Get current active view
   */
  async getCurrentView(): Promise<ViewMode> {
    const isTableVisible = await this.tableView.isVisible();
    const isDiagramVisible = await this.diagramView.isVisible();

    if (isTableVisible) return 'table';
    if (isDiagramVisible) return 'diagram';
    throw new Error('No view is currently visible');
  }

  /**
   * Check if diagram is rendered
   */
  async hasDiagram(): Promise<boolean> {
    return this.mermaidDiagram.isVisible();
  }

  /**
   * Check if empty state is shown
   */
  async hasEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  /**
   * Wait for diagram to render (for LLM responses)
   * @param timeout Max wait time (default 60s for backend)
   */
  async waitForDiagram(timeout = 60000) {
    await expect(this.mermaidDiagram).toBeVisible({ timeout });
  }

  /**
   * Check if metrics header is visible
   */
  async hasMetrics(): Promise<boolean> {
    return this.metricsHeader.isVisible();
  }

  /**
   * Get metrics text (for verification)
   */
  async getMetricsText(): Promise<string> {
    const text = await this.metricsHeader.textContent();
    return text || '';
  }

  /**
   * Check if debug panel is visible (dev mode only)
   */
  async isDebugPanelVisible(): Promise<boolean> {
    return this.debugPanel.isVisible();
  }

  /**
   * Get debug panel content (current view state)
   */
  async getDebugPanelText(): Promise<string> {
    const text = await this.debugPanel.textContent();
    return text || '';
  }
}
