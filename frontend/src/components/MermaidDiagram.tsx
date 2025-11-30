import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface Props {
  diagram: string | null;
}

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export function MermaidDiagram({ diagram }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        setError(null);
        // Clear previous diagram
        containerRef.current!.innerHTML = '';

        // Generate unique ID
        const id = `mermaid-${Date.now()}`;

        // Render
        const { svg } = await mermaid.render(id, diagram);
        containerRef.current!.innerHTML = svg;
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [diagram]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Failed to render diagram</p>
          <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto max-h-40">
            {diagram}
          </pre>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-auto p-4"
    />
  );
}
