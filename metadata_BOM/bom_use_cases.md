# BOM Data – What We Can Do

**Datum:** 2025-11-06  
**Audience:** Architekti, MCOP/archi-agent tým, Data Stewardi  
**Účel:** Rychlý souhrn využití BOM dat (metadata + budoucí ingest) napříč incidenty, analytikou i governance.

---

## 1. Incident Response & Risk Management
| Use Case | Popis | Co potřebujeme | Přínos |
|----------|-------|----------------|--------|
| **Supplier Disruption Impact** | Mapovat, které komponenty/projekty zasáhne výpadek dodavatele | `product_classes`, `bom_nodes`, `node_variants`, `usage_assignments` | Přímé napojení na incident T0–T4, podklad pro architekty i MCOP Tool 2 |
| **Spare Parts Redistribution (Port Strike)** | Přesměrovat servisní díly podle BOM/HS mappingu a logistických zásob | BOM + `BOM_HS_INTEGRATION_GAP_ANALYSIS.md`, logistické tabulky | Umožní rychle vidět, které servisy/projekty jsou kritické |
| **SPOF & Hidden Risk** | Odhalit, když více Tier‑1 závisí na stejné Tier‑2 komponentě | `bom_nodes` + TierIndex edges | Podklad pro SCR‑05/06; metadata umožní identifikovat risk před ingestem |

---

## 2. Metadata-Driven Automation (MCOP / archi-agent)
| Aktivita | Popis | Stav |
|----------|-------|------|
| **Tool 0–2 obohacení** | Přidat BOM entity do business requestů; Tool 1 mapuje na `bom_parent_child` apod. | Metadata připravena (`archi_agent_metadata_cards.md`), data ingest pending |
| **Quality Validator (Tool 3)** | Kontrolovat popisy, owner, security classification BOM tabulek | Z `BOM_HS_INTEGRATION_GAP_ANALYSIS.md` známe coverage; chybí ingest do UC |
| **Tool 5/6 Roadmap** | ER diagram + skriptování pro BOM scénáře | `bom_structure.md` poskytuje blueprint; čeká na implementaci Tool 5/6 |

---

## 3. Analytics & Planning
- **Variant Costing / Lead Time Forecasting** – využití `node_variants` + `usage_assignments` pro kalkulace nákladů, scrap factor, lead time.
- **HS / WGR filtering** – propojit BOM s HS kódy (viz gap analýza) → filtrování událostí Semantic Vision.
- **Lifecycle Tracking** – záznamy H2M, P-SSL, P-BK umožní sledovat, kde se komponenta nachází (vývoj vs. výroba).
- **What-if Simulation** – SCR‑09 potřebuje BOM strukturu jako vstup pro simulace (jak projekty reagují na změnu komponenty).

---

## 4. Governance & Compliance
- **Unity Catalog registrace** – `04_core_constraints.md` vyžaduje, aby všechny BOM tabulky běžely v UC + Delta (chybějící ingest = Gap #1).  
- **Audit Trail** – logování změn (variant history, lifecycle events) → splnění auditních požadavků.  
- **Security Classification** – metadata karty říkají, že BOM = „INTERNAL – Supplier Sensitive“, tedy nutné RLS před sdílením s třetími stranami.

---

## 5. Činnosti připravené k akci
1. **Ingest Bronze tabulky** (`sap_bom_structure`) dle návrhu v gap analýze.  
2. **Zapsat metadata karty do archi-agent** (už připraveno).  
3. **Připravit BOM highlight pro Incident A** – tabulka komponenta → projekt → dodavatel.  
4. **Napojit BOM na TierIndex** – definovat FK `product_class_id` ↔ TierIndex root entity.  
5. **Rozšířit workshop materials** – použít tuto rekapitulaci jako referenci v `workshop_packets/`.

---

> Data samotná zatím leží v CSV mimo Unity Catalog; přesto máme kompletní metadata, constraints a gap analýzu. Stačí spustit ingestion a MCOP/archi-agent scénáře můžou být 100 % BOM-aware.
