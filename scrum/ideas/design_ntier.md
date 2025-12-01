# Design Migrácia z N-tier Supply Chain Frontendu

**Dátum:** 2025-11-30
**Zdroj:** `/Users/marekminarovic/supply-chain-frontend`
**Cieľ:** `/Users/marekminarovic/front_archi-agent/frontend`

---

## 📋 Prehľad

Tento dokument popisuje, čo sa dá prevziať z N-tier supply chain frontendu do MCOP metadata projektu. Zameranie je na:
- Design a layout
- Farebná schéma
- Typografia
- Rozloženie stránky
- Canvas trigger logika (prepínanie medzi chatom a vizualizáciou)

---

## 🎨 1. Farebná Schéma

### Primárne farby (N-tier branding)

```css
/* Hlavné farby - Škoda Green theme */
--primary-dark: #0E3A2F;      /* Tmavo zelená - Header, CTA buttony */
--primary-accent: #4BA82E;    /* Zelená - Akcent, success stavy */
--primary-light: #78FAAE;     /* Svetlo zelená - Hover, sekundárne info */
--primary-muted: #1a5a42;     /* Stredná zelená - Karty na tmavom pozadí */
```

### Sekundárne farby

```css
/* Gray scale */
--bg-light: #f9fafb;          /* gray-50 - Pozadie canvasu */
--bg-white: #ffffff;          /* Karty, chat panel */
--border: #e5e7eb;            /* gray-200 - Borders */
--text-primary: #111827;      /* gray-900 - Hlavný text */
--text-secondary: #6b7280;    /* gray-500 - Sekundárny text */
--text-muted: #9ca3af;        /* gray-400 - Muted text */
```

### Adaptácia pre MCOP

| N-tier farba             | MCOP ekvivalent      | Použitie             |
| ------------------------ | -------------------- | -------------------- |
| `#0E3A2F` (dark green)   | `#1e40af` (blue-800) | Header, primárne CTA |
| `#4BA82E` (accent green) | `#3b82f6` (blue-500) | Akcent, success      |
| `#78FAAE` (light green)  | `#93c5fd` (blue-300) | Hover, sekundárne    |

**Alternatíva:** Ak chceš zachovať zelenú tému aj pre MCOP, môžeš použiť emerald/teal škálu.

---

## 🔤 2. Typografia

### Font Family

```css
/* N-tier používa Geist (Vercel font) */
font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* MCOP alternatíva (Vite default) */
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Sizes

```css
/* Hero titulok */
.hero-title {
  @apply text-4xl md:text-5xl font-bold;
}

/* Sekcia nadpis */
.section-title {
  @apply text-lg font-bold;
}

/* Label (uppercase tracking) */
.label {
  @apply text-xs uppercase tracking-wide font-semibold;
}

/* Body text */
.body {
  @apply text-sm md:text-base leading-relaxed;
}
```

---

## 📐 3. Layout Patterns

### 3.1 Dvojpanelový Layout (Chat + Canvas)

```tsx
// N-tier pattern: Chat vľavo, Canvas vpravo
<div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
  {/* Left Panel: Chat - Fixed width */}
  <div className="w-full md:w-[600px] flex-shrink-0 border-r border-gray-200 bg-white h-full">
    <ChatInterface />
  </div>

  {/* Right Panel: Canvas - Flexible */}
  <main className="flex-1 h-full overflow-y-auto bg-gray-50 p-4 md:p-8">
    <CanvasVisualization />
  </main>
</div>
```

**Kľúčové prvky:**
- Chat panel: Fixed `600px` na desktop, full width na mobile
- Canvas: `flex-1` pre flexibilnú šírku
- Responsive: `flex-col` na mobile, `flex-row` na desktop
- Border medzi panelmi: `border-r border-gray-200`

### 3.2 Úvodná Obrazovka (InitialChatView)

```tsx
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
  {/* Hero Section */}
  <div className="text-center mb-8 max-w-2xl">
    <h1 className="text-4xl md:text-5xl font-bold text-[#0E3A2F] mb-4">
      Supply Chain Intelligence
    </h1>
    <p className="text-lg md:text-xl text-gray-600">
      Ready to analyze supply chains
    </p>
  </div>

  {/* Example Prompts Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl w-full">
    {EXAMPLE_PROMPTS.map((prompt) => (
      <button className="px-5 py-3 bg-white border border-gray-300 text-left text-sm font-medium">
        💬 {prompt}
      </button>
    ))}
  </div>

  {/* Large Centered Input */}
  <div className="w-full max-w-2xl">
    <form className="flex gap-3">
      <input className="flex-1 p-4 border border-gray-300" />
      <button className="bg-[#0E3A2F] text-white px-8 py-4 font-semibold">
        Send
      </button>
    </form>
  </div>
</div>
```

**Kľúčové prvky:**
- Gradient pozadie: `bg-gradient-to-b from-gray-50 to-white`
- Centrovaný obsah: `items-center justify-center min-h-screen`
- Example prompts: 2-column grid s emoji ikonami
- Veľký input: `p-4` padding, široký button

### 3.3 Header v Chat Paneli

```tsx
<div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
  <h2 className="text-lg font-bold text-[#0E3A2F]">Supply Chain Chat</h2>
  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300">
    <HomeIcon />
    <span>Home</span>
  </button>
</div>
```

---

## 🔄 4. Canvas Trigger Logika

### 4.1 Koncept

Používateľ môže v chate napísať kľúčové slovo (napr. "dodavatel map view", "ownership Continental") a systém automaticky prepne canvas na príslušnú vizualizáciu.

### 4.2 Backend Response (CanvasTrigger)

```typescript
interface CanvasTrigger {
  action: 'new_analysis' | 'switch_view' | 'none';
  analysis_type?: 'supply_chain' | 'ownership' | 'map_view' | 'risk_financial';
  entity_name?: string;
  query?: string;       // Query pre nový API call
  reason: string;       // Dôvod prepnutia (zobrazí sa v chate)
}
```

### 4.3 Frontend Handling

```typescript
// V handleSendMessage po prijatí odpovede od API
if (response.canvas_trigger && response.canvas_trigger.action !== 'none') {
  console.log('[Canvas Trigger] Detected:', response.canvas_trigger);

  // 1. Zobraziť dôvod v chate
  const triggerMsg: Message = {
    id: Date.now().toString(),
    role: 'assistant',
    content: response.canvas_trigger.reason,
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, triggerMsg]);

  // 2. Zavolať nový API pre canvas dáta
  if (response.canvas_trigger.query) {
    const canvasResponse = await API.query(response.canvas_trigger.query);
    setActiveCanvasData(canvasResponse);
  }
}
```

### 4.4 Príklad použitia pre MCOP

| Kľúčové slovo                      | Canvas Trigger Action         | Výsledok           |
| ---------------------------------- | ----------------------------- | ------------------ |
| "diagram pre factv_purchase_order" | `switch_view: er_diagram`     | Mermaid ER diagram |
| "ukáž vzťahy medzi tabuľkami"      | `new_analysis: relationships` | Relationship view  |
| "zoznam tabuliek v schema X"       | `switch_view: table_list`     | Table list view    |

### 4.5 Hook implementácia

```typescript
// hooks/useCanvasTrigger.ts
import { useState, useCallback } from 'react';

interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: 'er_diagram' | 'table_list' | 'relationship_graph';
  entity_name?: string;
  query?: string;
  reason: string;
}

interface UseCanvasTriggerOptions {
  onTrigger?: (trigger: CanvasTrigger) => void;
  onError?: (error: Error) => void;
}

export function useCanvasTrigger(options: UseCanvasTriggerOptions = {}) {
  const [isTriggering, setIsTriggering] = useState(false);

  const handleCanvasTrigger = useCallback(
    async (trigger: CanvasTrigger) => {
      if (trigger.action === 'none') return;

      setIsTriggering(true);

      try {
        options.onTrigger?.(trigger);

        // Tu by sa zavolal API a prepol canvas
        console.log('[Canvas Trigger] Switching to:', trigger.view_type);
      } catch (error) {
        options.onError?.(error as Error);
      } finally {
        setIsTriggering(false);
      }
    },
    [options]
  );

  return { handleCanvasTrigger, isTriggering };
}
```

---

## 💡 5. Loading States a Animácie

### 5.1 Animované Loading Dots (Thinking...)

```tsx
<div className="flex items-center space-x-2">
  <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce"
       style={{ animationDelay: '0ms' }}></div>
  <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce"
       style={{ animationDelay: '150ms' }}></div>
  <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce"
       style={{ animationDelay: '300ms' }}></div>
  <span className="text-lg text-gray-500 ml-2">Thinking...</span>
</div>
```

### 5.2 Follow-up Loading Overlay

```tsx
{isFollowUpLoading && (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-[#4BA82E] max-w-md">
      <LoadingDots />
      <p className="text-gray-600 text-sm">
        🤔 LLM is generating an answer...
      </p>
      <p className="text-gray-400 text-xs mt-2">
        This usually takes 7-10 seconds
      </p>
    </div>
  </div>
)}
```

### 5.3 Spinner pre Initial Loading

```tsx
<div className="flex flex-col items-center justify-center h-full">
  <div className="animate-spin h-12 w-12 border-4 border-[#4BA82E] border-t-transparent rounded-full mb-4"></div>
  <p className="text-gray-600 font-medium">Analyzing metadata...</p>
</div>
```

---

## 🏷️ 6. Badge a Tag Komponenty

### 6.1 Follow-up Badge

```tsx
{message.isFollowUp && (
  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
    <span>⚡</span>
    <span>Follow-up</span>
  </span>
)}
```

### 6.2 Analysis Type Badge

```tsx
<span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs">
  {analysisType}
</span>
```

### 6.3 Status Indicators

```tsx
{/* Connected */}
<span className="w-2 h-2 rounded-full bg-green-500" title="Connected" />

{/* Disconnected */}
<span className="w-2 h-2 rounded-full bg-red-500" title="Disconnected" />

{/* Loading */}
<span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" title="Loading" />
```

---

## 📊 7. Canvas Header Cards (Metrics Dashboard)

### 7.1 Entity Header

```tsx
<div className="bg-white overflow-hidden border-t-2 border-[#4BA82E] border border-gray-200">
  {/* Dark header section */}
  <div className="bg-[#0E3A2F] px-8 py-6">
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {entityName}
        </h2>
        <p className="text-[#78FAAE] text-base font-medium">
          {country} • Overview
        </p>
      </div>
      {/* Metric badge */}
      <div className="bg-[#1a5a42] px-6 py-3 border border-[#78FAAE]">
        <p className="text-[#78FAAE] text-xs uppercase tracking-wide mb-1">Total</p>
        <p className="text-white text-2xl font-bold">{count}</p>
      </div>
    </div>
  </div>

  {/* Metrics grid */}
  <div className="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200">
    <MetricCard label="Tables" value={42} trend="+5" />
    <MetricCard label="Columns" value={380} />
    <MetricCard label="Relationships" value={24} />
    <MetricCard label="Quality Score" value="85%" />
  </div>
</div>
```

### 7.2 Metric Card Component

```tsx
function MetricCard({ label, value, trend }: { label: string; value: string | number; trend?: string }) {
  return (
    <div className="p-6 text-center bg-gradient-to-br from-white to-gray-50">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-4xl font-bold text-[#4BA82E] mb-1">{value}</p>
      {trend && (
        <div className="flex items-center justify-center gap-1 text-xs text-green-600">
          <TrendUpIcon className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
```

---

## 🔘 8. View Mode Toggle

```tsx
<div className="flex gap-2">
  <button
    onClick={() => setViewMode('table')}
    className={`px-4 py-2 text-sm font-semibold ${
      viewMode === 'table'
        ? 'bg-[#4BA82E] text-white border border-[#4BA82E]'
        : 'bg-white text-gray-700 border border-gray-300'
    }`}
  >
    📊 Table View
  </button>
  <button
    onClick={() => setViewMode('diagram')}
    className={`px-4 py-2 text-sm font-semibold ${
      viewMode === 'diagram'
        ? 'bg-[#4BA82E] text-white border border-[#4BA82E]'
        : 'bg-white text-gray-700 border border-gray-300'
    }`}
  >
    🔗 Diagram View
  </button>
</div>
```

---

## 📱 9. Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet - Tu sa prepína na split layout */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
```

### Layout Transitions

```tsx
{/* Mobile: Stack vertically */}
<div className="flex flex-col md:flex-row">
  {/* Chat: Full width on mobile, fixed on desktop */}
  <div className="w-full md:w-[600px]">
    <ChatPanel />
  </div>

  {/* Canvas: Below chat on mobile, right side on desktop */}
  <main className="flex-1">
    <Canvas />
  </main>
</div>
```

---

## ✅ 10. Implementačný Checklist

### Fáza 1: Design Tokens (30 min)
- [ ] Definovať farebné premenné v `index.css`
- [ ] Nastaviť Tailwind custom colors v `tailwind.config.js`
- [ ] Pridať font-family do global styles

### Fáza 2: Layout Components (1 hod)
- [ ] Vytvoriť `InitialView.tsx` - úvodná obrazovka s example prompts
- [ ] Upraviť `Layout.tsx` - responsive dual-panel
- [ ] Pridať Home button do ChatPanel header

### Fáza 3: Loading States (30 min)
- [ ] Implementovať Loading Dots komponent
- [ ] Pridať Follow-up overlay
- [ ] Spinner pre initial load

### Fáza 4: Canvas Trigger (1 hod)
- [ ] Rozšíriť WebSocket response o `canvas_trigger` field
- [ ] Vytvoriť `useCanvasTrigger` hook
- [ ] Integrovať do ChatPanel message handler

### Fáza 5: Canvas Views (2 hod)
- [ ] Metrics Header Card
- [ ] View Mode Toggle (Table/Diagram)
- [ ] Empty state a loading state

---

## 📁 Súbory na prevzatie / inšpiráciu

| Súbor (N-tier)                       | Účel                            | MCOP ekvivalent            |
| ------------------------------------ | ------------------------------- | -------------------------- |
| `app/page.tsx`                       | Hlavná stránka s layout logikou | `App.tsx`                  |
| `src/components/InitialChatView.tsx` | Úvodná obrazovka                | Nový `InitialView.tsx`     |
| `src/components/ChatInterface.tsx`   | Chat UI                         | Existujúci `ChatPanel.tsx` |
| `src/hooks/useCanvasTrigger.ts`      | Canvas navigation               | Nový hook                  |
| `src/types/api.ts`                   | CanvasTrigger typy              | Rozšíriť `types/index.ts`  |
| `app/globals.css`                    | Global styles                   | `index.css`                |

---

## 🎯 Sumár Rozdielov

| Aspekt       | N-tier             | MCOP                        | Adaptácia                         |
| ------------ | ------------------ | --------------------------- | --------------------------------- |
| Framework    | Next.js 16         | Vite + React 19             | Odstrániť `'use client'`, routing |
| Routing      | App Router         | SPA (žiadny routing)        | Použiť state-based views          |
| API          | REST (`fetch`)     | WebSocket                   | Integrovať trigger do WS handler  |
| Vizualizácie | ReactFlow, Leaflet | Mermaid.js                  | Iné canvas views                  |
| Farby        | Škoda Green        | Blue (alebo zachovať green) | Aktualizovať Tailwind config      |

---

**Poznámka:** Tento dokument slúži ako referencia. Nie všetko sa hodí 1:1 prevziať - vždy adaptuj na MCOP use case (metadata exploration vs supply chain analysis).
