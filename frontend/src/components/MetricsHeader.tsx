import { MetricItem, PipelineMetrics } from '../types';

// ============================================
// Props Interfaces
// ============================================

interface MetricsHeaderProps {
  title: string;
  subtitle?: string;
  totalBadge?: {
    label: string;
    value: number | string;
  };
  metrics: MetricItem[];
  isLoading?: boolean;
  isStale?: boolean;
  asOf?: string;
}

// ============================================
// Helper Functions
// ============================================

const formatMetricValue = (value: number | string | undefined | null): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value.toLocaleString();
  return value;
};

// ============================================
// MetricsHeader Component (FE-005)
// ============================================

export function MetricsHeader({
  title,
  subtitle,
  totalBadge,
  metrics,
  isLoading,
  isStale,
  asOf
}: MetricsHeaderProps) {
  if (isLoading) {
    return <MetricsHeaderSkeleton />;
  }

  return (
    <div
      className="bg-white overflow-hidden border-t-2 border-primary border border-gray-200 rounded-lg"
      data-testid="metrics-header"
    >
      {/* Dark Header */}
      <div className="bg-primary-dark px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
            {subtitle && (
              <p className="text-primary-light text-sm font-medium">{subtitle}</p>
            )}
            {isStale && (
              <p className="text-yellow-300 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>Data may be stale</span>
                {asOf && <span>• Last updated: {new Date(asOf).toLocaleTimeString()}</span>}
              </p>
            )}
          </div>

          {totalBadge && (
            <div className="bg-primary-muted px-4 py-2 rounded border border-primary-light">
              <p className="text-primary-light text-xs uppercase tracking-wide mb-0.5">
                {totalBadge.label}
              </p>
              <p className="text-white text-xl font-bold">{totalBadge.value}</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={`grid grid-cols-${Math.min(metrics.length, 4)} divide-x divide-gray-200 border-b border-gray-200`}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// MetricCard Sub-component
// ============================================

function MetricCard({ label, value, trend }: MetricItem) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-400',
  };

  const trendIcon = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className="p-4 text-center bg-gradient-to-br from-white to-gray-50">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-primary mb-1">{formatMetricValue(value)}</p>
      {trend && (
        <div className={`flex items-center justify-center gap-1 text-xs ${trendColor[trend.direction]}`}>
          <span>{trendIcon[trend.direction]}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Skeleton Loading State
// ============================================

function MetricsHeaderSkeleton() {
  return (
    <div className="bg-white overflow-hidden border border-gray-200 rounded-lg animate-pulse" data-testid="metrics-skeleton">
      <div className="bg-gray-200 h-20" />
      <div className="grid grid-cols-4 divide-x divide-gray-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 text-center">
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-2" />
            <div className="h-8 bg-gray-200 rounded w-12 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Metrics Unavailable State
// ============================================

export function MetricsUnavailable() {
  return (
    <div
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"
      data-testid="metrics-unavailable"
    >
      <p className="text-gray-500 text-sm">
        📊 Metrics will appear after analysis
      </p>
    </div>
  );
}

// ============================================
// Helper: Convert PipelineMetrics to MetricItem[]
// ============================================

export function pipelineMetricsToItems(metrics: PipelineMetrics): MetricItem[] {
  return [
    {
      label: 'Tables',
      value: metrics.total_tables,
    },
    {
      label: 'Columns',
      value: metrics.total_columns,
    },
    {
      label: 'Quality',
      value: metrics.quality_score != null ? `${metrics.quality_score}%` : '—',
    },
    {
      label: 'Relationships',
      value: metrics.relationships_count ?? '—',
    },
  ];
}

export default MetricsHeader;
