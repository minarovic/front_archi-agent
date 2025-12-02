# Supply Chain Frontend - Design System

Kompletná dokumentácia vizuálneho dizajnu pre migráciu do iného projektu.

---

## 1. Farebná paleta (Color Palette)

### 1.1 Primárne farby (Škoda Brand)

| Názov                        | Hex kód   | RGB                | Použitie                                                                                |
| ---------------------------- | --------- | ------------------ | --------------------------------------------------------------------------------------- |
| **Škoda Green**              | `#4BA82E` | rgb(75, 168, 46)   | Primárna akcentová farba - tlačidlá, badže, border-left akcenty, metriky, aktívne stavy |
| **Škoda Dark Green**         | `#0E3A2F` | rgb(14, 58, 47)    | Header backgrounds, primárne tlačidlá, hlavný text na tmavom pozadí                     |
| **Škoda Light Green**        | `#78FAAE` | rgb(120, 250, 174) | Sekundárny text na tmavom pozadí, hover stavy, accent text v headeroch                  |
| **Škoda Extra Dark**         | `#1a5a42` | rgb(26, 90, 66)    | Vnorené panely v tmavých headeroch (metric badge backgrounds)                           |
| **Light Green Background**   | `#E8F5E3` | rgb(232, 245, 227) | Hover stavy v tabuľkách, badge backgrounds, tier badže                                  |
| **Dark Text on Light Green** | `#2D7A1C` | rgb(45, 122, 28)   | Text v zelených badge elementoch                                                        |

### 1.2 Neutrálne farby (Grayscale)

| Názov        | Hex kód   | RGB                | Použitie                                                              |
| ------------ | --------- | ------------------ | --------------------------------------------------------------------- |
| **White**    | `#FFFFFF` | rgb(255, 255, 255) | Hlavné pozadie kariet, vstupné polia                                  |
| **Gray 50**  | `#F9FAFB` | rgb(249, 250, 251) | Sekundárne pozadia (page background), alternating rows, table headers |
| **Gray 100** | `#F3F4F6` | rgb(243, 244, 246) | Badge backgrounds, disabled input states, country tags                |
| **Gray 200** | `#E5E7EB` | rgb(229, 231, 235) | Bordery, dividers, React Flow background dots                         |
| **Gray 300** | `#D1D5DB` | rgb(209, 213, 219) | Input borders, sekundárne bordery, chat border-left                   |
| **Gray 400** | `#9CA3AF` | rgb(156, 163, 175) | Placeholder text, disabled ikony, metadata text                       |
| **Gray 500** | `#6B7280` | rgb(107, 114, 128) | Sekundárny text, uppercase labels, assistant label                    |
| **Gray 600** | `#4B5563` | rgb(75, 85, 99)    | Normálny text v metrikách, descriptions                               |
| **Gray 700** | `#374151` | rgb(55, 65, 81)    | Štandardný body text, table cell text                                 |
| **Gray 900** | `#111827` | rgb(17, 24, 39)    | Primárny text, headings, company names                                |

### 1.3 Sémantické farby (Risk & Status)

#### Červená (High Risk / Error)
| Názov       | Hex kód   | Použitie                   |
| ----------- | --------- | -------------------------- |
| **Red 50**  | `#FEF2F2` | High risk background       |
| **Red 100** | `#FEE2E2` | High risk badge background |
| **Red 200** | `#FECACA` | High risk badge border     |
| **Red 500** | `#EF4444` | High risk border, ikony    |
| **Red 600** | `#DC2626` | High risk text             |
| **Red 700** | `#B91C1C` | High risk warning text     |
| **Red 800** | `#991B1B` | High risk dark text        |

#### Žltá (Medium Risk / Warning)
| Názov          | Hex kód   | Použitie                         |
| -------------- | --------- | -------------------------------- |
| **Yellow 50**  | `#FFFBEB` | Medium risk / warning background |
| **Yellow 200** | `#FDE68A` | Warning badge border             |
| **Yellow 500** | `#F59E0B` | Medium risk border               |
| **Yellow 600** | `#D97706` | Warning text                     |
| **Yellow 700** | `#B45309` | Warning dark text                |
| **Yellow 800** | `#92400E` | Warning extra dark text          |

#### Oranžová (Company B / Alternative)
| Názov          | Hex kód   | Použitie                    |
| -------------- | --------- | --------------------------- |
| **Orange 50**  | `#FFF7ED` | Company B hover background  |
| **Orange 100** | `#FFEDD5` | Company B badge background  |
| **Orange 500** | `#F97316` | Company B border            |
| **Orange 600** | `#EA580C` | Company B header background |
| **Orange 800** | `#9A3412` | Company B text              |

#### Modrá (Company A / Info)
| Názov        | Hex kód   | Použitie                                    |
| ------------ | --------- | ------------------------------------------- |
| **Blue 50**  | `#EFF6FF` | Company A hover background, follow-up info  |
| **Blue 100** | `#DBEAFE` | Company A badge background, follow-up badge |
| **Blue 200** | `#BFDBFE` | Ownership data borders                      |
| **Blue 600** | `#2563EB` | Company A header background                 |
| **Blue 700** | `#1D4ED8` | Company A text, follow-up badge text        |
| **Blue 800** | `#1E40AF` | Company A dark text                         |
| **Blue 900** | `#1E3A8A` | Ownership data text                         |

#### Zelená (Success / Stable)
| Názov         | Hex kód   | Použitie                  |
| ------------- | --------- | ------------------------- |
| **Green 50**  | `#F0FDF4` | Stable/success background |
| **Green 100** | `#DCFCE7` | Success badge background  |
| **Green 300** | `#86EFAC` | Success border            |
| **Green 600** | `#16A34A` | Stable/success text       |
| **Green 700** | `#15803D` | Success check text        |
| **Green 800** | `#166534` | Success dark text         |

#### Amber (Critical Warning)
| Názov         | Hex kód   | Použitie                    |
| ------------- | --------- | --------------------------- |
| **Amber 50**  | `#FFFBEB` | Critical warning background |
| **Amber 500** | `#F59E0B` | Critical warning border     |
| **Amber 800** | `#92400E` | Critical warning text       |
| **Amber 900** | `#78350F` | Critical warning dark text  |

---

## 2. Typografia

### 2.1 Font rodina

```css
/* Primárny font - Geist (Google Fonts variable font) */
font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;

/* Monospace font - pre kódy, DUNS, country codes */
font-family: var(--font-geist-mono), 'Courier New', monospace;

/* Fallback pre body */
font-family: Arial, Helvetica, sans-serif;
```

**Import v Next.js:**
```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### 2.2 Font váhy

| Váha     | CSS hodnota | Tailwind class  | Použitie                                     |
| -------- | ----------- | --------------- | -------------------------------------------- |
| Regular  | 400         | `font-normal`   | Body text, descriptions, cell content        |
| Medium   | 500         | `font-medium`   | Tlačidlá, sekundárne labels, input labels    |
| Semibold | 600         | `font-semibold` | Subheadings, dôležité metriky, company names |
| Bold     | 700         | `font-bold`     | Hlavné headings, veľké čísla, card titles    |

### 2.3 Font veľkosti

| Veľkosť | Pixels | Tailwind    | Použitie                                     |
| ------- | ------ | ----------- | -------------------------------------------- |
| 5xl     | 48px   | `text-5xl`  | Hero headings (welcome screen)               |
| 4xl     | 36px   | `text-4xl`  | Veľké metriky v dashboardoch                 |
| 3xl     | 30px   | `text-3xl`  | Hlavné headings v headeroch, company names   |
| 2xl     | 24px   | `text-2xl`  | Sekčné headings, quick stats                 |
| xl      | 20px   | `text-xl`   | Card headings, section titles                |
| lg      | 18px   | `text-lg`   | Chat messages, subheadings, narrative text   |
| base    | 16px   | `text-base` | Body text, standard paragraphs               |
| sm      | 14px   | `text-sm`   | Sekundárny text, table cells, form labels    |
| xs      | 12px   | `text-xs`   | Labels, uppercase trackers, badges, metadata |

### 2.4 Line heights

| Názov   | Hodnota | Tailwind          | Použitie                  |
| ------- | ------- | ----------------- | ------------------------- |
| Tight   | 1.2     | `leading-tight`   | Headings, labels          |
| Snug    | 1.3     | `leading-snug`    | Node labels, compact text |
| Normal  | 1.5     | `leading-normal`  | Body text                 |
| Relaxed | 1.625   | `leading-relaxed` | Chat messages, narratives |

### 2.5 Text styling patterns

```css
/* Uppercase labels */
.uppercase-label {
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
}

/* Monospace pre kódy */
.code-text {
  font-family: var(--font-geist-mono);
  font-size: 12px;
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 4px;
}
```

---

## 3. Flat Design Princípy

### 3.1 Border Radius (Zaoblenie rohov)

Projekt používa **flat design** s minimálnym zaoblením:

| Element         | Border Radius | Tailwind       | Poznámka                              |
| --------------- | ------------- | -------------- | ------------------------------------- |
| Hlavné karty    | 0px           | žiadny class   | Sharp corners (flat design)           |
| Narrative cards | 8px           | `rounded-lg`   | Výnimka - mäkší vzhľad pre AI content |
| Tlačidlá        | 0px           | žiadny class   | Flat buttons                          |
| Input fields    | 0px           | žiadny class   | Flat inputs                           |
| Badges (pill)   | 9999px        | `rounded-full` | Fully rounded                         |
| Badges (tag)    | 4px           | `rounded`      | Slightly rounded                      |
| Graph nodes     | 2-3px         | inline style   | Minimálne zaoblenie                   |

### 3.2 Shadows (Tieňovanie)

| Typ          | CSS hodnota                                                         | Tailwind    | Použitie                              |
| ------------ | ------------------------------------------------------------------- | ----------- | ------------------------------------- |
| Card shadow  | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` | `shadow-lg` | Hlavné karty, narrative cards         |
| Light shadow | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)`         | `shadow`    | Metric cards, sekundárne elementy     |
| Node shadow  | `0 1px 3px 0 rgba(0,0,0,0.1)`                                       | inline      | Graph nodes                           |
| No shadow    | none                                                                | žiadny      | Tables, input fields (prefer borders) |

**Preferencia:** Bordery namiesto tieňov (`border border-gray-200`)

### 3.3 Border Styling

#### Border-top accent (Hero headers)
```css
.hero-card {
  border-top: 4px solid #4BA82E;
  border: 1px solid #E5E7EB;
}
/* Tailwind: border-t-4 border-t-[#4BA82E] border border-gray-200 */
```

#### Border-left accent (Narrative/Metric cards)
```css
.accent-card {
  border-left: 4px solid #4BA82E;
}
/* Tailwind: border-l-4 border-[#4BA82E] */
```

#### Dividers
```css
/* Horizontal divider */
.divider-x { border-top: 1px solid #E5E7EB; }
/* Tailwind: divide-y divide-gray-200 */

/* Vertical divider in grid */
.divider-y { border-left: 1px solid #E5E7EB; }
/* Tailwind: divide-x divide-gray-200 */
```

---

## 4. Layout Patterns

### 4.1 Hlavná štruktúra (Split Layout)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPLIT LAYOUT (after first message)           │
├──────────────────────┬──────────────────────────────────────────┤
│     CHAT PANEL       │           CANVAS / VISUALIZATION         │
│                      │                                          │
│   Width: 600px       │   Width: flex-1 (remaining space)        │
│   Background: white  │   Background: #F9FAFB (gray-50)          │
│   Border-right: 1px  │   Padding: 16px (mobile) / 32px (desktop)│
│   gray-200           │                                          │
│                      │                                          │
│   Fixed width on     │   Scrollable content                     │
│   desktop (md+)      │   max-width: 1152px (6xl) centered       │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

**CSS implementácia:**
```css
.split-container {
  display: flex;
  flex-direction: column; /* mobile */
  height: 100vh;
  background: #F9FAFB;
  overflow: hidden;
}

@media (min-width: 768px) {
  .split-container {
    flex-direction: row;
  }
}

.chat-panel {
  width: 100%;
  flex-shrink: 0;
  border-right: 1px solid #E5E7EB;
  background: white;
  height: 100%;
  transition: all 500ms ease-in-out;
}

@media (min-width: 768px) {
  .chat-panel {
    width: 600px;
  }
}

.canvas-panel {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background: #F9FAFB;
  padding: 16px;
}

@media (min-width: 768px) {
  .canvas-panel {
    padding: 32px;
  }
}
```

### 4.2 Initial State (Welcome Screen)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              VERTICALLY & HORIZONTALLY CENTERED                 │
│                                                                 │
│         ┌─────────────────────────────────────────┐            │
│         │          Supply Chain Intelligence       │            │
│         │      Ready to analyze supply chains      │            │
│         │                                          │            │
│         │   ┌────────────┐  ┌────────────┐        │            │
│         │   │ Example 1  │  │ Example 2  │        │            │
│         │   └────────────┘  └────────────┘        │            │
│         │   ┌────────────┐  ┌────────────┐        │            │
│         │   │ Example 3  │  │ Example 4  │        │            │
│         │   └────────────┘  └────────────┘        │            │
│         │                                          │            │
│         │   ┌──────────────────────────┐ ┌────┐  │            │
│         │   │ Ask about suppliers...   │ │Send│  │            │
│         │   └──────────────────────────┘ └────┘  │            │
│         │                                          │            │
│         │      Powered by Škoda Supply Chain       │            │
│         └─────────────────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #F9FAFB, #FFFFFF);
  padding: 16px 32px;
}

.welcome-content {
  max-width: 672px; /* max-w-2xl */
  width: 100%;
}
```

### 4.3 Hero Header Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████ border-t-4 green  │
├─────────────────────────────────────────────────────────────────┤
│ DARK HEADER (bg-[#0E3A2F])                                      │
│ padding: 24px 32px                                              │
│ ┌───────────────────────────────────────┬───────────────────┐  │
│ │ COMPANY NAME (3xl bold white)         │ ┌───────────────┐ │  │
│ │ Country • Type (base #78FAAE)         │ │ KEY METRIC    │ │  │
│ │                                        │ │ (nested card) │ │  │
│ │                                        │ │ bg-[#1a5a42]  │ │  │
│ │                                        │ └───────────────┘ │  │
│ └───────────────────────────────────────┴───────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ METRICS GRID (4 columns, divided)                               │
│ ┌────────────┬────────────┬────────────┬────────────┐          │
│ │   VALUE    │   VALUE    │   VALUE    │   VALUE    │          │
│ │   (4xl)    │   (4xl)    │   (4xl)    │   (4xl)    │          │
│ │  #4BA82E   │  #4BA82E   │  #4BA82E   │  orange    │          │
│ │   label    │   label    │   label    │   label    │          │
│ │   (xs)     │   (xs)     │   (xs)     │   (xs)     │          │
│ └────────────┴────────────┴────────────┴────────────┘          │
│ padding: 24px, text-center, divide-x divide-gray-200            │
├─────────────────────────────────────────────────────────────────┤
│ BOTTOM SECTION (2 columns)                                      │
│ ┌─────────────────────────┬─────────────────────────┐          │
│ │ Geographic Presence     │ Key Indicators          │          │
│ │ [Country tags...]       │ List items...           │          │
│ └─────────────────────────┴─────────────────────────┘          │
│ bg-gray-50, padding: 20px 24px                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Grid Layouts

```css
/* 4-column metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

/* 2-column equal split */
.two-column {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* Responsive metrics */
.responsive-metrics {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .responsive-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-metrics {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 5. Komponenty

### 5.1 Narrative Card (AI Insight)

```css
.narrative-card {
  background: #FFFFFF;
  border-left: 4px solid #4BA82E;
  border-radius: 8px; /* rounded-lg - výnimka z flat design */
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.narrative-card-loading {
  background: linear-gradient(to bottom right, #F9FAFB, #FFFFFF);
}

.narrative-icon {
  font-size: 24px;
  margin-top: 2px;
}

.narrative-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.narrative-content {
  font-size: 16px;
  line-height: 1.625;
  color: #374151;
  white-space: pre-wrap;
}
```

**HTML štruktúra:**
```html
<div class="narrative-card">
  <div class="flex items-start gap-3">
    <div class="narrative-icon">🏢</div>
    <div class="flex-1">
      <h3 class="narrative-title">Ownership Insights</h3>
      <p class="narrative-content">LLM generated text here...</p>
    </div>
  </div>
</div>
```

### 5.2 Metric Card

```css
.metric-card {
  background: #FFFFFF;
  padding: 20px;
  border-left: 4px solid #4BA82E;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.metric-card-winner {
  background: #F0FDF4; /* green-50 */
  border-left-color: #16A34A; /* green-600 */
}

.metric-card-danger {
  background: #FEF2F2; /* red-50 */
  border-left-color: #EF4444; /* red-500 */
}

.metric-label {
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #4BA82E;
  margin-bottom: 4px;
}

.metric-description {
  font-size: 12px;
  color: #9CA3AF;
}
```

### 5.3 Button Styles

```css
/* Primary Button (Dark Green) */
.btn-primary {
  background: #0E3A2F;
  color: #FFFFFF;
  padding: 12px 24px;
  font-weight: 500;
  border: 1px solid #0E3A2F;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 150ms;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Secondary Button (White with border) */
.btn-secondary {
  background: #FFFFFF;
  color: #374151;
  padding: 8px 16px;
  font-weight: 600;
  border: 1px solid #D1D5DB;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #F9FAFB;
}

/* Toggle Button - Active */
.btn-toggle-active {
  background: #4BA82E;
  color: #FFFFFF;
  border: 1px solid #4BA82E;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
}

/* Toggle Button - Inactive */
.btn-toggle-inactive {
  background: #FFFFFF;
  color: #374151;
  border: 1px solid #D1D5DB;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
}

.btn-toggle-inactive:hover {
  background: #F3F4F6;
}

/* Example Prompt Button (Welcome screen) */
.btn-prompt {
  background: #FFFFFF;
  color: #374151;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #D1D5DB;
  text-align: left;
  width: 100%;
  cursor: pointer;
}

.btn-prompt:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
}
```

### 5.4 Input Fields

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  color: #111827;
  background: #FFFFFF;
  font-size: 16px;
}

.input::placeholder {
  color: #9CA3AF;
}

.input:focus {
  outline: none;
  border-color: #0E3A2F;
}

.input:disabled {
  background: #F3F4F6;
  cursor: not-allowed;
}

/* Large input (welcome screen) */
.input-large {
  padding: 16px;
  font-size: 16px;
}
```

### 5.5 Table Styles

```css
.table {
  width: 100%;
  min-width: 100%;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  background: #F9FAFB;
}

.table-header th {
  padding: 12px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.table-header-sortable {
  cursor: pointer;
}

.table-header-sortable:hover {
  background: #F3F4F6;
}

.table-body {
  border-top: 1px solid #E5E7EB;
}

.table-row {
  transition: background-color 150ms;
}

.table-row:hover {
  background: #E8F5E3;
}

.table-row-high-risk {
  background: #FEF2F2;
}

.table-row-high-risk:hover {
  background: #FEE2E2;
}

.table-cell {
  padding: 16px 24px;
  font-size: 14px;
  white-space: nowrap;
}

/* Dividers between rows */
.table-body tr + tr {
  border-top: 1px solid #E5E7EB;
}

/* Sort icon */
.sort-icon {
  color: #4BA82E;
  margin-left: 8px;
}
```

### 5.6 Badge Styles

```css
/* Tier Badge (rounded pill) */
.badge-tier {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #E8F5E3;
  color: #2D7A1C;
}

/* Risk Badges */
.badge-risk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.badge-risk-high {
  background: #FEF2F2;
  color: #991B1B;
  border-color: #FECACA;
}

.badge-risk-medium {
  background: #FFFBEB;
  color: #92400E;
  border-color: #FDE68A;
}

.badge-risk-stable {
  background: #F0FDF4;
  color: #166534;
  border-color: #BBF7D0;
}

/* Country Tag */
.tag-country {
  display: inline-block;
  padding: 4px 12px;
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* Country Code (inline) */
.country-code {
  font-family: var(--font-geist-mono);
  font-size: 12px;
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Follow-up Badge */
.badge-followup {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #DBEAFE;
  color: #1D4ED8;
}

/* High Risk Inline Badge */
.badge-inline-risk {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #FEE2E2;
  color: #991B1B;
}
```

### 5.7 Chat Interface

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F9FAFB;
  overflow: hidden;
  border: 1px solid #E5E7EB;
}

/* Chat Header */
.chat-header {
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0E3A2F;
}

/* Message List */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Message */
.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-role-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.message-role-user {
  color: #4BA82E;
}

.message-role-assistant {
  color: #6B7280;
}

.message-content-assistant {
  padding-left: 16px;
  border-left: 2px solid #D1D5DB;
}

.message-text {
  font-size: 18px;
  line-height: 1.625;
  color: #111827;
  white-space: pre-wrap;
}

/* Chat Input Area */
.chat-input-area {
  background: #FFFFFF;
  border-top: 1px solid #E5E7EB;
  padding: 16px;
}

.chat-input-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

### 5.8 Loading States

```css
/* Spinner */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #4BA82E;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Bouncing Dots (Thinking indicator) */
.thinking-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thinking-dot {
  width: 8px;
  height: 8px;
  background: #4BA82E;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.thinking-dot:nth-child(2) {
  animation-delay: 150ms;
}

.thinking-dot:nth-child(3) {
  animation-delay: 300ms;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Follow-up Loading Overlay */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-card {
  background: #FFFFFF;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 2px solid #4BA82E;
  max-width: 448px;
}
```

---

## 6. React Flow (Graph Visualization)

### 6.1 Node Dimensions

| Tier/Depth              | Width | Height | Border Radius |
| ----------------------- | ----- | ------ | ------------- |
| Tier 1 / Depth 0 (Root) | 100px | 50px   | 2px           |
| Tier 2 / Depth 1        | 70px  | 45px   | 3px           |
| Tier 3 / Depth 2+       | 70px  | 40px   | 3px           |

### 6.2 Supply Chain Node

```css
/* Tier 1 (Root/Focal entity) */
.node-tier1 {
  width: 100px;
  height: 50px;
  padding: 8px 10px;
  background: #0E3A2F;
  border: 2px solid #78FAAE;
  border-radius: 2px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.node-tier1-label {
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
}

.node-tier1-company {
  font-size: 11px;
  font-weight: 400;
  color: #78FAAE;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tier 2/3 Nodes */
.node-tier2 {
  width: 70px;
  height: 45px;
  padding: 4px 6px;
  background: #FFFFFF;
  border: 1px solid; /* dynamic based on risk */
  border-radius: 3px;
}

.node-tier3 {
  width: 70px;
  height: 40px;
  padding: 4px 6px;
  background: #FFFFFF;
  border: 1px solid;
  border-radius: 3px;
}

/* Risk-based colors for border and text */
.node-risk-low {
  border-color: #16A34A;
  color: #16A34A;
}

.node-risk-medium {
  border-color: #F59E0B;
  color: #F59E0B;
}

.node-risk-high {
  border-color: #EF4444;
  color: #EF4444;
}
```

### 6.3 Ownership Node

```css
.ownership-node {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: border-color 150ms ease-in-out;
}

.ownership-node:hover {
  border-color: #78FAAE;
}

.ownership-node-root {
  width: 100px;
  height: 50px;
  padding: 8px 10px;
  background: #0E3A2F;
  border: 2px solid #78FAAE;
}

.ownership-node-child {
  width: 70px;
  height: 45px; /* or 40px for depth 2+ */
  padding: 4px 6px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
}

.ownership-label {
  font-size: 10px; /* 8px for children */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ownership-company {
  font-size: 11px; /* 9px for children */
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 6.4 Edge Styles

```css
.edge-default {
  stroke: #D1D5DB;
  stroke-width: 1px;
}

/* Animated edge (optional) */
.edge-animated {
  stroke: #4BA82E;
  stroke-dasharray: 5;
  animation: dash 0.5s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}
```

### 6.5 React Flow Background

```css
.reactflow-background {
  background: #FFFFFF;
}

/* Background dots */
.reactflow-dots {
  gap: 16px;
  size: 1px;
  color: #E5E7EB;
}
```

---

## 7. Animácie a Transitions

### 7.1 Layout Transitions

```css
.layout-transition {
  transition: all 500ms ease-in-out;
}

.opacity-transition {
  transition: opacity 500ms ease-in-out;
}

/* Fade in animation */
.animate-fade-in {
  animation: fadeIn 500ms ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 7.2 Hover Transitions

```css
.hover-transition {
  transition: background-color 150ms ease-in-out;
}

.border-hover-transition {
  transition: border-color 150ms ease-in-out;
}
```

---

## 8. Spacing System

| Jednotka | Pixels | Tailwind       | Použitie                       |
| -------- | ------ | -------------- | ------------------------------ |
| 0.5      | 2px    | `p-0.5`        | Micro spacing (badge padding)  |
| 1        | 4px    | `p-1`          | Icon margins, tight spacing    |
| 1.5      | 6px    | `p-1.5`        | Small badge padding            |
| 2        | 8px    | `p-2`, `gap-2` | Small gaps, badge padding      |
| 2.5      | 10px   | `p-2.5`        | Badge padding                  |
| 3        | 12px   | `p-3`, `gap-3` | Input padding, standard gaps   |
| 4        | 16px   | `p-4`, `gap-4` | Card padding, section gaps     |
| 5        | 20px   | `p-5`          | Metric card padding            |
| 6        | 24px   | `p-6`, `gap-6` | Large padding, section spacing |
| 8        | 32px   | `p-8`          | Page padding (desktop)         |

---

## 9. Responsive Breakpoints

| Breakpoint | Min-width | Tailwind prefix | Použitie                       |
| ---------- | --------- | --------------- | ------------------------------ |
| Mobile     | 0px       | (default)       | Stack layout, full-width       |
| Tablet     | 768px     | `md:`           | Split layout, 2-column grids   |
| Desktop    | 1024px    | `lg:`           | 4-column grids, expanded views |

---

## 10. Ikonografia

### 10.1 Emoji ikony

Projekt používa emoji pre vizuálne indikátory:

| Emoji | Použitie                |
| ----- | ----------------------- |
| 💬     | Chat/message prompt     |
| 🔗     | Supply chain overlap    |
| 🌍     | Geographic/global       |
| ⚠️     | Warning/medium risk     |
| ✅     | Success/stable          |
| 🔴     | High risk               |
| 🛡️     | Risk protection         |
| 📊     | Comparison/analytics    |
| 🏢     | Ownership/company       |
| 🤝     | Common/shared           |
| 🗺️     | Map view                |
| 🏆     | Winner                  |
| 🔄     | Redundancy              |
| ⚡     | Follow-up (quick)       |
| ⭐     | Special (voting rights) |
| 🤔     | Thinking                |

### 10.2 SVG ikony (Heroicons štýl)

```html
<!-- Send icon -->
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
</svg>

<!-- Home icon -->
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>

<!-- Arrow up-right icon -->
<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
</svg>
```

Štýl: **Outline (stroke)**, nie filled. Stroke-width: 2.

---

## 11. Z-Index Hierarchy

| Z-index | Použitie                 |
| ------- | ------------------------ |
| 0       | Base content             |
| 10      | Sticky headers           |
| 20      | Dropdowns                |
| 30      | Tooltips                 |
| 40      | Modals backdrop          |
| 50      | Loading overlays, modals |
| 60      | Toasts/notifications     |

---

## 12. CSS Variables (Design Tokens)

```css
:root {
  /* Primary Colors */
  --color-primary: #4BA82E;
  --color-primary-dark: #0E3A2F;
  --color-primary-light: #78FAAE;
  --color-primary-extra-dark: #1a5a42;
  --color-primary-bg: #E8F5E3;
  --color-primary-text: #2D7A1C;

  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* Semantic Colors */
  --color-success: #16A34A;
  --color-success-bg: #F0FDF4;
  --color-warning: #F59E0B;
  --color-warning-bg: #FFFBEB;
  --color-danger: #EF4444;
  --color-danger-bg: #FEF2F2;
  --color-info: #2563EB;
  --color-info-bg: #EFF6FF;

  /* Typography */
  --font-sans: var(--font-geist-sans), Arial, Helvetica, sans-serif;
  --font-mono: var(--font-geist-mono), 'Courier New', monospace;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

---

## 13. Tailwind Konfigurácia

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'skoda': {
          'green': '#4BA82E',
          'dark': '#0E3A2F',
          'light': '#78FAAE',
          'extra-dark': '#1a5a42',
          'bg': '#E8F5E3',
          'text': '#2D7A1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Courier New', 'monospace'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'spin': 'spin 1s linear infinite',
        'fade-in': 'fadeIn 500ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## 14. Príklady použitia

### 14.1 Hero Header s metrikami

```html
<div class="bg-white overflow-hidden border-t-4 border-[#4BA82E] border border-gray-200">
  <!-- Dark Header -->
  <div class="bg-[#0E3A2F] px-8 py-6">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h2 class="text-3xl font-bold text-white mb-2">Company Name</h2>
        <p class="text-[#78FAAE] text-base font-medium">Country • Type</p>
      </div>
      <div class="bg-[#1a5a42] px-6 py-3 border border-[#78FAAE]">
        <p class="text-[#78FAAE] text-xs uppercase tracking-wide mb-1">Key Metric</p>
        <p class="text-white text-2xl font-bold">42</p>
      </div>
    </div>
  </div>

  <!-- Metrics Grid -->
  <div class="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200">
    <div class="p-6 text-center">
      <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Metric 1</p>
      <p class="text-4xl font-bold text-[#4BA82E]">123</p>
      <p class="text-xs text-gray-400 mt-1">Description</p>
    </div>
    <!-- Repeat for other metrics -->
  </div>
</div>
```

### 14.2 Metric Card s akcentom

```html
<div class="bg-white p-5 shadow border-l-4 border-[#4BA82E]">
  <div class="flex items-center justify-between mb-2">
    <p class="text-sm font-medium text-gray-700">Metric Name</p>
    <span class="text-xl">🔗</span>
  </div>
  <p class="text-4xl font-bold text-[#4BA82E] mb-1">42</p>
  <p class="text-xs text-gray-500">Description text</p>
</div>
```

### 14.3 Risk Badge

```html
<!-- High Risk -->
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-800 border-red-200">
  <span>🔴</span>
  <span>HIGH RISK</span>
</span>

<!-- Stable -->
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-800 border-green-200">
  <span>✅</span>
  <span>STABLE</span>
</span>
```

### 14.4 Table s hover efektom

```html
<table class="min-w-full bg-white border border-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Column
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200">
    <tr class="hover:bg-[#E8F5E3] transition-colors">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        Cell content
      </td>
    </tr>
  </tbody>
</table>
```

---

Táto dokumentácia obsahuje všetky potrebné informácie pre replikáciu dizajnu v inom projekte bez potreby referencovania pôvodných súborov.
