# Workshop Backlog Focus (SCR‑06 / SCR‑05 / SCR‑07 / SCR‑09)

**Datum aktualizace:** 2025-11-06  
**Účel:** Stručná reference pro klíčové backlog stories, které je nutné pokrýt během workshopu s architekty.

---

| Story | Popis & přínos | Stav | Klíčové závislosti | Poznámky pro workshop |
|-------|----------------|------|--------------------|-----------------------|
| **SCR‑20250918‑06** | Mapping & Verification of Sub-Supplier Chains (N-tier transparentnost) | planned | Sayari API, graph vizualizace, ownership enrichment | Základ pro incident A; bez něj není možné sledovat dopady v hloubce |
| **SCR‑20250918‑05** | Detection of Hidden Risk Accumulation (SPOF) | planned | SCR‑06, calculated metrics | Python algoritmus je připraven (`calculated_metrics_specs.md`), chybí integrace & dashboard |
| **SCR‑20250918‑07** | Immediate Impact Analysis in Crisis | planned | SCR‑05, SCR‑06, alert infra | Zajišťuje <5 min response; návaznost na incident A; vyžaduje audit trail |
| **SCR‑20250918‑09** | What-If Scenario Modeling | planned | SCR‑07, Tool 5/6 roadmap | Připravuje proaktivní simulace (využití Tool 5 – Mermaid ER, Tool 6 – skripty) |

---

## Doporučené otevřené otázky
1. Potřebujeme další data ingestion (např. real-time feed) pro SCR‑07?
2. Jaké jsou požadavky na grafickou vizualizaci pro SCR‑06 (Neo4j vs. jiné řešení)?
3. Jak rychle můžeme prioritizovat Tool 4–6, aby SCR‑09 mělo automatizované výstupy?

---

## Reference
- `backlog_nepuvodni/implementation_roadmap.md`
- `backlog_nepuvodni/BACKLOG_ANALYSIS_SUMMARY.md`
- `backlog_nepuvodni/api_endpoint_mapping.md`
- `backlog_nepuvodni/calculated_metrics_specs.md`
