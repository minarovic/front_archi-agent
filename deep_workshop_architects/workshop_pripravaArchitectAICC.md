# Workshop Příprava: TierIndex Architektura pro AICC a Datový Tým

**Datum vytvoření:** 2025-10-22
**Audience:** Solution Architects (AICC, DAPI), Datový tým
**Typ dokumentu:** Workshop brief + Technical specification
**Status:** Draft for review

---

## Executive Summary

Tento dokument slouží jako komplexní technický podklad pro půldenní workshop s architekty z týmů AICC a datového týmu. Cílem workshopu je definovat architektonický přístup k TierIndex systému pro monitoring dodavatelského řetězce. Klíčovým požadavkem je nastavit správné architektonické základy, aby nedošlo k budoucímu nákladnému přepracování ("rebork").

### Strategický Kontext
- **Přechod od reaktivního → proaktivní řízení rizik** v dodavatelském řetězci
- **Vizibilita Tier 2/3 dodavatelů:** Současně známo pouze 10-30% z Tier 2/3, cíl: systematická mapa
- **Prediktivní monitoring:** Identifikace hrozeb dříve, než ovlivní výrobu

---

## 1. Workshop Logistics

### 1.1 Formát a Příprava



**Příprava:**

- ✅ **Fokus na rozhodnutí:** Workshop není pro eduakci, ale pro konkrétní architekturnická rozhodnutí

### 1.2 Klíčové Rozhodnutí (Decision Points)

Workshop musí definitivně rozhodnout:

1. **Platformová kapacita:**
   - Stávající datová platforma → kapacita pro grafovou logiku
-

1. **Gold vrstva architektura:**
   - Jeden Gold s více tabulkami vs. více samostatných Goldů
   - Dopad na výkon při očekávaném počtu uživatelů (Logistika, Kvalita, další oddělení)

2. **Výpočetní nároky:**
   - Batch processing windows pro TierIndex přepočet
   - ML model training/inference kapacita
   - Network bandwidth pro Sayari API dotazování

### 1.3 Očekávané Výstupy

Po workshopu:
- [ ] **Architekturnická rozhodnutí** zdokumentována (ADR format)
- [ ] **Roadmap** pro implementaci (iterativní fáze)
- [ ] **Open items** s ownerem a deadline
- [ ] **Next steps** pro týmy (AICC, DAPI, N-Tier)

---

## 2. Technický Kontext: TierIndex Systém

### 2.1 Účel Systému

**Problém:** Dodavatelský řetězec má 3 úrovně (Tier 1/2/3), ale vidíme jen Tier 1 (~1500 dodavatelů). Tier 2/3 jsou "black box" → riziko výpadků.

**Řešení:** TierIndex = předpočítaný "strom dodavatelů" kopírující kusovník auta (Bill of Materials), který:
- Mapuje Tier 1 → Tier 2 → Tier 3 vztahy
- Sleduje finanční zdraví, vlastnické změny, compliance rizika
- Generuje akčné alerty pro nákupčí **dříve, než problém nastane**

### 2.2 Datové Zdroje

#### Interní Data
| Zdroj         | Obsah                                 | Objem              | Refresh   |
| ------------- | ------------------------------------- | ------------------ | --------- |
| **SAP**       | Tier 1 dodavatelé (přímé smlouvy)     | ~1500 subjektů     | Denně     |
| **Kvalita**   | Audity, certifikace, Excel/SharePoint | ~500 auditů/rok    | Týdně     |
| **Logistika** | Dodací termíny, quality issues        | Kontinuální stream | Real-time |

#### Externí API
| Zdroj                      | Účel                       | Kapacita          | Náklady  | Klíčové Atributy                          |
| -------------------------- | -------------------------- | ----------------- | -------- | ----------------------------------------- |
| **Sayari API**             | Tier 2/3 mapování          | Unlimited queries | External | 35 endpointů, ~25 relevantních atributů   |
| **Sayari Media**           | Globální media monitoring  | Součást licence   | Included | Strukturované alerty (compliance, sankce) |
| **D&B (Dun & Bradstreet)** | Finanční data              | API access        | External | Credit scores, financials, ownership      |
| **Semantic Vision**        | Lokální média (PL, CZ, SK) | Custom            | €XX/rok  | Předzpracované výsledky ("mustry")        |

#### Web Scraping + ML
- **Účel:** Ověření neznámých Tier 2/3 dodavatelů
- **Metoda:** Extrakce HS kódů z webstránek → ML porovnání s known profiles
- **Output:** Redukce "okruhu kandidátů" z 1000+ na 10-20 s nejvyšší pravděpodobností

---

## 3. Architektura: Bronze-Silver-Gold Pattern

### 3.1 Architektonické Principy

**Princip 1: Škálovatelnost a "Big Picture"**
- Návrh musí vycházet z finálního cílového stavu
- Vyhnout se "příliš mělkým základům"
- Iterativní implementace, ale s vizí celého systému

**Princip 2: Modulární Design (Fork Concept)**
- Logistika a Kvalita sledují "vlastní rizika a data"
- Každé oddělení může vytvořit vlastní Gold vrstvu (fork)
- Všechny forky vycházejí ze společného Silver základu (Single Source of Truth)

**Princip 3: Pre-computing Strategy**
- TierIndex se **předpočítává** (ne real-time assembly)
- Odůvodnění: Sayari licence s unlimited queries → využít naplno
- Alert generování: Batch processing, ne reactive

**Princip 4: Iterativní Dodávka**
- Jednotlivé komponenty (Tier Index, risk models, data sources) vyvíjené samostatně
- Postupné dodávání obchodní hodnoty

### 3.2 Bronze Vrstva (Data Lake)

**Účel:** Sběrné jezero pro všechna surová data v původní podobě

**Obsah:**
- SAP exports (Tier 1 dodavatelé)
- Sayari API responses (raw JSON)
- D&B API data
- Web scraping výsledky (HTML → structured)
- Semantic Vision feeds
- Oddělení-specifická data (Kvalita audity, Logistika excely)

**Klíčové rozhodnutí:**
- [ ] Storage format: Parquet, Delta Lake, nebo raw files?
- [ ] Partitioning strategy: by date, by source, nebo hybrid?
- [ ] Retention policy: jak dlouho držet raw data?

### 3.3 Silver Vrstva (Single Source of Truth)

**Účel:** Vyčištěná, integrovaná, strukturovaná data jako základ pro analytiku

**Klíčové Komponenty:**

#### A. TierIndex (Hierarchie Dodavatelů)
```
Tier 1 (SAP)
  ├─ Tier 2 (Sayari API)
  │   ├─ Tier 3 (Sayari API)
  │   └─ Tier 3 (Web scraping + ML)
  └─ Tier 2 (Sayari API)
      └─ Tier 3 (Sayari API)
```

**Datový model:**
- `supplier_id` (primary key)
- `tier_level` (1, 2, 3)
- `parent_supplier_id` (foreign key → self-reference)
- `relationship_probability` (0.0-1.0, z Sayari)
- `relationship_evidence` (důkazy pro spojení)
- `hs_codes` (array) - produktové kategorie
- `last_updated` (timestamp)

#### B. Faktové Tabulky

**Společné faktovky** (pro všechna oddělení):
- `fact_sayari_ownership` - vlastnické změny
- `fact_sayari_risk_scores` - rizikové skóre
- `fact_dnb_financials` - finanční data
- `fact_media_alerts` - compliance/sankce alerty
- `fact_historical_events` - všechny události v časové ose

**Oddělené faktovky** (per oddělení):
- `fact_quality_audits` - audity kvality (Kvalita team)
- `fact_logistics_delays` - dodací problémy (Logistika team)

#### C. ML Models Outputs
- Risk classification (binary: high/low risk)
- Financial stability score (0-100)
- HS code matching confidence (pro neznámé dodavatele)

**Klíčové rozhodnutí pro Silver:**
- [ ] Jak modelovat self-referential hierarchii (TierIndex) efektivně?
- [ ] Kam patří ML model outputs → Silver nebo Gold?
- [ ] Jak verzovat faktovky při změnách schématu?

### 3.4 Gold Vrstva (Konzumace & Vizualizace)

**Účel:** Optimalizovaná data pro konkrétní use cases a vizualizační nástroje (Power BI)

**Charakteristiky:**
- Vyčištěné, předpřipravené, **malé tabulky**
- Denormalizované pro rychlé dotazy
- Optimalizované pro Power BI (zamezit načítání "miliard řádků")

#### KRITICKÉ ROZHODNUTÍ: Gold Architektura

**Varianta A: Jeden Gold s více tabulkami**
- **Pro:**
  - Centralizovaná správa
  - Jednodušší governance
  - Méně infrastruktury
- **Proti:**
  - Riziko performance při velkém počtu souběžných uživatelů
  - Vzájemné ovlivňování dotazů (Logistika query blokuje Kvalita query)
  - Složitější row-level security

**Varianta B: Více Goldů (per oddělení)**
- **Pro:**
  - Izolace (Logistika Gold vrstva nezasahuje Kvalita Gold vrstva)
  - Lepší výkon (dedicated resources)
  - Škálovatelnost (přidání nového oddělení = nová Gold vrstva)
- **Proti:**
  - Vyšší náročnost správy
  - Duplicita dat (každá Gold vrstva drží kopii TierIndex)
  - Potenciální inconsistency (pokud Silver update není atomický)

**Doporučení N-Tier týmu:** Varianta B (více Goldů)
- Odůvodnění: Očekáván velký počet uživatelů (Logistika ~50, Kvalita ~30, další oddělení)
- Trade-off: Vyšší správa vs. garantovaný výkon

**Architekti musí rozhodnout:**
- [ ] Varianta A nebo B?
- [ ] Pokud B: Jak zajistit konzistenci při update ze Silver?
- [ ] Feature Store napojení: Jak sdílet ML features mezi Gold vrstvami?

---

## 4. Prediktivní Monitoring Use Cases

### 4.1 Scénář: Finanční Nestabilita

**Business požadavek:** Detekovat finanční problémy u Tier 2/3 dodavatelů **dříve**, než způsobí výpadek dodávek.

**Datový vstup:**
- Sayari API: Vlastnické změny, soudní řízení, insolvence
- D&B: Credit scores, financial ratios

**Logika:**
1. **Baseline monitoring:** Čtvrtletní check všech Tier 2/3 (batch job)
2. **Elevated monitoring:** Měsíční check pro dodavatele s declining trend
3. **Critical monitoring:** Denní check pro dodavatele s "warning signals"

**Trigger events:**
- Vlastnické změny (>50% podílu)
- Soudní zabavení majetku
- Credit score drop >20 bodů
- Insolvence konkurentů v stejném regionu/odvětví

**Alert output:**
```json
{
  "alert_type": "financial_instability",
  "supplier_id": "TIER2_12345",
  "tier_level": 2,
  "severity": "high",
  "affected_tier1": ["TIER1_001", "TIER1_045"],
  "trigger": "ownership_change_hostile_takeover",
  "recommendation": "Identify alternative suppliers in region",
  "assignee": "nakupcí@skoda.cz"
}
```

**Klíčové rozhodnutí:**
- [ ] Frekvence batch jobů: Denní/týdenní/měsíční?
- [ ] Threshold pro "warning signals": Jak definovat?
- [ ] Eskalační matrix: Kdo dostane jaké alerty?

### 4.2 Scénář: Analýza Dopadu (Impact Analysis)

**Business požadavek:** Okamžitě vyhodnotit dopad výpadku libovolného Tier 2/3 dodavatele.

**Logika:**
1. Vypadne Tier 3 dodavatel → **propagace nahoru** stromem:
   - Najdi všechny Tier 2 dodavatele, kteří závisí na tomto Tier 3
   - Najdi všechny Tier 1 dodavatele, kteří závisí na těchto Tier 2
2. **Analýza nahraditelnosti:**
   - Existují alternativní dodavatelé se stejnými HS kódy?
   - Geografická poloha alternativ (same region vs. distant)
   - Lead time pro přesun výroby
3. **Kvantifikace dopadu:**
   - Počet ovlivněných Tier 1 (direct impact)
   - % produkce ovlivněné (volume impact)
   - Critical path: Je tento dodavatel na critical path výroby?

**Output:**
```
🔴 CRITICAL IMPACT: Tier 3 dodavatel XYZ vypadl

Ovlivněné Tier 2: 3 dodavatelé (ABC, DEF, GHI)
Ovlivněné Tier 1: 12 dodavatelů (45% celkové produkce)

Alternativní dodavatelé:
  - Vendor A (Polsko) - lead time 2 týdny
  - Vendor B (Německo) - lead time 4 týdny

Doporučení: Okamžitě kontaktovat Vendor A
```

**Klíčové rozhodnutí:**
- [ ] Jak definovat "criticality" dodavatele?
- [ ] Real-time analýza vs. pre-computed scenarios?
- [ ] Integrace s ERP (SAP) pro volume data?

### 4.3 Scénář: Compliance & Sankce

**Business požadavek:** Automaticky detekovat dodavatele v sankcích nebo s compliance issues.

**Datový vstup:**
- Sayari Media: Globální monitoring (sankce, korupce, porušení lidských práv)
- Semantic Vision: Lokální monitoring (polská/česká média)

**Logika:**
1. Media services dodávají **strukturované alerty** (ne raw articles)
2. Alert obsahuje: `supplier_id`, `event_type`, `severity`, `source`
3. Systém **propojí alert s TierIndex** (matching by supplier_id nebo název firmy)
4. **Propagace alertu:** Pokud Tier 3 má compliance issue → alertuj všechny Tier 1, které závisí na Tier 3

**Klíčové rozhodnutí:**
- [ ] Jak matchovat media mentions na konkrétní supplier_id? (fuzzy matching?)
- [ ] False positive handling: Jak filtrovat irelevantní alerty?
- [ ] Severity classification: Kdo definuje "high/medium/low"?

---

## 5. Výpočetní a Platformová Kritéria

### 5.1 Datové Úložiště

**Požadavky:**
- [ ] **Grafová logika:** Efektivní zpracování self-referential hierarchie (TierIndex)
  - Podporuje platforma graph queries? (např. Apache AGE, Neo4j, nebo SQL recursive CTEs?)
- [ ] **Kapacita úložiště:**
  - Bronze: ~500GB raw data (Sayari API responses, web scraping)
  - Silver: ~100GB structured data (TierIndex + faktovky)
  - Gold: ~50GB per oddělení (denormalizované tabulky)
- [ ] **Compliance:** GDPR requirements pro osobní data (ownership info)

### 5.2 Výpočetní Výkon

**Požadavky:**
- [ ] **Batch processing:**
  - TierIndex full rebuild: Každý týden, trvá ~4-6 hodin (odhad)
  - Incremental updates: Každý den, trvá ~30 min
- [ ] **ML modely:**
  - Training: Měsíčně (financial stability model, HS code matching)
  - Inference: Denně pro všechny Tier 2/3 dodavatele (~5000 entities)
- [ ] **Alert generation:**
  - Real-time evaluation rules pro každý nový event
  - Expected volume: ~100-500 events/den

**Klíčové rozhodnutí:**
- [ ] Stávající platforma má dostatečnou kapacitu?
- [ ] Potřeba autoscaling pro batch jobs?
- [ ] Dedicated compute pro ML vs. shared pool?

### 5.3 Síťová Konektivita

**Požadavky:**
- [ ] **Sayari API:** Časté dotazování pro pre-computing
  - Unlimited queries v licenci → využít agresivně
  - Expected volume: ~10,000 API calls/den
  - Bandwidth: ~1GB/den data transfer
- [ ] **D&B API:** Rate limits respektovat
  - API access allocation
  - Batch queries optimalizovat (ne real-time)

### 5.4 Referenční Benchmark

**VW Cloud Analytics Platform (CAP):**
- Použita pro podobný use case (supplier risk monitoring)
- **Pozor:** Dle dostupných info je funkčně **méně vyspělá** než naše stávající řešení
- **Cíl:** Nepřebírat VW přístup slepě, ale navrhnout superiorní řešení

**Klíčové otázky pro architekty:**
- [ ] Máme benchmark data z VW CAP? (performance, škálovatelnost)
- [ ] Co dělá VW lépe? Co dělá hůře?
- [ ] Můžeme se poučit z jejich chyb?

---

## 6. Proces Sestavení TierIndex (Technical Deep Dive)

### 6.1 Krok 1: Identifikace Tier 1 Dodavatelů

**Zdroj:** SAP (interní systém)

**Proces:**
1. Daily export z SAP (IDOC nebo API)
2. Extrakt obsahuje:
   - `supplier_id` (DUNS number nebo SAP vendor ID)
   - `supplier_name`
   - `contract_status` (active/inactive)
   - `contract_start_date`, `contract_end_date`
   - `hs_codes` (produkty, které dodavatel poskytuje)

**Output:** `bronze.sap_tier1_suppliers` (raw) → `silver.tierindex` (tier_level=1)

### 6.2 Krok 2: Obohacení o Tier 2/3 (Primární: Sayari API)

**Zdroj:** Sayari API

**Proces:**
1. Pro každý Tier 1 dodavatel: Query Sayari API
   ```
   GET /api/v1/suppliers/{supplier_id}/relationships
   ```
2. API response obsahuje:
   - `subdodavatel_id`
   - `relationship_type` (e.g., "supplies_to")
   - `probability` (0.0-1.0) - jak moc je Sayari confident v tomto vztahu
   - `evidence` (důkazy: contracts, shipping records, public filings)
   - `hs_codes` (produkty, které subdodavatel poskytuje)
3. **Rekurze:** Pro každý Tier 2 → query Sayari pro Tier 3

**Výzvy:**
- **Cirkulární vztahy:** Dodavatel A dodává B, B dodává C, C dodává A → jak řešit cycles?
- **Confidence threshold:** Ignorovat vztahy s `probability < 0.3`?
- **Data freshness:** Sayari data jsou někdy zastaralá → jak validovat?

**Klíčové rozhodnutí:**
- [ ] Rekurze: Zastavit na Tier 3 nebo jít hlouběji (Tier 4, 5)?
- [ ] Cycle detection algorithm: DFS, BFS, nebo jiný přístup?
- [ ] Confidence threshold: 0.3 nebo vyšší/nižší?

### 6.3 Krok 3: Doplňková Identifikace (Web Scraping + ML)

**Zdroj:** Web scraping + ML model

**Use case:** Sayari neví o dodavateli X, ale my máme "podezření", že X je Tier 2/3

**Proces:**
1. **Vstup:** Seznam "kandidátů" (např. od nákupčího: "Myslím, že firma Y dodává našemu Tier 1")
2. **Web scraping:**
   - Navštívit website firmy Y
   - Extrahovat HS kódy (z product pages, certifikáty, case studies)
   - Extrahovat zákaznickou referenci (customer logos, testimonials)
3. **ML matching:**
   - Porovnat HS kódy firmy Y s HS kódy známých Tier 1 dodavatelů
   - Vypočítat "match score" (cosine similarity na HS code vectors)
4. **Output:** Řazený seznam kandidátů (top 10 s nejvyšším match score)

**Klíčové rozhodnutí:**
- [ ] Jak definovat "okruh kandidátů"? (ruční input vs. automatické discovery)
- [ ] ML model type: Supervised (labeled data) vs. unsupervised (clustering)?
- [ ] Validation: Jak rychle musí nákupčí potvrdit/zamítnout návrhy?

---

## 7. Modularity: Fork Concept (Gold Vrstva per Oddělení)

### 7.1 Motivace

**Problém:** Logistika a Kvalita sledují "vlastní rizika a data"

**Příklad:**
- **Logistika** sleduje: Dodací termíny, on-time delivery %, dopravní rizika
- **Kvalita** sleduje: Certifikace (ISO, IATF), audit výsledky, non-conformance rate

→ Každé oddělení potřebuje **vlastní koeficienty, atributy, metriky** nad společným TierIndex základem

### 7.2 Technická Implementace Forku

**Princip:**
1. **Silver = Single Source of Truth** (společný základ pro všechny)
   - TierIndex hierarchie (Tier 1/2/3)
   - Společné faktovky (Sayari, D&B)
   - Oddělené faktovky (per oddělení)
2. **Gold = Fork (per oddělení)**
   - Logistika vytvoří `gold_logistics.*` (vlastní tabulky, vlastní dashboardy)
   - Kvalita vytvoří `gold_quality.*` (vlastní tabulky, vlastní dashboardy)

**Datový tok:**
```
Bronze (raw data)
  ↓
Silver (TierIndex + faktovky)
  ↓
  ├─→ Gold_Logistics (fork 1)
  ├─→ Gold_Quality (fork 2)
  └─→ Gold_Finance (fork 3, budoucí)
```

**Co je ve Forku (Gold vrstvě)?**
- **Denormalizovaná data:** TierIndex + oddělení-specifické metriky v jedné tabulce
- **Vlastní agregace:** Např. Logistika chce "average delivery delay per Tier 1" → pre-computed
- **Vlastní ML features:** Kvalita má vlastní "quality risk score" model

### 7.3 Zajištění Konzistence

**Výzva:** Pokud Silver se updatuje → jak synchronizovat všechny Gold vrstvy?

**Řešení A: Cascade update (waterfall)**
```
Silver update → Gold_Logistics update → Gold_Quality update → ...
```
- **Pro:** Jednoduché
- **Proti:** Pomalé (serialized), jeden failed update blokuje ostatní

**Řešení B: Parallel update**
```
Silver update
  ├─→ Gold_Logistics update (parallel)
  ├─→ Gold_Quality update (parallel)
  └─→ Gold_Finance update (parallel)
```
- **Pro:** Rychlé
- **Proti:** Složitější orchestrace, potenciální inconsistency (pokud 1 update failuje)

**Klíčové rozhodnutí:**
- [ ] Řešení A nebo B?
- [ ] Pokud B: Jak řešit partial failures?
- [ ] Transaction isolation: Jak zajistit, že Power BI nečte "half-updated" Gold vrstvu?

---

## 8. Slovník Pojmů (Glossary)

| Pojem                      | Definice                                                                              | Příklad                              |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| **Tier Index**             | Strom dodavatelů mapující hierarchické vztahy v dodavatelském řetězci                 | Tier 1 → Tier 2 → Tier 3             |
| **Tier 1**                 | Přímí dodavatelé s podepsanou smlouvou (SAP data)                                     | ~1500 dodavatelů                     |
| **Tier 2**                 | Subdodavatelé dodávající Tier 1                                                       | 10-30% známo, cíl: systematická mapa |
| **Tier 3**                 | Subdodavatelé dodávající Tier 2                                                       | <5% známo                            |
| **HS Kód**                 | Harmonized System Code - mezinárodní klasifikace produktů pro celní účely             | HS 8708 = auto parts                 |
| **Pre-computing**          | Strategie předpočítávání TierIndexu (ne real-time assembly při query)                 | Weekly batch rebuild                 |
| **Fork (Gold vrstva)**     | Modulární odbočka pro oddělení - vlastní Gold vrstva odvozená ze Silver               | `gold_logistics.*`                   |
| **Single Source of Truth** | Silver vrstva obsahující konsistentní, vyčištěná data jako základ pro všechny analýzy | `silver.tierindex`                   |
| **Bronze-Silver-Gold**     | Osvědčené paradigma datové architektury: raw → cleaned → consumption                  | Medallion architecture               |
| **Sayari API**             | Externí služba pro mapování dodavatelských vztahů                                     | 35 endpointů, ~25 atributů           |
| **Semantic Vision**        | Služba pro monitoring lokálních médií (PL, CZ, SK) s předzpracovanými výsledky        | Mustry = detection patterns          |
| **Rebork**                 | Slangový výraz pro nákladné přepracování architektury kvůli špatným základům          | "Avoid rebork at all costs!"         |

---

## 9. Workshop Agenda (Navrhovaná Struktura)

### Část 1: Kontext a Cíle (30 min)
- Business case: Proč TierIndex?
- Strategic priorities: MVP vs. long-term vision
- Success criteria: Jak vypadá úspěch?

### Část 2: Technické Rozhodnutí (120 min)
#### 2.1 Platformová Kapacita (30 min)
- Stávající platforma: Ano/Ne?
- Grafová logika: Jak řešit?
- Výpočetní nároky: Dostatečné?

#### 2.2 Gold Architektura (45 min)
- **KRITICKÉ:** Jeden Gold vs. více Goldů
- Performance modeling: Kolik uživatelů?
- Cost-benefit analysis: Správa vs. výkon

#### 2.3 TierIndex Sestavení (45 min)
- Sayari API integration: Frekvence, threshold
- Web scraping: Kdy použít?
- ML models: Kde běží (Silver/Gold)?

### Část 3: Roadmap a Next Steps (60 min)
- Iterativní fáze: Co kdy?
- Team responsibilities: AICC vs. DAPI vs. N-Tier
- Open items: Owner a deadline

### Část 4: Q&A a Wrap-up (30 min)
- Unresolved questions
- ADR documentation plan
- Follow-up meeting schedule

---

## 10. Pre-Workshop Checklist

### Pro Architekty (48h před workshopem)
- [ ] Přečíst tento brief (20 min)
- [ ] Přečíst `scrum/architecture/physical_model.md` (15 min)
- [ ] Přečíst `scrum/architecture/SLA.md` (10 min)
- [ ] Připravit otázky/concerns (list do emailu)

### Pro N-Tier Tým
- [ ] Dodat tento brief architekům (2 dny předem)
- [ ] Připravit demo: TierIndex mock-up (Mermaid diagram nebo interactive viz)
- [ ] Připravit cost breakdown: Sayari, D&B, Semantic Vision licence
- [ ] Kontaktovat VW CAP tým: Request benchmark data (pokud možné)

### Pro Meeting Owner (Marek/Honza)
- [ ] Zarezervovat meeting room (4h block, whiteboard)
- [ ] Připravit Miro board pro remote participants
- [ ] Nastavit recording (pro follow-up reference)
- [ ] Poslat kalendářní pozvánku s agenda a attachments

---

## 11. Otevřené Otázky pro Architekty (Decision Checklist)

### Platforma
- [ ] **P1:** Stávající platforma → kapacita pro Tier Index grafovou logiku?
  - Podporuje recursive CTEs? Graph extensions (Apache AGE)?
- [ ] **P2:** Alternativa (CAP) → kdy zvažovat migraci?
  - Trigger point: Počet dodavatelů? Performance degradace?
- [ ] **P3:** Data lake technology: Delta Lake, Iceberg, nebo proprietary?

### Gold Vrstva
- [ ] **G1:** Jeden Gold vs. více Goldů → finální rozhodnutí?
  - Quantify: Kolik uživatelů očekáváno? (Logistika, Kvalita, Finance, ...)
- [ ] **G2:** Feature Store napojení → jak zajistit konzistenci features?
  - Shared feature store vs. per-Gold vrstva feature store?
- [ ] **G3:** Power BI licence: Premium capacity vs. Pro?
  - Dopad na architekturu (direct query vs. import mode)?

### Modularity (Fork)
- [ ] **M1:** Jak technicky implementovat "fork" z Silver do Gold?
  - Views, materialized views, nebo separate tables?
- [ ] **M2:** Správa verzí faktových tabulek pro oddělení?
  - Schema evolution: Backward/forward compatibility?
- [ ] **M3:** Governance: Kdo approves nové Gold vrstvy?
  - Process pro onboarding nového oddělení?

### ML Pipeline
- [ ] **ML1:** Kde běží ML modely → Silver nebo Gold?
  - Training: Silver, Inference: Gold?
- [ ] **ML2:** Výstupy ML modelů → materializace do které vrstvy?
  - Features in Silver, predictions in Gold?
- [ ] **ML3:** MLOps platform: Databricks MLflow, Azure ML, nebo custom?

### Data Integration
- [ ] **D1:** Sayari API polling frequency: Denně, týdně, real-time?
- [ ] **D2:** Web scraping governance: Kdo spouští? Jak často?
- [ ] **D3:** Data quality monitoring: Anomaly detection na ingestě?

### Security & Compliance
- [ ] **S1:** GDPR compliance pro ownership data (osobní údaje)?
- [ ] **S2:** Row-level security v Gold: Jak implementovat?
  - Azure AD groups vs. custom roles?
- [ ] **S3:** Audit log: Kdo přistupoval k jakým datům?

---

## 12. Související Dokumenty

### Must-Read před Workshopem
1. `scrum/architecture/physical_model.md` - TierIndex architektura detail
2. `scrum/architecture/SLA.md` - SLA/SLO targets pro data freshness
3. `scrum/architecture/tierindex_slovnik_pojmu.md` - Terminologie a koncepty

### Nice-to-Have
4. `scrum/architecture/dap-integration/dap_gap_analysis.md` - DAP platform constraints
5. `scrum/architecture/synthesis-agent.md` - TierIndex-first orchestrace
6. `prezentace6.10/N_TIER_REQUIRED_USE_CASES.md` - Use cases analýza

### Technical Deep-Dive
7. `scrum/architecture/background_monitoring/` - TierIndex runtime implementation
   - `background_monitoring.md` - DAP migration strategy, governance
   - `background_monitoring_data_model.md` - Edge taxonomy, tier classification rules
   - `background_monitoring_implementation.md` - Loader, hot-reload, performance benchmarks

### Post-Workshop Follow-up
7. ADR (Architecture Decision Records) - dokumentovat všechna rozhodnutí
8. Roadmap update v `scrum/PRIORITIES.md`
9. Implementation plan v `scrum/stories/backlog/`

---

## Metadata

**Připravil:** N-Tier Team (Marek, Honza)
**Datum přípravy:** 2025-10-22
**Pro workshop:** AICC + Datový tým (plánováno půl dne)
**Verze:** 1.0 (draft)
**Status:** Awaiting architect review
**Next review:** 2025-10-24 (před workshopem)

**Change Log:**
- 2025-10-22: Initial draft (konsolidace z `deep_workshop_architects.md`)
