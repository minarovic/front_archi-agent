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
// MetricsHeader Component (FE-005 + Sprint 3.1 Hero Pattern)
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
      className="hero-header overflow-hidden"
      data-testid="metrics-header"
    >
      {/* Dark Header */}
      <div className="hero-header-dark">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="hero-header-title">{title}</h2>
            {subtitle && (
              <p className="hero-header-subtitle">{subtitle}</p>
            )}
            {isStale && (
              <p className="text-yellow-300 text-xs mt-2 flex items-center gap-1">
                <span>⚠️</span>
                <span>Data may be stale</span>
                {asOf && <span>• Last updated: {new Date(asOf).toLocaleTimeString()}</span>}
              </p>
            )}
          </div>

          {totalBadge && (
            <div className="bg-skoda-extra-dark px-5 py-3 border border-skoda-light">
              <p className="text-skoda-light text-xs uppercase tracking-wider mb-1">
                {totalBadge.label}
              </p>
              <p className="text-white text-2xl font-bold">{totalBadge.value}</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 divide-x divide-gray-200 bg-white">
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
    <div className="p-5 text-center">
      <p className="metric-label">{label}</p>
      <p className="text-3xl font-bold text-skoda-green mb-1">{formatMetricValue(value)}</p>
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
    <div className="bg-white overflow-hidden border border-gray-200 animate-pulse" data-testid="metrics-skeleton">
      <div className="bg-gray-300 h-24" />
      <div className="grid grid-cols-4 divide-x divide-gray-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 text-center">
            <div className="h-3 bg-gray-200 w-16 mx-auto mb-3" />
            <div className="h-8 bg-gray-200 w-12 mx-auto" />
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
      className="bg-gray-50 border border-gray-200 p-6 text-center"
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
