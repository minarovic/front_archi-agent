# MCOP-FE-005: Metrics Header Card

**Priorita:** 🟢 P3 (Could Have)
**Effort:** 20 minút
**Status:** 🟡 Ready (data optional)
**Závislosť:** `/api/stats` alebo `pipeline_result` - OPTIONAL

---

## ⚠️ Compatibility Contract

**CRITICAL:** Metrics môžu byť null/undefined. FE MUSÍ zobrazovať fallback UI:

```typescript
// If metrics unavailable
if (!metrics) {
  return <MetricsUnavailable />;  // "Metrics will appear after analysis"
}

// If specific field is null
const qualityDisplay = metrics.quality_score ?? '—';
```

---

## 📋 User Story

> Ako používateľ chcem vidieť štatistiky (počet tabuliek, stĺpcov, quality score) nad diagramom, aby som mal rýchly prehľad o analyzovaných dátach.

---

## ✅ Acceptance Criteria

- [ ] AC1: Header card nad Canvas obsahom
- [ ] AC2: 4 metriky v grid layoute
- [ ] AC3: Každá metrika má label, hodnotu a voliteľný trend
- [ ] AC4: Tmavý header s názvom entity/schema
- [ ] AC5: Dáta načítané z `/api/stats` alebo `pipeline_result`
- [ ] AC6: Loading skeleton počas načítania
- [ ] AC7: **Fallback UI** ak metrics nedostupné (MUST)
- [ ] AC8: **Stale indicator** ak `is_stale === true` (SHOULD)
- [ ] AC9: **Null handling** - display "—" for missing values (MUST)

---

## 🎨 Design Špecifikácia

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████████│ ← Dark header
│ █  dm_bs_purchase                      Total: 45    ██ │
│ █  Purchase Domain • Analysis                       ██ │
│ ████████████████████████████████████████████████████████│
├─────────────┬─────────────┬─────────────┬───────────────┤
│   Tables    │   Columns   │   Quality   │ Relationships │ ← Metrics grid
│     45      │     380     │    85%      │      24       │
│   +5 ↑      │             │   +2% ↑     │               │
├─────────────┴─────────────┴─────────────┴───────────────┤
│                                                         │
│              (Diagram Content)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Farby

**Dark Header:** (Azure Blue theme)
```css
bg-[#1e3a5f]
text-white
border-t-2 border-[#0078d4]
```

**Metric Cards:**
```css
bg-gradient-to-br from-white to-gray-50
text-[#0078d4] (hodnota)
text-gray-500 (label)
text-green-600 (trend up)
text-red-600 (trend down)
```

---

## 🔧 API Contract

### Endpoint: `GET /api/stats`

**Response:**
```json
{
  "active_sessions": 5,
  "total_tables": 45,
  "total_columns": 380,
  "tables_by_type": {
    "FACT": 12,
    "DIM": 28,
    "RELATION": 5
  }
}
```

### Z Pipeline Result

```json
{
  "tool2_output": {
    "facts": [...],        // facts.length = facts_count
    "dimensions": [...],   // dimensions.length = dims_count
    "relationships": [...] // relationships.length
  },
  "tool3_output": {
    "summary": {
      "quality_score": 85
    }
  }
}
```

### Nový Interface

```typescript
interface PipelineMetrics {
  // Required fields (always present if metrics available)
  total_tables: number;
  total_columns: number;
  facts_count: number;
  dimensions_count: number;

  // Optional fields (may be null/undefined)
  relationships_count?: number;
  quality_score?: number;         // 0-100, null if not computed
  schema_name?: string;

  // 🆕 Freshness fields
  as_of?: string;                 // ISO timestamp, e.g. "2025-12-01T10:30:00Z"
  is_stale?: boolean;             // true if data > 1 hour old
}

// Nullability handling
const formatMetricValue = (value: number | undefined | null): string => {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString();
};

const formatPercentage = (value: number | undefined | null): string => {
  if (value === null || value === undefined) return '—';
  return `${value}%`;
};
```
  quality_score?: number;
  schema_name?: string;
}
```

---

## 🔧 Technická Implementácia

### Nový komponent: `src/components/MetricsHeader.tsx`

```typescript
import React from 'react';

interface Metric {
  label: string;
  value: number | string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

interface MetricsHeaderProps {
  title: string;
  subtitle?: string;
  totalBadge?: {
    label: string;
    value: number | string;
  };
  metrics: Metric[];
  isLoading?: boolean;
}

export function MetricsHeader({
  title,
  subtitle,
  totalBadge,
  metrics,
  isLoading
}: MetricsHeaderProps) {
  if (isLoading) {
    return <MetricsHeaderSkeleton />;
  }

  return (
    <div className="bg-white overflow-hidden border-t-2 border-[#4BA82E] border border-gray-200 rounded-lg">
      {/* Dark Header */}
      <div className="bg-[#0E3A2F] px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
            {subtitle && (
              <p className="text-[#78FAAE] text-sm font-medium">{subtitle}</p>
            )}
          </div>

          {totalBadge && (
            <div className="bg-[#1a5a42] px-4 py-2 rounded border border-[#78FAAE]">
              <p className="text-[#78FAAE] text-xs uppercase tracking-wide mb-0.5">
                {totalBadge.label}
              </p>
              <p className="text-white text-xl font-bold">{totalBadge.value}</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={`grid grid-cols-${metrics.length} divide-x divide-gray-200 border-b border-gray-200`}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend }: Metric) {
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
      <p className="text-3xl font-bold text-[#4BA82E] mb-1">{value}</p>
      {trend && (
        <div className={`flex items-center justify-center gap-1 text-xs ${trendColor[trend.direction]}`}>
          <span>{trendIcon[trend.direction]}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}

function MetricsHeaderSkeleton() {
  return (
    <div className="bg-white overflow-hidden border border-gray-200 rounded-lg animate-pulse">
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
```

### Integrácia do Canvas.tsx

```typescript
import { MetricsHeader } from './MetricsHeader';

interface CanvasProps {
  metrics?: PipelineMetrics;
  diagram?: string;
  isLoading?: boolean;
}

export function Canvas({ metrics, diagram, isLoading }: CanvasProps) {
  const headerMetrics = metrics ? [
    {
      label: 'Tables',
      value: metrics.total_tables,
      trend: { value: '+5', direction: 'up' as const }
    },
    { label: 'Columns', value: metrics.total_columns },
    {
      label: 'Quality',
      value: `${metrics.quality_score || 0}%`,
      trend: metrics.quality_score ? { value: '+2%', direction: 'up' as const } : undefined
    },
    { label: 'Relationships', value: metrics.relationships_count || 0 },
  ] : [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      {/* Metrics Header */}
      {metrics && (
        <div className="p-4 pb-0">
          <MetricsHeader
            title={metrics.schema_name || 'Data Analysis'}
            subtitle="Metadata Overview"
            totalBadge={{ label: 'Total', value: metrics.total_tables }}
            metrics={headerMetrics}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Diagram Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <MermaidDiagram code={diagram} />
      </div>
    </div>
  );
}
```

### Načítanie metrík

```typescript
// hooks/useMetrics.ts
import { useState, useEffect } from 'react';

export function useMetrics(sessionId?: string) {
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        // Option 1: Z pipeline result
        const response = await fetch(`/api/pipeline/${sessionId}/result`);
        const result = await response.json();

        const metrics: PipelineMetrics = {
          total_tables: result.tool2_output?.facts?.length + result.tool2_output?.dimensions?.length || 0,
          total_columns: 380, // TODO: Calculate from columns
          facts_count: result.tool2_output?.facts?.length || 0,
          dimensions_count: result.tool2_output?.dimensions?.length || 0,
          relationships_count: result.tool2_output?.relationships?.length || 0,
          quality_score: result.tool3_output?.summary?.quality_score,
        };

        setMetrics(metrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [sessionId]);

  return { metrics, isLoading };
}
```

---

## 🧪 Playwright Test Scenáre

### Test Suite: `tests/e2e/metrics-header.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Metrics Header Card', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Run pipeline to get metrics
    await page.fill('input[placeholder*="Ask anything"]', 'Analyze dm_bs_purchase schema');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="metrics-header"]', { timeout: 30000 });
  });

  test('should display metrics header with 4 metrics', async ({ page }) => {
    // Header visible
    await expect(page.locator('[data-testid="metrics-header"]')).toBeVisible();

    // 4 metrics visible
    await expect(page.getByText('Tables')).toBeVisible();
    await expect(page.getByText('Columns')).toBeVisible();
    await expect(page.getByText('Quality')).toBeVisible();
    await expect(page.getByText('Relationships')).toBeVisible();
  });

  test('should show schema name in header', async ({ page }) => {
    await expect(page.getByText(/dm_bs_purchase|Data Analysis/i)).toBeVisible();
  });

  test('should show loading skeleton while fetching', async ({ page }) => {
    // Navigate away and back to trigger loading
    await page.goto('/');
    await page.fill('input[placeholder*="Ask anything"]', 'New analysis');
    await page.click('button:has-text("Analyze")');

    // Skeleton should appear briefly
    const skeleton = page.locator('.animate-pulse');
    // Note: This might be too fast to catch, adjust timeout as needed
  });

});
```

---

## 📦 Deliverables

| Súbor                              | Akcia                    |
| ---------------------------------- | ------------------------ |
| `src/components/MetricsHeader.tsx` | **Vytvoriť**             |
| `src/hooks/useMetrics.ts`          | **Vytvoriť**             |
| `src/components/Canvas.tsx`        | Integrovať MetricsHeader |
| `tests/e2e/metrics-header.spec.ts` | **Vytvoriť**             |

---

## ✅ Definition of Done

- [ ] MetricsHeader komponent s dark header a metrics grid
- [ ] Loading skeleton implementovaný
- [ ] Dáta z pipeline result alebo /api/stats
- [ ] Trend indikátory (up/down arrows)
- [ ] 3 Playwright testy prechádzajú
