# Tool 4–6 Scenario Brief – When Roadmap Turns Critical

**Datum:** 2025-11-05  
**Autor:** MCOP Team  
**Kontext:** Navazuje na zadání `docs_langgraph/zadani.md` a dokumenty `mcop-architecture.md`, `deep_workshop_architects_brief.md`.

---

## Scénář: „Supplier Disruption + Compliance Escalation“

### 1. Incident Trigger
- **Událost:** Strategický dodavatel *NordMetal GmbH* nedoručil kritickou dodávku komponent pro výrobu převodovek.  
- **Business reakce:** Supply chain leadership svolává krizový tým, který požaduje okamžitou analýzu alternativních dodavatelů, dopadu na kusovník a zásoby (viz incident drill v `mcop-architecture.md:820`).  
- **Governance požadavek:** Compliance upozorňuje, že nový dodavatel musí splnit interní bezpečnostní standardy a auditní logy, jinak hrozí stopka výroby.

### 2. Co umí MVP (Tool 0–3/7)
1. **Tool 0** načte krizový business dokument → identifikuje entity: dodavatelé, kusovník, zásoby.  
2. **Tool 1** vybere kandidátní datamarty (procurement, logistika, BOM) a uloží mapping (`data/tool1/filtered_dataset.json`).  
3. **Tool 2** sestaví strukturu faktů a dimenzí → zjistí, které produkty jsou ovlivněné.  
4. **Tool 3** zkontroluje metadata (popisy, owner, validationResult) a zvedne varování, pokud chybí governance data.  
5. **Tool 7** vygeneruje governance report se summary incidentu.

### 3. Proč teď potřebujeme Tool 4–6

| Potřeba | Co nám chybí v MVP | Jak ji pokryjí Tooly 4–6 |
| ------- | ------------------ | ------------------------ |
| **Bezpečnost & Compliance** | Tool 3 vidí chybějící `securityClassification`, ale neumí navrhnout RLS ani odhalit PII. | **Tool 4** (Security Analyzer) okamžitě highlightuje PII, navrhne Row-Level Security a uloží `security_report.json`. |
| **Vizualizace vztahů** | Workshop s architekty potřebuje ER diagram pro krizovou komunikaci. | **Tool 5** (ER Diagram Generator) přetaví `structure.json` do Mermaid diagramu, který lze vložit do incident dokumentace. |
| **Automatizace skriptů** | Data engineering tým potřebuje rychle připravit Power Query / SQL pro náhradního dodavatele. | **Tool 6** (Script Generator) vezme business kontext + strukturu a vygeneruje M skripty a SQL jako startovní bod. |

### 4. Jak by to proběhlo po doplnění Tool 4–6
1. **Tool 4** běží po Tool 3 a doporučí RLS pro nové dodavatele, upozorní na PII ve `dm_bs_purchase`.  
2. **Tool 5** vytvoří `diagram.md` s Mermaid kódem → architekti během workshopu vidí propojení dodavatel ↔ komponenta ↔ zásoba.  
3. **Tool 6** generuje `query.m` a `incident_restock.sql`, aby data tým mohl hned spustit analýzu variantních dodavatelů.  
4. Všechny soubory se uloží do `scrum/artifacts/<datum>_supplier-disruption/`, což splní auditní požadavky compliance.

### 5. Co z toho pro nás plyne
- **Roadmapa:** Incident ukazuje, že Tool 4–6 nejsou jen „nice-to-have“, ale nutné pro krizový response.  
- **Workshop příprava:** Materiály z `deep_workshop_architects_brief.md` doplníme o bezpečnostní a skriptovací výstupy.  
- **Akční kroky:**  
  1. Prioritizovat vývoj Tool 4 v Q1 2026 (pilotovat na procurement doméně).  
  2. Připravit šablony pro Tool 5/6 (Mermaid layout, Power Query templates).  
  3. Aktualizovat orchestrátor tak, aby nové tooly běžely paralelně s Tool 7 a sdílely business kontext.

---

Tento scénář propojuje aktuální schopnosti MVP s požadavky ze zadání a ukazuje, kdy se roadmapa Tool 4–6 stává kritickou. Slouží jako podklad pro plánování kapacit i komunikaci s architekty.
