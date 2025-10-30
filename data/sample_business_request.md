# Požadavek na datový projekt

## Projekt
**Název:** BA/BS Supplier Analytics Platform
**Sponzor:** Marie Dvořáková
**Datum:** 2025-10-25
**Oddělení:** Business Analytics
**Priorita:** Vysoká

## Cíl
Vytvořit komplexní analytickou platformu pro reporting a analýzu dodavatelských dat v BA/BS datamartů. Platforma umožní business uživatelům sledovat výkonnost dodavatelů, identifikovat rizikové partnery a optimalizovat nákupní procesy na základě historických dat.

## Rozsah

### In Scope
- Analýza dodavatelů (suppliers) a jejich výkonnosti
- Reporting nákupních objednávek (purchase orders)
- Sledování kvality dodávek (delivery quality metrics)
- Dimenzionální model pro dodavatelské údaje
- Integrace s existujícími BA/BS datamartami

### Out of Scope
- HR data o zaměstnancích
- Finanční forecasting a budgetování
- Real-time monitoring dodávek
- Integrace s externí CRM systémy

## Klíčové entity & metriky

### Entity
- Suppliers (dodavatelé)
- Purchase Orders (nákupní objednávky)
- Products (produkty)
- Delivery Performance (výkonnost dodávek)

### Metriky
- On-time delivery rate (% včasných dodávek)
- Supplier reliability score (hodnocení spolehlivosti)
- Average order value (průměrná hodnota objednávky)
- Quality defect rate (% vadných dodávek)
- Lead time průměr

## Očekávané zdroje
- Databricks Unity Catalog (BA/BS datamart schemas)
- Collibra Data Catalog (metadata governance)
- SAP Tables (zdrojové transakční data)
- Historical supplier performance logs

## Omezení
- GDPR compliance - žádné osobní údaje bez souhlasu
- Data retention max 5 let
- Maximální response time pro dashboardy: 3 sekundy
- Read-only přístup k produkčním datům
- Row Level Security podle business unit

## Požadované artefakty
- ER diagram v Mermaid formátu
- Power Query M skripty pro data refresh
- Governance report (kvalita metadat, validace)
- Security report (RLS návrh, klasifikace)
- Dokumentace datového modelu
