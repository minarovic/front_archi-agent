# Prezentace: Executive Overview
**Dokument:** `00_executive_overview.html`
**Audience:** C-level management, business stakeholders
**Účel:** High-level představení N-Tier TierIndex platformy

---

## Slajd 1: Co je N-Tier TierIndex?

### Co říkám:
> "TierIndex je předpočítaný graf 15 tisíc dodavatelů - od našich přímých dodavatelů (Tier 1) až po sub-dodavatele třetího a čtvrtého řádu. Díky tomu dokážeme rychle odpovědět na komplexní otázky o dodavatelském řetězci."

### Klíčové body:
- **15k dodavatelů** - Pokrytí celého supply chain
- **Předpočítané metriky** v Gold layer → rychlé odpovědi
- **Hybridní refresh** - Měsíční baseline (3.22 TiB) + denní inkrementální update
- **3 zdroje dat** - Sayari (vztahy), DnB (finance), SAP (kontrakty)

### Proč je to důležité:
"Bez TierIndexu bychom museli každý dotaz počítat znovu od začátku - trvalo by to minuty místo sekund. Předpočítáním hlavních metrik získáváme rychlost potřebnou pro interaktivní analýzu."

---

## Slajd 2: Co N-Tier umožňuje

### Co říkám:
> "N-Tier není jen databáze - je to orchestrátor komplexních analýz, které Power BI nebo Excel prostě nezvládnou."

### 5 klíčových capabilities:

1. **Multi-hop graph traversal**
   - *Co to znamená:* "Tier-3 dodavatelé na sankčním seznamu s finančním rizikem"
   - *Proč Power BI ne:* Power BI neumí propojovat vztahy přes více úrovní s podmínkami

2. **Multi-source synthesis**
   - *Co to znamená:* Kombinace Sayari + DnB + SAP + BeON → unified risk score
   - *Proč Power BI ne:* Power BI zobrazí jednotlivé zdroje, ale nespojí je inteligentně

3. **Crisis cascade analysis**
   - *Co to znamená:* "Dodavatel X zkrachoval - kdo je všechno zasažen?"
   - *Proč Power BI ne:* Power BI nezvládne real-time propagaci dopadu

4. **Predictive monitoring**
   - *Co to znamená:* Early warning 3 měsíce předem (ML model)
   - *Proč Power BI ne:* Power BI má jen základní predikce

5. **Conversational interface**
   - *Co to znamená:* Přirozený jazyk místo SQL dotazů
   - *Proč Power BI ne:* Power BI vyžaduje předpřipravené reporty

### Key message:
"TierIndex je datová platforma (předpočítané metriky), N-Tier orchestrátor řídí komplexní dotazy nad touto platformou."

---

## Slajd 3: Architektura (Mermaid diagram)

### Co říkám:
> "Architektura následuje Medallion pattern - průmyslový standard pro data lakehouse na Databricks."

### 3 vrstvy vysvětlit:

**Bronze - Raw data:**
- "Surová data ze Sayari, DnB, SAP - neupravená, immutable audit trail"
- "Když něco pokazíme v transformaci, můžeme se vrátit k originálu"

**Silver - Fact tables + Feature Store:**
- "Čisté, normalizované tabulky - ti_entity (dodavatelé), ti_edge (vztahy)"
- "Feature Store = historické snapshoty pro ML trénink"

**Gold - Pre-calculated metrics + ML predictions:**
- "Hotové metriky pro Power BI a API"
- "ML predictions = pravděpodobnost úpadku dodavatele"

### API + Power BI + Frontend:
- "Tři způsoby konzumace dat - podle use case"
- "Power BI pro dashboardy, API pro integraci, Frontend pro exploraci"

---

## Slajd 4: Klíčové tabulky (Silver Layer)

### Co říkám:
> "Silver layer obsahuje 4 core tabulky - základ všeho, co děláme."

### Tabulku po tabulce:

| Tabulka             | Co obsahuje                  | Proč důležitá                                     |
| ------------------- | ---------------------------- | ------------------------------------------------- |
| `ti_entity`         | Master data 20k dodavatelů   | "DUNS číslo = unikátní identifikátor"             |
| `ti_entity_matches` | Mapování Sayari ↔ SAP        | "Propojení mezi naším systémem a Sayari databází" |
| `ti_edge`           | 200k vztahů mezi dodavateli  | "Kdo dodává komu - základ grafu"                  |
| `ti_entity_risk`    | Risk atributy 15k dodavatelů | "Sankce, finanční zdraví, UBO complexity"         |

### Unity Catalog path:
"Všechno v `staging_wsp.tierindex_silver.*` - centrální governance, přístupová práva přes role."

---

## Slajd 5: Zdroje dat

### Co říkám:
> "Kombinujeme 3 externí zdroje s interními SAP daty."

### Sayari (supplier relationships):
- **API** - Real-time dotazy
- **Bulk Data** - 3.22 TiB snapshot (3.75B entit, 5.47B vztahů)
- **Notifications API** - Denní polling rizikových změn
- *Proč důležité:* "Jediný zdroj globálních dodavatelských vztahů - vlastníci, sankce, UBO"

### DnB (financial health):
- **API** - Company profily, credit score
- **DataBlocks** - Standardizované finanční metriky
- *Proč důležité:* "Nejdůvěryhodnější zdroj finančních dat - 400M+ firem"

### SAP (internal data):
- **Master data** - DUNS list, kontrakty
- **dm_ba_purchase, dm_bs_purchase** - Objednávky, faktury (DAP Gold)
- **Experience data** - Historie objednávek, kvalita, platební morálka
- *Proč důležité:* "Naše interní zkušenost s dodavateli - complementární k externím datům"

---

## Slajd 6: Tier Identification (3 metody)

### Co říkám:
> "Jak určujeme, kdo je Tier 1, Tier 2, Tier 3? Máme 3 metody s různou spolehlivostí."

### ✅ Metoda 1: SAP Master Data
- **Jak funguje:** Kontrakt se Škodou → Tier 1
- **Confidence:** 100% (verified)
- *Kdy použít:* "Pro všechny dodavatele s přímým kontraktem"

### ✅ Metoda 2.1: Sayari API + HS Code Match
- **Jak funguje:**
  1. Query Sayari: "Kdo jsou dodavatelé firmy X?"
  2. Sayari vrátí vztahy s HS kódy (commodity codes)
  3. Match proti expected automotive parts
- **Confidence:** 70-90% (závisí na HS code overlap)
- *Kdy použít:* "Pro sub-dodavatele bez přímého kontraktu"

### ⏸️ Metoda 2.2: Web Scraping + AI + HS Code Inference
- **Jak funguje:** NLP inference z textů na webu
- **Status:** Detailed validation method
- *Kdy použít:* "Pro edge cases - verifikace, zda dodavatel zapadá do výrobního procesu"

### Data tracking:
"`ti_edge.identification_method` = enum trackuje, kterou metodou byl vztah identifikován."

---

## Slajd 7: Business Value - SCR-06

### Co říkám:
> "První use case je prediktivní monitoring - varujeme 3 měsíce předem, než dodavatel zkrachuje."

### SCR-06: Supplier Deterioration Prediction

**Co děláme:**
- ML model (LightGBM) predikuje credit rating downgrade
- Horizon: 3 měsíce dopředu
- Features: DnB trends + SAP payment behavior + industry benchmarks

**Jak to funguje:**
1. Hodinové snapshoty z Feature Store
2. ML inference každou hodinu
3. Alert delivery: Email, Teams Copilot
4. SLA: <4h response pro critical alerts

**Proč je to důležité:**
"Místo reaktivního hašení požárů děláme proaktivní prevenci. 3 měsíce je dost času aktivovat alternativní dodavatele."

---

## Slajd 8: Business Value - SCR-07

### Co říkám:
> "Druhý use case je crisis management - dodavatel zkrachoval, kdo je zasažen?"

### SCR-07: Crisis Impact Analysis

**Co děláme:**
- Real-time graph traversal (Tier 1 → Tier 4)
- Impact scoring (criticality, revenue exposure, geografická koncentrace)
- Alternative supplier recommendations z TierIndex Gold

**Jak to funguje:**
1. Input: "SUPPLIER_X bankrupt"
2. Upstream analysis: Kdo kupuje od X?
3. Downstream analysis: Kdo dodává X?
4. Project mapping: Které projekty jsou zasažené?
5. Alternative matching: Sémantické vyhledávání náhrad

**Proč je to důležité:**
"Dnes trvá manuální analýza v Excelu 2-3 dny. S N-Tier to je 4 minuty - critically important pro supply chain continuity."

---

## Slajd 9: Power BI vs N-Tier Comparison

### Co říkám:
> "Proč nemůžeme použít jen Power BI? Tady je přesné srovnání capabilities."

### Tabulku vysvětlit řádek po řádku:

1. **Multi-hop graph traversal**
   - Power BI: ❌ - "Neumí propojovat vztahy přes více úrovní"
   - N-Tier: ✅ - "Graph database backend, native graph queries"

2. **Multi-source synthesis**
   - Power BI: ⚠️ Basic - "Zobrazí data vedle sebe, ale nespojí inteligentně"
   - N-Tier: ✅ Advanced - "LLM orchestrátor kombinuje zdroje kontextuálně"

3. **Conversational interface**
   - Power BI: ❌ - "Q&A je omezené na předpřipravené dotazy"
   - N-Tier: ✅ LLM - "Natural language → SQL → odpověď"

4. **Predictive monitoring**
   - Power BI: ⚠️ Basic - "Jen simple forecasting"
   - N-Tier: ✅ ML-powered - "LightGBM s SHAP explanations"

5. **Static reporting**
   - Power BI: ✅ - "To je jeho síla"
   - N-Tier: ✅ - "Také umíme"

6. **Self-service dashboards**
   - Power BI: ✅ - "Best-in-class"
   - N-Tier: ⚠️ Basic - "Nemáme ambici nahradit Power BI"

### Key message:
"N-Tier a Power BI jsou complementární - ne competitors. Power BI pro dashboardy, N-Tier pro komplexní analýzy."

---

## Q&A - Očekávané otázky

### Q: "Jak často se data refreshují?"
**A:** "Hybrid approach:
- **Baseline:** Měsíčně (3.22 TiB Bulk Data ze Sayari)
- **Incremental updates:** Denně (Notifications API)
- **Feature Store snapshots:** Hodinově
- **Gold layer aggregace:** Týdně"

### Q: "Kolik to stojí?"
**A:** "Rozbíjíme náklady na:
- **Sayari:** Partnership pricing (Bulk Data + API)
- **DnB:** Per-query pricing (negotiating volume discount)
- **Databricks compute:** ~$X/měsíc (optimizing with serverless)
- **Storage:** Delta Lake na Azure (~$Y/měsíc)

Detailní cost breakdown v business case dokumentu."

### Q: "Kdy bude hotovo?"
**A:** "Phased rollout:
- **Q4 2025:** MVP (GitHub + Docker Hub) - 2 use cases (SCR-06, SCR-07)
- **Q1 2026:** Pre-production (Azure DevOps migration, JFrog onboarding)
- **Q2 2026:** Production (Red Hat UBI, SA DMZ accounts, full DAP integration)"

### Q: "Kdo to bude používat?"
**A:** "3 user personas:
1. **Procurement Manager** - Crisis response, supplier alerts
2. **Risk Manager** - Proactive monitoring dashboards
3. **Data Analyst** - Exploratory analysis, ad-hoc queries"

### Q: "Jak zajistíme data governance?"
**A:** "Unity Catalog na DAP platformě:
- **RBAC** - Role-based access control (ntier_reader, ntier_admin)
- **Audit trail** - Všechny změny v Bronze layer immutable
- **Data lineage** - Databricks Lineage tracking transformací
- **Retention policies** - Gold 24m, Feature Store 12m, Alert History 36m"

---

## Závěrečný slide - Call to Action

### Co říkám:
> "Tři věci potřebujeme od vás dnes:"

1. **Schválení DAP workspace requestu**
   - "Staging workspace pro Silver layer tabulky"
   - "Potřebujeme Unity Catalog permissions pro read/write"

2. **Business case review**
   - "ROI analýza v `N_TIER_REQUIRED_USE_CASES.md`"
   - "112k$/year data investment vs potential savings"

3. **Prioritizace use cases**
   - "SCR-06 a SCR-07 jako MVP must-have?"
   - "Nebo přidáme další use cases do Q4 2025 scope?"

### Next steps:
"Follow-up meeting za týden - ukážeme live demo na test datech."

---

**Tip pro prezentaci:**
- Neukazuj slajdy lineárně - skoč podle otázek audience
- První 3 slajdy = must-have (Co, Proč, Jak)
- Zbytek = reference pro deep-dive diskusi
- Keep it executive-friendly - avoid technical jargon
