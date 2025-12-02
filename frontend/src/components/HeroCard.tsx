import React from 'react';

// ============================================
// HeroCard Component - Supply Chain Style
// ============================================

interface MetricItem {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

interface HeroCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    value: string | number;
  };
  metrics?: MetricItem[];
  children?: React.ReactNode;
}

export function HeroCard({ title, subtitle, badge, metrics, children }: HeroCardProps) {
  return (
    <div className="bg-white overflow-hidden border-t-4 border-skoda-green border border-gray-200 animate-fade-in-scale">
      {/* Dark Header Section */}
      <div className="bg-skoda-dark px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-skoda-light text-sm font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Badge */}
          {badge && (
            <div className="bg-skoda-extra-dark px-4 py-2 border border-skoda-light">
              <p className="text-skoda-light text-xs uppercase tracking-wide mb-0.5">
                {badge.label}
              </p>
              <p className="text-white text-xl font-bold">
                {badge.value}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics && metrics.length > 0 && (
        <div className={`grid grid-cols-${Math.min(metrics.length, 4)} divide-x divide-gray-200 border-b border-gray-200`}>
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-4 text-center ${metric.highlight ? 'bg-gradient-to-br from-white to-gray-50' : ''}`}
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {metric.label}
              </p>
              <p className="text-3xl font-bold text-skoda-green mb-0.5">
                {metric.value}
              </p>
              {metric.subtext && (
                <p className="text-xs text-gray-400">
                  {metric.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Children content */}
      {children && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// MetricCard Component - Border-left accent
// ============================================

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function MetricCard({ label, value, description, icon, variant = 'default' }: MetricCardProps) {
  const borderColors = {
    default: 'border-skoda-green',
    success: 'border-green-500',
    warning: 'border-orange-500',
    danger: 'border-red-500',
  };

  const valueColors = {
    default: 'text-skoda-green',
    success: 'text-green-600',
    warning: 'text-orange-500',
    danger: 'text-red-600',
  };

  return (
    <div className={`bg-white p-5 shadow-sm border-l-4 ${borderColors[variant]} animate-slide-in-up`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className={`text-3xl font-bold ${valueColors[variant]} mb-1`}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

export default HeroCard;
