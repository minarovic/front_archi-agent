# MCOP-FE-001: InitialView s Example Prompts

**Priorita:** 🔴 P1 (Must Have)
**Effort:** 30 minút
**Status:** planned
**Závislosť:** žiadna

---

## 📋 User Story

> Ako používateľ chcem vidieť úvodnú obrazovku s príkladmi otázok, aby som vedel, čo môžem aplikáciu spýtať a rýchlo začal.

---

## ✅ Acceptance Criteria

- [ ] AC1: Úvodná obrazovka sa zobrazí keď `messages.length === 0`
- [ ] AC2: Hero sekcia s názvom "Metadata Copilot" a subtitulom
- [ ] AC3: Grid s 4 example prompts (kliknuteľné)
- [ ] AC4: Veľký centrovaný input s tlačidlom "Analyze"
- [ ] AC5: Mock "Upload" tlačidlo (hardcoded dokument)
- [ ] AC6: Klik na example prompt vyplní input a odošle
- [ ] AC7: Po odoslaní sa InitialView skryje a zobrazí chat

---

## 🎨 Design Špecifikácia

### Layout
```
┌─────────────────────────────────────────────┐
│                                             │
│         🔍 Metadata Copilot                 │
│    Explore your data with natural language  │
│                                             │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Example 1   │  │ Example 2   │          │
│  └─────────────┘  └─────────────┘          │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Example 3   │  │ Example 4   │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Type your question...              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│          [ 📄 Load Sample Document ]        │
│                                             │
└─────────────────────────────────────────────┘
```

### Farebná schéma
- Background: `bg-gradient-to-b from-gray-50 to-white`
- Hero title: `text-[#0E3A2F]` (primary-dark)
- Example cards: `bg-white border border-gray-300 hover:border-[#4BA82E]`
- CTA button: `bg-[#0E3A2F] text-white`
- Upload button: `border border-[#4BA82E] text-[#4BA82E]`

---

## 📝 Example Prompts (MCOP špecifické)

```typescript
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
```

---

## 🔧 Technická Implementácia

### Nový súbor: `src/components/InitialView.tsx`

```tsx
import React, { useState } from 'react';

interface InitialViewProps {
  onSubmit: (message: string) => void;
  onLoadDocument: () => void;
  isLoading?: boolean;
}

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#0E3A2F] mb-4">
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
                       hover:border-[#4BA82E] hover:shadow-md transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
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
                       focus:outline-none focus:border-[#4BA82E] focus:ring-2 focus:ring-[#4BA82E]/20
                       disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#0E3A2F] text-white px-8 py-4 rounded-lg font-semibold
                       hover:bg-[#1a5a42] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="flex items-center gap-2 px-6 py-3 border-2 border-[#4BA82E]
                     text-[#4BA82E] rounded-lg font-medium
                     hover:bg-[#4BA82E] hover:text-white transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
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
```

### Integrácia do App.tsx

```tsx
// App.tsx
import { InitialView } from './components/InitialView';
import { ChatPanel } from './components/ChatPanel';
import { Canvas } from './components/Canvas';

function App() {
  const { messages, sendMessage, isLoading } = useChatStore();

  // Hardcoded dokument pre demo
  const handleLoadDocument = () => {
    const sampleDocument = `# Business Request: Purchase Order Analysis

## Goal
Analyze the dm_bs_purchase schema to understand supplier relationships.

## Scope
- All FACT and DIM tables in gold layer
- Focus on purchase_order entity

## Expected Outputs
- ER diagram showing relationships
- Data quality assessment
- Business glossary mapping
`;

    // Uložiť do session/store
    sessionStorage.setItem('mcop_document', sampleDocument);

    // Odoslať prvú správu
    sendMessage("Document loaded. Analyze the dm_bs_purchase schema.");
  };

  // Ak nie sú správy, zobraz InitialView
  if (messages.length === 0) {
    return (
      <InitialView
        onSubmit={sendMessage}
        onLoadDocument={handleLoadDocument}
        isLoading={isLoading}
      />
    );
  }

  // Inak zobraz split layout
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ChatPanel />
      <Canvas />
    </div>
  );
}
```

---

## 🧪 Playwright Test Scenáre

### Test Suite: `tests/e2e/initial-view.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('InitialView Component', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial view when no messages', async ({ page }) => {
    // Hero section visible
    await expect(page.getByRole('heading', { name: /Metadata Copilot/i })).toBeVisible();
    await expect(page.getByText(/Explore your data catalog/i)).toBeVisible();

    // Example prompts visible
    await expect(page.getByText(/Show me all FACT tables/i)).toBeVisible();
    await expect(page.getByText(/relationships for factv_purchase_order/i)).toBeVisible();
  });

  test('should have 4 example prompt buttons', async ({ page }) => {
    const promptButtons = page.locator('button:has-text("📊"), button:has-text("🔗"), button:has-text("📈"), button:has-text("🔍")');
    await expect(promptButtons).toHaveCount(4);
  });

  test('clicking example prompt should send message', async ({ page }) => {
    // Click first example
    await page.click('button:has-text("Show me all FACT tables")');

    // Should navigate to chat view
    await expect(page.getByRole('heading', { name: /Metadata Copilot/i })).not.toBeVisible();

    // Should show the message in chat
    await expect(page.getByText(/Show me all FACT tables/i)).toBeVisible();
  });

  test('should submit custom query via input', async ({ page }) => {
    // Type custom query
    await page.fill('input[placeholder*="Ask anything"]', 'List all schemas');

    // Click Analyze button
    await page.click('button:has-text("Analyze")');

    // Should navigate away from InitialView
    await expect(page.getByRole('heading', { name: /Metadata Copilot/i })).not.toBeVisible();
  });

  test('Load Sample Document button should work', async ({ page }) => {
    // Click load document
    await page.click('button:has-text("Load Sample Document")');

    // Should start analysis
    await expect(page.getByText(/Document loaded/i)).toBeVisible({ timeout: 5000 });
  });

  test('input should be disabled while loading', async ({ page }) => {
    // Submit a query
    await page.fill('input[placeholder*="Ask anything"]', 'Test query');
    await page.click('button:has-text("Analyze")');

    // Buttons should show loading state
    // (This depends on actual loading implementation)
  });

});
```

---

## 📦 Deliverables

| Súbor                            | Akcia                                    |
| -------------------------------- | ---------------------------------------- |
| `src/components/InitialView.tsx` | **Vytvoriť**                             |
| `src/App.tsx`                    | Upraviť - pridať podmienené renderovanie |
| `tests/e2e/initial-view.spec.ts` | **Vytvoriť**                             |

---

## 🔗 Súvisiace Stories

- [MCOP-FE-002](./MCOP-FE-002-canvas-trigger.md) - Canvas Trigger (po odoslaní query)
- [MCOP-FE-004](./MCOP-FE-004-loading-dots.md) - Loading Dots (počas čakania)

---

## ✅ Definition of Done

- [ ] Komponent `InitialView.tsx` implementovaný
- [ ] Example prompts sú MCOP-špecifické
- [ ] Load Document button funguje s hardcoded textom
- [ ] Responsive na mobile a desktop
- [ ] 6 Playwright testov prechádza
- [ ] Code review hotové
