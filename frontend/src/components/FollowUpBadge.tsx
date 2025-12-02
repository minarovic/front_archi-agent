// ============================================
// Props Interface
// ============================================

interface FollowUpBadgeProps {
  className?: string;
}

// ============================================
// FollowUpBadge Component (FE-006 + Sprint 3.1 Design)
// ============================================

export function FollowUpBadge({ className = '' }: FollowUpBadgeProps) {
  return (
    <span
      className={`badge-followup ${className}`}
      title="This question uses context from the previous messages"
      data-testid="follow-up-badge"
    >
      <span>⚡</span>
      <span>Follow-up</span>
    </span>
  );
}

export default FollowUpBadge;
