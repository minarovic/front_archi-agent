# Szilard Email Responses - Summary & Action Items

**Metadata:**
- Date: October 7, 2025
- Context: Technical questions about Bulk Data, Notifications API, and Project Entities
- Participants: Marek Minarovic (Škoda Auto), Szilard (Sayari)
- Related docs: `szilard_mail.md`, `szilard_mail_improved.md`

---

## 📋 Executive Summary

Szilard provided comprehensive answers confirming our TierIndex architecture approach:
- ✅ **Bulk Data + Notifications API** is the recommended pattern
- ✅ **Project Entities** are the right abstraction for monitoring suppliers
- ✅ **Monthly full refresh** + **daily/weekly risk monitoring** is optimal
- ⚠️ **Rate limits** need follow-up clarification
- ⚠️ **Notifications API deprecation** clarified as "being enhanced but remains fully functional"

---

## 🎯 Key Technical Answers

### 1. Bulk Data Strategy (Option A Confirmed)

**Question:** Initial population via Bulk Data + subsequent changes via Notifications API?

**Szilard's Answer:**
> "We do not currently provide delta exports to our bulk data files. This was and is still being considered, but the complexity of calculating the changes and updating the graph (the relationship network) would be very high, both for us and for our customers.
>
> Therefore, I recommend Option A: prepopulate a database from bulk data and then use the API (via notifications) to keep it up-to-date."

**Implications:**
- ✅ Our TierIndex baseline architecture is correct (monthly full refresh from Bulk Data)
- ✅ Delta updates via Notifications API for risk monitoring
- ❌ No incremental Bulk Data exports available (must do full refresh)

**Action Items:**
- [ ] Design DAP pipeline for 3.22 TiB monthly ingestion (Bronze→Silver→Gold)
- [ ] Plan Bronze layer partitioning strategy (entity vs relationship files)
- [ ] Estimate Databricks cluster costs for monthly refresh

---

### 2. Bulk Data Update Frequency

**Question:** How often is Bulk Data updated? Can we get delta between snapshots?

**Szilard's Answer:**
> "Updated bulk data files are released on a monthly basis."
>
> "As I mentioned above, this (delta exports) is currently not provided."
>
> "My understanding is that we inform our clients when a new bulk data snapshot is available (i.e., no polling is needed), but I will double-check this."

**Current Bulk Data Stats (2025-09-24, "goya3"):**
- Total size: **3.22 TiB**
- Entities: **3.75B in 1,710 files** (1.52 TiB)
- Relationships: **5.47B in 4,500 files** (1.70 TiB)
- Format: **Parquet**

**Delivery:**
- Signed URLs or SFTP service (pull, not push)
- Client notification when new snapshot ready (no need to poll for availability)

**Implications:**
- ✅ Monthly cadence aligns with our baseline refresh plan
- ⚠️ 3.22 TiB requires significant DAP storage and compute resources
- ⚠️ Need to design selective ingestion (only relevant subset? Or full graph for upstream analysis?)

**Action Items:**
- [ ] Coordinate with DAP team for SFTP/signed URL access setup
- [ ] Estimate Unity Catalog storage costs (3.22 TiB + versions)
- [ ] Design Parquet→Delta Lake ingestion pipeline (schema evolution, deduplication)
- [ ] Confirm notification mechanism (email? API webhook? Portal?)

---

### 3. Notifications API & Project Entities

**Question:** Is Legacy Notifications API designed for 15,000+ entities? Rate limits?

**Szilard's Answer:**
> "You mentioned that the intention is to monitor approximately 10,000 suppliers. These could be added to a project. Using the notification endpoints, you could track the changes in the risks associated with each of the project members.
>
> Please note: monitoring only tracks changes in the risk status (what has been added, what has been removed); but not changes in attributes, such as name(s), address(es), etc. Therefore I think the best approach would be to completely refresh the database every time when a new bulk data release is available, to ensure that you have the latest set of attributes."

**Current API Status (from documentation):**
- Endpoint: `GET /v1/notifications/projects/:id`
- Status: **"Being enhanced but remains fully functional for production use"**
- Recommended polling: **24-hour cadence**
- Deprecation (May 2025) sunset date (June 2025) extended - **endpoint still active**

**Implications:**
- ✅ 15,000 suppliers can be added to a single project
- ✅ Notifications API filters by `project_id` (path parameter)
- ⚠️ **Tracks only risk_status changes** (not name/address/ownership updates)
- ⚠️ Rate limits NOT specified by Szilard → **need follow-up**

**Action Items:**
- [ ] **Follow-up email:** Ask specific rate limits for `/v1/notifications/projects/:id` with 15k suppliers
- [ ] Confirm new enhanced Notifications API status (when available? migration path?)
- [ ] Design hybrid refresh: Monthly (attributes) + Daily/Weekly (risk factors)
- [ ] Update `scrum/architecture/physical_model.md` with attribute vs risk update separation

---

### 4. Project Entities Recommendation

**Szilard's Answer:**
> "I also suggest considering using project entities. A project entity serves as an 'envelope' for one-to-many possible matches returned from Sayari's Knowledge Graph via the match resolution process. Its primary purpose is to provide clients with a single, unified representation for a given real-world entity."

**Documentation Link Provided:**
- https://documentation.sayari.com/api/guides/understanding-project-entity

**Key Project Entity Features:**
- **Three-tier hierarchy:** Project → Project Entity → Matches
- **Stable `project_entity_id`:** Remains static for same input parameters
- **Risk consolidation:** Risk factors rolled up from individual matches
- **Supply chain data:** `upstream` object with countries, risk_factors, products (HS codes)

**Implications:**
- ✅ Use `project_entity_id` as stable key in TierIndex (not `entity_id`)
- ✅ Consolidated risk profile simplifies Gold layer calculations
- ✅ Supply chain roll-up reduces complexity in N-Tier traversal

**Action Items:**
- [ ] Update TierIndex schema: Add `project_entity_id` column to `ti_entity` table
- [ ] Create `ti_entity_matches` table for many-to-many relationship
- [ ] Update Supervisor Architecture Input Agent: Use `project_entity_id` for lookups
- [ ] Document Project Entity workflow in `scrum/architecture/dap-integration/`

---

### 5. Entity Resolution Calibration

**Question:** How should calibration work for our supplier portfolio?

**Szilard's Answer:**
> "The quality of responses from entity resolution (i.e., finding the (right) entities) depends on two things:
> 1. The amount and quality of input parameters. The more detail you have, the better, and – of course – the cleaner data you have, the better.
> 2. The tuning parameters of the resolution. There are a number of ways to tune the resolution. One of the most important ones is the search profile. The different profiles implement different search algorithms focusing on different aspects of the details. E.g., there is one for suppliers, and it is tailored for matching entities with trade data."
>
> "The calibration is a one-time activity, and we can schedule it at your convenience (considering our availability)."

**Data Preparation Needed:**
- Metadata and sample data of search terms
- Sample data: number of entities/suppliers with available details
- Use sample data for resolution with various profiles and tuned parameters
- Compare findings with our details

**Implications:**
- ✅ "Suppliers" search profile exists (tailored for trade data matching)
- ✅ One-time calibration activity (not recurring)
- ⚠️ Requires clean, high-quality SAP supplier data

**Action Items:**
- [ ] Prepare metadata: SAP fields (vendor_number, name, address, country, DUNS)
- [ ] Sample data: 50-100 high-quality suppliers + 50-100 messy suppliers
- [ ] Schedule calibration session with Szilard (after MVP scope finalized)
- [ ] Coordinate with Alice (Sayari) for onboarding process

---

### 6. Onboarding Process

**Szilard's Answer:**
> "This is perhaps best answered by Alice. As I mentioned above, an exercise of reviewing the source data you have (for search terms) and identifying potential ways of cleansing/transforming it would be necessary."

**Implications:**
- Alice (Sayari) should be involved in data cleansing/transformation review
- Onboarding process includes data quality assessment

**Action Items:**
- [ ] Contact Alice for Bulk Data onboarding process
- [ ] Prepare data quality assessment (SAP supplier data completeness)
- [ ] Plan data cleansing strategy (address standardization, name normalization)

---

## 🔴 Critical Architectural Decisions

### Decision 1: Hybrid Refresh Strategy (CONFIRMED)

**Monthly (Bulk Data):**
- Source: Full 3.22 TiB snapshot
- Content: Entities + Relationships + Attributes (name, address, ownership)
- Process: Bronze → Silver → Gold pipeline (full rebuild)
- Latency: Batch processing (hours to 1 day acceptable)

**Daily/Weekly (Notifications API):**
- Source: `GET /v1/notifications/projects/:id`
- Content: Risk factor changes only (added/removed)
- Process: Incremental update of `ti_entity_risk` table
- Latency: <1 hour (near real-time monitoring)

**Real-time (Ad-hoc API):**
- Source: Direct Sayari API calls
- Content: Missing entities, deep-dive queries, disambiguation
- Process: Supervisor orchestration via API agents
- Latency: 200-500ms (acceptable for exploration)

---

### Decision 2: Project Entity as Stable Key (NEW)

**TierIndex Schema Update:**

```sql
-- Primary entity table (Silver layer)
ti_entity:
  - duns (primary key, SAP vendor number)
  - project_entity_id (Sayari stable key) ← NEW
  - entity_id (deprecated, for backward compatibility)
  - company_name
  - match_strength (strong/partial/no_match)
  - ...

-- Many-to-many matches (Silver layer)
ti_entity_matches (NEW TABLE):
  - project_entity_id (foreign key)
  - match_id (composite: project_entity_id:entity_id)
  - sayari_entity_id
  - match_profile (suppliers/corporate)
  - relationship_count (JSON)
  - created_at, updated_at
```

**Benefits:**
- Stable reference for monitoring (project_entity_id doesn't change)
- Consolidated risk profile (no duplicate risk factors)
- Simplified N-Tier traversal (supply chain roll-up)

---

### Decision 3: Bulk Data Ingestion Scope (TBD)

**Option A: Full Graph Ingestion (3.22 TiB)**
- Pros: Complete upstream analysis capability, no API calls for traversal
- Cons: High storage costs, complex monthly refresh

**Option B: Selective Ingestion (subset)**
- Pros: Lower costs, faster refresh
- Cons: Missing entities for upstream analysis, more API calls needed

**Recommendation:** Start with Option A for MVP, optimize later based on:
- DAP storage costs (Unity Catalog Delta Lake)
- Actual usage patterns (which tiers are queried most?)
- API rate limits vs batch ingestion trade-offs

**Action Items:**
- [ ] Coordinate with DAP team for cost estimates (3.22 TiB + monthly versions)
- [ ] Design Bronze layer partitioning (by country? by tier? by entity type?)
- [ ] Plan Silver layer optimization (relevant subset for Škoda suppliers?)

---

## 📧 Follow-up Email to Szilard (DRAFT)

**Subject:** Follow-up: Rate Limits & New Notifications API

**Body:**

Hi Szilard,

Thank you for the comprehensive answers! Your recommendations are very helpful for our TierIndex architecture.

A few follow-up questions:

### 1. Notifications API Rate Limits
For monitoring 15,000 suppliers via `GET /v1/notifications/projects/:id`:
- What are the rate limits for this endpoint?
- Is 24-hour polling still optimal for this volume?
- Are there pagination limits we should consider (max offset/limit)?

### 2. New Notifications API Status
We noticed the documentation mentions:
> "The notifications endpoint is being enhanced but remains fully functional for production use"

- Is the enhanced version already available? If yes, what's the endpoint?
- Should we plan migration from `/v1/notifications/projects/:id`?
- What are the improvements in the new version?

### 3. Bulk Data Access
For the 3.22 TiB monthly snapshots:
- How do we request SFTP/signed URL access?
- Is there a cost associated with Bulk Data service?
- Can we filter by country/region during download (to reduce volume)?

### 4. Project Entities Batch Upload
To initially populate 15,000 suppliers:
- Is there a batch upload endpoint? (or must we call `POST /v1/projects/:id/entities/create` 15k times?)
- What's the recommended batch size?
- Any rate limits for entity creation?

### 5. Predictive Monitoring Use Cases
You asked about the types of predictions we intend to produce. Here are our 4 core use cases:

**SCR-06: Sub-Supplier Mapping**
- Query: "Find all Tier-3 suppliers with Russian ownership AND financial risk >70%"
- Prediction: Proactive identification of risky sub-suppliers before they impact production

**SCR-02: Combined Risk Selection**
- Query: "Rank Tier-1 suppliers by combined risk (financial + sanctions + ESG + geopolitical)"
- Prediction: Prioritized supplier audit list based on multi-source intelligence

**SCR-07: Crisis Impact Analysis**
- Query: "Russia border closure → which Tier-1 affected → which projects impacted → alternatives?"
- Prediction: Real-time crisis cascade assessment with mitigation recommendations

**SCR-05: Hidden Risk Accumulation**
- Query: "Which suppliers are SPOF (geographic clustering, network centrality)?"
- Prediction: Portfolio-level risk detection (not visible in individual supplier profiles)

Would these use cases benefit from specific Sayari features or API endpoints?

Looking forward to your guidance.

Best regards,
Marek Minarovic

---

## 🗓️ Timeline & Next Steps

### This Week (Oct 7-11, 2025):
- [x] Analyze Szilard's responses
- [x] Update architectural documentation
- [ ] Send follow-up email (rate limits, new API, use cases)
- [ ] VW meeting (synchronization discussion)

### Early Next Week (Oct 14-18, 2025):
- [ ] Receive Szilard's follow-up answers
- [ ] Contact Alice for Bulk Data onboarding
- [ ] Prepare sample supplier data for calibration
- [ ] Update TierIndex schema with `project_entity_id`

### Q4 2025 (Oct-Dec):
- [ ] MVP implementation (Notifications API integration)
- [ ] Test Projects feature with 100-500 suppliers
- [ ] Calibration session with Szilard/Alice
- [ ] DAP team coordination for Bulk Data access

### Q1 2026 (Jan-Mar):
- [ ] Bulk Data integration (monthly refresh pipeline)
- [ ] Scale to 15,000 suppliers in Projects
- [ ] Supervisor Architecture migration (use `project_entity_id`)
- [ ] Pre-production deployment

---

## 📚 Related Documentation

**Architecture:**
- `scrum/architecture/physical_model.md` - TierIndex Silver/Gold/API layers
- `scrum/architecture/dap-integration/data-ingestion.md` - Bulk Data pipeline
- `scrum/architecture/supervisor_architecture/` - Orchestration with Project Entities

**Communication:**
- `scrum/architecture/communication/szilard_mail.md` - Original email thread
- `scrum/architecture/communication/szilard_mail_improved.md` - Improved version

**Use Cases:**
- `prezentace6.10/N_TIER_REQUIRED_USE_CASES.md` - 4 core N-Tier use cases (SCR-06, SCR-02, SCR-07, SCR-05)

**Implementation:**
- `src/memory_agent/sayari_sdk_wrapper.py` - Sayari SDK integration
- `src/integrations/dnb_client.py` - DnB client (for comparison)

---

**Last Updated:** October 7, 2025
**Owner:** Marek Minarovic
**Status:** ✅ Analysis Complete, ⏳ Follow-up Pending
**Priority:** 🔴 KRITICKÉ (Q4 2025 MVP dependency)
