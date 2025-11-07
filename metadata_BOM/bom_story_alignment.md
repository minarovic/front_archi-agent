# BOM Story Alignment – Shortlist for Deep Architects & Metadata Agent

**Datum:** 2025-11-06  
**Účel:** Vybrat backlog stories, které nejlépe využijí BOM metadata a zapadnou do archi-agent / deep architects prezentací.

---

## Shrnutí doporučení

| Pořadí | Story | Doporučení | Proč |
|--------|-------|------------|------|
| 1 | **SCR‑06 Mapping & Verification of Sub-Supplier Chains** | ✅ Top priority | Bez N-tier mapy není možné řešit žádný incident sit s BOM. Umožňuje ukázat Sayari/DnB + BOM strukturu, přímo podporuje deep architects. |
| 2 | **SCR‑05 Detection of Hidden Risk Accumulation** | ✅ Vysoká | Navazuje na SCR‑06, využívá BOM k identifikaci SPOF a clusterů; architekti uvidí graph + Azure SQL řešení. |
| 3 | **SCR‑07 Immediate Impact Analysis in Crisis** | ✅ Vysoká | Incidentní scénář pro Tool 0–3 pipeline, spojuje BOM a TierIndex do praktické demonstrace. |
| 4 | **SCR‑09 What-If Scenario Modeling** | ✅ Střední | Ukazuje roadmapu k Tool 5/6 (ER diagram, skripty), vhodné jako follow-up po incidentu. |
| 5 | SCR‑08 Deep Risk Analysis of Specific Plant | ⚪ Sekundární | Přínosné, ale část scénáře pokryjí už SCR‑06/07; využít až po zvládnutí základních BOM integrací. |
| 6 | SCR‑02 Supplier Selection Based on Combined Risk | ⚪ Sekundární | Více scoring/finanční use case, BOM metadata zde hrají menší roli. |
| 7 | SCR‑03 Early Warning of Supplier Deterioration | ⚪ Sekundární | Zaměřeno na trendové metriky a background monitoring; BOM jen podpůrný kontext. |
| 8 | SCR‑04 Monitoring Long-Term Stability of Key Suppliers | ⚪ Sekundární | Podobně jako SCR‑03 – důležité, ale není BOM-centrické. |
| 9 | SCR‑01 Rapid Supplier Onboarding Screening | ⚪ Nízká | Fokus na onboarding proces, BOM metadata nejsou klíčová. |

---

## Důvody výběru

1. **BOM závislost:** SCR‑06/05/07/09 přímo vyžadují parent-child strukturu komponent → můžeme využít metadata z `bom_structure.md`, `archi_agent_metadata_cards.md` a gap analýzy.  
2. **Deep Architects relevance:** Tyto story otevírají rozhodnutí o graph storage, Gold vrstvách, Tool 4–6 – přesně to, co architekti potřebují řešit.  
3. **Metadata Agent (MCOP) fit:** Incidentní pipeline (Tool 0–3) čerpá z BOM metadata; tyto story lze demonstrovat bez přístupu k živým datům (stačí metadata mappingy).  
4. **Roadmap coherence:** Výběr pokrývá „transparentnost → risk → incident → what-if“, takže workshop má ucelený příběh.

---

## Poznámky k ostatním story
- **SCR‑01 Rapid Supplier Onboarding** – spíše zaměřeno na screening nových vendorů (DnB/Sayari scoring). BOM hraje minimální roli.  
- **SCR‑02 Supplier Selection (Combined Risk)** – relevantní pro scoring, ale nepotřebuje hluboký kusovník; archi-agent si vystačí s TierIndex + finanční data.  
- **SCR‑03 Early Warning of Deterioration** & **SCR‑04 Monitoring Stability** – využívají trendové metriky a background monitoring, BOM je jen doplňkový kontext.  
- **SCR‑08 Deep Risk Analysis of Specific Plant** – zajímavé pro lokalizované analýzy, ale už je pokryto kombinací SCR‑06/07 (projekty + plant BOM).

---

> Tuto tabulku můžeš použít ve workshop packets, aby architekti hned viděli, které stories jsou nejvhodnější pro BOM + MCOP diskusi.
