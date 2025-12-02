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
// ViewModeToggle Component (FE-003 + Sprint 3.1 Design)
// ============================================

export function ViewModeToggle({ value, onChange, disabled }: ViewModeToggleProps) {
  return (
    <div className="flex" role="group" aria-label="View mode" data-testid="view-mode-toggle">
      <button
        onClick={() => onChange('table')}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          value === 'table' ? 'btn-toggle-active' : 'btn-toggle-inactive'
        }`}
        aria-pressed={value === 'table'}
        title="Table View (T)"
        data-testid="view-toggle-table"
      >
        📊 Table
      </button>
      <button
        onClick={() => onChange('diagram')}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed -ml-px ${
          value === 'diagram' ? 'btn-toggle-active' : 'btn-toggle-inactive'
        }`}
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
