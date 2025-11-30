/**
 * Type definitions for MCOP Frontend
 */

export interface Message {
  id: string;
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp: Date;
  toolName?: string;
}

export interface SessionState {
  sessionId: string | null;
  isConnected: boolean;
  messages: Message[];
  diagram: string | null;
  isLoading: boolean;
  error: string | null;
}

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
