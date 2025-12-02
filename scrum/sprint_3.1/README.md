# Sprint Export Design - README

Tento balík obsahuje kompletný design systém z Supply Chain Frontend projektu.

## Obsah súborov

| Súbor                | Popis                                                                           |
| -------------------- | ------------------------------------------------------------------------------- |
| `DESIGN_SYSTEM.md`   | Kompletná dokumentácia dizajnu - farby, typografia, layout patterns, komponenty |
| `DESIGN_TOKENS.ts`   | TypeScript konštanty pre všetky vizuálne hodnoty                                |
| `tailwind.config.js` | Tailwind CSS konfigurácia s custom farbami a utilities                          |
| `globals.css`        | Globálne CSS štýly a utility classes                                            |

## Ako použiť v novom projekte

### 1. Inštaluj závislosti

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Skopíruj súbory

1. Nahraď `tailwind.config.js` súborom z tohto balíka
2. Nahraď/vytvor `app/globals.css` alebo `styles/globals.css`
3. Pridaj `DESIGN_TOKENS.ts` do `src/lib/` alebo `lib/`

### 3. Nastav fonty (Next.js)

V `app/layout.tsx`:

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### 4. Importuj design tokens

```tsx
import { COLORS, SKODA_COLORS, SPACING, getRiskConfig } from '@/lib/DESIGN_TOKENS';

// Použitie
const primaryColor = SKODA_COLORS.GREEN; // '#4BA82E'
const riskConfig = getRiskConfig(45); // Returns HIGH config
```

## Hlavné farby

| Farba       | Hex       | Použitie                              |
| ----------- | --------- | ------------------------------------- |
| Škoda Green | `#4BA82E` | Primárna akcentová farba              |
| Škoda Dark  | `#0E3A2F` | Header backgrounds, primárne tlačidlá |
| Škoda Light | `#78FAAE` | Text na tmavom pozadí                 |

## Tailwind classes (custom)

```html
<!-- Škoda farby -->
<div class="bg-skoda-green text-white">Primary</div>
<div class="bg-skoda-dark text-skoda-light">Header</div>
<div class="bg-skoda-bg text-skoda-text">Light badge</div>

<!-- Risk colors -->
<div class="bg-risk-high-bg text-risk-high-text">High Risk</div>
<div class="bg-risk-medium-bg text-risk-medium-text">Medium</div>
<div class="bg-risk-low-bg text-risk-low-text">Low/Stable</div>

<!-- Shadows -->
<div class="shadow-node">Graph node shadow</div>

<!-- Heights -->
<div class="h-graph">600px graph</div>
<div class="h-map">500px map</div>

<!-- Widths -->
<div class="w-chat">600px chat panel</div>
```

## CSS classes (z globals.css)

```html
<!-- Komponenty -->
<div class="narrative-card">AI insight card</div>
<div class="metric-card">Metric display</div>
<div class="hero-header">Dashboard header</div>

<!-- Tlačidlá -->
<button class="btn-primary">Primary button</button>
<button class="btn-secondary">Secondary button</button>
<button class="btn-toggle-active">Active toggle</button>

<!-- Inputy -->
<input class="input" placeholder="Text input" />

<!-- Tabuľky -->
<table class="table">
  <thead class="table-header">...</thead>
  <tbody>
    <tr class="table-row">
      <td class="table-cell">...</td>
    </tr>
  </tbody>
</table>

<!-- Badges -->
<span class="badge-tier">Tier 2</span>
<span class="badge-risk badge-risk-high">HIGH RISK</span>
<span class="badge-risk badge-risk-stable">STABLE</span>
<span class="tag-country">Germany</span>

<!-- Loading -->
<div class="spinner"></div>
<div class="thinking-dots">
  <div class="thinking-dot"></div>
  <div class="thinking-dot"></div>
  <div class="thinking-dot"></div>
</div>

<!-- Chat -->
<div class="chat-container">
  <div class="chat-header">...</div>
  <div class="message-list">...</div>
  <div class="chat-input-area">...</div>
</div>

<!-- React Flow nodes -->
<div class="node-tier1">Tier 1 node</div>
<div class="node-tier2 node-risk-low">Tier 2 low risk</div>
<div class="node-tier3 node-risk-high">Tier 3 high risk</div>
```

## Design princípy

1. **Flat Design** - Minimálne zaoblenie rohov (0px pre karty, tlačidlá)
2. **Border Accents** - `border-l-4` alebo `border-t-4` namiesto shadows
3. **Škoda Brand** - Zelená paleta (#4BA82E, #0E3A2F, #78FAAE)
4. **Risk Indicators** - Sémantické farby (red/yellow/green)
5. **Consistent Spacing** - Tailwind spacing system
6. **Geist Font** - Google Fonts variable font

## Poznámky

- `@theme inline` v globals.css je Tailwind v4 syntax. Pre v3 to odstrán.
- Emoji sú používané ako ikony (💬, 🔗, ⚠️, ✅, 🔴, 🛡️, 📊, 🏢, 🤝, 🗺️)
- SVG ikony sú v Heroicons štýle (outline, stroke-width: 2)
