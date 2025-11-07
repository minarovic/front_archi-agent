# CORE Architecture Change Log

**Purpose:** Track all changes to CORE architecture documents
**Format:** Semantic versioning (MAJOR.MINOR.PATCH)
**Approval:** All changes require architect review + approval

---

## Version 1.0.0 (2025-10-22)

### Initial CORE Definition

**Status:** ✅ CREATED (Pending architect approval)

**Documents Created:**
1. `01_core_concepts.md` (241 lines)
   - TierIndex definition (pre-computed supplier graph)
   - Entity/Edge/Tier fundamental data structures
   - Baseline + Changeset + Manifest architecture
   - Scope boundaries (what IS vs. what IS NOT TierIndex)
   - Read-only runtime principle

2. `02_core_principles.md` (304 lines)
   - Why Medallion Architecture (Bronze/Silver/Gold)
   - Why Pre-Computing (not real-time)
   - Why Unity Catalog (centralized governance)
   - Why Delta Lake (ACID + time-travel)
   - Consistency philosophy (strong vs. eventual)

3. `03_core_data_model.md` (416 lines)
   - Entity schema (required fields: entity_id, entity_type, name, country, tier_level, source_system)
   - Edge schema (required fields: source_id, target_id, raw_type, category, direction)
   - Canonical edge types (supply/ownership/control taxonomy)
   - Tier classification rules (Tier 1/2/3 logic)
   - Manifest schema (baseline_version, applied_changesets, checksum)
   - Validation rules and constraints

4. `04_core_constraints.md` (405 lines)
   - DAP platform MUST requirements (Unity Catalog, Delta Lake, Databricks)
   - Pending verifications (EventHub, Azure DevOps - TBD)
   - Technology stack (MUST / MUST NOT / CAN)
   - Security constraints (Azure AD, Key Vault, TLS)
   - Compliance and audit trail requirements

**Total Lines:** ~1366 lines (target was ~360, expanded for completeness)

**Extracted From:**
- `tierindex_slovnik_pojmu.md` (terminology, concepts)
- `physical_model.md` (schemas, Bronze/Silver/Gold)
- `er_diagram.md` (logical relationships)
- `background_monitoring.md` (TierIndex purpose, Medallion)
- `background_monitoring_data_model.md` (edge taxonomy, tier rules)
- `dap_gap_analysis.md` (DAP constraints)
- `SLA.md` (principles, NOT numbers)

**Methodology:**
- Question-First pattern applied (scope, versioning, validation criteria)
- Filtered out: Implementation details, performance numbers, organizational noise
- Included: Fundamental concepts, architectural principles, required schemas, mandatory constraints

**Next Steps:**
1. Architect review (Honza)
2. Validation against 10-point checklist
3. Approval for v1.0.0 finalization
4. Add metadata to existing IMPLEMENTATION docs (type: IMPLEMENTATION, depends_on: CORE/...)

---

## Versioning Guidelines

### MAJOR Version (X.0.0)

**When to increment:**
- Breaking change to CORE schema (e.g., remove required field)
- New mandatory constraint (e.g., EventHub becomes MUST)
- Change to tier classification rules (affects tier assignments)
- New data structure added to CORE (e.g., new entity type)

**Example:**
```
v1.0.0 → v2.0.0: Added EventHub mandatory constraint
```

**Required:**
- Architect approval
- Migration guide for IMPLEMENTATION docs
- Impact analysis (which IMPL docs affected?)
- CHANGELOG entry with rationale

---

### MINOR Version (x.Y.0)

**When to increment:**
- Add optional field to schema (backward compatible)
- Clarification or example added
- Typo fix in field name (STRING → INT correction)
- Documentation improvement (no functional change)

**Example:**
```
v1.0.0 → v1.1.0: Added optional entity.duns_number field
```

**Required:**
- Architect notification (approval optional)
- CHANGELOG entry with rationale

---

### PATCH Version (x.y.Z)

**When to increment:**
- Typo fix in documentation
- Formatting improvement
- Link correction
- Comment clarification

**Example:**
```
v1.0.0 → v1.0.1: Fixed typo in 02_core_principles.md
```

**Required:**
- CHANGELOG entry (minimal)

---

## Change Template

### [Version X.Y.Z] (YYYY-MM-DD)

**Type:** MAJOR / MINOR / PATCH

**Changed Documents:**
- `XX_document_name.md` - [description of change]

**Rationale:**
[Why was this change needed?]

**Impact:**
[Which IMPLEMENTATION docs are affected?]

**Migration Guide:**
[If MAJOR version: How to migrate existing implementations?]

**Approved By:**
- Architect: [Name]
- Date: [YYYY-MM-DD]

---

## Approval Process

### For MAJOR Changes:

1. **Propose Change:**
   - Create draft CHANGELOG entry
   - Document rationale and impact
   - Prepare migration guide

2. **Impact Analysis:**
   - List affected IMPLEMENTATION docs
   - Estimate implementation effort
   - Identify risks

3. **Architect Review:**
   - Schedule review meeting
   - Present rationale and impact
   - Get written approval

4. **Implementation:**
   - Update CORE documents
   - Update CHANGELOG
   - Notify team

5. **Migration:**
   - Update IMPLEMENTATION docs
   - Run consistency checks (Skills)
   - Validate changes

### For MINOR Changes:

1. **Propose Change:**
   - Create draft CHANGELOG entry
   - Document rationale

2. **Quick Review:**
   - Email architect with proposal
   - Get approval (24-48h)

3. **Implementation:**
   - Update CORE documents
   - Update CHANGELOG
   - Notify team

### For PATCH Changes:

1. **Make Change:**
   - Update documentation
   - Update CHANGELOG

2. **Notification:**
   - Email team (no approval needed)

---

## Future Changes (Planned)

### Q1 2026 (v1.1.0 or v2.0.0)

**EventHub Monitoring:**
- Status: Pending verification
- If MANDATORY: v2.0.0 (breaking change to constraints)
- If OPTIONAL: v1.1.0 (add to SHOULD list)

**Azure DevOps:**
- Status: Pending exception request
- If MANDATORY: v2.0.0 (breaking change to deployment)
- If EXCEPTION granted: v1.1.0 (add note to constraints)

**ML Model Integration:**
- Status: Planned for MVP2+
- If added: v2.0.0 (new entity type or separate catalog)
- Rationale: Current CORE = datový produkt (non-ML)

---

## Archive

(No archived versions yet - v1.0.0 is initial release)

---

**Maintenance:** Update this CHANGELOG with every CORE change
**Owner:** N-Tier team + Architect
**Review Frequency:** Monthly (check for pending changes)
