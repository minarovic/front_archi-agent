# WGR ↔ HS Kódy: Analýza mapování

**Datum:** 14. října 2025
**Účel:** Propojení WGR klasifikace s HS kódy pro filtrování Semantic Vision dat

---

## 📊 Shrnutí

- **WGR kategorií:** 1191 produktových skupin (531 Material Groups)
- **HS kódů:** ~100 automotive kódů (z tisíců celkově)
- **Nalezených shod:** 495 (metoda keyword matching, minimálně 2 společná slova)

---

## ✅ Typ mapování: M:N (nikoliv 1:1)

### Proč ne 1:1?

1. **WGR je obecnější** - 531 Material Groups pro celé portfolio
2. **HS je detailnější** - tisíce specifických kódů pro mezinárodní obchod
3. **Jeden WGR → více HS kódů** je pravidlem, ne výjimkou

### Praktický přístup:
```
WGR Material Group → [seznam relevantních HS kódů] + keywords
```

**Příklad:**
- Material Group 250 (Glass) → HS: 7007110000, 7007210000, 7007190000
- Material Group 480 (Pipes) → HS: 8708920000, 7306...

---

## 🎯 TOP shody podle Match Score

### Match Score 3 (velmi přesné - priorita)

#### 1. Glass kategorie (Material Group 250)
**WGR:** Glass > VSG laminated safety glass windshields
**HS kódy:**
- `7007110000` - Laminated safety glass for vehicles
- `7007210000` - Tempered safety glass for vehicles

**Společná klíčová slova:** glass, laminated, safety
**Použití:** Perfektní pro filtrování news o sklech, čelních sklech, bezpečnostních sklech

---

#### 2. Fasteners (Material Group 498)
**WGR:** Weld pins, weld nuts > Weld bolts
**HS kódy:**
- `7616100000` - Nails, tacks, staples, screws, bolts, nuts

**Společná klíčová slova:** bolts, nuts, pins
**Použití:** Spojovací materiál, upevňovací součástky

---

#### 3. Exhaust systems (Material Group 480)
**WGR:** PIPES, PIPE PARTS PER DRAWING > Exhaust gas recirculation
**HS kódy:**
- `8708920000` - Silencers (mufflers) and exhaust pipes

**Společná klíčová slova:** exhaust, parts, pipes
**Použití:** Výfukové systémy, EGR komponenty

---

### Match Score 2 (dobré shody)

#### Metal materials (304 shod celkem!)
**WGR:** Hot surface, hot-rolled strip steel < 3 mm VW
**HS kódy:**
- `7208400000` - Hot-rolled steel, not in coils
- `7208390000` - Hot-rolled steel, thickness < 3mm
- `7208380000` - Hot-rolled steel, 3-4.75mm
- `7208520000` - Hot-rolled steel, 4.75-10mm

**Společná klíčová slova:** hot-rolled, steel
**Použití:** Ocelové plechy, pásy, materiály pro karoserie

---

## 📈 Statistiky podle WGR Level 1 Commodity

| Level 1 Commodity                                       | Počet shod | Průměrný Match Score |
| ------------------------------------------------------- | ---------- | -------------------- |
| **Metal**                                               | 304        | 2.00                 |
| **Powertrain**                                          | 75         | 2.03                 |
| **Exterior**                                            | 57         | 2.11                 |
| **Interior**                                            | 32         | 2.00                 |
| **Connectivity, eMobility & driver assistance systems** | 27         | 2.04                 |

### Insights:
- **Metal** má nejvíce shod (304) - nejlepší pokrytí HS kódy
- **Exterior** má nejvyšší průměrný Match Score (2.11) - nejpřesnější mapování
- **Connectivity/eMobility** má nejméně shod (27) - může vyžadovat manuální doplnění

---

## 💡 Doporučení pro implementaci

### Fáze 1: Přímé použití (prioritní kategorie)
Mapovat s vysokou confidence (Score 3):
- ✅ Glass → HS 7007
- ✅ Fasteners → HS 7616
- ✅ Exhaust systems → HS 8708920000
- ✅ Bumpers → HS 8708100000

### Fáze 2: ML-assisted validace (Score 2)
- Metal categories → HS 7208 (steel), HS 7606 (aluminum)
- Electrical → HS 8512 (lighting/signalling)
- Použít existující kusovníky pro trénink modelu

### Fáze 3: Semantic Vision integrace

**Filtrovací logika:**
```python
IF news mentions:
  - HS_code IN [WGR_mapped_hs_codes]  # Přímá shoda HS kódu
  OR
  - keywords MATCH [WGR_keywords]      # Sémantické slova (glass, steel, exhaust...)
  OR
  - supplier IN [WGR_suppliers]        # Dodavatelé pro daný Material Group
THEN:
  alert = relevant for Material_Group_X
```

**Příklad pro Material Group 250 (Glass):**
```json
{
  "material_group": 250,
  "wgr_level2": "Glass",
  "wgr_level3": "VSG laminated safety glass",
  "hs_codes": ["7007110000", "7007210000"],
  "keywords": ["glass", "laminated", "safety", "windshield", "tempered"],
  "confidence": 3
}
```

---

## 🔄 Workflow pro Semantic Vision filtrování

### Vstup: News článek z Semantic Vision
```
"AGC Automotive announces production halt at Czech plant
due to laminated glass quality issues. HS code 7007110000 affected."
```

### Zpracování:
1. **HS Code matching:** `7007110000` → Material Group 250 ✅
2. **Keyword matching:** `laminated glass` → Material Group 250 ✅
3. **Confidence:** HIGH (přímá shoda + keywords)

### Výstup:
```json
{
  "alert": true,
  "material_group": 250,
  "wgr_category": "Glass / VSG laminated safety glass",
  "relevance_score": 0.95,
  "reason": "HS code match + keyword match",
  "action": "Notify procurement team - Tier 1 glass suppliers"
}
```

---

## 📁 Další kroky

### Technická implementace:
1. ✅ **wgr_hs_matches.csv** - všechny shody (495 řádků)
2. 🔄 **wgr_to_hs_mapping.json** - strukturovaný mapping pro API
3. 🔄 **Enriched WGR tabulka** - Material Group + HS kódy + keywords + suppliers
4. 🔄 **AI orchestrátor integrace** - propojení s TierIndex a Semantic Vision API

### Business validace:
- [ ] Review s procurement týmem - jsou kategorie správně zmapované?
- [ ] Pilot test na 5-10 Material Groups s nejvyšším Match Score
- [ ] Feedback loop - ruční validace prvních alertů
- [ ] Rozšíření na všech 531 Material Groups

---

## 🎯 Závěr

**ANO, WGR a HS kódy se dají mapovat**, ale:
- ❌ **Ne 1:1** (jeden WGR → jeden HS)
- ✅ **M:N mapování** (jeden WGR → více HS kódů)
- ✅ **Kombinace přístupů:**
  - Přímé HS code matching (pro Score 3)
  - Keyword/sémantické matching (pro Score 2)
  - ML model (pro budoucí rozšíření)

**Pro Semantic Vision to stačí** - můžeme filtrovat news efektivně i s M:N mapováním! 🚀

---

**Soubory:**
- Analýza: `scrum/semantic_vision/wgr_hs_mapping_analysis.md` (tento dokument)
- Data: `scrum/semantic_vision/wgr_hs_matches.csv`
- Notebook: `scrum/semantic_vision/wgr_hs_mapping.ipynb`
- JSON mapping: `scrum/semantic_vision/wgr_to_hs_mapping.json` (bude vytvořen)
