# Prezentace: Use Cases - Proaktivní Monitoring
**Dokument:** `02_use_cases_proaktivni_monitoring.html`
**Audience:** Risk managers, procurement managers, technical leads
**Účel:** Detailní vysvětlení 2 core use cases (SCR-06, SCR-07)

---

## Slajd 1: Use Cases Overview

### Co říkám:
> "Dnes probereme 2 konkrétní use cases, které řeší reálné business problémy. Nejedná se o teoretické možnosti - máme real-world scenarios."

### 2 core use cases:

1. **SCR-06: Supplier Deterioration Prediction**
   - *Co řeší:* Early warning system - varování 3 měsíce předem
   - *Pro koho:* Risk Manager

2. **SCR-07: Crisis Impact Analysis**
   - *Co řeší:* Real-time cascade assessment - kdo je zasažen krizí
   - *Pro koho:* Procurement Manager, Crisis Response Team

### Proč tyto dva?
"Vybrali jsme je na základě analýzy 112k$/year data investment - nejvyšší ROI, nejvyšší business impact."

---

## Slajd 2: SCR-06 - Problem Statement

### Co říkám:
> "Risk manager chce automatické alerty, když se dodavatel začíná dostávat do problémů - PŘED tím, než je pozdě."

### Dnešní stav (bez N-Tier):
- **Reaktivní** - Zjistíme problém, až dodavatel přestane dodávat
- **Manuální monitoring** - Excel spreadsheets, ad-hoc checks
- **Pozdní reakce** - Nemáme čas aktivovat alternativy
- **Vysoké náklady** - Emergency procurement, production stoppages

### Bolestivé příběhy:
"Dodavatel zkrachoval minulý rok - zjistili jsme až když nepřišla dodávka. Assembly line stála 2 týdny, ztráta 5M EUR. S 3-měsíčním early warning bychom měli čas aktivovat backup dodavatele."

---

## Slajd 3: SCR-06 - Scenario 1: Financial Deterioration

### Co říkám:
> "Ukážu konkrétní alert, který by systém vygeneroval."

### Alert breakdown:

```
Alert: SUPPLIER_X má 82% pravděpodobnost downgrade credit ratingu za 3 měsíce

Evidence:
- Credit rating klesá 3 měsíce (85 → 82 → 78) [DnB]
- Revenue trend: -15% quarterly [DnB]
- Payment behavior: 23% faktur po splatnosti (bylo 5%) [SAP dm_bs_purchase]
- Credit note ratio: 4.2% (bylo 1.5%) [SAP dm_bs_purchase]
- Industry benchmark: SUPPLIER_X je 1.2 std dev pod průměrem

Recommended Actions:
- Zvýšit safety stock (+20%)
- Vyžádat finanční výkazy
- Aktivovat alternativního dodavatele (SUPPLIER_Y)
- SLA: Odpovědět do 4 hodin
```

### Vysvětlit každý řádek Evidence:

1. **Credit rating klesá** - "DnB sleduje rating měsíčně, vidíme konzistentní pokles"
2. **Revenue trend** - "Příjmy firmy klesají - často předchůdce úpadku"
3. **Payment behavior** - "Naše vlastní zkušenost ze SAP - platí později"
4. **Credit note ratio** - "Více reklamací/vrácení - kvalita klesá"
5. **Industry benchmark** - "Porovnáváme s peer group - SUPPLIER_X je horší než průměr"

### Recommended Actions vysvětlit:
"Nejsou to jen tipy - systém vygeneruje konkrétní action items s ownery a deadlines."

---

## Slajd 4: SCR-06 - Scenario 2: Ownership Change

### Co říkám:
> "Druhý typ rizika - změna vlastníka. Často přehlížená, ale kritická."

### Alert breakdown:

```
Alert: SUPPLIER_X změnil ultimate beneficial owner (UBO)

Evidence:
- Sayari API detekoval ownership transfer (2025-10-08)
- Nový vlastník: COMPANY_Z (neznámá entita, bez credit history)
- Předchozí vlastník: COMPANY_ABC (stable, 10-letá historie)
- UBO complexity vzrostla z 2 na 5 layers

Recommended Actions:
- Vyžádat aktualizované kontrakty
- Ověřit novou ownership strukturu
- Assess COMPANY_Z financial health
- Zvážit aktivaci backup dodavatele
```

### Proč je UBO změna problém?
"Změna majitele často znamená změnu strategie, cashflow problémů původního majitele (proto prodává), nebo dokonce money laundering. UBO complexity = 5 layers je red flag - kdo vlastní koho?"

### Real-world příklad:
"Dodavatel byl odkoupen private equity firmou - zatížili ho dluhem, vytěžili cash, za rok zkrachoval. Kdyby nás varoval UBO change alert, mohli jsme reagovat dřív."

---

## Slajd 5: SCR-06 - Scenario 3: Sanctions / Compliance

### Co říkám:
> "Třetí typ rizika - sankce, adverse media, compliance violations."

### Alert breakdown:

```
Alert: SUPPLIER_X má novou adverse media zmínku

Evidence:
- Source: Reuters článek (2025-10-07)
- Topic: Environmental compliance violation (€2M pokuta)
- Severity: MEDIUM (zatím ne na blacklistu, ale under investigation)
- Related entities: 3 subsidiaries také zmíněny

Recommended Actions:
- Monitorovat oficiální sankce
- ESG review nutný
- Zvážit contract clauses (ethics compliance)
```

### Proč je to důležité?
"Nesankcionujeme dodavatele my - ale pokud se dostane na EU/US blacklist, nesmíme s ním obchodovat. Lepší vědět předem a diverzifikovat."

### Compliance aspect:
"ESG reporting requirements - musíme prokázat due diligence na dodavatele. Adverse media monitoring je součástí compliance."

---

## Slajd 6: SCR-06 - Architecture (Rule-Based)

### Co říkám:
> "Ukážu, jak to technicky funguje - nejdřív jednodušší rule-based approach."

### Python pseudo-code vysvětlit:

```python
def monitor_suppliers():
    suppliers = get_tier1_suppliers() # ~1500 dodavatelů

    for supplier in suppliers:
        current = feature_store.get_latest(supplier.duns)
        historical = feature_store.get_history(supplier.duns, days=90)

        alerts = []

        # Check 1: Credit rating trend
        if current.credit_rating < historical.avg - 10:
            alerts.append(Alert("Credit rating klesl o 10+ bodů"))

        # Check 2: Payment behavior
        if current.payment_late_pct > 0.20:
            alerts.append(Alert("20%+ faktur po splatnosti"))

        # Check 3: Sanctions
        if current.sanctions_count > historical.sanctions_count:
            alerts.append(Alert("Nové sankce detekovány"))

        # Check 4: UBO changes
        if current.ubo_hash != historical.ubo_hash:
            alerts.append(Alert("Ownership struktura se změnila"))

        for alert in alerts:
            deliver_alert(alert, supplier)
```

### Krok po kroku:

1. **Feature Store** - "Hodinové snapshoty všech metrik - credit rating, payment behavior, sanctions..."
2. **Historical comparison** - "Porovnáváme current state s 90-day historií"
3. **Rule checks** - "4 základní pravidla - credit drop, payment late, sanctions, UBO change"
4. **Alert delivery** - "Email, Teams Copilot, audit log"

### Nevýhody rule-based:
"Funguje, ale má false positives - někdy credit rating klesne z legitimních důvodů. Proto máme ML-enhanced verzi."

---

## Slajd 7: SCR-06 - Architecture (ML-Enhanced)

### Co říkám:
> "Sofistikovanější approach - machine learning model predikuje pravděpodobnost úpadku."

### Python pseudo-code vysvětlit:

```python
def predict_deterioration(supplier):
    # Extract features (12 dimensions)
    features = {
        "credit_rating_6m": [85, 84, 83, 81, 80, 78],  # 6-month history
        "revenue_trend_slope": -0.15,  # regression slope
        "sanctions_count": 2,
        "ubo_changes": 1,
        "negative_news_count": 5,
        "industry_benchmark_zscore": -1.2,
        "payment_late_pct": 0.23,
        "defect_rate_ppm": 250,
        "otd_score": 0.87,
        "employee_count_change": -50,  # layoffs
        "capex_trend": -0.30,  # declining investments
        "peer_group_volatility": 0.45
    }

    # LightGBM inference
    probability = lightgbm_model.predict_proba(features)
    shap_values = lightgbm_model.explain(features)

    if probability > 0.80:
        return Alert(
            message=f"{probability*100:.0f}% probability downgrade za 3 měsíce",
            top_factors=shap_values.top3,
            confidence=probability
        )
```

### Features vysvětlit:

**Financial features (DnB):**
- `credit_rating_6m` - 6-měsíční historie (hledáme trend)
- `revenue_trend_slope` - Regression slope (klesá/roste?)

**Compliance features (Sayari):**
- `sanctions_count` - Počet sankcí
- `ubo_changes` - Změny majitele
- `negative_news_count` - Adverse media

**Operational features (SAP):**
- `payment_late_pct` - % pozdních plateb
- `defect_rate_ppm` - PPM defektů (kvalita)
- `otd_score` - On-time delivery score

**Macro features:**
- `industry_benchmark_zscore` - Porovnání s peer group
- `peer_group_volatility` - Jak moc se celý sektor třese

### LightGBM + SHAP:
"LightGBM je gradient boosted decision trees - průmyslový standard pro tabular data. SHAP explanations = 'proč model predikoval 82%?' → top 3 faktory."

### Výhody ML:
- ✅ Nižší false positive rate (<5%)
- ✅ Predikce 3 měsíce dopředu (ne jen current state)
- ✅ Interpretable (SHAP)
- ✅ Continuous learning (retrain týdně)

---

## Slajd 8: SCR-06 - Alert Delivery Workflow (Diagram)

### Co říkám:
> "Ukážu, jak putuje alert od detekce k doručení."

### Mermaid diagram vysvětlit:

**1. Monitoring Pipeline → Anomaly?**
"Každou hodinu běží monitoring job - feature store snapshots → anomaly detection"

**2. Alert Engine**
"Pokud detekujeme anomálii → Alert Engine rozhoduje o severity"

**3. Severity routing:**
- **HIGH** → Immediate: Teams + Email
  - "Procurement Manager + Category Manager dostanou instant notifikaci"
- **MEDIUM** → Daily Digest: Email
  - "Buyer + Risk Manager dostanou daily summary"
- **LOW** → Weekly Report: Power BI
  - "Dashboard update - všichni uživatelé vidí v reportu"

**4. Audit Log → Alert History Table**
"Každý alert jde do Delta Lake - compliance audit trail, můžeme zpětně analyzovat false positives"

### SLA targets:
- HIGH: <5 min delivery
- MEDIUM: <24 hours
- LOW: Weekly

---

## Slajd 9: SCR-06 - Notification Channels Table

### Co říkám:
> "Tři severity levels, různé kanály a SLA."

### Tabulku vysvětlit:

| Severity   | Channel              | SLA       | Recipients                 |
| ---------- | -------------------- | --------- | -------------------------- |
| **HIGH**   | Teams + Email        | <5 min    | Procurement Manager, Buyer |
| **MEDIUM** | Email (daily digest) | <24 hours | Buyer, Risk Manager        |
| **LOW**    | Power BI dashboard   | Weekly    | All users                  |

### HIGH severity příklad:
"Dodavatel má 85%+ probability úpadku → instant Teams message + email. Procurement Manager musí reagovat do 4 hodin - aktivovat backup dodavatele nebo zvýšit safety stock."

### MEDIUM severity příklad:
"Credit rating klesl o 5 bodů (ne kritické, ale sledovat) → daily digest email. Risk Manager reviewne všechny MEDIUM alerts ráno, rozhodne o dalších krocích."

### LOW severity příklad:
"Payment late ratio vzrostl z 2% na 8% (hodně nízké číslo, ale stojí za zmínku) → Power BI dashboard tile. Analysts vidí v weekly review."

---

## Slajd 10: SCR-07 - Problem Statement

### Co říkám:
> "Druhý use case - crisis management. Dodavatel právě zkrachoval - co teď?"

### Real-time otázka:
"SUPPLIER_X právě vyhlásil insolvenci - které dodavatele to zasáhne?"

### Dnešní stav (bez N-Tier):
1. **Manuální Excel** - Hledáme SUPPLIER_X v spreadsheetech
2. **Review Tier-1** - Kdo kupuje od X? (ruční procházení)
3. **Cascade mapping** - Kdo kupuje od těch, co kupují od X? (další kolo)
4. **SAP query** - Které projekty používají zasažené dodavatele?
5. **Google search** - Hledání alternativ
6. **Time: 2-4 hours** (kritické!)

### Proč je to problém?
"Assembly line může stát za pár dní. Každá hodina zpoždění = lost revenue. Potřebujeme odpověď za minuty, ne hodiny."

---

## Slajd 11: SCR-07 - Solution Overview

### Co říkám:
> "N-Tier automatizuje celý crisis workflow - z hodin na minuty."

### N-Tier workflow (4 kroky):

**Step 1: Graph Traversal (Upstream + Downstream)**
```python
upstream = graph_traversal(
    start=bankrupt_supplier_duns,
    direction="incoming_edges",  # Kdo kupuje od X?
    max_depth=2  # Tier-1, Tier-2
)

downstream = graph_traversal(
    start=bankrupt_supplier_duns,
    direction="outgoing_edges",  # Kdo dodává X?
    max_depth=2
)
```
"Graph database query - najdi všechny upstream (zákazníky) a downstream (sub-dodavatele) do 2 úrovní."

**Step 2: Project Mapping**
```python
for supplier in affected_suppliers:
    supplier_projects = sap_api.get_projects(supplier.duns)

    # Check criticality
    buffer = project.inventory_buffer_days
    lead_time = project.supplier_lead_time_days

    if buffer < lead_time:
        criticality = "HIGH"  # Žádný time buffer!
```
"Pro každého zasaženého dodavatele: které projekty ho používají? Kolik máme time buffer?"

**Step 3: Alternative Matching**
```python
candidates = semantic_search(
    query=f"Alternative suppliers for {hs_codes}",
    exclude=[bankrupt_supplier.duns],
    k=10
)

# Rank by similarity + capacity
combined_score = 0.6 * similarity + 0.4 * capacity_score
```
"Sémantické vyhledávání alternativ - podobné capabilities + dostupná kapacita."

**Step 4: Quantified Exposure**
```python
total_volume_eur = sum(s.annual_volume for s in affected_suppliers)
critical_projects = [p for p in projects if p.criticality == "HIGH"]
```
"Sečti finanční exposure, identifikuj kritické projekty."

---

## Slajd 12: SCR-07 - Output Example

### Co říkám:
> "Výstup vypadá takto - comprehensive crisis report za 4 minuty."

### Report breakdown:

```
🚨 SUPPLIER_X Insolvency Impact

Impacted Suppliers:
- Direct customers: 12 Tier-1 suppliers (kupují přímo od SUPPLIER_X)
- Indirect: 6 Tier-2 suppliers (závisí na zasažených Tier-1)
- Downstream cascade: 28 additional suppliers impacted

Impacted Projects:
- Critical: 3 projects (PROJECT_Y vyžaduje parts za 2 týdny, no buffer)
  * PROJECT_Y: Assembly line stoppage za 14 dní
  * PROJECT_Z: Reduced output (-30%) za 21 dní
- Medium: 8 projects (1-2 months buffer)
- Low: 5 projects (>3 months buffer)

Quantified Exposure:
- Annual volume at risk: 52M EUR
- Estimated downtime: 14-21 days (pokud nebudeme jednat)
- Production impact: 1,200 vehicles (based on assembly schedule)

Alternative Suppliers (Top 3):
1. SUPPLIER_Y (Match: 92%, Capacity: 80%, Lead time: 6 weeks)
2. SUPPLIER_Z (Match: 87%, Capacity: 100%, Lead time: 8 weeks)
3. SUPPLIER_W (Match: 85%, Capacity: 60%, Lead time: 4 weeks)

Recommended Actions (Priority Order):
1. Immediate: Contact SUPPLIER_Y (highest match + capacity)
2. Short-term: Increase safety stock from buffer inventory
3. Medium-term: Dual-source strategy for critical parts
4. Long-term: Geographic diversification (reduce single-country risk)
```

### Co je důležité vysvětlit:

**Impacted Suppliers:**
"12 direct = naši Tier-1 dodavatelé kupují od X"
"6 indirect = Tier-2 dodavatelé závisí na těch 12"
"28 downstream = cascade effect"

**Critical Projects:**
"PROJECT_Y má no buffer - assembly line stojí za 2 týdny pokud nejednáme NOW"

**Alternative Suppliers:**
"Match score = sémantická podobnost capabilities"
"Capacity score = kolik dokážou dodat vs. kolik potřebujeme"
"Lead time = jak rychle můžeme začít odebírat"

**Recommended Actions:**
"Priority order = co dělat první, druhé, třetí"
"Immediate vs short-term vs long-term"

---

## Slajd 13: Configurable Thresholds

### Co říkám:
> "Každý tým může mít vlastní nastavení - co je pro ně high/medium/low severity."

### YAML config vysvětlit:

```yaml
thresholds:
  credit_rating_drop:
    enabled: true
    threshold: 10  # bodů pokles = alert
    lookback_days: 90

  payment_late_pct:
    enabled: true
    threshold: 0.20  # 20%

  sanctions:
    enabled: true
    immediate: true  # bez threshold, alert on any

  ml_prediction:
    enabled: true
    probability_threshold: 0.80  # 80%
    forecast_horizon_days: 90

notification_channels:
  teams:
    enabled: true
    webhook_url: "https://..."
  email:
    enabled: true
    recipients: ["procurement@skoda.cz"]
```

### Proč konfigurovatelné?
"Procurement Manager pro critical commodities chce alert při 5% credit drop, ale pro non-critical při 15% drop. Každý tým má jiné risk tolerance."

### Web UI pro configuration:
"Není nutné editovat YAML - máme web UI, kde uživatel nastaví prahy pomocí sliderů."

---

## Q&A - Očekávané otázky

### Q: "Jak přesný je ML model?"
**A:** "Current metrics na test data:
- **AUC: 0.83** (good discrimination)
- **Precision@0.80: 0.76** (76% alertů jsou skutečné problémy)
- **Recall@0.80: 0.71** (chytíme 71% všech deteriorations)
- **False positive rate: <5%**

Training data: 150+ labeled deterioration events (2020-2024). Retrain model týdně s novými daty."

### Q: "Co když dostaneme příliš mnoho alertů?"
**A:** "3 mechanizmy anti-spam:
1. **Severity routing** - LOW severity jde jen do dashboardu
2. **Configurable thresholds** - uživatel si nastaví, co je pro něj HIGH
3. **Alert aggregation** - daily digest pro MEDIUM (ne 50 emailů)

Plus průběžně tunujeme ML model thresholds podle user feedback."

### Q: "Jak rychle můžeme reagovat na crisis?"
**A:** "End-to-end timeline:
- **Crisis detected:** T+0 (real-time monitoring)
- **Impact analysis:** T+4 minutes (N-Tier report)
- **Alternative suppliers contacted:** T+1 hour (manual action)
- **Contract negotiation:** T+1-3 days
- **First delivery:** T+4-8 weeks (depends on supplier lead time)

Kritické okno je T+0 až T+4 min - tam N-Tier šetří 2-3 hodiny."

### Q: "Můžeme přidat vlastní features do ML modelu?"
**A:** "Ano! ML pipeline je navržený pro extensibility:
1. Přidej nový feature do Feature Store schema
2. Feature engineering pipeline ho automaticky compute
3. Retrain model s novým feature
4. A/B test nové verze modelu (MLflow)
5. Rollout do production

Příklad: Mohli bychom přidat 'social media sentiment score' z news scraping."

### Q: "Co když chceme monitorovat více než Tier-1?"
**A:** "Aktuálně monitorujeme ~1500 Tier-1 dodavatelů (high frequency).

Pro Tier-2/3 máme 2 options:
1. **Selective monitoring** - Only high-value Tier-2 (configuration by procurement)
2. **Lower frequency** - Tier-2 check daily místo hourly

TierIndex má data pro všech 15k dodavatelů - je to jen otázka compute resources."

---

## Závěr - Key Takeaways

### Co říkám:
> "Shrňme si 3 hlavní body z tohoto deep dive."

### 1. Proaktivita místo reaktivity
"SCR-06 dává 3-měsíční early warning - máme čas aktivovat alternativy místo emergency procurement."

### 2. Rychlost v krizi
"SCR-07 redukuje crisis response time z hodin na minuty - kritické pro supply chain continuity."

### 3. Konfigurovatelnost
"Každý tým si nastaví vlastní thresholds a notification preferences - není to one-size-fits-all."

### Next steps:
"Ukážeme live demo na test datech - uvidíte workflow od query až po final report."
