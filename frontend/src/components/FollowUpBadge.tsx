// ============================================
// Props Interface
// ============================================

interface FollowUpBadgeProps {
  className?: string;
}

// ============================================
// FollowUpBadge Component (FE-006)
// ============================================

export function FollowUpBadge({ className = '' }: FollowUpBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        text-xs font-medium
        bg-blue-100 text-blue-700
        px-2 py-0.5 rounded
        ${className}
      `}
      title="This question uses context from the previous messages"
      data-testid="follow-up-badge"
    >
      <span>⚡</span>
      <span>Follow-up</span>
    </span>
  );
}

export default FollowUpBadge;
