import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { MermaidDiagram } from './MermaidDiagram';
import { ViewModeToggle } from './ViewModeToggle';
import { MetricsHeader, MetricsUnavailable, pipelineMetricsToItems } from './MetricsHeader';
import { LoadingDots } from './LoadingDots';
import { ViewMode, PipelineMetrics } from '../types';

interface CanvasProps {
  metrics?: PipelineMetrics | null;
  isCanvasLoading?: boolean;
}

export function Canvas({ metrics, isCanvasLoading }: CanvasProps) {
  const { diagram, isLoading } = useChatStore();
  const [viewMode, setViewMode] = useState<ViewMode>('diagram');

  // Keyboard shortcuts (T for Table, D for Diagram)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key.toLowerCase() === 't') {
        setViewMode('table');
      } else if (e.key.toLowerCase() === 'd') {
        setViewMode('diagram');
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleCopy = () => {
    if (diagram) {
      navigator.clipboard.writeText(diagram);
    }
  };

  // Show loading state
  if (isCanvasLoading || (isLoading && !diagram)) {
    return (
      <div className="h-full flex flex-col bg-gray-50" data-testid="canvas">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <h2 className="text-xl font-bold text-skoda-dark">Canvas</h2>
          <ViewModeToggle value={viewMode} onChange={setViewMode} disabled />
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center card px-12 py-10">
            <LoadingDots text="Generating diagram..." size="lg" />
            <p className="text-sm mt-6 text-gray-500">
              🤔 This usually takes 5-10 seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50" data-testid="canvas">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-xl font-bold text-skoda-dark">Canvas</h2>
        <div className="flex items-center gap-4">
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
          {diagram && (
            <button
              onClick={handleCopy}
              className="btn-secondary"
            >
              📋 Copy Mermaid
            </button>
          )}
        </div>
      </div>

      {/* Metrics Header (FE-005) */}
      <div className="p-4 pb-0">
        {metrics ? (
          <MetricsHeader
            title={metrics.schema_name || 'Data Analysis'}
            subtitle="Metadata Overview"
            totalBadge={{ label: 'Total', value: metrics.total_tables }}
            metrics={pipelineMetricsToItems(metrics)}
            isStale={metrics.is_stale}
            asOf={metrics.as_of}
          />
        ) : (
          <MetricsUnavailable />
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4" data-testid={`canvas-view-${viewMode}`}>
        {viewMode === 'diagram' ? (
          diagram ? (
            <MermaidDiagram diagram={diagram} />
          ) : (
            <EmptyState />
          )
        ) : (
          <TableListPlaceholder />
        )}
      </div>
    </div>
  );
}

// Empty state when no diagram
function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      <div className="text-center">
        <p className="text-6xl mb-4">📊</p>
        <p className="text-xl font-semibold text-gray-600 mb-2">No diagram yet</p>
        <p className="text-sm max-w-xs text-gray-500">
          Run the pipeline or ask about table relationships to generate an ER diagram
        </p>
      </div>
    </div>
  );
}

// Placeholder for table list view (to be implemented)
function TableListPlaceholder() {
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      <div className="text-center">
        <p className="text-6xl mb-4">📋</p>
        <p className="text-xl font-semibold text-gray-600 mb-2">Table List View</p>
        <p className="text-sm max-w-xs text-gray-500">
          Table list view will be available after running analysis
        </p>
      </div>
    </div>
  );
}
