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
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
          Metadata Copilot
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Explore your data catalog with natural language
        </p>
      </div>

      {/* Example Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl w-full">
        {EXAMPLE_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(prompt.text)}
            disabled={isLoading}
            className="px-5 py-4 bg-white border border-gray-300 rounded-lg text-left
                       hover:border-primary hover:shadow-md transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-primary/20"
            data-testid={`example-prompt-${index}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{prompt.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{prompt.text}</p>
                <p className="text-xs text-gray-500 mt-1">{prompt.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your metadata..."
            disabled={isLoading}
            className="flex-1 p-4 border border-gray-300 rounded-lg
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       disabled:bg-gray-100"
            data-testid="initial-input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold
                       hover:bg-primary-muted transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="initial-submit"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Load Document Button */}
      <div className="mt-6">
        <button
          onClick={onLoadDocument}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 border-2 border-primary
                     text-primary rounded-lg font-medium
                     hover:bg-primary hover:text-white transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="load-document-button"
        >
          <span>📄</span>
          <span>Load Sample Document</span>
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Loads pre-configured business request for demo
        </p>
      </div>
    </div>
  );
}

export default InitialView;
