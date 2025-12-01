/**
 * WebSocket Test Fixtures Index
 *
 * Import all fixtures for use in Playwright tests.
 *
 * Usage:
 * ```typescript
 * import { WS_FIXTURES } from '../fixtures/ws';
 *
 * const trigger = WS_FIXTURES.triggers.diagram_high_confidence;
 * ```
 */

import canvasTriggers from './canvas-triggers.json';
import metrics from './metrics.json';
import messages from './messages.json';
import errors from './errors.json';

export const WS_FIXTURES = {
  triggers: canvasTriggers,
  metrics,
  messages,
  errors
} as const;

// Type exports for TypeScript
export type CanvasTriggerFixture = typeof canvasTriggers[keyof typeof canvasTriggers];
export type MetricsFixture = typeof metrics[keyof typeof metrics];
export type MessageFixture = typeof messages[keyof typeof messages];
export type ErrorFixture = typeof errors[keyof typeof errors];

// Helper functions
export function getTriggerByConfidence(minConfidence: number) {
  return Object.values(canvasTriggers).filter(
    (t: any) => t.canvas_trigger?.confidence >= minConfidence
  );
}

export function getMetricsWithField(field: string) {
  return Object.values(metrics).filter(
    (m: any) => m.metrics?.[field] !== undefined
  );
}
