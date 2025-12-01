// ============================================
// Props Interface
// ============================================

interface LoadingDotsProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// ============================================
// LoadingDots Component (FE-004)
// ============================================

export function LoadingDots({
  text = 'Thinking...',
  size = 'md',
  color = '#4BA82E'  // primary accent
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotClass = sizeClasses[size];

  return (
    <div className="flex items-center space-x-2" data-testid="loading-dots">
      <div
        className={`${dotClass} rounded-full animate-bounce`}
        style={{ backgroundColor: color, animationDelay: '0ms' }}
      />
      <div
        className={`${dotClass} rounded-full animate-bounce`}
        style={{ backgroundColor: color, animationDelay: '150ms' }}
      />
      <div
        className={`${dotClass} rounded-full animate-bounce`}
        style={{ backgroundColor: color, animationDelay: '300ms' }}
      />
      {text && (
        <span className="text-gray-500 ml-2 text-sm">{text}</span>
      )}
    </div>
  );
}

// ============================================
// Inline variant (no text, smaller)
// ============================================

export function LoadingDotsInline() {
  return (
    <span className="inline-flex items-center space-x-1" data-testid="loading-dots-inline">
      <span
        className="w-1 h-1 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-1 h-1 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1 h-1 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </span>
  );
}

export default LoadingDots;
