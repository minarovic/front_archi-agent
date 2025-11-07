# TierIndex – Co to je a proč ho potřebujeme

**Audience:** Deep Architects Workshop
**Focus:** Praktické příklady použití TierIndex dat
**Level:** Conceptual s technickými detaily

---

## 🎯 Co je TierIndex?

> **TierIndex je unifikovaná datová platforma pro procurement intelligence – strukturovaná databáze 15 000+ dodavatelů, jejich vztahů, finančního zdraví a obchodních dat.**

### Jednoduše řečeno:
Když procurement manager nebo risk manager potřebuje odpověď typu:
- *"Kteří dodavatelé jsou závislí na čínských sub-dodavatelích?"*
- *"Které projekty jsou ohrožené, když dodavatel XYZ zkrachuje?"*
- *"Máme alternativy pro kritické komponenty z Ukrajiny?"*

...tak **TierIndex poskytuje data pro tyto odpovědi**.

---

## 💡 Proč TierIndex potřebujeme: 4 praktické příklady

### **Příklad 1: "Kde používáme tenhle HS kód?"**

**Business situace:**
Nové EU regulace zakazují import určitých dílů klasifikovaných pod HS code `8708.29` (brzdové komponenty) z Ruska.

**Bez TierIndex:**
- Manuální Excel audit 3000+ dodavatelů
- Email dotazy na každého dodavatele
- 2-3 týdny práce
- Neúplná data (dodavatelé nereagují)

**S TierIndex:**
```sql
-- Jednoduchý dotaz: Kteří dodavatelé obchodují s HS 8708.29 z Ruska?
SELECT
    supplier_name,
    country,
    hs_code,
    annual_volume_eur
FROM tierindex.ti_entity_trade
WHERE hs_code = '8708.29'
  AND origin_country = 'RU'
  AND tier_level IN (1, 2);
```

**Output:**
| Supplier       | Country | Annual Volume | Tier   |
| -------------- | ------- | ------------- | ------ |
| BrakeSys GmbH  | DE      | 2.1M EUR      | Tier-1 |
| PartSupply Ltd | CZ      | 890K EUR      | Tier-2 |

**Čas:** <30 sekund
**Akce:** Kontaktovat 2 dodavatele místo 3000

#### **Co nám TierIndex poskytl:**
- ✅ **HS Codes** = Harmonized System klasifikace (co se obchoduje)
- ✅ **Country origin** = Odkud díly pocházejí
- ✅ **Tier level** = Je to náš přímý dodavatel nebo sub-dodavatel?

---

### **Příklad 2: "Kolik projektů je závislých na tomhle dodavateli?"**

**Business situace:**
Dodavatel `ElectroComponents GmbH` právě vyhlásil bankrot. Musíme okamžitě vědět dopady.

**Bez TierIndex:**
- Projít SAP zakázky ručně
- Hledat BOM struktury v PLM systému
- Kontaktovat project managery
- 1-2 dny analýzy
- Mezitím produkce může stát

**S TierIndex:**
```sql
-- Které projekty používají díly od ElectroComponents?
SELECT
    p.project_name,
    p.production_phase,
    COUNT(DISTINCT b.part_number) as affected_parts,
    SUM(b.monthly_volume) as parts_at_risk
FROM tierindex.ti_bom b
JOIN tierindex.ti_projects p ON b.project_id = p.project_id
WHERE b.supplier_id = 'SUP-04521'  -- ElectroComponents
  AND p.production_phase IN ('SERIAL', 'RAMP_UP')
GROUP BY p.project_name, p.production_phase;
```

**Output:**
| Project               | Phase   | Parts | Monthly Volume at Risk |
| --------------------- | ------- | ----- | ---------------------- |
| EV Battery Controller | SERIAL  | 12    | 8,500 units            |
| Smart Infotainment    | RAMP_UP | 5     | 2,300 units            |
| Safety System Gen3    | SERIAL  | 8     | 6,100 units            |

**Čas:** <1 minuta
**Akce:** Okamžitě aktivovat alternativní dodavatele pro 3 kritické projekty

#### **Co nám TierIndex poskytl:**
- ✅ **BOM (Bill of Materials)** = Hierarchie dílů ve vozidlech
- ✅ **Project mappings** = Které projekty používají které díly
- ✅ **Supplier relationships** = Kdo dodává co

---

### **Příklad 3: "Máme SPOF v dodavatelském řetězci?"**

**Business situace:**
Risk manager chce proaktivně identifikovat Single Points of Failure – subdodavatele, na kterých závisí více projektů a nemají alternativy.

**Bez TierIndex:**
- Teoreticky nelze zjistit (sub-dodavatelé jsou neviditelní)
- Tier-1 dodavatelé nesdílí své sub-dodavatele
- Discover SPOF až když nastane krize

**S TierIndex:**
```sql
-- Identifikuj Tier-2 subdodavatele s vysokou centralitou
WITH tier2_dependencies AS (
    SELECT
        t2.supplier_id,
        t2.supplier_name,
        COUNT(DISTINCT t1.supplier_id) as tier1_count,
        COUNT(DISTINCT p.project_id) as project_count,
        SUM(t1.annual_volume_eur) as total_exposure
    FROM tierindex.ti_tier2 t2
    JOIN tierindex.ti_tier1_tier2_rel r ON t2.supplier_id = r.tier2_id
    JOIN tierindex.ti_tier1 t1 ON r.tier1_id = t1.supplier_id
    JOIN tierindex.ti_projects p ON t1.supplier_id = p.supplier_id
    GROUP BY t2.supplier_id, t2.supplier_name
)
SELECT *,
    CASE
        WHEN tier1_count >= 5 AND project_count >= 8 THEN 'CRITICAL_SPOF'
        WHEN tier1_count >= 3 THEN 'HIGH_SPOF'
        ELSE 'MEDIUM_SPOF'
    END as spof_severity
FROM tier2_dependencies
WHERE tier1_count >= 3
ORDER BY total_exposure DESC;
```

**Output:**
| Supplier (Tier-2)     | Tier-1 Dependent | Projects | Exposure | SPOF Level    |
| --------------------- | ---------------- | -------- | -------- | ------------- |
| ChipManufacturing Ltd | 5                | 12       | 8.2M EUR | CRITICAL_SPOF |
| CablePro GmbH         | 4                | 9        | 5.1M EUR | HIGH_SPOF     |

**Čas:** <2 minuty
**Akce:** Urgentně diverzifikovat sourcing pro ChipManufacturing

#### **Co nám TierIndex poskytl:**
- ✅ **Tier-1 → Tier-2 relationships** = Kdo dodává komu (visibility do sub-dodavatelů)
- ✅ **Network centrality** = Graph analytics pro SPOF detection
- ✅ **Exposure quantification** = Business impact v EUR

---

### **Příklad 4: "Který WGR commodity group je nejvíc rizikový?"**

**Business situace:**
Strategický procurement plánuje diverzifikaci. Chce vědět, které commodity skupiny mají nejvyšší koncentraci v rizikových regionech.

**Bez TierIndex:**
- Commodity groups (WGR) jsou v SAP
- Dodavatelé a jejich lokace jsou v jiném systému
- Ruční spojování dat z multiple systémů
- Týdny práce

**S TierIndex:**
```sql
-- Vypočítej geografickou koncentraci pro každou WGR commodity group
WITH geo_risk AS (
    SELECT
        wgr.commodity_group,
        t1.country,
        COUNT(DISTINCT t1.supplier_id) as supplier_count,
        SUM(t1.annual_volume_eur) as total_spend,
        -- Označení high-risk countries
        CASE
            WHEN t1.country IN ('RU', 'BY', 'UA', 'CN') THEN 'HIGH_RISK'
            WHEN t1.country IN ('TR', 'IN', 'TH') THEN 'MEDIUM_RISK'
            ELSE 'LOW_RISK'
        END as country_risk
    FROM tierindex.ti_tier1 t1
    JOIN tierindex.ti_wgr_mapping wgr ON t1.supplier_id = wgr.supplier_id
    GROUP BY wgr.commodity_group, t1.country
)
SELECT
    commodity_group,
    country,
    supplier_count,
    total_spend,
    country_risk,
    ROUND(100.0 * total_spend / SUM(total_spend) OVER (PARTITION BY commodity_group), 1) as spend_share_pct
FROM geo_risk
WHERE country_risk IN ('HIGH_RISK', 'MEDIUM_RISK')
ORDER BY commodity_group, total_spend DESC;
```

**Output:**
| Commodity Group (WGR) | Country | Suppliers | Annual Spend | Risk        | Share % |
| --------------------- | ------- | --------- | ------------ | ----------- | ------- |
| Elektrika             | CN      | 12        | 15.2M EUR    | HIGH_RISK   | 68%     |
| Plastové díly         | TH      | 8         | 8.1M EUR     | MEDIUM_RISK | 42%     |
| Kovové komponenty     | TR      | 5         | 6.3M EUR     | MEDIUM_RISK | 35%     |

**Čas:** <5 minut
**Akce:** Prioritizovat diverzifikaci "Elektrika" commodity (68% koncentrace v Číně)

#### **Co nám TierIndex poskytl:**
- ✅ **WGR (Warengruppe)** = Škoda Auto commodity taxonomy
- ✅ **Country risk scoring** = Geopolitická rizika
- ✅ **Spend concentration** = Finanční exposure analytics

---

## 🧩 Co je uvnitř TierIndex: 4 datové komponenty

### **1. HS Codes (Harmonized System)**
**Co to je:** 6-místné mezinárodní kódy pro klasifikaci obchodovaného zboží
**Proč důležité:** Celní úřady, trade data, regulace

**Příklad:**
- `8708.29` = Brzdové komponenty
- `8542.31` = Integrated circuits (čipy)
- `8544.42` = Ignition wiring (kabeláž)

**Kde to používáme:**
- Sayari Trade API vrací HS kódy pro každý trade relationship
- Mapujeme dodavatele na HS kódy → vidíme "co vyrábějí"
- Compliance checks (EU import restrictions)

---

### **2. WGR (Warengruppe) – Commodity Taxonomy**

**Co to je:** Interní Škoda Auto kategorizace materiálů a dílů
**Proč důležité:** Business procesy, sourcing strategie, cost management

**Příklad:**
- `WGR-3400` = Elektrika a elektronika
- `WGR-5200` = Plastové díly interiér
- `WGR-6100` = Kovové komponenty chassis

**Kde to používáme:**
- Propojení mezi SAP (WGR) a external data (HS codes)
- Commodity-specific risk analysis
- Strategic sourcing decisions

**Mapping HS ↔ WGR:**
```
HS 8542.31 (Integrated Circuits) → WGR-3400 (Elektrika)
HS 8708.29 (Brakes) → WGR-6100 (Kovové komponenty)
```

---

### **3. BOM (Bill of Materials) – Part Hierarchies**

**Co to je:** Hierarchie parent-child vztahů mezi díly ve vozidle
**Proč důležité:** Impact propagation, project dependencies

**Příklad struktury:**
```
Vehicle Model: Octavia EV
├── Battery Pack Assembly (parent)
│   ├── Battery Controller Module (child) ← Supplier: ElectroComponents
│   ├── Cooling System (child)
│   └── Wiring Harness (child) ← Supplier: CablePro
├── Infotainment System (parent)
│   ├── Display Unit (child)
│   └── Connectivity Module (child) ← Supplier: ElectroComponents
```

**Kde to používáme:**
- Crisis impact analysis: "ElectroComponents zkrachoval → Battery Pack + Infotainment jsou blocked"
- Alternative matching: "Potřebuji náhradníka pro Battery Controller → Kdo jiný dělá podobné HS kódy?"

---

### **4. Tier1/2/3 Mappings – Supplier Relationships**

**Co to je:** Graf vztahů "kdo dodává komu"
**Proč důležité:** Visibility do sub-dodavatelů, cascade analysis

**Příklad grafu:**
```
Škoda Auto (zákazník)
├── ElectroComponents GmbH (Tier-1)
│   ├── ChipManufacturing Ltd (Tier-2, Taiwan)
│   │   └── SiliconWafer Corp (Tier-3, South Korea)
│   └── ConnectorSystems SpA (Tier-2, Italy)
├── BrakeSystem Solutions (Tier-1)
│   └── CastingPro Ltd (Tier-2, Czech Republic)
```

**Kde to používáme:**
- N-tier traversal: "Který Tier-3 dodavatel má sankce?"
- SPOF detection: "ChipManufacturing dodává 5 Tier-1 → CRITICAL SPOF"
- Geographic clustering: "3 Tier-2 dodavatelé v Northern Italy → shared risk"

---

## 🔄 Jak získáváme TierIndex data: 3 zdroje

### **Zdroj 1: Sayari (Global Supply Chain Data)**

**Co poskytuje:**
- Ownership vztahy (UBO - Ultimate Beneficial Owner)
- Trade relationships (kdo obchoduje s kým)
- Sanctions & watchlist screening
- HS codes pro každý trade flow

**API endpoints:**
- `/v1/resolution` - Entity matching
- `/v1/supply_chain/upstream` - Tier-2/3 traversal
- `/v1/trade/search/suppliers` - Find suppliers by HS code

**Update frequency:** Denní polling (Notifications API) + měsíční baseline (Bulk Data 3.22 TiB)

**Příklad použití:**
> "Chci vědět, kdo jsou sub-dodavatelé ElectroComponents"
> → Sayari API vrátí graf upstream suppliers s HS kódy

---

### **Zdroj 2: Dun & Bradstreet (Financial Health)**

**Co poskytuje:**
- Credit ratings a failure scores
- Financial statements (revenue, profit, debt)
- Payment behavior (PAYDEX score)
- Corporate hierarchy (parent/subsidiary)

**API endpoints:**
- `/v1/data/duns/{duns}` - Company profile
- `companyinfo_L2_v1` - Financial metrics
- `financialstrengthinsight_L4_v1` - Risk indicators

**Update frequency:** Denní API calls pro monitorované dodavatele

**Příklad použití:**
> "Je ElectroComponents finančně zdravý?"
> → DnB vrátí: Credit rating 78, Failure score 30, Revenue trend -15% → **Rizikový dodavatel**

---

### **Zdroj 3: SAP (Internal Business Data)**

**Co poskytuje:**
- DUNS numbers našich Tier-1 dodavatelů (master data)
- Kontrakty, objednávky, faktury
- Delivery performance, quality scores
- Payment behavior (platí včas?)

**DAP Gold tables:**
- `dm_ba_purchase` - Purchase orders
- `dm_bs_purchase` - Invoices
- `dm_experience` - Historical performance

**Update frequency:** Denní ETL z SAP do DAP

**Příklad použití:**
> "Jak se ElectroComponents chová v platbách?"
> → SAP: 23% faktur po splatnosti (bylo 5%) → **Deteriorating behavior**

---

## 🏗️ Databricks Architecture: Bronze → Silver → Gold

### **Bronze Layer: Raw Data**
Surová data ze 3 zdrojů, immutable audit trail

```
staging_wsp.tierindex_bronze
├── sayari_raw (JSON responses z API)
├── dnb_raw (JSON responses z API)
└── sap_raw (CSV exports z DAP Gold)
```

**Update:** Denní append-only

---

### **Silver Layer: Normalized Tables**
Čisté, normalizované tabulky pro analytics

```
staging_wsp.tierindex_silver
├── ti_entity (20k dodavatelů, DUNS jako PK)
├── ti_edge (200k vztahů, Tier-1 → Tier-2/3)
├── ti_entity_risk (Risk atributy: sanctions, financial, UBO)
└── ti_entity_matches (Mapování Sayari entity_id ↔ SAP DUNS)
```

**Update:** Denní transformace z Bronze

---

### **Gold Layer: Pre-calculated Metrics**
Hotové metriky pro business users

```
staging_wsp.tierindex_gold
├── ti_spof_scores (Single Point of Failure rankings)
├── ti_geographic_clusters (Risk regions)
├── ti_commodity_exposure (WGR concentration analysis)
└── ti_manifest (Baseline version tracking)
```

**Update:** Týdně batch jobs

---

## 🤖 MCOP: Metadata Orchestrator pro TierIndex

### **Co je MCOP?**
> **Metadata Copilot (MCOP) je helper agent, který propojuje TierIndex data s metadata systémy (Collibra, Unity Catalog, DAP) a umožňuje jejich enrichment.**

### **MCOP ≠ TierIndex**
- **TierIndex** = Data platform (samotná data o dodavatelích)
- **MCOP** = Orchestrátor (propojuje data, enrichuje metadata, loguje transformace)

### **Příklad MCOP workflow:**

**Situace:** Procurement manager chce analýzu Hamburg port blockage

**MCOP orchestrace:**
1. **Query TierIndex** → Kteří Tier-1 používají Hamburg jako import port?
2. **Enrich s Collibra** → Jaká je data quality score pro tyto dodavatele?
3. **Query Unity Catalog** → Jaké HS kódy obchodují přes Hamburg?
4. **Query DAP (SAP)** → Jaké jsou annual volumes a projekty?
5. **Aggregate & synthesize** → Kompletní risk report
6. **Log to Unity Catalog** → Audit trail všech transformací

**Result:**
```json
{
  "affected_tier1": 3,
  "total_exposure": "25.8M EUR",
  "projects_at_risk": 10,
  "mcop_metadata": {
    "data_quality_avg": 87,
    "collibra_verified": true,
    "unity_catalog_lineage": "bronze.sayari_raw → silver.ti_entity → gold.ti_exposure"
  }
}
```

### **MCOP jako základ pro proaktivní monitoring**

**Budoucí vize:**
MCOP metadata umožní **ML modely** predikovat supplier risks:

- **Feature Store** = Historické snapshoty z TierIndex (enriched MCOPem)
- **ML model** = Predikce deterioration 3 měsíce dopředu
- **Alert pipeline** = Notifikace procurement team

**Ale to je Phase 2!** Dnes se soustředíme na **TierIndex foundation**.

---

## 🎯 Shrnutí: Proč TierIndex potřebujeme

| Use Case                                 | Bez TierIndex            | S TierIndex           |
| ---------------------------------------- | ------------------------ | --------------------- |
| **Compliance check** (HS codes)          | 2-3 týdny manuálně       | <30 sekund SQL        |
| **Crisis impact** (dodavatel zkrachoval) | 1-2 dny analýzy          | <1 minuta             |
| **SPOF detection** (sub-dodavatelé)      | Nelze zjistit            | <2 minuty graph query |
| **Commodity risk** (WGR clustering)      | Týdny multi-systém audit | <5 minut analytics    |

### **TierIndex = Enabler pro:**
1. ✅ Rychlé odpovědi na komplexní dodavatelské otázky
2. ✅ Visibility do Tier-2/3 sub-dodavatelů
3. ✅ Risk quantification v business terms (EUR, projekty)
4. ✅ Foundation pro budoucí ML/prediktivní monitoring

---

**Next:** Podíváme se na konkrétní business capabilities postavené na TierIndex datech
