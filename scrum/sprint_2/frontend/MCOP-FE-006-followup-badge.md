# MCOP-FE-006: Follow-up Badge

**Priorita:** 🟢 P3 (Could Have)
**Effort:** 10 minút
**Status:** 🟠 Partial (client-side only until backend ready)
**Závislosť:** Backend `is_follow_up` flag - OPTIONAL

---

## ⚠️ Backend Dependency Notice

**Current State:** Backend nepodporuje `is_follow_up` flag vo WebSocket response.

**Fallback Strategy:**
- ✅ Client-side regex detection (implemented)
- 🔴 Backend `is_follow_up` flag (NOT YET AVAILABLE)

**When backend adds support:**
```typescript
// WebSocket response will include:
{
  "type": "user",
  "content": "Show relationships for that table",
  "is_follow_up": true  // 🆕 Backend-computed
}
```

**Until then:** Use client-side heuristic only. May have false positives/negatives.

---

## 📋 User Story

> Ako používateľ chcem vidieť vizuálne rozlíšenie medzi novými otázkami a follow-up otázkami, aby som vedel, ktoré odpovede využívajú predošlý kontext.

---

## ✅ Acceptance Criteria

- [ ] AC1: ⚡ Follow-up badge pri správach, ktoré sú follow-up
- [ ] AC2: Badge má modrý background (`bg-blue-100 text-blue-700`)
- [ ] AC3: Follow-up správy detekované (client-side regex OR backend flag)
- [ ] AC4: Badge zobrazený iba pri user správach
- [ ] AC5: Tooltip vysvetľuje čo znamená follow-up
- [ ] AC6: **Prefer backend flag** if available, fallback to regex (MUST)

---

## 🎨 Design Špecifikácia

### Badge

```
┌─────────────────────────────────────────────┐
│ 👤 User                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Show relationships for that table       │ │
│ │                          [⚡ Follow-up] │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Styling

```css
/* Follow-up Badge */
.follow-up-badge {
  background: #DBEAFE;     /* blue-100 */
  color: #1D4ED8;          /* blue-700 */
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
```

---

## 🔧 Logika detekcie Follow-up

### Pravidlá

Správa je **follow-up** ak:
1. Nie je prvá správa v session
2. Obsahuje referenčné slová: "that", "this", "it", "the same", "also", "more"
3. Neobsahuje explicitný subject (tabuľka, schema)

### Implementácia

```typescript
// utils/detectFollowUp.ts
const FOLLOW_UP_INDICATORS = [
  /\b(that|this|it|these|those)\b/i,
  /\b(the same|also|too|more|another)\b/i,
  /\b(what about|how about|and|show me more)\b/i,
  /^(yes|no|ok|sure|please)\b/i,
];

export function isFollowUpMessage(message: string, messageIndex: number): boolean {
  // First message is never follow-up
  if (messageIndex === 0) return false;

  // Check for follow-up indicators
  return FOLLOW_UP_INDICATORS.some(pattern => pattern.test(message));
}
```

---

## 🔧 Technická Implementácia

### Badge komponent: `src/components/FollowUpBadge.tsx`

```typescript
import React from 'react';

interface FollowUpBadgeProps {
  className?: string;
}

export function FollowUpBadge({ className = '' }: FollowUpBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        text-xs font-medium
        bg-blue-100 text-blue-700
        px-2 py-0.5 rounded
        ${className}
      `}
      title="This question uses context from the previous messages"
    >
      <span>⚡</span>
      <span>Follow-up</span>
    </span>
  );
}
```

### Integrácia do MessageList.tsx

```typescript
import { FollowUpBadge } from './FollowUpBadge';
import { isFollowUpMessage } from '../utils/detectFollowUp';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system' | 'error';
  content: string;
  timestamp: string;
  isFollowUp?: boolean;  // Optional, can be pre-computed
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const showFollowUp =
          message.type === 'user' &&
          (message.isFollowUp || isFollowUpMessage(message.content, index));

        return (
          <div key={message.id} className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${message.type === 'user' ? 'bg-gray-200' : 'bg-[#0E3A2F] text-white'}
            `}>
              {message.type === 'user' ? '👤' : '🤖'}
            </div>

            {/* Message Content */}
            <div className={`
              flex-1 rounded-lg px-4 py-3
              ${message.type === 'user' ? 'bg-blue-50' : 'bg-gray-100'}
            `}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-900">{message.content}</p>

                {/* Follow-up Badge */}
                {showFollowUp && (
                  <FollowUpBadge className="flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Backend Enhancement (Optional)

Backend môže tiež označiť follow-up:

```python
# src/api/main.py - WebSocket handler
async def detect_follow_up(session_id: str, message: str) -> bool:
    """Detect if message is a follow-up based on session context."""
    session = session_manager.get(session_id)
    if not session or len(session.chat_history) == 0:
        return False

    follow_up_patterns = [
        r'\b(that|this|it)\b',
        r'\b(the same|also|more)\b',
    ]

    return any(re.search(p, message, re.I) for p in follow_up_patterns)

# V WebSocket response
await websocket.send_json({
    "type": "user",
    "content": user_message,
    "is_follow_up": await detect_follow_up(session_id, user_message),
})
```

---

## 🧪 Playwright Test Scenáre

### Test Suite: `tests/e2e/message-badges.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Follow-up Badge', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Send first message
    await page.fill('input[placeholder*="Ask anything"]', 'Show tables in dm_bs_purchase');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="agent-message"]');
  });

  test('should show follow-up badge on context-aware questions', async ({ page }) => {
    // Send follow-up message
    await page.fill('input[data-testid="chat-input"]', 'Show relationships for that table');
    await page.click('button[data-testid="send-button"]');

    // Badge should appear
    await expect(page.getByText('Follow-up')).toBeVisible();
    await expect(page.getByText('⚡')).toBeVisible();
  });

  test('should NOT show badge on first message', async ({ page }) => {
    // First message should not have badge
    const firstMessage = page.locator('[data-testid="user-message"]').first();
    await expect(firstMessage.getByText('Follow-up')).not.toBeVisible();
  });

});
```

---

## 📦 Deliverables

| Súbor                              | Akcia            |
| ---------------------------------- | ---------------- |
| `src/components/FollowUpBadge.tsx` | **Vytvoriť**     |
| `src/utils/detectFollowUp.ts`      | **Vytvoriť**     |
| `src/components/MessageList.tsx`   | Integrovať badge |
| `tests/e2e/message-badges.spec.ts` | **Vytvoriť**     |

---

## 🔗 Súvisiace

- Backend môže rozšíriť WebSocket response o `is_follow_up` pole
- Viď [canvas-trigger-backend.md](../../architecture/canvas-trigger-backend.md)

---

## ✅ Definition of Done

- [ ] FollowUpBadge komponent implementovaný
- [ ] Detekcia follow-up na frontende funguje
- [ ] Badge sa zobrazuje iba pri user správach
- [ ] Tooltip vysvetľuje význam
- [ ] 2 Playwright testy prechádzajú
