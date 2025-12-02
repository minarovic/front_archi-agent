import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { MermaidDiagram } from './MermaidDiagram';
import { ViewModeToggle } from './ViewModeToggle';
import { MetricsHeader, MetricsUnavailable, pipelineMetricsToItems } from './MetricsHeader';
import { LoadingDots } from './LoadingDots';
import { ViewMode, PipelineMetrics } from '../types';

interface CanvasProps {
  metrics?: PipelineMetrics | null;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  isCanvasLoading?: boolean;
}

export function Canvas({ metrics, viewMode: controlledViewMode, onViewModeChange, isCanvasLoading }: CanvasProps) {
  const { diagram, isLoading } = useChatStore();
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('diagram');

  // Use controlled viewMode if provided, otherwise use internal state
  const viewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = onViewModeChange ?? setInternalViewMode;

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
  }, [setViewMode]);

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
              This usually takes 5-10 seconds
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
              Copy Mermaid
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
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        </div>
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
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-600 mb-2">Table List View</p>
        <p className="text-sm max-w-xs text-gray-500">
          Table list view will be available after running analysis
        </p>
      </div>
    </div>
  );
}
