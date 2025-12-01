/**
 * Type definitions for MCOP Frontend
 */

// ============================================
// View Types (FE-002, FE-003)
// ============================================

export type ViewType = 'er_diagram' | 'table_list' | 'relationship_graph';
export type ViewMode = 'table' | 'diagram';

// ============================================
// Canvas Trigger (FE-002)
// ============================================

export interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: ViewType;
  entity_name?: string;
  query?: string;
  reason: string;
  confidence?: number;  // 0.0-1.0, FE auto-switches only if >= 0.6
  trace_id?: string;
  latency_ms?: number;
}

// ============================================
// Pipeline Metrics (FE-005)
// ============================================

export interface PipelineMetrics {
  total_tables: number;
  total_columns: number;
  facts_count: number;
  dimensions_count: number;
  quality_score?: number | null;  // 0-100, nullable
  relationships_count?: number;
  schema_name?: string;
  as_of?: string;        // ISO timestamp of data snapshot
  is_stale?: boolean;    // true if data older than 1 hour
}

// ============================================
// Messages
// ============================================

export interface Message {
  id: string;
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp: Date;
  toolName?: string;
  isFollowUp?: boolean;  // FE-006: Follow-up indicator
  canvas_trigger?: CanvasTrigger;  // FE-002
  metrics?: PipelineMetrics;       // FE-005
}

export interface SessionState {
  sessionId: string | null;
  isConnected: boolean;
  messages: Message[];
  diagram: string | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Table & Schema Types
// ============================================

export interface TableSummary {
  name: string;
  full_name: string;
  table_type: string;
  schema: string | null;
  description: string;
  column_count: number;
  confidence: number;
}

export interface SchemaInfo {
  name: string;
  total_views: number;
  dimensions: number;
  facts: number;
  relations: number;
}

export interface PipelineStatus {
  session_id: string;
  status: string;
  current_step: string | null;
  has_result: boolean;
  has_diagram: boolean;
  error: string | null;
}

// ============================================
// Metrics Header Types (FE-005)
// ============================================

export interface MetricItem {
  label: string;
  value: number | string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

// ============================================
// Confirm Chip (FE-002 - for low confidence triggers)
// ============================================

export interface ConfirmChipData {
  message: string;
  viewType: ViewType;
  onConfirm: () => void;
  onDismiss: () => void;
}
