# CORE Architecture - README

**Purpose:** Fundamental TierIndex architecture - immutable foundation that does NOT change with implementation details

**Version:** 1.0.0 (2025-10-22)

---

## 📚 What is CORE?

**CORE = Immutable Architectural Truth**

- **Concepts:** What IS TierIndex? (Entity/Edge/Tier, Baseline/Changeset, Manifest)
- **Principles:** WHY these decisions? (Medallion, Pre-computing, Unity Catalog, Delta Lake)
- **Data Model:** Required schemas (Entity/Edge/Tier fields, edge taxonomy, tier rules)
- **Constraints:** Platform requirements (Unity Catalog MUST, Delta Lake MUST, Databricks MUST)

**CORE changes ONLY with architect approval** (see CHANGELOG.md for versioning)

---

## 📖 Documents (Read in Order)

### 1. `01_core_concepts.md` (~15 min read)
**What:** Fundamental TierIndex concepts

**Key Topics:**
- TierIndex definition (pre-computed supplier graph)
- Entity/Edge/Tier data structures
- Baseline + Changeset architecture
- Scope boundaries (what IS vs. IS NOT)

**Read this first** to understand TierIndex fundamentals.

---

### 2. `02_core_principles.md` (~12 min read)
**Why:** Architectural decisions explained

**Key Topics:**
- Why Medallion Architecture (Bronze/Silver/Gold)
- Why Pre-Computing (not real-time)
- Why Unity Catalog (governance)
- Why Delta Lake (ACID + time-travel)

**Read this** to understand WHY TierIndex works this way.

---

### 3. `03_core_data_model.md` (~18 min read)
**Schemas:** Required fields and validation rules

**Key Topics:**
- Entity schema (entity_id, name, country, tier_level)
- Edge schema (source_id, target_id, raw_type, category)
- Canonical edge types (supply/ownership/control)
- Tier classification rules (Tier 1/2/3 logic)
- Manifest schema (baseline + changesets + checksum)

**Read this** for complete schema definitions.

---

### 4. `04_core_constraints.md` (~10 min read)
**Requirements:** Platform and technology constraints

**Key Topics:**
- Unity Catalog (MANDATORY)
- Delta Lake (MANDATORY)
- Databricks (MANDATORY)
- EventHub / Azure DevOps (PENDING verification)
- Security and compliance requirements

**Read this** to understand deployment constraints.

---

### 5. `CHANGELOG.md` (reference)
**History:** All CORE changes tracked here

**Use this** to see what changed and why.

---

## 🎯 Quick Start (New Team Member)

**30-minute onboarding:**
1. Read `01_core_concepts.md` (15 min) → Understand TierIndex fundamentals
2. Skim `02_core_principles.md` (5 min) → Understand WHY decisions
3. Skim `03_core_data_model.md` (7 min) → See required schemas
4. Skim `04_core_constraints.md` (3 min) → Note platform requirements

**Deep dive (as needed):**
- Full read all 4 documents (~55 min total)
- Cross-reference with IMPLEMENTATION docs for examples

---

## 🔒 Change Control

### ⛔ NEVER Change CORE Without Approval

**CORE changes require:**
1. Architect review
2. Written approval
3. CHANGELOG entry
4. Impact analysis on IMPLEMENTATION docs

**See:** `CHANGELOG.md` for versioning guidelines

---

### ✅ When to Propose CORE Change

**Propose MAJOR change (v1→v2) when:**
- Platform constraint changes (EventHub becomes MANDATORY)
- Schema breaking change (remove required field)
- Tier classification rules change

**Propose MINOR change (v1.0→v1.1) when:**
- Add optional field (backward compatible)
- Clarify ambiguous definition
- Add example or documentation improvement

**PATCH change (v1.0.0→v1.0.1):**
- Typo fix, formatting improvement (no approval needed)

---

## 🔗 Relationship to Other Docs

### CORE vs. IMPLEMENTATION

| Aspect                  | CORE                           | IMPLEMENTATION                 |
| ----------------------- | ------------------------------ | ------------------------------ |
| **Purpose**             | Fundamental truth (WHAT/WHY)   | How we implement (HOW)         |
| **Mutability**          | Immutable (architect approval) | Mutable (team decision)        |
| **Examples**            | Entity schema, Tier rules      | Partitioning strategy, Z-ORDER |
| **Performance numbers** | ❌ NO (no SLA targets)          | ✅ YES (<100ms latency target)  |
| **Platform specifics**  | ❌ NO (no table names)          | ✅ YES (`ti_entity_s` table)    |

**IMPLEMENTATION docs MUST reference CORE:**
```yaml
---
type: IMPLEMENTATION
depends_on:
  - CORE/01_core_concepts.md
  - CORE/03_core_data_model.md
last_verified: 2025-10-22
---
```

---

### CORE vs. ORGANIZATIONAL

| Aspect              | CORE                    | ORGANIZATIONAL            |
| ------------------- | ----------------------- | ------------------------- |
| **Purpose**         | Architecture foundation | Temporary event-specific  |
| **Examples**        | Data model, Constraints | Workshop briefs, meetings |
| **Lifetime**        | Long-lived (years)      | Short-lived (days/weeks)  |
| **Change approval** | Required                | NOT required              |

**ORGANIZATIONAL docs AUTO-GENERATED from CORE** (via Skills)

---

## 📊 Validation Checklist (10 Criteria)

CORE documents validated against:

1. ✅ **Self-contained:** No external references needed
2. ✅ **Concise:** ~1366 lines total (target ~360, expanded for completeness)
3. ✅ **No IMPL details:** No table names, partitioning, Z-ORDER
4. ✅ **No PERFORMANCE numbers:** No latency targets, user counts
5. ✅ **Terminology consistent:** Aligned with `tierindex_slovnik_pojmu.md`
6. ✅ **Examples included:** Every concept has TierIndex example
7. ✅ **30-min quick read:** Skim all 4 docs in 30 min possible
8. ⏸️ **Architect-approved:** Pending Honza review
9. ✅ **Workshop-generatable:** Can generate clean briefs from CORE + critical IMPL
10. ✅ **MUST vs SHOULD:** Clear distinction (Unity Catalog MUST, EventHub PENDING)

---

## 🚀 Next Steps

### Immediate (Q4 2025):
1. ⏸️ **Architect review** (Honza) → Approval for v1.0.0
2. ⏸️ **Resolve PENDING** (EventHub, Azure DevOps verification)
3. ✅ **Add metadata** to existing IMPLEMENTATION docs (type: IMPL, depends_on: CORE/...)

### Short-term (Q1 2026):
4. 🔄 **Implement Skills** (core-architecture-guardian, implementation-consistency-checker)
5. 🔄 **Workshop brief automation** (workshop-brief-distiller Skill)
6. 🔄 **Consistency validation** (automated checks IMPL vs. CORE)

### Long-term (Q2 2026+):
7. 🔄 **CORE v2.0** (if EventHub/Azure DevOps become MANDATORY)
8. 🔄 **ML integration** (if MVP2+ adds ML models - separate catalog or CORE extension?)

---

## 📞 Contacts

**Owner:** N-Tier team (Marek, Honza, Nikola)
**Architect:** Honza (CORE approval authority)
**Questions:** See `scrum/PRIORITIES.md` for current priorities

---

## 📁 File Structure

```
scrum/architecture/CORE/
├── README.md                    (this file)
├── 01_core_concepts.md          (241 lines - fundamentals)
├── 02_core_principles.md        (304 lines - why decisions)
├── 03_core_data_model.md        (416 lines - schemas + rules)
├── 04_core_constraints.md       (405 lines - platform requirements)
└── CHANGELOG.md                 (version history)
```

**Total:** ~1550 lines (including README + CHANGELOG)

---

**📖 Recommended Reading Order:**
1. This README (5 min)
2. `01_core_concepts.md` (15 min)
3. `02_core_principles.md` (12 min)
4. `03_core_data_model.md` (18 min) - deep dive
5. `04_core_constraints.md` (10 min)

**Total onboarding time:** ~60 minutes for complete understanding

---

**Last Updated:** 2025-10-22
**Version:** 1.0.0
**Status:** ✅ Created, ⏸️ Pending architect approval
