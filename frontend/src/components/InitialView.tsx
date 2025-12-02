import React, { useState } from 'react';

// ============================================
// Example Prompts (MCOP specific)
// ============================================

const EXAMPLE_PROMPTS = [
  "Show me all FACT tables in dm_bs_purchase schema",
  "What are the relationships for factv_purchase_order?",
  "Generate an ER diagram for the Purchase domain",
  "Analyze data quality issues in gold layer",
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
// InitialView Component - Supply Chain Design Style
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
      <div className="text-center mb-8 max-w-2xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-skoda-dark mb-4">
          Metadata Copilot
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Explore your data catalog with natural language
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Ask about tables, columns, relationships, or data quality
        </p>
      </div>

      {/* Example Prompts Grid - Supply Chain Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl w-full animate-slide-in-up">
        {EXAMPLE_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(prompt)}
            disabled={isLoading}
            className="px-5 py-3 bg-white border border-gray-300 text-left text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors"
            data-testid={`example-prompt-${index}`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Large Centered Input - Supply Chain Style */}
      <div className="w-full max-w-2xl animate-slide-in-up" style={{ animationDelay: '100ms' }}>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tables, schemas, or relationships..."
            disabled={isLoading}
            className="flex-1 p-4 border border-gray-300 focus:outline-none focus:border-skoda-dark disabled:bg-gray-100 text-base text-gray-900 placeholder:text-gray-400"
            data-testid="initial-input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-skoda-dark text-white px-8 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-skoda-dark hover:opacity-90 transition-opacity"
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

      {/* Load Document Section */}
      <div className="flex flex-col items-center gap-2 mt-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <button
          onClick={onLoadDocument}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="load-document-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span>Load Sample Document</span>
        </button>
        <p className="text-xs text-gray-400">
          Pre-configured business request for demo
        </p>
      </div>

      {/* Footer Branding */}
      <p className="text-xs text-gray-400 mt-12">
        Powered by MCOP Pipeline
      </p>
    </div>
  );
}

export default InitialView;
