# Metadata Enrichment Initiative – Business Input

## Projekt
**Název:** BA/BS Datamarts Business Metadata Boost  
**Sponzor:** Lenka Štěrbová, Director of Procurement Excellence  
**Datum:** 2025-11-05  
**Oddělení:** Data Governance & Procurement  
**Priorita:** Must-have

## Kontext
Audit `BA-BS Datamarts Metadata - Data Quality Audit` ze dne 2025-11-03 odhalil nízké pokrytí business metadat (popisy, businessName, owner, securityClassification). Nedostatky komplikují mapování nákupních požadavků na technické artefakty v Tool 1 a brzdí onboarding nových procurement use-case.

## Cíl
Do konce Q1 2026 zvýšit pokrytí business metadat v BA/BS datamartech tak, aby Tool 1 ingest dokázal využít minimálně 75 % záznamů bez ručního doplňování. Součástí je zavedení governance procesu a auditního trailu.

## Rozsah

### In Scope
- Doplnění `description` pole lidsky čitelným popisem pro minimálně 1 650 záznamů (≈75 %).
- Vyplnění `businessName` v konzistentním naming standardu (Prefix `BA/BS` + funkční název).
- Identifikace a přiřazení `ownerInSource` (business owner + steward) pro všechny tabulky a pohledy v nákupních schématech (`dm_ba_purchase`, `dm_bs_purchase`).
- Tvorba bezpečnostní klasifikace (`securityClassification`) pro nákupní entity.
- Dokumentace rozhodovacích pravidel v `docs_langgraph/tool3-detailed-flow.md` + logování výsledků do `scrum/artifacts/`.

### Out of Scope
- Technické refaktoringy datových modelů.
- Real-time monitoring a streaming pipelines.
- Úpravy SAP zdrojových systémů.
- HR a finanční forecast datové domény.

## Klíčové entity & metriky

### Entity
- Dimenze nákupu: `dimv_supplier`, `dimv_material`, `dimv_purchase_group`, `dimv_material_group`.
- Fakta nákupu: `factv_purchase_order`, `factv_purchase_order_item`.
- Cross-domain referenční tabulky sdílené s logistikou.

### KPI
- Coverage `description`: cílově ≥75 %.
- Coverage `businessName`: cílově ≥70 %.
- Coverage `ownerInSource`: cílově ≥90 %.
- Coverage `securityClassification`: cílově 100 % pro procurement entity.
- Počet duplicitních `displayName` bez doplněného prefixu: <5.

## Očekávané zdroje
- Collibra Data Catalog API (bulk update).
- Databricks Unity Catalog exporty (ověření struktury).
- HR personální systém (jen pro potvrzení vlastníků, nikoliv pro ingest).
- Dřívější audit `scrum/artifacts/2025-11-03_datamarts-dq-audit.json` jako baseline.

## Omezení
- Dodržení scope_out blacklistu (HR/forecasting).
- Governance proces musí vytvářet auditní stopy v `scrum/artifacts/` (např. `<datum>_metadata-enrichment.json`).
- Všechny datumové údaje logovat pomocí `.isoformat()`.
- Změny musí projít schválením Data Steward Council.

## Požadované artefakty
- Aktualizovaný Collibra export s vyšší coverage (uložit do `scrum/artifacts/`).
- Playbook pro doplňování business metadat (Markdown v `docs_langgraph/`).
- Report o splnění KPI (confidence a coverage tabulka).
- Input pro Tool 3 Quality Validator: nové test scénáře ověřující přítomnost business popisů a ownerů.
