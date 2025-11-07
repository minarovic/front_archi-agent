# TierIndex Visual Reference - Workshop AICC

**Účel:** Vizualizace TierIndex konceptu pro architektonický workshop
**Audience:** AICC architekti, Honza, Marek
**Last Updated:** 2025-10-25

---

## Přehled

TierIndex je **předpočítaný supplier graph**, který klasifikuje dodavatele podle jejich vzdálenosti od root entity (product_class). Tento dokument obsahuje Mermaid diagramy pro workshop prezentaci.

---

## 1. Core Concept - TierIndex Základy

**Co diagram ukazuje:**
- Entity = Suppliers nebo Product Classes
- Edges = Supply relationships (dodavatelské vztahy)
- Tiers = Vzdálenost od root entity (0 = root, 1 = přímý dodavatel, 2 = sub-supplier, ...)

```mermaid
graph TD
    ROOT["Root Entity<br/>(Product Class)<br/>Tier 0"]
    T1A["Tier 1 Supplier A<br/>(Direct)"]
    T1B["Tier 1 Supplier B<br/>(Direct)"]
    T2A["Tier 2 Supplier A1<br/>(Sub-supplier)"]
    T2B["Tier 2 Supplier A2<br/>(Sub-supplier)"]
    T2C["Tier 2 Supplier B1<br/>(Sub-supplier)"]

    ROOT -->|supplies| T1A
    ROOT -->|supplies| T1B
    T1A -->|supplies| T2A
    T1A -->|supplies| T2B
    T1B -->|supplies| T2C

    style ROOT fill:#F5DEB3,stroke:#8B4513,stroke-width:3px,color:#000
    style T1A fill:#B8D4E8,stroke:#2C5F8D,stroke-width:2px,color:#000
    style T1B fill:#B8D4E8,stroke:#2C5F8D,stroke-width:2px,color:#000
    style T2A fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    style T2B fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    style T2C fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
```

**Legenda:**
- � **Béžová** = Root Entity (Product Class, Tier 0)
- 🔵 **Světle modrá** = Tier 1 Suppliers (přímí dodavatelé)
- 🟢 **Světle zelená** = Tier 2 Suppliers (sub-suppliers)

---

## 2. Reálný Příklad - Škoda Superb (3V0)

**Scénář:** Product Class `3V0` (Škoda Superb) s 3 Tier 1 suppliers a 5 Tier 2 suppliers.

```mermaid
graph TD
    ROOT["3V0<br/>Škoda Superb<br/>(Product Class)<br/>Tier 0"]

    T1_LEAR["Lear Corporation<br/>(Sedačky)<br/>Tier 1"]
    T1_CONT["Continental AG<br/>(Pneumatiky)<br/>Tier 1"]
    T1_BOSCH["Bosch<br/>(Motor komponenty)<br/>Tier 1"]

    T2_TEXT["XYZ Textiles<br/>(Potahy sedaček)<br/>Tier 2"]
    T2_FOAM["ABC Foam GmbH<br/>(Pěna sedaček)<br/>Tier 2"]
    T2_RUBB["Rubber Supplier X<br/>(Guma pneumatik)<br/>Tier 2"]
    T2_STEEL["Steel Supplier Y<br/>(Ocel motor)<br/>Tier 2"]
    T2_ELECTR["Electronics Co Z<br/>(Senzory motor)<br/>Tier 2"]

    ROOT -->|dodává sedačky| T1_LEAR
    ROOT -->|dodává pneumatiky| T1_CONT
    ROOT -->|dodává motor| T1_BOSCH

    T1_LEAR -->|dodává potahy| T2_TEXT
    T1_LEAR -->|dodává pěnu| T2_FOAM
    T1_CONT -->|dodává gumu| T2_RUBB
    T1_BOSCH -->|dodává ocel| T2_STEEL
    T1_BOSCH -->|dodává senzory| T2_ELECTR

    style ROOT fill:#F5DEB3,stroke:#8B4513,stroke-width:4px,font-size:14px,color:#000
    style T1_LEAR fill:#B8D4E8,stroke:#2C5F8D,stroke-width:3px,color:#000
    style T1_CONT fill:#B8D4E8,stroke:#2C5F8D,stroke-width:3px,color:#000
    style T1_BOSCH fill:#B8D4E8,stroke:#2C5F8D,stroke-width:3px,color:#000
    style T2_TEXT fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    style T2_FOAM fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    style T2_RUBB fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    style T2_STEEL fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    style T2_ELECTR fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
```

**Klíčové Vlastnosti:**
- **Root**: `3V0` (product_class) = Škoda Superb
- **Tier 1 (3 suppliers)**: Lear, Continental, Bosch - dodávají **přímo** do 3V0 BOM
- **Tier 2 (5 suppliers)**: Dodávají Tier 1 suppliers (nepřímí dodavatelé pro 3V0)
- **15,000 total suppliers** v plném TierIndex (toto je zjednodušený vzorek)

---

## 3. Update Pattern - Baseline vs Changeset

**Dva režimy aktualizace TierIndex:**

### A) Baseline Rebuild (Weekly)
- Kompletní přepočítání celého grafu (15k suppliers)
- Trvá: **4-6 hodin** (DAP cluster)
- Výstup: Nový snapshot `TierIndex.baseline_v{N}` (Delta table)

### B) Changeset Update (Daily - nice-to-have, Q1 2026)
- Pouze delta změny (100-500 suppliers changed)
- Trvá: **<30 minut**
- Výstup: `changeset_YYYYMMDD_HHMM.json` + incremental Delta

```mermaid
graph LR
    BASE["Baseline<br/>v1<br/>(Neděle)"]
    CS1["Changeset<br/>Mon"]
    CS2["Changeset<br/>Tue"]
    CS3["Changeset<br/>Wed"]
    CS4["Changeset<br/>Thu"]
    CS5["Changeset<br/>Fri"]
    BASE_NEW["Baseline<br/>v2<br/>(Neděle)"]

    BASE -->|apply| CS1
    CS1 -->|apply| CS2
    CS2 -->|apply| CS3
    CS3 -->|apply| CS4
    CS4 -->|apply| CS5
    CS5 --> BASE_NEW

    style BASE fill:#F5DEB3,stroke:#8B4513,stroke-width:3px,color:#000
    style BASE_NEW fill:#F5DEB3,stroke:#8B4513,stroke-width:3px,color:#000
    style CS1 fill:#E8E8E8,stroke:#5A5A5A,stroke-width:2px,color:#000
    style CS2 fill:#E8E8E8,stroke:#5A5A5A,stroke-width:2px,color:#000
    style CS3 fill:#E8E8E8,stroke:#5A5A5A,stroke-width:2px,color:#000
    style CS4 fill:#E8E8E8,stroke:#5A5A5A,stroke-width:2px,color:#000
    style CS5 fill:#E8E8E8,stroke:#5A5A5A,stroke-width:2px,color:#000
```

**Současný Stav (MVP Q4 2025):**
- ✅ **Weekly baseline** - implementováno
- ⏸️ **Daily changesets** - nice-to-have, Q1 2026 (závisí na DAP capacity)

---

## 4. Data Sources Integration

**Odkud TierIndex získává data:**

```mermaid
graph TB
    subgraph External_APIs[External APIs]
        SAYARI[Sayari API<br/>Ownership + Risk]
        DNB[D&amp;B API<br/>Financial + Credit]
    end

    subgraph Internal_Systems[Internal Škoda Systems]
        SAP[SAP Master Data<br/>Supplier registry + Quality + Logistics]
    end

    subgraph TierIndex_Pipeline[TierIndex Pipeline]
        BRONZE[Bronze Layer<br/>Raw ingestion]
        SILVER[Silver Layer<br/>Cleansed + validated]
        GOLD[Gold Layer<br/>TierIndex computed]
    end

    SAYARI --> BRONZE
    DNB --> BRONZE
    SAP --> BRONZE

    BRONZE --> SILVER
    SILVER --> GOLD

    style SAYARI fill:#FFD4D4,stroke:#B71C1C,color:#000
    style DNB fill:#FFD4D4,stroke:#B71C1C,color:#000
    style SAP fill:#B8D4E8,stroke:#2C5F8D,color:#000
    style BRONZE fill:#D7B89C,stroke:#6B4423,color:#000
    style SILVER fill:#D3D3D3,stroke:#5A5A5A,color:#000
    style GOLD fill:#F5E6B3,stroke:#B8860B,color:#000
```

**Data Flow:**
1. **External APIs** (Sayari, D&B) → Ownership, Risk, Financial data
2. **Internal Systems** (SAP) → Master data, Supplier registry, Quality, Logistics
3. **Bronze** → Raw data ingestion
4. **Silver** → Cleansed (validace, deduplikace, normalizace)
5. **Gold** → **TierIndex computed** (Entity, Edges, Tiers)

---

## 5. Gold Layer Options (Workshop Decision)

**🔴 KRITICKÉ ROZHODNUTÍ PRO WORKSHOP:**

### Option A: Centralized Gold (One table)

```mermaid
graph TD
    SILVER[Silver Layer<br/>TierIndex entities + edges]
    GOLD_SINGLE[Gold Layer<br/>Unified TierIndex table]

    LOGISTIKA[Logistics Queries]
    KVALITA[Quality Queries]
    FINANCE[Finance Queries]

    SILVER --> GOLD_SINGLE
    GOLD_SINGLE --> LOGISTIKA
    GOLD_SINGLE --> KVALITA
    GOLD_SINGLE --> FINANCE

    style SILVER fill:#D3D3D3,stroke:#5A5A5A,color:#000
    style GOLD_SINGLE fill:#F5E6B3,stroke:#B8860B,stroke-width:3px,color:#000
```

**Pro:**
- ✅ Jednodušší správa (jedna tabulka)
- ✅ Konzistentní data napříč odděleními
- ✅ Menší infrastruktura

**Proti:**
- ❌ Performance risk při 50+ concurrent users
- ❌ Vzájemné ovlivňování dotazů (contention)
- ❌ Těžší škálování

---

### Option B: Parallel Gold Layers (Per Department)

```mermaid
graph TD
    SILVER[Silver Layer<br/>TierIndex entities + edges]

    GOLD_LOG[Gold - Logistics<br/>Dedicated cluster]
    GOLD_KVAL[Gold - Quality<br/>Dedicated cluster]
    GOLD_FIN[Gold - Finance<br/>Dedicated cluster]

    LOGISTIKA[Logistics Queries<br/>~50 users]
    KVALITA[Quality Queries<br/>~30 users]
    FINANCE[Finance Queries<br/>~20 users]

    SILVER --> GOLD_LOG
    SILVER --> GOLD_KVAL
    SILVER --> GOLD_FIN

    GOLD_LOG --> LOGISTIKA
    GOLD_KVAL --> KVALITA
    GOLD_FIN --> FINANCE

    style SILVER fill:#D3D3D3,stroke:#5A5A5A,color:#000
    style GOLD_LOG fill:#F5E6B3,stroke:#B8860B,stroke-width:2px,color:#000
    style GOLD_KVAL fill:#F5E6B3,stroke:#B8860B,stroke-width:2px,color:#000
    style GOLD_FIN fill:#F5E6B3,stroke:#B8860B,stroke-width:2px,color:#000
```

**Pro:**
- ✅ Izolace výkonu (dedicated resources)
- ✅ Oddělení mohou přidat vlastní data a upravovat svůj Gold layer
- ✅ Škálovatelnost (přidat další Gold layer = snadné)

**Proti:**
- ❌ Vyšší správa (3 tabulky místo 1)
- ❌ Duplicita dat (3x storage)
- ❌ Synchronizační riziko (consistency)

---

**N-Tier Doporučení:** ✅ **Option B (Parallel Gold Layers)** (nice-to-have)

**Důvod:**
- Umožňuje oddělením přidávat vlastní data a dělat co uznají za vhodné
- Izolace výkonu (dedicated resources)
- Trade-off: Vyšší správa **vs** flexibilita a výkon
- Architekti rozhodnou na workshopu

---

## 6. Related Documentation

**Pro workshop přípravu:**
- `scrum/architecture/bom/bom_structure.md` - BOM kontext, product_class definice
- `scrum/architecture/communication/deep_workshop_architects/workshop_architect_focus.md` - Hlavní workshop brief (350 řádků)
- `scrum/architecture/communication/deep_workshop_architects/tierindex_update_workflow.md` - Update scénáře (weekly/monthly)
- `scrum/architecture/physical_model.md` - Silver/Gold/API technická architektura

**Use cases:**
- `prezentace6.10/N_TIER_REQUIRED_USE_CASES.md` - Business case analýza
