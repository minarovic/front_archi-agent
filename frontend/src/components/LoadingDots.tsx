// ============================================
// Props Interface
// ============================================

interface LoadingDotsProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// ============================================
// LoadingDots Component (FE-004 + Sprint 3.1 Design)
// ============================================

export function LoadingDots({
  text = 'Thinking...',
  size = 'md',
  color = 'var(--color-primary)'  // Škoda Green
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotClass = sizeClasses[size];

  return (
    <div className="thinking-dots" data-testid="loading-dots">
      <div
        className={`thinking-dot ${dotClass}`}
        style={{ backgroundColor: color, animationDelay: '0ms' }}
      />
      <div
        className={`thinking-dot ${dotClass}`}
        style={{ backgroundColor: color, animationDelay: '150ms' }}
      />
      <div
        className={`thinking-dot ${dotClass}`}
        style={{ backgroundColor: color, animationDelay: '300ms' }}
      />
      {text && (
        <span className="text-gray-500 ml-3 text-sm font-medium">{text}</span>
      )}
    </div>
  );
}

// ============================================
// Inline variant (no text, smaller)
// ============================================

export function LoadingDotsInline() {
  return (
    <span className="inline-flex items-center gap-1" data-testid="loading-dots-inline">
      <span
        className="w-1 h-1 rounded-full animate-bounce"
        style={{ backgroundColor: 'var(--color-primary)', animationDelay: '0ms' }}
      />
      <span
        className="w-1 h-1 rounded-full animate-bounce"
        style={{ backgroundColor: 'var(--color-primary)', animationDelay: '150ms' }}
      />
      <span
        className="w-1 h-1 rounded-full animate-bounce"
        style={{ backgroundColor: 'var(--color-primary)', animationDelay: '300ms' }}
      />
    </span>
  );
}

export default LoadingDots;
