import React from 'react';

interface NarrativeCardProps {
  title?: string;
  content?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  companyName?: string;
}

/**
 * MCOP-123: NarrativeCard with loading state
 *
 * Shows LLM-generated narrative with progressive loading.
 * - Loading state: Spinner + "Generating AI insights..." message
 * - Success state: Display narrative text
 * - Empty state: Don't render (hidden)
 */
export function NarrativeCard({
  title = 'AI Analysis',
  content,
  icon,
  isLoading = false,
  companyName
}: NarrativeCardProps) {
  // Loading state: Show spinner + progress message
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-[#4BA82E] rounded-lg p-6 shadow-lg">
        <div className="flex items-start gap-4">
          {/* Spinner */}
          <div className="flex-shrink-0">
            <svg
              className="animate-spin h-6 w-6 text-[#4BA82E]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          {/* Loading message */}
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Generating AI insights{companyName ? ` for ${companyName}` : ''}...
            </p>
            <p className="text-sm text-gray-600 mb-1">
              🤖 LLM is analyzing the supply chain data and creating a narrative summary.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This may take up to 30 seconds. You can continue working with the data above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if content is empty
  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <div className="bg-white border-l-4 border-[#4BA82E] rounded-lg p-6 shadow-lg">
      <div className="flex items-start gap-3">
        {icon && <div className="text-2xl mt-0.5">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}
