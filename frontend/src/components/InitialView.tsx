import React, { useState } from 'react';

// ============================================
// Example Prompts (MCOP specific)
// ============================================

const EXAMPLE_PROMPTS = [
  {
    icon: "📊",
    text: "Show me all FACT tables in dm_bs_purchase schema",
    description: "List fact tables with measures"
  },
  {
    icon: "🔗",
    text: "What are the relationships for factv_purchase_order?",
    description: "Explore table relationships"
  },
  {
    icon: "📈",
    text: "Generate an ER diagram for the Purchase domain",
    description: "Visualize data model"
  },
  {
    icon: "🔍",
    text: "Analyze data quality issues in gold layer",
    description: "Find quality problems"
  }
];

// ============================================
// Props Interface
// ============================================

interface InitialViewProps {
  onSubmit: (message: string) => void;
  onLoadDocument: () => void;
  isLoading?: boolean;
}

// ============================================
// InitialView Component (FE-001)
// ============================================

export function InitialView({ onSubmit, onLoadDocument, isLoading }: InitialViewProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  const handleExampleClick = (text: string) => {
    onSubmit(text);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8"
      data-testid="initial-view"
    >
      {/* Hero Section */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0E3A2F] mb-4">
          Metadata Copilot
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Explore your data catalog with natural language
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Start with an example or enter your own query
        </p>
      </div>

      {/* Example Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl w-full">
        {EXAMPLE_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(prompt.text)}
            disabled={isLoading}
            className="px-5 py-3 bg-white border border-gray-300 text-left text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid={`example-prompt-${index}`}
          >
            {prompt.icon} {prompt.text}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="w-full max-w-2xl mb-8">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your metadata..."
            disabled={isLoading}
            className="flex-1 p-4 border border-gray-300 focus:outline-none focus:border-[#0E3A2F] disabled:bg-gray-100 text-base text-gray-900 placeholder:text-gray-400"
            data-testid="initial-input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#0E3A2F] text-white px-8 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-[#0E3A2F]"
            data-testid="initial-submit"
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

      {/* Load Document Button */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onLoadDocument}
          disabled={isLoading}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="load-document-button"
        >
          <span className="text-lg">📄</span>
          <span className="text-sm font-medium text-gray-700">Load Sample Document</span>
        </button>
        <p className="text-xs text-gray-400">
          Pre-configured business request for demo
        </p>
      </div>
    </div>
  );
}

export default InitialView;
