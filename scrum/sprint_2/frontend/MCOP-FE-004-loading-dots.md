# MCOP-FE-004: Loading Dots Animation

**Priorita:** 🟡 P2 (Should Have)
**Effort:** 15 minút
**Status:** planned
**Závislosť:** žiadna

---

## 📋 User Story

> Ako používateľ chcem vidieť animované bodky namiesto spinnera počas čakania na odpoveď, aby som vedel že systém pracuje a mal lepší vizuálny zážitok.

---

## ✅ Acceptance Criteria

- [ ] AC1: 3 animované bodky s bounce efektom
- [ ] AC2: Staggered delay (0ms, 150ms, 300ms)
- [ ] AC3: Zelená farba (`bg-[#4BA82E]`)
- [ ] AC4: Text "Thinking..." vedľa bodiek
- [ ] AC5: Použité v ChatPanel počas čakania na response
- [ ] AC6: Použité v Canvas počas loading stavu

---

## 🎨 Design Špecifikácia

### Loading Dots

```
  ●   ●   ●   Thinking...
 ↑   ↑   ↑
 0ms 150ms 300ms (animation-delay)
```

### Animácia
- Tailwind `animate-bounce`
- Staggered delay pre wave efekt
- Veľkosť bodiek: `w-2 h-2` (8px)

### Farby
- Bodky: `bg-[#4BA82E]` (primary accent)
- Text: `text-gray-500`

---

## 🔧 Technická Implementácia

### Nový komponent: `src/components/LoadingDots.tsx`

```typescript
import React from 'react';

interface LoadingDotsProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingDots({
  text = 'Thinking...',
  size = 'md',
  color = '#4BA82E'
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotClass = sizeClasses[size];

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`${dotClass} rounded-full animate-bounce`}
        style={{ backgroundColor: color, animationDelay: '0ms' }}
      />
      <div
        className={`${dotClass} rounded-full animate-bounce`}
        style={{ backgroundColor: color, animationDelay: '150ms' }}
      />
      <div
        className={`${dotClass} rounded-full animate-bounce`}
        style={{ backgroundColor: color, animationDelay: '300ms' }}
      />
      {text && (
        <span className="text-gray-500 ml-2 text-sm">{text}</span>
      )}
    </div>
  );
}

// Varianta bez textu pre inline použitie
export function LoadingDotsInline() {
  return (
    <span className="inline-flex items-center space-x-1">
      <span
        className="w-1 h-1 rounded-full bg-[#4BA82E] animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-1 h-1 rounded-full bg-[#4BA82E] animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1 h-1 rounded-full bg-[#4BA82E] animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </span>
  );
}
```

### Použitie v ChatPanel.tsx

```typescript
import { LoadingDots } from './LoadingDots';

export function ChatPanel() {
  const { messages, isLoading } = useChatStore();

  return (
    <div className="flex flex-col h-full">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 py-4">
            <div className="w-8 h-8 rounded-full bg-[#0E3A2F] flex items-center justify-center text-white text-sm">
              🤖
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <LoadingDots text="Thinking..." />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput disabled={isLoading} />
    </div>
  );
}
```

### Použitie v Canvas.tsx

```typescript
import { LoadingDots } from './LoadingDots';

export function Canvas({ isLoading, diagram }: CanvasProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingDots text="Generating diagram..." size="lg" />
          <p className="text-gray-400 text-xs mt-4">
            This usually takes 5-10 seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-4">
      <MermaidDiagram code={diagram} />
    </div>
  );
}
```

### CSS Custom Animation (voliteľné)

```css
/* src/index.css */

/* Smooth bounce animation */
@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

.loading-dot {
  animation: dot-bounce 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) { animation-delay: 0ms; }
.loading-dot:nth-child(2) { animation-delay: 160ms; }
.loading-dot:nth-child(3) { animation-delay: 320ms; }
```

---

## 🧪 Playwright Test Scenáre

### Test Suite: `tests/e2e/loading-states.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Loading Dots Animation', () => {

  test('should show loading dots while waiting for response', async ({ page }) => {
    await page.goto('/');

    // Send a query
    await page.fill('input[placeholder*="Ask anything"]', 'List all tables');
    await page.click('button:has-text("Analyze")');

    // Loading dots should appear
    await expect(page.getByText('Thinking...')).toBeVisible();

    // Three dots should be present
    const dots = page.locator('.animate-bounce');
    await expect(dots).toHaveCount(3);
  });

  test('loading dots should disappear after response', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'Hello');
    await page.click('button:has-text("Analyze")');

    // Wait for response
    await page.waitForSelector('[data-testid="agent-message"]', { timeout: 30000 });

    // Loading dots should be gone
    await expect(page.getByText('Thinking...')).not.toBeVisible();
  });

  test('canvas should show loading state during diagram generation', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'Generate ER diagram');
    await page.click('button:has-text("Analyze")');

    // Canvas loading state
    await expect(page.getByText(/Generating diagram/i)).toBeVisible();
  });

  test('loading dots should have staggered animation', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="Ask anything"]', 'Test');
    await page.click('button:has-text("Analyze")');

    // Check animation delays
    const dots = page.locator('.animate-bounce');

    // First dot should have 0ms delay
    await expect(dots.nth(0)).toHaveCSS('animation-delay', '0ms');
    // Second dot should have 150ms delay
    await expect(dots.nth(1)).toHaveCSS('animation-delay', '150ms');
    // Third dot should have 300ms delay
    await expect(dots.nth(2)).toHaveCSS('animation-delay', '300ms');
  });

});
```

---

## 📦 Deliverables

| Súbor                              | Akcia                        |
| ---------------------------------- | ---------------------------- |
| `src/components/LoadingDots.tsx`   | **Vytvoriť**                 |
| `src/components/ChatPanel.tsx`     | Pridať loading indicator     |
| `src/components/Canvas.tsx`        | Pridať loading state         |
| `src/index.css`                    | (Voliteľné) Custom animation |
| `tests/e2e/loading-states.spec.ts` | **Vytvoriť**                 |

---

## 🎯 Varianty použitia

| Miesto                        | Text                    | Veľkosť |
| ----------------------------- | ----------------------- | ------- |
| Chat (čakanie na odpoveď)     | "Thinking..."           | md      |
| Canvas (generovanie diagramu) | "Generating diagram..." | lg      |
| Button (submit)               | bez textu               | sm      |
| Inline v texte                | bez textu               | sm      |

---

## ✅ Definition of Done

- [ ] LoadingDots komponent implementovaný
- [ ] Staggered animation funguje
- [ ] Použité v ChatPanel aj Canvas
- [ ] 4 Playwright testy prechádzajú
- [ ] Responzívne veľkosti (sm/md/lg)
