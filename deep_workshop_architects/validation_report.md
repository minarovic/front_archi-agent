# Workshop Brief - Validation Report

**Source Document:** workshop_pripravaArchitectAICC.md → workshop_architect_focus.md
**Validation Date:** 2025-10-22
**Validated by:** AI Agent (manual audit)
**Status:** ⚠️ **5 CRITICAL unverified claims found**

---

## Executive Summary

**Finding:** Workshop brief obsahuje několik klíčových čísel a předpokladů, které **nejsou ověřené** v source dokumentaci (`physical_model.md`, `SLA.md`, `AGENTS.md`).

**Risk:** Architekti mohou dělat rozhodnutí (Gold architektura, platformová kapacita) **based on neověřených číslech** → potenciál over-engineering nebo wrong capacity planning.

**Recommendation:** ⚠️ **Ověřit TOP 5 CRITICAL claims před workshopem** (deadline: 48h před)

---

## 🔴 CRITICAL: Unverified Claims (5)

### 1. Sayari API: "€120k/rok, unlimited queries"

**Claim locations:**
- workshop_architect_focus.md line 17: "Sayari API (€120k/rok, unlimited queries)"
- workshop_architect_focus.md line 22: "využít Sayari unlimited queries"
- workshop_logistics.md line 99: "€120k/rok, unlimited queries"

**Cross-check result:**
- ❌ **NOT found** in SLA.md
- ❌ **NOT found** in physical_model.md
- ❌ **NOT found** in AGENTS.md

**Source:** Likely from original comprehensive brief (workshop_pripravaArchitectAICC.md) but **no verification evidence**

**Questions to answer:**
1. Je cena €120k/rok ověřená v licence agreement?
2. Je "unlimited queries" skutečně unlimited, nebo existuje rate limit? (některé dokumenty zmiňují "1000 req/min")
3. Pokud NE unlimited → jak to ovlivňuje pre-computing strategii?

**Impact:** 🔴 **CRITICAL** - Celá "pre-computing" strategie závisí na "unlimited queries"

**Action:**
- [ ] Owner: **___** (procurement nebo Sayari account manager)
- [ ] Deadline: **2 dny před workshopem**
- [ ] Verification source: **Sayari licence agreement** (dokument)
- [ ] Fallback: Pokud je rate limited → re-design batch strategy

---

### 2. User counts: "Logistika ~50, Kvalita ~30"

**Claim locations:**
- workshop_architect_focus.md line 50: "Logistika ~50, Kvalita ~30, další oddělení"
- workshop_logistics.md line 32-33: "Logistika ~50 uživatelů (odkud?)"

**Cross-check result:**
- ❌ **NOT found** in physical_model.md
- ❌ **NOT found** in SLA.md
- ❌ **NOT found** in AGENTS.md

**Source:** Appears in comprehensive brief but **no source cited**

**Questions to answer:**
1. Odkud tato čísla? (meeting notes? stakeholder request? odhad?)
2. Je to **current state** nebo **projected future**?
3. Pokud projekce → na jaký timeline? (MVP launch? 6 months after? 2 years?)
4. Kdo může potvrdit accuracy?

**Impact:** 🔴 **CRITICAL** - **Rozhodnutí Gold architektury** (Varianta A vs B) **závisí na tomto čísle**
- 50+30 = 80 users → Varianta B (více Goldů) má smysl
- Real number = 15-20 users → Varianta A (jeden Gold) může stačit

**Action:**
- [ ] Owner: **___** (assign to Logistika lead + Kvalita lead)
- [ ] Deadline: **2 dny před workshopem**
- [ ] Verification source: **Direct confirmation** z vedoucích oddělení
- [ ] Fallback: Pokud nelze potvrdit → prezentovat RANGE (15-50) místo konkrétního čísla

---

### 3. TierIndex rebuild time: "4-6h"

**Claim locations:**
- workshop_architect_focus.md line 92: "TierIndex full rebuild = 4-6h batch job"
- workshop_architect_focus.md line 95: "Weekly full rebuild (~5000 entities, 4-6h)"
- workshop_logistics.md line 34: "TierIndex rebuild 4-6h (odhad nebo measured?)"

**Cross-check result:**
- ✅ **FOUND** in data_refresh_schedule.md: "4-6 hours on DAP"
- ⚠️ **BUT** marked as estimate, **not measured**

**Source:** Appears to be **engineering estimate**, not benchmark

**Questions to answer:**
1. Je to measured (skutečný test na DAP) nebo engineer's guess?
2. Test scenario: 5000 entities je realistic pro MVP?
3. Pokud odhad → margin of error? (může být 2h nebo 10h?)

**Impact:** 🟡 **MEDIUM** - Ovlivňuje **platformová kapacita** rozhodnutí
- 4-6h = acceptable pro weekly batch
- 10-12h = možná potřeba autoscaling nebo jiný approach

**Action:**
- [ ] Owner: **___** (assign to N-Tier dev lead - Marek/Honza)
- [ ] Deadline: **Nice-to-have before workshop** (not blocker)
- [ ] Verification: **Run benchmark** na PoC datasetu nebo **explicitly mark as ESTIMATE** v brifu
- [ ] Fallback: Present as "ESTIMATE: 4-6h (to be validated in pre-prod)"

---

### 4. Platform capability: "Podporuje recursive CTEs"

**Claim locations:**
- workshop_architect_focus.md line 90: "Podporuje recursive CTEs? (SQL self-referential hierarchie)"
- workshop_pripravaArchitectAICC.md line 327: "Apache AGE, Neo4j, nebo SQL recursive CTEs?"

**Cross-check result:**
- ❌ **NOT verified** in physical_model.md (mentions concept, but no confirmation platform supports it)
- ❌ **NOT verified** in dap-integration docs

**Source:** **Assumed**, not tested with DAP team

**Questions to answer:**
1. DAP Databricks workspace podporuje recursive CTEs?
2. Byl test provedený? (simple recursive query na test workspace)
3. Pokud NE → jaké alternativy? (Apache AGE extension? NetworkX in Python?)

**Impact:** 🔴 **CRITICAL** - **Platformová kapacita rozhodnutí**
- Pokud ANO → TierIndex může být v SQL (jednodušší)
- Pokud NE → potřeba graph database extension nebo Python traversal (složitější, pomalejší)

**Action:**
- [ ] Owner: **___** (assign to DAP technical lead)
- [ ] Deadline: **2 dny před workshopem**
- [ ] Verification: **Test query** na DAP workspace nebo **contact DAP support**
- [ ] Fallback: Pokud nelze ověřit → present both options (recursive CTE IF supported, NetworkX IF NOT)

---

### 5. Entity count: "~5000 entities"

**Claim locations:**
- workshop_architect_focus.md line 95: "~5000 entities"

**Cross-check result:**
- ❌ **NOT found** in physical_model.md
- ❌ **NOT found** in SLA.md

**Source:** Engineering estimate for MVP scope?

**Questions to answer:**
1. Odkud 5000? (Tier 1 count × average Tier 2/3 per supplier?)
2. Je to only Tier 1+2, nebo včetně Tier 3?
3. MVP scope nebo full production?

**Impact:** 🟡 **MEDIUM** - Ovlivňuje storage/compute estimates
- 5000 entities = small dataset, fast processing
- 50,000 entities = different story

**Action:**
- [ ] Owner: **___** (assign to N-Tier team)
- [ ] Deadline: **Nice-to-have**
- [ ] Verification: **Calculate** from SAP Tier 1 count × Sayari relationship average
- [ ] Fallback: Present as "ESTIMATE: ~5000 (MVP scope, excludes full Tier 3 expansion)"

---

## ✅ VERIFIED Claims (3)

### 1. SLA targets
- ✅ "Freshness baseline: Weekly" - **verified** in SLA.md
- ✅ "Latence dotazu: < 200ms p95" - **verified** in SLA.md
- ✅ "API dostupnost: 99.5%" - **verified** in SLA.md

**Source:** scrum/architecture/SLA.md (last updated 2025-10-04)

### 2. Bronze-Silver-Gold architecture
- ✅ "Medallion architecture pattern" - **verified** in physical_model.md
- ✅ "Unity Catalog governance" - **verified** in tierindex_slovnik_pojmu.md
- ✅ "Delta Lake format" - **verified** in physical_model.md

**Source:** scrum/architecture/physical_model.md (last updated 2025-10-04)

### 3. Project phase
- ✅ "Q4 2025: MVP (GitHub + Docker Hub OK)" - **verified** in AGENTS.md
- ✅ "Q1 2026: Pre-production (Azure DevOps + JFrog)" - **verified** in AGENTS.md
- ✅ "Q2 2026: Production (Red Hat UBI, SA DMZ)" - **verified** in AGENTS.md

**Source:** AGENTS.md (last updated 2025-10-22)

---

## 🟡 MEDIUM: Assumptions Flagged But Acceptable

### 1. "VW CAP benchmark" - REMOVED
- ✅ **Correctly removed** from architect_focus.md (was in comprehensive brief as "pokud možné")
- No action needed - this was correctly identified as noise

### 2. Use cases (Financial instability, Impact analysis, Compliance)
- 🟡 **Conceptually valid** but not yet tested in PoC
- Not blocker for workshop (architectural discussion, not implementation validation)

---

## Recommended Actions

### IMMEDIATE (Before Workshop - 48h)

**TOP PRIORITY (BLOCKERS):**
1. ✅ **Verify Sayari licence terms** (unlimited?)
   - Owner: ___
   - Source: License agreement document
   - If NOT unlimited → impacts pre-computing strategy

2. ✅ **Verify user counts** (Logistika/Kvalita)
   - Owner: ___
   - Source: Direct confirmation from department leads
   - If significantly different → impacts Gold architecture decision

3. ✅ **Test recursive CTE support** on DAP
   - Owner: ___
   - Source: Simple test query on DAP Databricks
   - If NOT supported → impacts platform capacity decision

**NICE-TO-HAVE:**
4. 🟡 **Benchmark TierIndex rebuild** or mark as ESTIMATE
   - Owner: ___
   - Fallback: Explicitly label "4-6h" as estimate in workshop brief

5. 🟡 **Calculate entity count** from real data
   - Owner: ___
   - Fallback: Present as "~5000 (MVP scope estimate)"

---

### SHORT-TERM (After Workshop)

6. **Add metadata to ALL architecture docs:**
   ```markdown
   ---
   status: VERIFIED | DRAFT | ESTIMATE
   verified_by: Jan Novak (DAP lead)
   verification_date: 2025-10-15
   verification_source: DAP platform docs v2.3
   ---
   ```

7. **Create Skills** for automated consistency checking:
   - `architecture-doc-consistency-checker` (checks cross-doc conflicts)
   - `workshop-brief-validator` (flags unverified claims)

---

## Updated Workshop Brief Recommendations

### Add Explicit Disclaimers

In `workshop_architect_focus.md`, mark unverified claims:

```markdown
**Gold Architektura:**
- Očekáván velký počet uživatelů (Logistika ~50, Kvalita ~30)
  ⚠️ [ESTIMATE - to verify with department leads]

**Platformová Kapacita:**
- TierIndex full rebuild = 4-6h batch job
  ⚠️ [ESTIMATE - not benchmarked on DAP]
```

### Create "Assumptions to Verify" Section

Add at the beginning of architect_focus.md:

```markdown
## ⚠️ Assumptions Requiring Verification

Before final architectural decisions, please verify:
1. Sayari API capacity (unlimited queries confirmed?)
2. User counts per department (Logistika/Kvalita leads)
3. Recursive CTE support on DAP platform
4. TierIndex rebuild timing (benchmark or estimate?)

These assumptions impact critical decisions (Gold architecture, platform capacity).
```

---

## Document Trust Summary

| Document                    | Status       | Last Verified | Critical Unverified Claims |
| --------------------------- | ------------ | ------------- | -------------------------- |
| workshop_architect_focus.md | 🔴 UNVERIFIED | 2025-10-22    | 5 items                    |
| physical_model.md           | ✅ VERIFIED   | 2025-10-04    | 0 items                    |
| SLA.md                      | ✅ VERIFIED   | 2025-10-04    | 0 items                    |
| AGENTS.md                   | ✅ VERIFIED   | 2025-10-22    | 0 items                    |

---

## Validation Checklist for Workshop Organizer

### Pre-Workshop (48h before)
- [ ] **BLOCKER #1:** Sayari licence verified (unlimited?)
- [ ] **BLOCKER #2:** User counts confirmed (Logistika/Kvalita)
- [ ] **BLOCKER #3:** Recursive CTE tested on DAP
- [ ] **Nice-to-have #4:** TierIndex rebuild benchmarked or marked ESTIMATE
- [ ] **Nice-to-have #5:** Entity count calculated from real data

### Workshop Day
- [ ] Present assumptions that were **verified** as facts
- [ ] Present assumptions that were **NOT verified** with explicit "ESTIMATE" disclaimers
- [ ] Note any blockers that couldn't be resolved → add to "Open Items" for follow-up

### Post-Workshop
- [ ] Document which assumptions were **accepted by architects** despite being estimates
- [ ] Create follow-up tasks to verify remaining estimates
- [ ] Update workshop_architect_focus.md with final verified numbers

---

**Metadata:**
- **Created:** 2025-10-22
- **Purpose:** Prevent "SLA incident" repeat - ensure workshop decisions based on verified data
- **Method:** Manual cross-check of claims against source docs (physical_model.md, SLA.md, AGENTS.md)
- **Next validation:** After resolving TOP 3 blockers, re-run this audit
