/**
 * Follow-up detection utility (FE-006)
 * Client-side heuristic for detecting follow-up questions
 */

const FOLLOW_UP_INDICATORS = [
  /\b(that|this|it|these|those)\b/i,
  /\b(the same|also|too|more|another)\b/i,
  /\b(what about|how about|and|show me more)\b/i,
  /^(yes|no|ok|sure|please)\b/i,
  /^(can you|could you|would you)\b/i,
  /\b(mentioned|said|showed|listed)\b/i,
];

/**
 * Detect if a message is a follow-up based on content patterns
 * @param message - The message content to check
 * @param messageIndex - The index of the message in the conversation
 * @returns true if the message appears to be a follow-up
 */
export function isFollowUpMessage(message: string, messageIndex: number): boolean {
  // First message is never a follow-up
  if (messageIndex === 0) return false;

  // Check for follow-up indicators
  return FOLLOW_UP_INDICATORS.some(pattern => pattern.test(message));
}

/**
 * Detect follow-up with additional context
 * @param message - The message content
 * @param hasHistory - Whether there are previous messages in the session
 * @returns true if the message appears to be a follow-up
 */
export function isFollowUpWithContext(message: string, hasHistory: boolean): boolean {
  if (!hasHistory) return false;
  return FOLLOW_UP_INDICATORS.some(pattern => pattern.test(message.trim()));
}
