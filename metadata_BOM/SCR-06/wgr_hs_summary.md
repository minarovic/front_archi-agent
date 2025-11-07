# WGR ↔ HS Summary (pro SCR‑06)

**Zdroj:** `hs_codes/wgr_hs_mapping_analysis.md` + `hs_codes/hs_automotive_cleaned.json`  
**Datum:** 2025-11-06

---

## Základní statistiky
- **WGR kategorií:** 1191 produktových skupin (531 material groups používaných v praxi).  
- **HS kódů (automotive subset):** ~100.  
- **Mapování:** 495 WGR↔HS párů (keyword matching + manuální validace).

### Match Score
- **Score 3 (High):** 127 párů (26 %). Přímá shoda HS + klíčových slov.  
- **Score 2 (Medium):** 368 párů (74 %). Sémantické keyword match.  
- **Score 1 (Low):** nedoporučeno (není ve výsledném seznamu).

### Příklad
```json
{
  "material_group": 250,
  "wgr_category": "Glass / VSG laminated safety glass",
  "hs_codes": ["7007110000", "7007210000", "7007190000"],
  "match_score": 3,
  "keywords": ["glass", "laminated", "safety"]
}
```

---

## Dopad na SCR‑06
1. **Silver enrichment:** `ti_bom_usage_s` dostane `wgr_group` (už existuje) + `hs_code_6` (trim na 6 cifer).  
2. **Gold view:** `vw_bom_tier_path` zobrazí `tier_level`, `product_class`, `wgr_group`, `hs_code_6` → umožní drill-down.  
3. **Tier interpretace:**  
   - Tier 1 → hotové díly (HS kód kompletu)  
   - Tier 2 → sub-komponenty  
   - Tier 3 → materiály  
4. **Governance:** Metadata agent (Tool 3) hlídá popisy/owner/security nových polí. Dataset zatím není v UC – součást gapu.

---

> Tento souhrn můžeš použít ve slidu „Commodity roadmap (WGR→HS)“ a při diskusi o tom, jak hluboko jít (6 vs 8 cifer).
