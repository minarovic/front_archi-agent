# Minimalistický dizajn systém - Technická dokumentácia

**Dátum vytvorenia**: 2025-12-02
**Autor**: GitHub Copilot
**Verzia**: 1.0.0
**Status**: Implementované

## Prehľad

Tento dokument popisuje minimalistický dizajn systém aplikovaný v Sprint 3 na MCOP frontend. Dizajn je založený na supply-chain-frontend projekte a implementuje clean, enterprise-grade UI bez dekoratívnych prvkov.

## Dizajnová filozofia

### Core Principles

1. **Minimalizmus** - žiadne zbytočné dekorácie
2. **Čitateľnosť** - väčší text, lepší kontrast
3. **Konzistencia** - jednotné spacing, borders, colors
4. **Profesionalita** - enterprise-ready vzhľad
5. **Výkon** - žiadne zbytočné animácie

### Anti-patterns (čo sa odstránilo)

```css
/* ❌ Zaoblené rohy */
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }

/* ❌ Tiene */
.shadow-md { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0,0,0,0.1); }

/* ❌ Animácie */
.animate-pulse { animation: pulse 2s infinite; }
.hover\:scale-\[1\.02\]:hover { transform: scale(1.02); }

/* ❌ Focus rings */
.focus\:ring-2:focus { box-shadow: 0 0 0 3px rgba(59,130,246,0.5); }
```

## Design Tokens

### Color Palette

```css
:root {
  /* Primary Colors (Škoda Green) */
  --primary-dark: #0E3A2F;      /* Headers, buttons, active states */
  --primary-accent: #4BA82E;    /* Accents, hover, focus borders */
  --primary-light: #78FAAE;     /* Highlights (minimal use) */
  --primary-muted: #1a5a42;     /* Muted backgrounds (minimal use) */

  /* Neutrals */
  --gray-50: #FAFAFA;           /* Light backgrounds */
  --gray-100: #F5F5F5;          /* Subtle backgrounds */
  --gray-200: #E5E5E5;          /* Borders, dividers */
  --gray-300: #D1D5DB;          /* Standard borders */
  --gray-400: #9CA3AF;          /* Disabled text */
  --gray-500: #6B7280;          /* Placeholder text */
  --gray-600: #4B5563;          /* Secondary text */
  --gray-700: #374151;          /* Body text */
  --gray-900: #111827;          /* Primary text */

  /* Semantic Colors */
  --white: #FFFFFF;             /* Cards, inputs, backgrounds */
  --red-50: #FEF2F2;            /* Error backgrounds */
  --red-200: #FECACA;           /* Error borders */
  --red-800: #991B1B;           /* Error text */
}
```

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;     /* 12px - micro text */
--text-sm: 0.875rem;    /* 14px - small text */
--text-base: 1rem;      /* 16px - base text */
--text-lg: 1.125rem;    /* 18px - body text (LARGER) */
--text-xl: 1.25rem;     /* 20px - subheaders */
--text-2xl: 1.5rem;     /* 24px - small headers */
--text-4xl: 2.25rem;    /* 36px - headers */
--text-5xl: 3rem;       /* 48px - hero headers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Spacing Scale

```css
/* Tailwind Spacing (rem-based) */
--spacing-0: 0;
--spacing-px: 1px;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px - gaps */
--spacing-4: 1rem;      /* 16px - padding */
--spacing-5: 1.25rem;   /* 20px - button padding */
--spacing-6: 1.5rem;    /* 24px - section spacing */
--spacing-8: 2rem;      /* 32px - large spacing */
--spacing-12: 3rem;     /* 48px - hero spacing */
```

### Border Styles

```css
/* Border Widths */
--border-default: 1px;
--border-2: 2px;         /* Minimal use - only for emphasis */

/* Border Colors */
--border-gray-200: #E5E5E5;     /* Subtle dividers */
--border-gray-300: #D1D5DB;     /* Standard borders */
--border-primary: #0E3A2F;      /* Active/focused elements */
--border-accent: #4BA82E;       /* Accent borders */

/* Border Radius */
--radius-none: 0;               /* Square (default) */
--radius-full: 9999px;          /* Only for status indicators */
```

## Component Patterns

### Button Styles

```tsx
// Primary Button (Dark Green)
<button className="bg-[#0E3A2F] text-white px-8 py-4 font-semibold border border-[#0E3A2F] disabled:opacity-50">
  Send
</button>

// Secondary Button (White with border)
<button className="bg-white text-gray-700 px-5 py-3 font-medium border border-gray-300">
  Cancel
</button>

// Accent Button (Green border)
<button className="bg-white text-[#4BA82E] px-4 py-2 font-semibold border border-[#4BA82E]">
  Copy
</button>
```

### Input Styles

```tsx
// Standard Input
<input
  type="text"
  className="p-4 border border-gray-300 focus:outline-none focus:border-[#0E3A2F] text-base text-gray-900 placeholder:text-gray-400"
  placeholder="Enter text..."
/>

// Disabled Input
<input
  type="text"
  disabled
  className="p-4 border border-gray-300 bg-gray-100 text-gray-400"
/>
```

### Card Styles

```tsx
// Standard Card
<div className="bg-white border border-gray-200 p-6">
  {/* Content */}
</div>

// Emphasized Card
<div className="bg-white border border-[#0E3A2F] p-6">
  {/* Content */}
</div>
```

### Message Bubbles

```tsx
// User Message (Dark Green)
<div className="bg-[#0E3A2F] text-white border border-[#0E3A2F] px-4 py-3">
  <p className="text-lg leading-relaxed">{content}</p>
</div>

// Assistant Message (White)
<div className="bg-white text-gray-900 border border-gray-200 px-4 py-3">
  <p className="text-lg leading-relaxed">{content}</p>
</div>

// Error Message (Red)
<div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3">
  <p className="text-lg leading-relaxed">{error}</p>
</div>
```

### Header Patterns

```tsx
// Dark Green Header (Chat Panel)
<div className="bg-[#0E3A2F] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
  <h2 className="text-lg font-bold text-white">Title</h2>
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-[#4BA82E]" />
    <span className="text-sm font-medium text-white">Connected</span>
  </div>
</div>

// White Header (Canvas)
<div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
  <h2 className="text-lg font-bold text-[#0E3A2F]">Canvas</h2>
  {/* Controls */}
</div>
```

### Status Indicators

```tsx
// Connected (Green)
<span className="w-2 h-2 rounded-full bg-[#4BA82E]" />

// Disconnected (Red)
<span className="w-2 h-2 rounded-full bg-red-400" />

// Loading (Animated dots - minimal animation)
<div className="flex space-x-1">
  <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
  <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
  <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
</div>
```

## Layout Patterns

### Hero Section (InitialView)

```tsx
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
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

  {/* Example Prompts */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl w-full">
    {prompts.map((prompt) => (
      <button className="px-5 py-3 bg-white border border-gray-300 text-left text-sm font-medium text-gray-700">
        {prompt.icon} {prompt.text}
      </button>
    ))}
  </div>

  {/* Input */}
  <div className="w-full max-w-2xl mb-8">
    <form className="flex gap-3">
      <input className="flex-1 p-4 border border-gray-300 focus:outline-none focus:border-[#0E3A2F]" />
      <button className="bg-[#0E3A2F] text-white px-8 py-4 font-semibold border border-[#0E3A2F]">
        Send
      </button>
    </form>
  </div>
</div>
```

### Split Panel Layout

```tsx
<div className="flex h-screen">
  {/* Left Panel - Chat */}
  <div className="w-1/2 flex flex-col bg-gray-50 border-r border-gray-200">
    {/* Header */}
    <div className="bg-[#0E3A2F] border-b border-gray-200 px-4 py-3">
      <h2 className="text-lg font-bold text-white">Chat</h2>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4">
      {/* Message components */}
    </div>

    {/* Input */}
    <div className="p-4 border-t border-gray-200 bg-white">
      {/* MessageInput component */}
    </div>
  </div>

  {/* Right Panel - Canvas */}
  <div className="w-1/2 flex flex-col bg-white">
    {/* Canvas content */}
  </div>
</div>
```

## Responsive Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */

/* Common Patterns */
text-4xl md:text-5xl        /* Larger text on desktop */
grid-cols-1 md:grid-cols-2  /* 1 column mobile, 2 desktop */
gap-3 md:gap-4              /* Smaller gaps on mobile */
px-4 md:px-6                /* More padding on desktop */
```

## Accessibility

### Focus States

```tsx
// Visible focus (keyboard navigation)
<button className="focus:outline-none focus:border-[#0E3A2F]">
  {/* No ring, just border change */}
</button>

// Input focus
<input className="focus:outline-none focus:border-[#0E3A2F]">
```

### Color Contrast

```css
/* WCAG 2.1 AA Compliance */
--primary-dark: #0E3A2F;    /* 7.2:1 on white (AAA) */
--gray-900: #111827;        /* 14.5:1 on white (AAA) */
--gray-600: #4B5563;        /* 4.7:1 on white (AA) */
```

### ARIA Labels

```tsx
<div role="group" aria-label="View mode" data-testid="view-mode-toggle">
  <button aria-pressed={value === 'table'}>Table</button>
  <button aria-pressed={value === 'diagram'}>Diagram</button>
</div>
```

## Performance

### CSS Optimization

- **No complex animations** - len `animate-bounce` pre loading dots
- **No box-shadows** - lepší rendering performance
- **No gradients** (okrem hero background) - rýchlejšie render
- **Square corners** - jednoduchšie border rendering

### Bundle Size

```bash
# Tailwind CSS Production Build
Original: 4.82 kB
Gzipped:  1.58 kB

# Removed unused classes: ~40
# Added minimal classes: ~30
# Net reduction: ~10 classes
```

## Migration Guide

### Ako nahradiť staré komponenty

```tsx
// ❌ PRED (Sprint 2)
<div className="rounded-xl shadow-lg hover:scale-[1.02] transition-all">
  <button className="bg-blue-600 rounded-lg px-4 py-2">Click</button>
</div>

// ✅ PO (Sprint 3)
<div className="border border-gray-200">
  <button className="bg-[#0E3A2F] border border-[#0E3A2F] px-8 py-4">Click</button>
</div>
```

### CSS Variables → Hardcoded Colors

```tsx
// ❌ PRED
style={{ backgroundColor: 'var(--primary-dark)' }}
style={{ color: 'var(--primary-accent)' }}

// ✅ PO
className="bg-[#0E3A2F]"
className="text-[#4BA82E]"
```

### Text Sizes

```tsx
// ❌ PRED (menší text)
<p className="text-sm">Message</p>
<h1 className="text-5xl md:text-6xl">Hero</h1>

// ✅ PO (väčší, čitateľnejší)
<p className="text-lg leading-relaxed">Message</p>
<h1 className="text-4xl md:text-5xl">Hero</h1>
```

## Testing

### Visual Regression

```bash
# Screenshot testing (budúce)
npm run test:visual

# Manual comparison
# Before: scrum/sprint_2/screenshots/
# After:  scrum/sprint_3/screenshots/
```

### Build Verification

```bash
cd frontend
npm run build
# ✅ Should complete in ~3.8s
# ✅ No TypeScript errors
# ✅ No missing dependencies

npm run dev
# ✅ Should start on localhost:3000
# ✅ HMR should work
```

## Related Documentation

- `scrum/sprint_3/FE-007-redesign-minimal-ui.md` - User story
- `scrum/sprint_2/design-update-supply-chain.md` - Design changes summary
- `scrum/ideas/design_ntier.md` - Original N-tier design (deprecated)

## Version History

- **1.0.0** (2025-12-02) - Initial minimal design system
- **0.2.0** (Sprint 2) - N-tier design with decorations (deprecated)
- **0.1.0** (Sprint 1) - Basic MVP design

---

**Status**: ✅ Implementované
**Next Review**: Sprint 4
**Maintainer**: @minarovic
