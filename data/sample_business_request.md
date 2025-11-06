# Nákupní data – požadavek na harmonizaci

## Projekt
**Název:** Procurement Data Harmonization Pilot  
**Sponzor:** Tomáš Matouš, Head of Strategic Sourcing  
**Datum:** 2025-10-28  
**Oddělení:** Procurement Excellence Office  
**Priorita:** Vysoká

## Cíl
Pilotně sjednotit nákupní data napříč existujícími BA/BS datamarty tak, aby bylo možné spolehlivě mapovat nákupní entity na dostupné kandidátní zdroje. Výstup má potvrdit, že sourcing tým dokáže rychle identifikovat vhodná datová aktiva pro analýzy dodavatelů, skladových zásob a souvisejících procesů.

## Rozsah

### In Scope
- Harmonizace klíčových nákupních entit (Suppliers, Purchase Orders, Products, Warehouse Inventory)
- Validace kvality mapování vůči kandidátním datovým sadám (dm_bs_purchase, dm_bs_logistics)
- Definice pravidel pro odmítnutí nekorektních kandidátů (např. HR datové sady)
- Dokumentace rozhodovacích kritérií a confidence skóre

### Out of Scope
- HR data o zaměstnancích a forecasty kapacit
- Finanční forecasting a plánování rozpočtů
- Real-time monitoring dodávek
- Integrace s externími CRM/Service desk systémy

## Klíčové entity & metriky

### Entity
- Suppliers (dodavatelé)
- Purchase Orders (nákupní objednávky)
- Products (produkty)
- Warehouse Inventory (skladové zásoby)
- Customer Complaints (stížnosti zákazníků) – používá se pro test nízké shody

### Metriky
- Confidence skóre mapování (0–1)
- % entit s jednoznačným kandidátem (>0.85)
- Počet zamítnutých kandidátů kvůli scope_out omezením
- Čas potřebný k manuálnímu ověření (baseline pro úsporu času)

## Očekávané zdroje
- Databricks Unity Catalog – dm_bs_purchase, dm_bs_logistics
- Collibra Data Catalog – popisy kandidátních sad a jejich stewardi
- SAP MM – referenční klíče pro nákupní objednávky a skladové pohyby
- Historické výstupy Quality Validatoru (kvůli porovnání confidence trendů)

## Omezení
- GDPR: bez osobních údajů; zákaz práce s HR atributy
- Scope_out blacklist: HR datové sady, forecasting, real-time streaming
- Stabilní API pro načítání metadat z Collibry (denní refresh)
- Všechny výsledky musí být exportovatelné ve formátu JSON s `.isoformat()` daty

## Požadované artefakty
- Mapping report s confidence skóre pro každou entitu
- Audit trail uložený v `scrum/artifacts/` (název: `<datum>_procurement-mapping.json`)
- Směrnice pro odmítnuté kandidáty (včetně zmínky o scope_out pravidlech)
- Aktualizovaný návod pro Test Scenarios for Entity Mapping (QA tým)
