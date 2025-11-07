# Proaktivní Monitoring - N-Tier Runtime Aplikace

**Audience:** 🏗️ Architect, 💼 Business, 👨‍💻 Developer
**Purpose:** Dokumentace N-Tier runtime aplikace pro proaktivní supplier monitoring
**Priority:** 🔴 HIGH (Jarmila priority)
**Date:** October 9, 2025

---

## 🎯 Co Je Proaktivní Monitoring?

**Definice:**
N-Tier runtime aplikace která **predikuje** supplier risks PŘED tím, než se stanou problémem, a **automaticky notifikuje** příslušné stakeholdery.

**Klíčový rozdíl oproti TierIndex:**
- ✅ **TierIndex** = předpočítaný supplier graph (Gold layer, baseline, changesets)
- ✅ **N-Tier Monitoring** = runtime AI/LLM aplikace (continuous monitoring → alerts)

---

## 🔴 Core Use Cases (Jarmila Priority)

### **1. SCR-06: Supplier Deterioration Prediction**
**Problém:** Automatické varování když se supplier health zhoršuje

**Příklad:**
```
"Alert: SUPPLIER_X má 82% pravděpodobnost credit rating downgrade za 3 měsíce"
→ Continuous monitoring (DnB ratings, Sayari sanctions, negative news)
→ Trend detection (CUSUM algorithm + ML models)
→ Configurable thresholds + notification delivery
```

**Jarmila requirement:**
> "Systém by měl poslat notifikaci, když identifikuje potenciální riziko (např. u dodavatel x bude za období xy vyšší počet faktur po splatnosti, nebo když se změní management firmy, dodavatele někdo koupí nebo násilně převezme, atd.)"

**Dokumentace:** [02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md)

---

### **2. SCR-07: Crisis Impact Analysis**
**Problém:** Real-time cascade analysis při krizi

**Příklad:**
```
"SUPPLIER_X právě vyhlásil insolvenci - kteří dodavatelé jsou impactovaní?"
→ Graph traversal upstream/downstream
→ Project mapping + quantified exposure
→ Alternative supplier matching
→ Time: <5 minutes
```

**Dokumentace:** [02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md)

---

## 📂 Struktura Dokumentace

### **Základní dokumenty:**
1. **[01_overview_proaktivni_monitoring.md](./01_overview_proaktivni_monitoring.md)** ⏱️ 5 min
   - Architektura N-Tier runtime aplikace
   - Rozdíl oproti TierIndex (Gold layer)
   - ETL pipeline (Sergiu diagram)

2. **[02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md)** ⏱️ 10 min
   - Detailní popis SCR-06, SCR-07
   - Příklady queries + expected outputs
   - Architecture approach

3. **[03_data_model_proaktivni_monitoring.md](./03_data_model_proaktivni_monitoring.md)** ⏱️ 10 min
   - Runtime data flows
   - Feature Store struktura
   - Alert pipeline architecture

4. **[04_diagrams_proaktivni_monitoring.md](./04_diagrams_proaktivni_monitoring.md)** ⏱️ 5 min
   - ETL pipeline (Sergiu feedback #2)
   - Supervisor Architecture
   - Alert delivery workflow

### **ML Enhancement dokumenty:**
5. **[ML_deterioration_prediction.md](./ML_deterioration_prediction.md)** ⏱️ 15 min
   - SCR-06 specific ML approach
   - LightGBM + CUSUM algorithms
   - Data requirements + labeling strategy

6. **[LLM_orchestration_patterns.md](./LLM_orchestration_patterns.md)** ⏱️ 10 min
   - Gate rules pro monitoring
   - Tool-call interfaces (predict_deterioration, detect_anomaly)
   - Format contracts (alert schemas)

---

## 🚀 Quick Start podle Role

### **💼 Business (Jarmila, Procurement Team)**
1. Přečti [02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md) - konkrétní use cases
2. Review [ML_deterioration_prediction.md](./ML_deterioration_prediction.md) - jak funguje early warning

**Klíčové otázky:**
- Jaké signals chceš monitorovat? (faktury po splatnosti, změna managementu, M&A?)
- Jak rychle chceš dostat notifikaci? (real-time vs daily batch?)
- Kdo má dostávat alerts? (buyer, category manager, risk manager?)

---

### **🏗️ Architect (Marek, Honza)**
1. Začni s [01_overview_proaktivni_monitoring.md](./01_overview_proaktivni_monitoring.md) - architektura
2. Review [04_diagrams_proaktivni_monitoring.md](./04_diagrams_proaktivni_monitoring.md) - Sergiu ETL diagram
3. Deep dive: [03_data_model_proaktivni_monitoring.md](./03_data_model_proaktivni_monitoring.md) - data flows

**Klíčové rozhodnutí:**
- Feature Store vs on-demand computation?
- Real-time streaming vs batch monitoring?
- Alert delivery (Teams, Email, ServiceNow)?

---

### **👨‍💻 Developer (Sergiu, Team)**
1. Začni s [02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md) - požadavky
2. Review [LLM_orchestration_patterns.md](./LLM_orchestration_patterns.md) - implementační patterns
3. Deep dive: [ML_deterioration_prediction.md](./ML_deterioration_prediction.md) - ML algoritmy

**Implementační tasky:**
- Continuous monitoring infrastructure (Azure Functions? Databricks Jobs?)
- Alert pipeline (trigger logic, notification delivery)
- ML model training + inference (Feature Store integration)

---

## 🔗 Related Docs

### **TierIndex (Gold Layer):**
- `scrum/architecture/physical_model.md` - Silver/Gold/API architektura
- `scrum/architecture/tierindex_slovnik_pojmu.md` - slovník pojmů
- `scrum/architecture/communication/sergiu/` - Sergiu onboarding (TierIndex fokus)

### **Supervisor Architecture:**
- `scrum/architecture/supervisor_architecture/` - nová orchestrace (ReAct agents)
- Relevant pro SCR-07 (Impact Propagation Agent)

### **Machine Learning:**
- `scrum/architecture/machine_learning/ML_PREDICTIVE_ROADMAP.md` - ML roadmap (generický)
- **→ Tato složka:** Specifické ML implementace pro proaktivní monitoring

---

## 📋 Status & Timeline

**Current Phase:** Documentation & Architecture

| Component                   | Status          | Owner          | Timeline  |
| --------------------------- | --------------- | -------------- | --------- |
| **Use Cases Documentation** | 🟡 In Progress   | Marek          | Oct 9-11  |
| **ETL Pipeline Diagram**    | ✅ Done (Sergiu) | Sergiu         | Oct 8     |
| **ML Deterioration Design** | 🔴 To Do         | Data Scientist | Oct 10-15 |
| **Alert Pipeline Design**   | 🔴 To Do         | Architect      | Oct 10-15 |
| **Implementation**          | 🔴 Not Started   | Team           | TBD       |

---

## 💬 Feedback & Questions

**Kontakty:**
- **Jarmila (Business):** Requirements, use case validation
- **Marek/Honza (Architect):** Architecture decisions, DAP integration
- **Sergiu (Developer):** Implementation, ETL pipeline

**Open Questions:**
1. Real-time streaming vs batch monitoring? (latency requirements)
2. Alert delivery channels? (Teams, Email, ServiceNow integration)
3. Configurable thresholds? (user-defined vs fixed rules)
4. Historical data retention? (how far back for trend analysis)

---

**Last Updated:** October 9, 2025
**Next Review:** October 11, 2025 (after initial docs complete)
