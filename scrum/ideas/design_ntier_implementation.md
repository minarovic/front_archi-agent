# Design N-tier: Implementačný Plán

**Dátum:** 2025-11-30
**Súvisiaci dokument:** [design_ntier.md](./design_ntier.md)

---

## 📊 Rozdelenie Backend vs Frontend

### ✅ Frontend (implementovateľné ihneď)

| #   | Úloha                    | Popis                                                         | Čas    |
| --- | ------------------------ | ------------------------------------------------------------- | ------ |
| F1  | InitialView komponent    | Úvodná obrazovka s hero, example prompts, veľkým inputom      | 30 min |
| F2  | Loading Dots animácia    | `animate-bounce` s delay namiesto spinneru                    | 15 min |
| F3  | Layout responsive úpravy | Dual-panel s `md:flex-row`, border, Home button               | 20 min |
| F4  | Follow-up badge          | ⚡ indikátor pre context-aware queries                         | 10 min |
| F5  | View Mode Toggle         | Table/Diagram prepínač v Canvas                               | 15 min |
| F6  | Farebná schéma           | CSS custom properties, Tailwind config                        | 15 min |
| F7  | Metrics Header Card      | Štatistiky nad diagramom                                      | 20 min |
| F8  | Canvas Trigger handler   | Parsovanie `canvas_trigger` z WS response (ready for backend) | 20 min |

**Celkovo frontend: ~2.5 hodiny**

---

### 🔴 Backend (vyžaduje archi-agent repo)

| #   | Úloha                     | Popis                                                              | Dôvod                                                  |
| --- | ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| B1  | Canvas Trigger v response | Backend musí vracať `canvas_trigger` objekt                        | LLM detekuje kľúčové slová ("diagram", "ukáž tabuľky") |
| B2  | Follow-up endpoint        | `/api/chat/follow-up` s kontextom predošlej analýzy                | Rýchle odpovede bez re-query                           |
| B3  | Analysis type routing     | Backend rozhoduje `er_diagram`, `table_list`, `relationship_graph` | Frontend len zobrazuje                                 |

**Príklad backend response:**
```json
{
  "type": "agent",
  "content": "Prepínam na ER diagram...",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "entity_name": "factv_purchase_order",
    "reason": "Generujem ER diagram pre tabuľku factv_purchase_order"
  }
}
```

---

## 🎯 Prioritizácia (MoSCoW)

### 🔴 MUST HAVE (MVP - bez toho nefunguje)

| #   | Úloha             | Strana   | Zdôvodnenie                              |
| --- | ----------------- | -------- | ---------------------------------------- |
| F3  | Layout responsive | Frontend | Základná UX - dual-panel je core koncept |
| F2  | Loading Dots      | Frontend | Vizuálna spätná väzba počas čakania      |
| F6  | Farebná schéma    | Frontend | Konzistentný branding                    |

**Čas: ~50 min**

---

### 🟡 SHOULD HAVE (Silne odporúčané)

| #   | Úloha                   | Strana   | Zdôvodnenie                                |
| --- | ----------------------- | -------- | ------------------------------------------ |
| F1  | InitialView             | Frontend | Lepší onboarding, example prompts pomáhajú |
| F5  | View Mode Toggle        | Frontend | Umožňuje prepínať Table/Diagram            |
| F8  | Canvas Trigger handler  | Frontend | Pripravený na backend integráciu           |
| B1  | Canvas Trigger response | Backend  | Automatické prepínanie canvasu             |

**Čas: ~1.5 hod (frontend) + backend práca**

---

### 🟢 COULD HAVE (Nice to have)

| #   | Úloha               | Strana   | Zdôvodnenie                       |
| --- | ------------------- | -------- | --------------------------------- |
| F4  | Follow-up badge     | Frontend | UX vylepšenie, nie kritické       |
| F7  | Metrics Header Card | Frontend | Štatistiky - pekné, ale voliteľné |
| B2  | Follow-up endpoint  | Backend  | Rýchlejšie odpovede, nie MVP      |

**Čas: ~30 min (frontend)**

---

### ⚪ WON'T HAVE (Zatiaľ nie)

| #   | Úloha                 | Strana   | Zdôvodnenie                         |
| --- | --------------------- | -------- | ----------------------------------- |
| -   | ReactFlow grafy       | Frontend | MCOP používa Mermaid, nie ReactFlow |
| -   | Leaflet mapy          | Frontend | Nepotrebné pre metadata exploration |
| B3  | Analysis type routing | Backend  | Komplexné, odložené na neskôr       |

---

## 📋 Odporúčaný Postup Implementácie

### Fáza 1: MVP (50 min) ✅ Môžem urobiť teraz

```
1. F6 - Farebná schéma (15 min)
   └── Aktualizovať index.css a tailwind.config.js

2. F3 - Layout responsive (20 min)
   └── Upraviť Layout.tsx s Home button

3. F2 - Loading Dots (15 min)
   └── Nahradiť spinner animovanými bodkami
```

### Fáza 2: UX Vylepšenia (1 hod) ✅ Môžem urobiť teraz

```
4. F1 - InitialView (30 min)
   └── Nový komponent s hero + example prompts

5. F5 - View Mode Toggle (15 min)
   └── Table/Diagram prepínač v Canvas

6. F8 - Canvas Trigger handler (20 min)
   └── Hook + integrácia do ChatPanel (ready for backend)
```

### Fáza 3: Polish (30 min) ✅ Môžem urobiť teraz

```
7. F4 - Follow-up badge (10 min)
   └── Badge komponent v MessageList

8. F7 - Metrics Header Card (20 min)
   └── Header s metrikami nad diagramom
```

### Fáza 4: Backend Integrácia 🔴 Vyžaduje backend prácu

```
9. B1 - Canvas Trigger response
   └── Upraviť WebSocket handler v archi-agent

10. B2 - Follow-up endpoint (optional)
    └── Nový endpoint pre kontextové otázky
```

---

## 🏆 Súhrn Odporúčaní

### Okamžite (dnes):
1. **Implementovať Fázu 1 (MVP)** - 50 min
2. **Implementovať Fázu 2 (UX)** - 1 hod
3. Výsledok: Funkčný frontend s novým dizajnom

### Tento týždeň:
4. **Fáza 3 (Polish)** - 30 min
5. Výsledok: Kompletný frontend dizajn

### Nasledujúci sprint:
6. **Fáza 4 (Backend)** - Práca v archi-agent repo
7. Výsledok: Plne funkčný Canvas Trigger

---

## 📁 Súbory na úpravu (Frontend)

| Súbor                              | Akcia                           | Fáza |
| ---------------------------------- | ------------------------------- | ---- |
| `src/index.css`                    | Pridať CSS custom properties    | 1    |
| `tailwind.config.js`               | Pridať custom colors            | 1    |
| `src/components/Layout.tsx`        | Responsive layout + Home button | 1    |
| `src/components/ChatPanel.tsx`     | Loading dots                    | 1    |
| `src/components/InitialView.tsx`   | **Nový** - úvodná obrazovka     | 2    |
| `src/components/Canvas.tsx`        | View Mode Toggle                | 2    |
| `src/hooks/useCanvasTrigger.ts`    | **Nový** - trigger hook         | 2    |
| `src/types/index.ts`               | CanvasTrigger interface         | 2    |
| `src/components/MessageList.tsx`   | Follow-up badge                 | 3    |
| `src/components/MetricsHeader.tsx` | **Nový** - header card          | 3    |

---

## ⚠️ Riziká a Mitigácie

| Riziko                                              | Pravdepodobnosť | Dopad   | Mitigácia                                            |
| --------------------------------------------------- | --------------- | ------- | ---------------------------------------------------- |
| Backend nepodporuje canvas_trigger                  | Vysoká          | Stredný | Frontend handler bude ready, ignoruje chýbajúce pole |
| Farebná schéma nefunguje s existujúcimi komponentmi | Nízka           | Nízky   | Použiť CSS variables pre ľahkú zmenu                 |
| InitialView rozbije existujúci flow                 | Stredná         | Stredný | Podmienené renderovanie - ak `messages.length === 0` |

---

## ✅ Definition of Done

### Frontend MVP:
- [ ] Dual-panel layout funguje na mobile aj desktop
- [ ] Loading dots animácia namiesto spinneru
- [ ] Konzistentná farebná schéma (blue alebo green)
- [ ] Home button vracia na InitialView

### Frontend Complete:
- [ ] InitialView s example prompts
- [ ] View Mode Toggle (Table/Diagram)
- [ ] Canvas Trigger handler (ready for backend)
- [ ] Follow-up badge
- [ ] Metrics Header Card

### Full Integration:
- [ ] Backend vracia `canvas_trigger` v response
- [ ] Chat keyword automaticky prepína canvas
- [ ] E2E testy prechádzajú

---

**Poznámka:** Tento plán je flexibilný. Môžeš začať s Fázou 1 a postupne pridávať ďalšie fázy podľa potrieb.
