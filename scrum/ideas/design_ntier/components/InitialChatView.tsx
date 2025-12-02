'use client';

import { useState } from 'react';

interface InitialChatViewProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const EXAMPLE_PROMPTS = [
  'Flídr plast tier 2 suppliers',
  'Lear Corporation ownership structure',
  'Compare Bosch and ZF supply chains',
  'Robert Bosch financial risk',
];

export default function InitialChatView({ onSendMessage, isLoading }: InitialChatViewProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0E3A2F] mb-4">
          Supply Chain Intelligence
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Ready to analyze supply chains
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Ask about suppliers, ownership structures, or compare companies
        </p>
      </div>

      {/* Example Prompts (Pills) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl w-full">
        {EXAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(prompt)}
            disabled={isLoading}
            className="px-5 py-3 bg-white border border-gray-300 text-left text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💬 {prompt}
          </button>
        ))}
      </div>

      {/* Large Centered Input */}
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about suppliers, risks, or tiers..."
            disabled={isLoading}
            className="flex-1 p-4 border border-gray-300 focus:outline-none focus:border-[#0E3A2F] disabled:bg-gray-100 text-base text-gray-900 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-[#0E3A2F] text-white px-8 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-[#0E3A2F]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Branding */}
      <p className="text-xs text-gray-400 mt-8">
        Powered by Škoda Supply Chain Analytics
      </p>
    </div>
  );
}
