# MCOP-FE-003: View Mode Toggle

**Priorita:** 🟡 P2 (Should Have)
**Effort:** 15 minút
**Status:** planned
**Závislosť:** MCOP-FE-002 (Canvas Trigger)

---

## 📋 User Story

> Ako používateľ chcem manuálne prepínať medzi Table view a Diagram view v Canvas paneli, aby som videl dáta v preferovanom formáte.

---

## ✅ Acceptance Criteria

- [ ] AC1: Toggle buttons "📊 Table" a "🔗 Diagram" v Canvas header
- [ ] AC2: Aktívny button má zelený accent (`bg-[#4BA82E]`)
- [ ] AC3: Neaktívny button má biely background s border
- [ ] AC4: Klik prepne view a uloží preference
- [ ] AC5: Toggle je disabled počas loading stavu
- [ ] AC6: Keyboard shortcut: `T` pre Table, `D` pre Diagram

---

## 🎨 Design Špecifikácia

### Toggle Buttons

```
┌─────────────────────────────────────────────┐
│ Canvas                    [📊 Table] [🔗 Diagram] │
├─────────────────────────────────────────────┤
│                                             │
│              (Content Area)                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Stavy

**Aktívny button:**
```css
bg-[#4BA82E] text-white border border-[#4BA82E] font-semibold
```

**Neaktívny button:**
```css
bg-white text-gray-700 border border-gray-300 hover:border-[#4BA82E]
```

**Disabled:**
```css
opacity-50 cursor-not-allowed
```

---

## 🔧 Technická Implementácia

### Nový komponent: `src/components/ViewModeToggle.tsx`

```typescript
import React from 'react';

export type ViewMode = 'table' | 'diagram';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  disabled?: boolean;
}

export function ViewModeToggle({ value, onChange, disabled }: ViewModeToggleProps) {
  const baseClasses = `
    px-4 py-2 text-sm font-semibold rounded-lg transition-all
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const activeClasses = 'bg-[#4BA82E] text-white border border-[#4BA82E]';
  const inactiveClasses = 'bg-white text-gray-700 border border-gray-300 hover:border-[#4BA82E]';

  return (
    <div className="flex gap-2" role="group" aria-label="View mode">
      <button
        onClick={() => onChange('table')}
        disabled={disabled}
        className={`${baseClasses} ${value === 'table' ? activeClasses : inactiveClasses}`}
        aria-pressed={value === 'table'}
      >
        📊 Table
      </button>
      <button
        onClick={() => onChange('diagram')}
        disabled={disabled}
        className={`${baseClasses} ${value === 'diagram' ? activeClasses : inactiveClasses}`}
        aria-pressed={value === 'diagram'}
      >
        🔗 Diagram
      </button>
    </div>
  );
}
```

### Integrácia do Canvas.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { ViewModeToggle, ViewMode } from './ViewModeToggle';
import { MermaidDiagram } from './MermaidDiagram';
import { TableListView } from './TableListView';

interface CanvasProps {
  diagram?: string;
  tables?: TableSummary[];
  isLoading?: boolean;
}

export function Canvas({ diagram, tables, isLoading }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('diagram');

  // Keyboard shortcuts
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

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      {/* Header with Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0E3A2F]">Canvas</h2>
        <ViewModeToggle
          value={viewMode}
          onChange={setViewMode}
          disabled={isLoading}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {viewMode === 'diagram' ? (
          <MermaidDiagram code={diagram} />
        ) : (
          <TableListView tables={tables} />
        )}
      </div>
    </div>
  );
}
```

### Keyboard Shortcut Tooltip

```typescript
// Pridať tooltip s klávesovou skratkou
<button
  title="Table View (T)"
  // ...
>
  📊 Table
</button>
<button
  title="Diagram View (D)"
  // ...
>
  🔗 Diagram
</button>
```

---

## 🧪 Playwright Test Scenáre

### Test Suite: `tests/e2e/view-toggle.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('View Mode Toggle', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to chat view
    await page.fill('input[placeholder*="Ask anything"]', 'Show tables');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="canvas"]');
  });

  test('should toggle between Table and Diagram views', async ({ page }) => {
    // Default should be Diagram
    const diagramBtn = page.getByRole('button', { name: /Diagram/i });
    await expect(diagramBtn).toHaveClass(/bg-\[#4BA82E\]/);

    // Click Table
    await page.click('button:has-text("Table")');

    // Table should be active
    const tableBtn = page.getByRole('button', { name: /Table/i });
    await expect(tableBtn).toHaveClass(/bg-\[#4BA82E\]/);

    // Diagram should be inactive
    await expect(diagramBtn).not.toHaveClass(/bg-\[#4BA82E\]/);
  });

  test('keyboard shortcut T should switch to Table view', async ({ page }) => {
    // Press T
    await page.keyboard.press('t');

    // Table should be active
    const tableBtn = page.getByRole('button', { name: /Table/i });
    await expect(tableBtn).toHaveClass(/bg-\[#4BA82E\]/);
  });

  test('keyboard shortcut D should switch to Diagram view', async ({ page }) => {
    // First switch to Table
    await page.click('button:has-text("Table")');

    // Press D
    await page.keyboard.press('d');

    // Diagram should be active
    const diagramBtn = page.getByRole('button', { name: /Diagram/i });
    await expect(diagramBtn).toHaveClass(/bg-\[#4BA82E\]/);
  });

});
```

---

## 📦 Deliverables

| Súbor                               | Akcia                   |
| ----------------------------------- | ----------------------- |
| `src/components/ViewModeToggle.tsx` | **Vytvoriť**            |
| `src/components/Canvas.tsx`         | Upraviť - pridať toggle |
| `tests/e2e/view-toggle.spec.ts`     | **Vytvoriť**            |

---

## ✅ Definition of Done

- [ ] Toggle komponent implementovaný
- [ ] Keyboard shortcuts fungujú (T/D)
- [ ] Aktívny/neaktívny stav vizuálne odlíšený
- [ ] 3 Playwright testy prechádzajú
- [ ] Accessible (ARIA labels)
