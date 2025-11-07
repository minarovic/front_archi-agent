# CORE Constraints – Platform and Technology Requirements

**Type:** CORE (Immutable Foundation)
**Version:** 1.0
**Last Updated:** 2025-10-22
**Audience:** 📊 Architects, 🔧 Platform Engineers
**Purpose:** Define mandatory (MUST) vs. recommended (SHOULD) platform constraints

---

## 1. DAP Platform Constraints (MUST)

### Unity Catalog (MANDATORY)

**Status:** ✅ **MUST USE** - Non-negotiable DAP requirement

**Requirements:**
- ALL TierIndex tables MUST be registered in Unity Catalog
- Catalog structure: `skoda_tierindex_{env}` where env = dev/test/prod
- Schema separation: `bronze`, `silver`, `gold`
- Metadata MUST include: owner, SLA, refresh schedule, lineage

**Rationale:**
- Centralized governance requirement
- Automatic lineage tracking
- RBAC enforcement
- Audit trail for compliance

**Compliance:**
```sql
-- Example Unity Catalog registration
CREATE CATALOG IF NOT EXISTS skoda_tierindex_prod;
CREATE SCHEMA IF NOT EXISTS skoda_tierindex_prod.silver;

CREATE TABLE skoda_tierindex_prod.silver.ti_entity_s (
  entity_id STRING NOT NULL,
  entity_type STRING NOT NULL,
  name STRING NOT NULL,
  country STRING,
  tier_level INT,
  source_system STRING NOT NULL
)
USING DELTA
LOCATION 's3://bucket/tierindex/silver/entities/'
COMMENT 'TierIndex normalized entities - Silver layer'
TBLPROPERTIES (
  'owner' = 'ntier-team@skoda.vwg',
  'sla_refresh' = 'daily',
  'data_classification' = 'internal'
);
```

**Verification:**
- ✅ All tables visible in Unity Catalog UI
- ✅ Lineage graph shows Bronze → Silver → Gold
- ✅ Permissions enforced via RBAC roles

---

### Delta Lake (MANDATORY)

**Status:** ✅ **MUST USE** - Non-negotiable storage format

**Requirements:**
- ALL TierIndex data MUST use Delta Lake format (not plain Parquet)
- ACID transactions MUST be enabled
- Versioning (time-travel) MUST be retained (minimum 7 days)
- Checkpoint files MUST be generated automatically

**Rationale:**
- ACID guarantees (no partial writes)
- Time-travel for audit and rollback
- Schema evolution without data rewrite
- DAP standard storage format

**Anti-Patterns (MUST NOT):**
```python
# ❌ FORBIDDEN: Plain Parquet write
df.write.format("parquet").save("/path/to/data")

# ✅ REQUIRED: Delta Lake write
df.write.format("delta").save("/path/to/data")
```

**Compliance:**
```python
# Baseline write with Delta
(baseline_df
  .write
  .format("delta")
  .mode("overwrite")
  .option("overwriteSchema", "true")
  .saveAsTable("skoda_tierindex_prod.silver.ti_entity_s")
)

# Time-travel query (audit requirement)
spark.sql("""
  SELECT * FROM skoda_tierindex_prod.silver.ti_entity_s
  TIMESTAMP AS OF '2025-09-15T14:30:00Z'
""")
```

**Verification:**
- ✅ `_delta_log/` directory exists in table path
- ✅ `DESCRIBE HISTORY` command returns version history
- ✅ No `.parquet` files without Delta metadata

---

### Databricks Platform (MANDATORY)

**Status:** ✅ **MUST USE** - DAP standard compute platform

**Requirements:**
- ETL jobs MUST run on Databricks (not standalone VMs or AKS)
- Job clusters OR serverless compute (both acceptable)
- Notebooks OR Python wheel jobs (both acceptable)
- Unity Catalog integration MUST be enabled

**Rationale:**
- DAP centralized compute management
- Automatic lineage tracking
- Integration with Unity Catalog
- Monitoring and cost allocation

**Deployment:**
```yaml
# Databricks Job definition (YAML format)
name: TierIndex Baseline Ingest
job_type: notebook
notebook_path: /Workspace/ntier/notebooks/ti_ingest_sources
cluster:
  spark_version: "13.3.x-scala2.12"
  node_type_id: "Standard_DS3_v2"
  num_workers: 2
  spark_conf:
    "spark.databricks.delta.preview.enabled": "true"
schedule:
  quartz_cron_expression: "0 0 2 * * ?"  # Daily 02:00
  timezone_id: "Europe/Prague"
```

**Verification:**
- ✅ Jobs visible in Databricks UI → Workflows
- ✅ Job runs logged to Unity Catalog lineage
- ✅ No standalone Python scripts running outside Databricks

---

## 2. Pending Verification (TBD)

### EventHub / Elastic Monitoring

**Status:** ⚠️ **PENDING** - Awaiting DAP ops confirmation

**Question:** Is EventHub → Elastic monitoring MANDATORY for all DAP components?

**Current State:**
- Prometheus metrics export implemented
- Application Insights integration active
- NO EventHub integration yet

**Proposed Solution (if mandatory):**
- **Dual-shipping:** Prometheus (for debugging) + EventHub (for DAP compliance)
- Metrics format: JSON schema per DAP spec
- Managed Identity authentication

**Escalation Required:**
- Contact: Honza / DAP ops team
- Deadline: Before production deployment (Q1 2026)
- Blocking: YES (cannot deploy to production without compliance)

---

### Azure DevOps (TFS)

**Status:** ⚠️ **PENDING** - Exception request possible

**Question:** Is Azure DevOps MANDATORY or can we use GitHub Enterprise?

**Current State:**
- GitHub repository: `AI-agent-PoC3`
- GitHub Actions CI/CD
- Azure Container Registry (ACR) integration

**DAP Requirement:**
- Azure DevOps preferred for SA DMZ accounts
- Centralized audit logs
- TFS Git repositories

**Proposed Solution:**
- **Exception request:** GitHub Enterprise has equivalent security
- **Compromise:** GitHub for dev, Azure Pipelines for prod artifacts
- **Migration:** Full migration to Azure DevOps (6+ months work)

**Escalation Required:**
- Contact: DAP governance team
- Deadline: MVP phase OK with GitHub, prod requires decision
- Blocking: Partial (can deploy MVP, prod needs approval)

---

## 3. Technology Stack (MUST / MUST NOT / CAN)

### MUST USE

✅ **Mandatory technologies:**
- Delta Lake (storage format)
- Unity Catalog (governance)
- Databricks (compute platform)
- Python 3.11+ (ETL scripting)
- SQL (data transformations)

### MUST NOT USE

❌ **Forbidden technologies:**
- Plain Parquet (without Delta Lake)
- Azure Cosmos DB (for TierIndex storage)
- Standalone VMs (outside Databricks)
- Public PyPI packages (use JFrog mirror)
- Docker Hub public images (use JFrog registry)

### CAN USE (Implementation Choice)

✅ **Allowed but not required:**
- React/Angular (frontend framework)
- FastAPI (API server)
- Prometheus (metrics - if EventHub not mandatory)
- Azure Static Web Apps (frontend hosting)
- GitHub (version control - pending exception approval)

---

## 4. Data Classification and Access

### Data Sensitivity

**Classification:** `INTERNAL` (not PUBLIC, not CONFIDENTIAL)

**Rationale:**
- Supplier relationships are business-sensitive
- NOT personal data (GDPR not applicable)
- NOT public (competitive intelligence)

**Access Control:**
```sql
-- Unity Catalog RBAC
GRANT SELECT ON CATALOG skoda_tierindex_prod TO `ntier_reader`;
GRANT ALL PRIVILEGES ON CATALOG skoda_tierindex_prod TO `ntier_admin`;

-- Gold layer read-only for orchestrator
GRANT SELECT ON SCHEMA skoda_tierindex_prod.gold TO `orchestrator_service_account`;
```

### Retention Policy

**Requirement:** Audit trail MUST be retained for compliance

**Retention rules:**
- **Bronze (raw data):** 90 days
- **Silver (normalized):** 2 years
- **Gold (published):** 5 years
- **Manifests:** Indefinite (audit trail)

**Implementation:**
```sql
-- Delta Lake VACUUM with retention
VACUUM skoda_tierindex_prod.bronze.dnb_raw RETAIN 90 HOURS;
VACUUM skoda_tierindex_prod.silver.ti_entity_s RETAIN 17520 HOURS;  -- 2 years
-- Gold tables: No VACUUM (keep all history)
```

---

## 5. Security Constraints

### Authentication

**MUST USE:**
- Azure AD integration for human users
- Managed Identity for service accounts
- Service Principal with Key Vault secrets (fallback)

**MUST NOT:**
- Hardcoded credentials in code
- Username/password authentication
- Unencrypted connection strings

### Network Security

**MUST:**
- All connections over TLS 1.2+
- Private endpoints for Databricks (where possible)
- SA DMZ accounts for production (Q2 2026+)

**SHOULD:**
- VNet integration for Azure services
- Firewall rules limiting access to known IPs

### Secrets Management

**MUST:**
- Azure Key Vault for all secrets
- Databricks Secrets API for job access
- NO secrets in Git repositories

**Example:**
```python
# ✅ CORRECT: Key Vault integration
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://ntier-kv.vault.azure.net/", credential=credential)
dnb_api_key = client.get_secret("dnb-api-key").value

# ❌ FORBIDDEN: Hardcoded secret
dnb_api_key = "abc123xyz789"  # NEVER DO THIS
```

---

## 6. Compliance and Audit

### Audit Trail Requirements

**MUST LOG:**
- All data changes (insert/update/delete)
- Manifest publications
- User access to Gold layer
- Failed authentication attempts
- Data quality validation failures

**Log Destination:**
- Unity Catalog automatic lineage
- Azure Monitor logs
- EventHub (if mandatory)

### Compliance Standards

**Applicable Standards:**
- GDPR: NOT applicable (no personal data)
- ISO 27001: Information security (general)
- SOX: NOT applicable (not financial reporting system)
- Internal Škoda/VW data governance policies

---

## 7. Environment Separation

### Environment Requirements

**MUST HAVE:**
- Separate catalogs per environment
- No cross-environment data sharing
- Separate service accounts per environment

**Catalog Naming:**
```
skoda_tierindex_dev   (Development)
skoda_tierindex_test  (Testing/QA)
skoda_tierindex_prod  (Production)
```

**Deployment Pipeline:**
```
GitHub/Azure DevOps
  → Build artifacts
    → Deploy to dev (automatic)
      → Run tests
        → Promote to test (manual approval)
          → QA validation
            → Promote to prod (manual approval + CAB)
```

---

## 8. Migration and Compatibility

### Phase-Based Constraints

| Phase                | Unity Catalog | Delta Lake | Databricks | EventHub | Azure DevOps |
| -------------------- | ------------- | ---------- | ---------- | -------- | ------------ |
| PoC (Q4 2025)        | SHOULD        | MUST       | SHOULD     | NO       | NO           |
| MVP (Q4 2025)        | MUST          | MUST       | MUST       | PENDING  | PENDING      |
| Pre-prod (Q1 2026)   | MUST          | MUST       | MUST       | TBD      | TBD          |
| Production (Q2 2026) | MUST          | MUST       | MUST       | TBD      | TBD          |

**Migration Plan:**
- Q4 2025: Finalize Unity Catalog + Delta Lake
- Q1 2026: Resolve EventHub/Azure DevOps (exception or compliance)
- Q2 2026: Full DAP compliance (SA DMZ accounts, Red Hat UBI)

---

## Change Log

### Version 1.0 (2025-10-22)
- Initial CORE constraints definition
- DAP platform requirements (Unity Catalog, Delta Lake, Databricks)
- Pending verifications (EventHub, Azure DevOps)
- Technology stack (MUST / MUST NOT / CAN)
- Security and compliance constraints
- Extracted from: dap_gap_analysis.md, tierindex_slovnik_pojmu.md
- Approved by: [Pending architect review]

---

## Related Documentation

**CORE:**
- `01_core_concepts.md` - TierIndex fundamental concepts
- `02_core_principles.md` - Why architecture decisions
- `03_core_data_model.md` - Entity/Edge/Tier schemas

**IMPLEMENTATION:**
- `dap-integration/dap_gap_analysis.md` - Detailed DAP alignment
- `governance_lineage.md` - Unity Catalog governance
- `security_checklist.md` - Security implementation details

---

**📖 Read Time:** ~10 minutes
**✅ Self-Contained:** Complete constraint list included
**🔒 Change Control:** Architect approval + CHANGELOG entry required
**⚠️ Escalation:** EventHub + Azure DevOps verification PENDING
