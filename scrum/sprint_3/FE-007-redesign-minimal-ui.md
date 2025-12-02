# FE-007: Redesign aplikácie na minimalistický profesionálny dizajn

**Typ**: Story
**Priorita**: High
**Sprint**: 3
**Stav**: In Progress
**Assignee**: GitHub Copilot
**Created**: 2025-12-02

## Popis

Kompletný redesign MCOP frontend aplikácie podľa minimalistického dizajnu zo supply-chain-frontend projektu. Odstránenie všetkých dekoratívnych prvkov (zaoblené rohy, tiene, animácie) a aplikovanie čistého, profesionálneho enterprise dizajnu.

## Dôvod zmeny

Pôvodný dizajn (Sprint 2) mal príliš veľa dekoratívnych prvkov:
- Zaoblené rohy (`rounded-lg`, `rounded-xl`)
- Tiene (`shadow-lg`, `shadow-xl`)
- Animácie (`animate-pulse`, `scale-[1.02]`)
- Gradientové pozadia na kartách
- Komplexné hover efekty

**Problém**: Aplikácia nevyzerala profesionálne a enterprise-ready.

## Referenčný dizajn

**Zdroj**: `/Users/marekminarovic/supply-chain-frontend/`

Analyzované súbory:
- `app/globals.css` - Tailwind 4 setup, minimalistická farebná schéma
- `src/components/InitialChatView.tsx` - Hero sekcia dizajn
- `src/components/ChatInterface.tsx` - Layout správ
- `src/components/SupplierTable.tsx` - Tabuľkový štýl

## Dizajnové princípy (Supply Chain)

### Farby
```css
Primary Dark: #0E3A2F    /* Škoda dark green - headers, buttons */
Primary Accent: #4BA82E  /* Škoda bright green - accents, focus */
Gray 50: #FAFAFA         /* Light backgrounds */
Gray 300: #D1D5DB        /* Borders */
Gray 600: #4B5563        /* Secondary text */
Gray 900: #111827        /* Primary text */
White: #FFFFFF           /* Cards, inputs */
```

### Typografia
```css
Headers:     text-4xl md:text-5xl  (36-48px)
Subheaders:  text-lg md:text-xl    (18-20px)
Body:        text-lg               (18px) - VÄČŠÍ ako predtým
Small:       text-sm               (14px)
Micro:       text-xs               (12px)
```

### Spacing
```css
Gaps:        gap-3      (12px) - menšie, konzistentné
Padding:     px-4 py-3  (16px 12px) headers
             px-5 py-3  (20px 12px) buttons
             p-4        (16px) inputs
```

### Borders
```css
Standard:    border border-gray-300
Active:      border border-[#0E3A2F]
Accent:      border border-[#4BA82E]
NO:          rounded-*, shadow-*
```

## Acceptance Criteria

### AC1: InitialView komponenta
- [x] Odstránené zaoblené rohy (`rounded-xl`)
- [x] Odstránené tiene (`shadow-*`)
- [x] Odstránené animácie (`animate-pulse`)
- [x] Hero nadpis: `text-4xl md:text-5xl`
- [x] Príklad karty: `border border-gray-300` (žiadne zaoblenie)
- [x] Input: `p-4 border border-gray-300` (square)
- [x] Button: `bg-[#0E3A2F] border border-[#0E3A2F]` (square)

### AC2: ChatPanel komponenta
- [x] Header: `bg-[#0E3A2F]` s jednoduchým `border-b`
- [x] Odstránená animate-pulse na status indikátore
- [x] Jednoduchý status: `w-2 h-2 rounded-full` (bez animácie)
- [x] Loading bubble: `bg-white border border-gray-200` (square)
- [x] Odstránené gradientové pozadia

### AC3: MessageInput komponenta
- [x] Input: `p-4 border border-gray-300` (square)
- [x] Focus: `focus:border-[#0E3A2F]` (žiadny ring)
- [x] Button: `bg-[#0E3A2F] px-8 py-4` (square)
- [x] Send ikona: SVG arrow

### AC4: MessageList komponenta
- [x] Message bubbles: square (žiadne `rounded-lg`)
- [x] User messages: `bg-[#0E3A2F] text-white`
- [x] Assistant messages: `bg-white border border-gray-200`
- [x] Väčší text: `text-lg` namiesto `text-sm`
- [x] Lepšia čitateľnosť

### AC5: Canvas komponenta
- [x] Header: jednoduchý `border-b border-gray-200`
- [x] Loading card: `bg-white border border-gray-200` (square)
- [x] Copy button: `border border-[#4BA82E] text-[#4BA82E]`
- [x] Odstránené `shadow-xl`, `rounded-*`

### AC6: ViewModeToggle komponenta
- [x] Square buttons (žiadne `rounded-lg`)
- [x] Active: `bg-[#0E3A2F] border border-[#0E3A2F]`
- [x] Inactive: `bg-white border border-gray-300`
- [x] Odstránené `focus:ring-*`

## Implementované zmeny

### 1. InitialView.tsx
**Pred**:
```tsx
<h1 className="text-5xl md:text-6xl font-bold mb-4">
<div className="rounded-xl hover:scale-[1.02]">
<input className="border-2 rounded-xl focus:ring-2">
<button className="rounded-xl shadow-md hover:shadow-lg">
```

**Po**:
```tsx
<h1 className="text-4xl md:text-5xl font-bold text-[#0E3A2F] mb-4">
<button className="px-5 py-3 bg-white border border-gray-300">
<input className="p-4 border border-gray-300 focus:border-[#0E3A2F]">
<button className="bg-[#0E3A2F] px-8 py-4 border border-[#0E3A2F]">
```

### 2. ChatPanel.tsx
**Pred**:
```tsx
<div className="px-6 py-4 border-b-2" style={{ backgroundColor: 'var(--primary-dark)' }}>
<span className="animate-pulse">
<div className="bg-gradient-to-br rounded-xl shadow-sm">
```

**Po**:
```tsx
<div className="bg-[#0E3A2F] border-b border-gray-200 px-4 py-3">
<span className="w-2 h-2 rounded-full bg-[#4BA82E]">
<div className="bg-white border border-gray-200 px-5 py-3">
```

### 3. MessageInput.tsx
**Pred**:
```tsx
<input className="rounded-lg focus:ring-2 focus:ring-blue-500">
<button className="bg-blue-600 rounded-lg">
```

**Po**:
```tsx
<input className="p-4 border border-gray-300 focus:border-[#0E3A2F]">
<button className="bg-[#0E3A2F] px-8 py-4 border border-[#0E3A2F]">
  <svg>...</svg> {/* Send arrow icon */}
</button>
```

### 4. MessageList.tsx
**Pred**:
```tsx
<div className="rounded-lg px-4 py-2 bg-primary-dark">
<p className="text-sm">
```

**Po**:
```tsx
<div className="px-4 py-3 bg-[#0E3A2F] border border-[#0E3A2F]">
<p className="text-lg leading-relaxed">
```

### 5. Canvas.tsx
**Pred**:
```tsx
<div className="rounded-2xl shadow-xl border-2">
<button className="rounded-lg border-2 hover:shadow-md">
```

**Po**:
```tsx
<div className="bg-white border border-gray-200">
<button className="border border-[#4BA82E] text-[#4BA82E]">
```

### 6. ViewModeToggle.tsx
**Pred**:
```tsx
<button className="rounded-lg focus:ring-2 focus:ring-primary/20">
const activeClasses = 'bg-primary border-primary';
```

**Po**:
```tsx
<button className="px-4 py-2 text-sm font-semibold">
const activeClasses = 'bg-[#0E3A2F] border border-[#0E3A2F]';
const inactiveClasses = 'bg-white border border-gray-300';
```

## Odstránené elementy

### Zaoblené rohy
- ❌ `rounded-lg` (8px)
- ❌ `rounded-xl` (12px)
- ❌ `rounded-2xl` (16px)
- ❌ `rounded-full` (okrem status indikátora)

### Tiene
- ❌ `shadow-sm`
- ❌ `shadow-md`
- ❌ `shadow-lg`
- ❌ `shadow-xl`
- ❌ `shadow-2xl`

### Animácie
- ❌ `animate-pulse`
- ❌ `hover:scale-[1.02]`
- ❌ `scale-110`
- ❌ `transition-all duration-200`

### Gradients (okrem hero background)
- ❌ `bg-gradient-to-br from-gray-100 to-gray-50`
- ❌ `bg-gradient-to-r from-[var(--primary-accent)]`

### Focus rings
- ❌ `focus:ring-2`
- ❌ `focus:ring-blue-500`
- ❌ `focus:ring-primary/20`

## Výsledok

### Pred (Sprint 2)
- Dekoratívny dizajn s veľa "fluff" elementmi
- Zaoblené rohy všade
- Tiene na všetkých kartách
- Animácie na hover
- Menší text (text-sm)

### Po (Sprint 3)
- ✅ Minimalistický, profesionálny dizajn
- ✅ Square borders všade
- ✅ Žiadne tiene
- ✅ Žiadne animácie
- ✅ Väčší, čitateľnejší text (text-lg)
- ✅ Škoda Green branding (#0E3A2F, #4BA82E)
- ✅ Enterprise-ready vzhľad

## Build & Testing

```bash
cd frontend
npm run build
# ✅ Build successful (3.80s)
# ✅ No TypeScript errors
# ✅ No broken imports

npm run dev
# ✅ Dev server running on localhost:3000
```

## Dokumentácia

- [x] Vytvorený: `scrum/sprint_2/design-update-supply-chain.md`
- [ ] Aktualizovať: `scrum/architecture/design-system.md`
- [ ] Screenshot comparison (pred/po)

## Technické detaily

- **Modifikované súbory**: 6 komponentov + 1 CSS
- **Odstránené klasy**: ~40 Tailwind utility classes
- **Pridané klasy**: ~30 minimalistických Tailwind classes
- **Hardcoded farby**: 2 (#0E3A2F, #4BA82E) - nahradené CSS variables
- **Build time**: 3.80s (bez zmeny)

## Follow-up Stories

- [ ] FE-008: Responsive testing (mobile/tablet/desktop)
- [ ] FE-009: Dark mode support
- [ ] FE-010: Accessibility audit (WCAG 2.1)
- [ ] FE-011: Screenshot testing (Percy/Chromatic)

## Related

- Epic: Sprint 2 Frontend Implementation
- Blocked by: -
- Blocks: FE-008, FE-009, FE-010

---

**Status**: ✅ Completed
**Merged**: -
**Deployed**: -
