import { Message } from '../types';

interface Props {
  messages: Message[];
}

export function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-2xl mb-2">👋</p>
        <p className="font-medium">Hi! I'm the MCOP Explorer Agent.</p>
        <p className="text-sm mt-2">Ask me about tables, columns, or relationships.</p>
        <div className="mt-6 text-sm text-left max-w-xs mx-auto">
          <p className="font-medium mb-2">Try asking:</p>
          <ul className="space-y-1 text-gray-600">
            <li>• "List all tables"</li>
            <li>• "What columns does factv_purchase_order have?"</li>
            <li>• "Find columns with 'supplier' in the name"</li>
            <li>• "What are the relationships?"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user';
  const isPartial = message.type === 'agent_partial';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : isError
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-gray-100 text-gray-800'
        } ${isPartial ? 'animate-pulse' : ''}`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        {message.toolName && (
          <p className="text-xs mt-1 opacity-70">🔧 {message.toolName}</p>
        )}
      </div>
    </div>
  );
}
