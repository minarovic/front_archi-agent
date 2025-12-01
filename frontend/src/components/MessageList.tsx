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
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-primary-dark text-white'
            : isError
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-gray-100 text-gray-800'
        } ${isPartial ? 'animate-pulse' : ''}`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>

          {/* FE-006: Follow-up Badge */}
          {showFollowUp && (
            <FollowUpBadge className="flex-shrink-0 mt-0.5" />
          )}
        </div>

        {message.toolName && (
          <p className="text-xs mt-1 opacity-70">🔧 {message.toolName}</p>
        )}
      </div>
    </div>
  );
}
