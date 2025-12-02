import { Message } from '../types';
import { FollowUpBadge } from './FollowUpBadge';
import { isFollowUpMessage } from '../utils/detectFollowUp';

interface Props {
  messages: Message[];
}

export function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return null; // InitialView will be shown instead
  }

  return (
    <div className="space-y-4" data-testid="message-list">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          messageIndex={index}
        />
      ))}
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  messageIndex: number;
}

function MessageBubble({ message, messageIndex }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isPartial = message.type === 'agent_partial';
  const isError = message.type === 'error';

  // FE-006: Detect follow-up (prefer backend flag, fallback to client-side)
  const showFollowUp = isUser && (
    message.isFollowUp || isFollowUpMessage(message.content, messageIndex)
  );

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`${message.type}-message`}
    >
      <div
        className={`max-w-[85%] px-5 py-3 border ${
          isUser
            ? 'bg-white text-gray-900 border-gray-200'
            : isError
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-white text-gray-900 border-gray-200'
        } ${isPartial ? 'animate-pulse' : ''}`}
      >
        {/* Role Label */}
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
          isUser ? 'text-skoda-green' : isError ? 'text-red-600' : 'text-gray-500'
        }`}>
          {isUser ? 'You' : 'Assistant'}
        </p>

        <div className="flex items-start justify-between gap-2">
          <p className="message-text">{message.content}</p>

          {/* FE-006: Follow-up Badge */}
          {showFollowUp && (
            <FollowUpBadge className="flex-shrink-0 mt-0.5" />
          )}
        </div>

        {message.toolName && (
          <p className="text-xs mt-2 opacity-70">Tool: {message.toolName}</p>
        )}
      </div>
    </div>
  );
}
