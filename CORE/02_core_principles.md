# CORE Principles – Why TierIndex Architecture Works This Way

**Type:** CORE (Immutable Foundation)
**Version:** 1.0
**Last Updated:** 2025-10-22
**Audience:** 📊 Architects, 👨‍💼 Business Stakeholders
**Purpose:** Explain fundamental "WHY" decisions behind TierIndex architecture

---

## 1. Why Medallion Architecture (Bronze → Silver → Gold)?

### The Principle

**Medallion = Progressive Refinement Pattern**

Surová data (Bronze) → Normalizovaná data (Silver) → Business-ready data (Gold)

### Why NOT Single-Layer Storage?

❌ **Anti-pattern:** Jeden datový layer:
- Mix raw + transformed data = složitá governance
- Nelze auditovat transformace (chybějící lineage)
- Recompute vyžaduje opětovný fetch z external APIs

✅ **Medallion pattern:**
- **Bronze:** Preserve raw (audit trail, možnost replay)
- **Silver:** Normalize (entity/edge model, canonical types)
- **Gold:** Optimize (pre-joined views, materialized metrics)

### TierIndex Application

**Bronze (Raw Preservation):**
- Surové JSON odpovědi z Sayari API
- Surové JSON odpovědi z D&B API
- Retention: 90 dní (audit trail)
- Účel: Replay capability, debugging, compliance

**Silver (Normalized Entities):**
- `ti_entity_s`: Normalizované entity (DUNS, Sayari ID → canonical entity_id)
- `ti_edge_s`: Normalizované edges (canonical edge types)
- `ti_tier_assignment_s`: Tier classification rules
- Účel: Single source of truth, validovaná data

**Gold (Business-Ready):**
- `ti_manifest`: Publikovaný baseline + changesets
- `vw_entity_graph`: Pre-joined view pro <100ms API latency
- `ti_metrics`: Calculated metrics (optional, outside CORE scope)
- Účel: Optimized for consumption, SLA compliance

### Key Insight

**Separation of Concerns:**
- Bronze = "What did external API say?" (immutable truth)
- Silver = "What does it mean in our model?" (normalized, validated)
- Gold = "How do we serve it efficiently?" (optimized, indexed)

---

## 2. Why Pre-Computing (NOT Real-Time)?

### The Principle

**Pre-compute heavy work, serve light results**

### Why NOT Real-Time Graph Traversal?

❌ **Anti-pattern:** Compute on-demand:
- Recursive graph traversal = exponentially expensive
  * Tier 1: 50 entities
  * Tier 2: 500 entities (50 × 10 avg suppliers)
  * Tier 3: 5,000 entities (500 × 10 avg suppliers)
- Single query = 5,550 entity lookups + relationship traversals
- Latency: 5-10 seconds (unacceptable for SLA <200ms)

✅ **Pre-computing pattern:**
- Compute weekly: 4-6 hours (full baseline recalculation)
- Serve instantly: <100ms (read from pre-computed graph)
- Update incrementally: 5-15 minutes (apply changeset)

### TierIndex Application

**Weekly Baseline Recompute:**
- Input: All Sayari/D&B entities + relationships
- Process: Graph traversal, tier classification, validation
- Output: Baseline snapshot (`TierIndex.baseline_v1`)
- Trigger: Schedule (Sunday 02:00) OR manual (data quality issue)

**Daily Changeset Application:**
- Input: New/changed relationships from Sayari/D&B
- Process: Incremental edge add/remove/update
- Output: Changeset (`cs_YYYYMMDD_HHMM`)
- Trigger: Schedule (daily 03:00) OR event-driven (critical supplier change)

**Runtime API:**
- Input: Business question ("Show Tier 2 suppliers in China")
- Process: Read from Gold view (no computation)
- Output: Filtered results from pre-computed graph
- Latency: <100ms (SLA target)

### Key Insight

**Performance vs. Freshness Trade-off:**
- Accept 24-hour data freshness
- Guarantee <100ms API latency
- Enable predictable SLA (no query complexity variability)

---

## 3. Why Unity Catalog (NOT File-Based Governance)?

### The Principle

**Centralized governance > Decentralized file permissions**

### Why NOT File-Level Access Control?

❌ **Anti-pattern:** Blob storage + ACLs:
- Permissions per-file = administrative nightmare (1000+ files)
- No lineage tracking (odkud data pochází?)
- No schema enforcement (každý může zapsat invalid JSON)
- Audit trail = parsing Azure Blob logs (komplexní, incomplete)

✅ **Unity Catalog pattern:**
- **Catalog-level RBAC:** Role `ntier_reader` → access all Gold tables
- **Automatic lineage:** Bronze → Silver → Gold tracked automatically
- **Schema enforcement:** Delta Lake constraints + Unity Catalog validation
- **Metadata governance:** Owner, SLA, refresh schedule in catalog

### TierIndex Application

**Catalog Structure:**
```
catalog: skoda_tierindex_prod
├── schema: bronze (raw API responses)
│   ├── table: dnb_raw
│   └── table: sayari_raw
├── schema: silver (normalized entities)
│   ├── table: ti_entity_s
│   ├── table: ti_edge_s
│   └── table: ti_tier_assignment_s
└── schema: gold (business-ready)
    ├── table: ti_manifest
    └── view: vw_entity_graph
```

**RBAC Model:**
- `ntier_admin`: Read/write Silver + Gold, publish manifests
- `ntier_reader`: Read-only Gold views
- `ntier_etl`: Write Bronze, read Bronze/Silver

**Lineage Example:**
```
bronze.sayari_raw (2025-09-15 02:00)
  → silver.ti_entity_s (2025-09-15 03:00, transform: normalize_sayari_entity)
    → gold.vw_entity_graph (2025-09-15 04:00, transform: join_edges_tiers)
```

### Key Insight

**Governance as First-Class Concern:**
- Unity Catalog = metadata + permissions + lineage in one place
- Audit trail automatic (kdo četl data, kdy, proč)
- Schema evolution traceable (změna field type = versioned)

---

## 4. Why Delta Lake (NOT Parquet/CSV)?

### The Principle

**ACID transactions + Time-travel > Immutable files**

### Why NOT Plain Parquet?

❌ **Anti-pattern:** Plain Parquet files:
- No ACID: Concurrent writes = corruption risk
- No versioning: Overwrite file = ztráta historie
- No schema evolution: Add column = rewrite all files
- No rollback: Bad data = need backup restore

✅ **Delta Lake pattern:**
- **ACID transactions:** Atomic writes (all-or-nothing)
- **Time-travel:** `SELECT * FROM table TIMESTAMP AS OF '2025-09-15'`
- **Schema evolution:** Add column without rewrite
- **Rollback:** `RESTORE TABLE TO VERSION AS OF 10`

### TierIndex Application

**Changeset Application with ACID:**
```sql
-- Atomicity: Either all edges added OR none
MERGE INTO silver.ti_edge_s AS target
USING changeset_edges AS source
ON target.edge_key = source.edge_key
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

-- If MERGE fails midway → automatic rollback (no partial state)
```

**Time-Travel for Debugging:**
```sql
-- What did TierIndex look like on 2025-09-15?
SELECT * FROM gold.vw_entity_graph
TIMESTAMP AS OF '2025-09-15T14:30:00Z'
WHERE tier_level = 1;
```

**Rollback on Bad Changeset:**
```sql
-- Changeset cs_20250916_1430 introduced bad data
RESTORE TABLE silver.ti_edge_s TO VERSION AS OF 42;
-- Version 42 = before bad changeset
```

**Schema Evolution Example:**
```sql
-- Add new field to entity schema (no rewrite needed)
ALTER TABLE silver.ti_entity_s
ADD COLUMN risk_score DECIMAL(5,2);

-- Existing rows: risk_score = NULL (backward compatible)
```

### Key Insight

**Reliability > Storage Cost:**
- Delta Lake overhead: ~10-15% (transaction logs, versioning metadata)
- Benefit: ACID guarantees, rollback capability, audit trail
- Trade-off: Pay slightly more for storage, gain operational safety

---

## 5. Why NOT Real-Time? (Revisited with Concrete Example)

### Concrete Business Scenario

**Question:** "Show me all Tier 2 suppliers in China with financial risk."

**Real-Time Approach (Anti-Pattern):**
1. Query Sayari API: "Find all China entities" (5-10 sec)
2. For each entity: Query D&B API for financial data (50+ entities × 2 sec = 100+ sec)
3. Traverse ownership relationships: "Who owns who?" (recursive, 20+ sec)
4. Calculate tier assignment: "Is this Tier 2?" (graph traversal, 30+ sec)
5. **Total latency: 150-180 seconds**

**Pre-Computed Approach (CORE Pattern):**
1. Read from Gold view `vw_entity_graph` (pre-filtered WHERE tier_level=2 AND country='CN')
2. Financial risk score already joined from daily D&B refresh
3. **Total latency: 50-100ms**

### When Real-Time WOULD Make Sense

✅ **Real-time justified:**
- Single entity lookup (no recursion)
- Freshness critical (stock prices, real-time monitoring)
- Unpredictable query patterns (can't pre-compute)

❌ **Real-time NOT justified (TierIndex case):**
- Recursive graph traversal (exponential complexity)
- Predictable queries (Tier 1/2/3 filters, country aggregations)
- 24-hour freshness acceptable (supply chain planning horizon = weeks)

---

## 6. Consistency Philosophy

### Strong Consistency (CORE Requirement)

**Principle:** All users see the same snapshot at the same time.

**Why important:**
- Business decision: "Approve Tier 1 supplier based on data from 2025-09-15"
- Audit requirement: "Reproduce answer from 2025-09-15 exactly"
- Compliance: "Prove supplier risk assessment was correct at decision time"

**How achieved:**
- Manifest = atomic snapshot (baseline + changesets)
- Version control = immutable (published manifest never changes)
- Rollback capability = restore previous manifest if needed

### Eventual Consistency (Acceptable Trade-off)

**Principle:** Source updates propagate within 24 hours.

**Why acceptable:**
- Supply chain planning horizon = weeks/months (not seconds)
- Financial risk changes gradually (not instant)
- Ownership changes rare (weeks/months between updates)

**How managed:**
- Daily changeset application (15-minute window)
- Weekly full baseline recompute (4-6 hour window)
- Critical changes = manual trigger (escalation for emergency supplier issue)

---

## Change Log

### Version 1.0 (2025-10-22)
- Initial CORE principles definition
- Extracted from: background_monitoring.md, dap_gap_analysis.md, physical_model.md
- Approved by: [Pending architect review]

---

## Related Documentation

**CORE:**
- `01_core_concepts.md` - Fundamental data structures
- `03_core_data_model.md` - Entity/Edge/Tier schemas
- `04_core_constraints.md` - Platform requirements

**IMPLEMENTATION:**
- `physical_model.md` - Delta Lake implementation details
- `SLA.md` - Performance targets and availability numbers
- `background_monitoring/` - Runtime monitoring

---

**📖 Read Time:** ~12 minutes
**✅ Self-Contained:** No external references required
**🔒 Change Control:** Architect approval + CHANGELOG entry required
