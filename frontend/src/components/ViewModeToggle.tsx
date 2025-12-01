import { ViewMode } from '../types';

// ============================================
// Props Interface
// ============================================

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  disabled?: boolean;
}

// ============================================
// ViewModeToggle Component (FE-003)
// ============================================

export function ViewModeToggle({ value, onChange, disabled }: ViewModeToggleProps) {
  const baseClasses = `
    px-4 py-2 text-sm font-semibold rounded-lg transition-all
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary/20
  `;

  const activeClasses = 'bg-primary text-white border border-primary';
  const inactiveClasses = 'bg-white text-gray-700 border border-gray-300 hover:border-primary';

  return (
    <div className="flex gap-2" role="group" aria-label="View mode" data-testid="view-mode-toggle">
      <button
        onClick={() => onChange('table')}
        disabled={disabled}
        className={`${baseClasses} ${value === 'table' ? activeClasses : inactiveClasses}`}
        aria-pressed={value === 'table'}
        title="Table View (T)"
        data-testid="view-toggle-table"
      >
        📊 Table
      </button>
      <button
        onClick={() => onChange('diagram')}
        disabled={disabled}
        className={`${baseClasses} ${value === 'diagram' ? activeClasses : inactiveClasses}`}
        aria-pressed={value === 'diagram'}
        title="Diagram View (D)"
        data-testid="view-toggle-diagram"
      >
        🔗 Diagram
      </button>
    </div>
  );
}

export default ViewModeToggle;
