# Databricks notebook source
# MAGIC %md
# MAGIC # Tool 0 - Business Request Parser (Databricks)
# MAGIC
# MAGIC **Purpose:** Parse standardized Markdown business documents into structured JSON using Azure OpenAI.
# MAGIC
# MAGIC **Databricks-Specific Changes:**
# MAGIC - ✅ `dbutils.secrets.get()` instead of `.env` file
# MAGIC - ✅ `/dbfs/FileStore/` paths instead of local `data/` directory
# MAGIC - ✅ `%pip install` cell for package installation
# MAGIC - ✅ `dbutils.library.restartPython()` to reload packages
# MAGIC - ✅ DBFS-safe filenames (replaced `:` with `-` in timestamps)
# MAGIC
# MAGIC **Azure AI Foundry Configuration:**
# MAGIC - **Endpoint:** https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/
# MAGIC - **Deployment:** test-gpt-5-mini
# MAGIC - **Model:** gpt-5-mini-2025-08-07
# MAGIC - **Pattern A:** Direct OpenAI SDK with JSON mode + Pydantic validation

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1. Install Required Packages

# COMMAND ----------

# Install all required packages with pinned versions for reproducibility
# Using openai>=1.40.0 for Databricks proxy compatibility
%pip install openai>=1.40.0 pydantic==2.8.2 python-dotenv==1.0.1 mlflow==2.12.1

# COMMAND ----------

# Restart Python kernel to load new packages
dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2. Configure MLflow (Optional)

# COMMAND ----------

import mlflow
mlflow.autolog()

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3. Define Pydantic Schemas

# COMMAND ----------

# Import required modules
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import json
from pathlib import Path

# Define Pydantic schemas
class ProjectMetadata(BaseModel):
    """Metadata about the business project request."""

    project_name: str = Field(description="Name of the project")
    sponsor: str = Field(description="Name of the project sponsor")
    submitted_at: str = Field(description="Date when the request was submitted, in ISO 8601 format (YYYY-MM-DD)")
    extra: dict[str, str] = Field(default_factory=dict, description="Additional metadata fields as key-value pairs")

    @field_validator('submitted_at')
    @classmethod
    def validate_iso_date(cls, v: str) -> str:
        """Validate that date is in ISO 8601 format."""
        try:
            datetime.fromisoformat(v)
            return v
        except ValueError:
            raise ValueError(f"Date must be in ISO 8601 format (YYYY-MM-DD), got: {v}")


class BusinessRequest(BaseModel):
    """Structured representation of a parsed business request document."""

    project_metadata: ProjectMetadata = Field(description="Project metadata including name, sponsor, and submission date")
    goal: str = Field(default="unknown", description="Main goal or objective of the project")
    scope_in: str = Field(default="unknown", description="What is included in the project scope")
    scope_out: str = Field(default="unknown", description="What is explicitly excluded from the project scope")
    entities: list[str] = Field(default_factory=list, description="Key business entities involved in the project")
    metrics: list[str] = Field(default_factory=list, description="Key metrics or KPIs to be tracked")
    sources: list[str] = Field(default_factory=list, description="Expected data sources for the project")
    constraints: list[str] = Field(default_factory=list, description="Constraints, limitations, or special requirements")
    deliverables: list[str] = Field(default_factory=list, description="Required deliverables or artifacts from the project")

print("✅ Schemas defined successfully")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 4. Load Azure Configuration from Secrets

# COMMAND ----------

# Get Azure configuration from Databricks secrets
# Strip whitespace/newlines to avoid malformed URLs
AZURE_ENDPOINT = dbutils.secrets.get(scope="mcop", key="azure-openai-endpoint").strip()
AZURE_API_KEY = dbutils.secrets.get(scope="mcop", key="azure-openai-api-key").strip()
DEPLOYMENT_NAME = dbutils.secrets.get(scope="mcop", key="azure-openai-deployment-name").strip()

# Ensure endpoint ends with /openai/v1/ for OpenAI SDK v1.x compatibility
if not AZURE_ENDPOINT.rstrip("/").endswith("openai/v1"):
    AZURE_ENDPOINT = AZURE_ENDPOINT.rstrip("/") + "/openai/v1/"
else:
    AZURE_ENDPOINT = AZURE_ENDPOINT.rstrip("/") + "/"

if not all([AZURE_ENDPOINT, AZURE_API_KEY, DEPLOYMENT_NAME]):
    raise ValueError("Missing Azure configuration in Databricks secrets (scope: mcop)")

print(f"☁️ Azure OpenAI configured from Databricks secrets")
print(f"   Endpoint: {AZURE_ENDPOINT}")
print(f"   Deployment: {DEPLOYMENT_NAME}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 5. Load Sample Business Document

# COMMAND ----------

# Hardcoded sample business document
business_document = """# Žádost o datový projekt – Supplier Risk Insights 2.0

## Projekt
**Název:** Supplier Risk Insights 2.0
**Sponzor:** Marek Hrubý (VP Procurement Excellence)
**Datum:** 2025-10-28
**Oddělení:** Group Procurement Analytics
**Priorita:** Kritická – Q4 OKR "Stabilizace dodavatelského řetězce"

## Cíl
Dodat konsolidovaný pohled na spolehlivost dodavatelů napříč BA/BS datamarťy a SAP ECC zdroji. Výsledný reporting musí upozorňovat na dodavatele s rostoucím lead time, častými reklamacemi nebo blokacemi plateb, aby procurement dokázal včas přesměrovat objem a eskalovat smluvní pokuty.

## Rozsah

### In Scope
- Historická data o purchase orders (posledních 36 měsíců) včetně RU/DE regionu.
- Dimenze dodavatel, produkt, dodací lokace, nákupní organizace.
- SLA metriky: on-time delivery, defect rate, invoice dispute count.
- Spárování se security klasifikací (Confidential vs Internal).
- Export KPI do Power BI workspace "Supplier Control Tower".

### Out of Scope
- Forecasting budoucích objednávek (řeší Supply Planning tým).
- Integrace s CRM a risk ratingy třetích stran.
- Real-time streaming ze SCADA nebo IoT senzorů.
- Detailní finanční marže – používá Finance Controlling.

## Klíčové entity & metriky

### Entity
- Supplier Master (Collibra/Unity Catalog `dimv_supplier`).
- Purchase Order Header + Item (`factv_purchase_order`, `factv_purchase_order_item`).
- Quality Incident (`factv_quality_notification`).
- Delivery Calendar Dimension (`dimv_delivery_date`).

### Metriky
- Supplier Reliability Index (vážený mix on-time %, dispute rate, defect rate).
- Average Goods Receipt Lead Time (dny).
- % PO s „blocked for payment" statusem.
- NCR Count (non-conformance reports) za poslední kvartál.
- Spend concentration top 10 dodavatelů.

## Očekávané zdroje
- Databricks Unity Catalog: `dm_ba_purchase`, `dm_bs_purchase` schemata.
- Collibra Data Catalog export (zajišťuje lineage a vlastníky).
- SAP ECC tabulky: `EKKO`, `EKPO`, `LFA1`, `MKPF`.
- SharePoint složka "Supplier Audits" pro manuální NCR zápisy.

## Omezení
- GDPR: žádná osobní data supplier kontaktů v datasetu; pseudonymizace ID.
- Data retention: pouze 3 roky historie v produkčním modelu.
- Každý dashboard refresh < 5 min, jinak neprojde SLA.
- Row Level Security podle regionu (EMEA, AMER, APAC).
- Pouze read-only přístup do SAP; žádné zápisy zpět.

## Požadované artefakty
- Kurátorované `business_request.json` a `structure.json` pro Tool 3/7.
- Quality report shrnující articulationScore + missingFromSource flagy.
- Power BI semantic model + definice DAX measures.
- Governance runbook popisující validace a kontakty (owner, steward).
- Checklist P0/P1/P2 mitigací pro Supplier Risk komisi.
"""

print(f"📄 Business document loaded ({len(business_document)} characters)")
print("\nFirst 300 characters:")
print("=" * 60)
print(business_document[:300])
print("...")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 6. Parse Document Using Azure OpenAI

# COMMAND ----------

# Parse the business document using Azure OpenAI
from openai import OpenAI

print(f"🔄 Parsing document with Azure OpenAI ({DEPLOYMENT_NAME})...")

SYSTEM_PROMPT = """You are a business requirements parser. Your task is to extract structured information
from mixed-language (Czech/English) business request documents. Extract fields like project name, sponsor,
goal, scope, entities, metrics, sources, constraints, and deliverables into JSON."""

client = OpenAI(
    api_key=AZURE_API_KEY,
    base_url=AZURE_ENDPOINT
)

user_message = f"Parse the following business request document:\n\n{business_document}\n\nReturn valid JSON."

prompt_used = f"System:\n{SYSTEM_PROMPT}\n\nUser:\n{user_message}"

response = client.chat.completions.create(
    model=DEPLOYMENT_NAME,
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ],
    response_format={"type": "json_object"},
)

raw_response = response.choices[0].message.content

try:
    parsed_json = json.loads(raw_response)
    print("✅ Parsing complete!")
    print(f"   Model: {response.model}")
    print(f"   Tokens used: {response.usage.total_tokens}")
except json.JSONDecodeError as e:
    print(f"❌ JSON parsing error: {e}")
    print("Raw response:")
    print(raw_response)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 7. Display Parsed JSON

# COMMAND ----------

# Display parsed JSON
print("📊 Parsed Business Request:")
print("=" * 60)
print(json.dumps(parsed_json, indent=2, ensure_ascii=False))

# Also show as Pydantic model
print("\n" + "=" * 60)
print("📋 Validation:")
try:
    validated = BusinessRequest.model_validate(parsed_json)
    print(f"✅ Schema valid: {validated.project_metadata.project_name}")
    print(f"   Sponsor: {validated.project_metadata.sponsor}")
    print(f"   Date: {validated.project_metadata.submitted_at}")
    print(f"   Entities: {len(validated.entities)} found")
    print(f"   Sources: {len(validated.sources)} found")
except Exception as e:
    print(f"❌ Validation error: {e}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 8. Save Results to DBFS

# COMMAND ----------

# Save results to DBFS
from datetime import datetime
from pathlib import Path
import json

timestamp = datetime.now().isoformat().replace(':', '-')  # DBFS-safe filename
output_dir = Path('/dbfs/FileStore/mcop/tool0_samples')
output_dir.mkdir(parents=True, exist_ok=True)

# Save JSON result
json_path = output_dir / f"{timestamp}.json"
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(parsed_json, f, indent=2, ensure_ascii=False)

# Save prompt
md_path = output_dir / f"{timestamp}.md"
with open(md_path, 'w', encoding='utf-8') as f:
    f.write(f"# Parse Request - {timestamp}\n\n")
    f.write(f"## Prompt Used\n\n```\n{prompt_used}\n```\n\n")
    f.write(f"## Raw Response\n\n```\n{raw_response}\n```\n\n")
    f.write(f"## Parsed JSON\n\n```json\n{json.dumps(parsed_json, indent=2, ensure_ascii=False)}\n```\n")

print(f"💾 Results saved:")
print(f"   JSON: {json_path}")
print(f"   Markdown: {md_path}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 9. Summary
# MAGIC
# MAGIC ✅ **Databricks Deployment Complete:**
# MAGIC - [x] Azure OpenAI credentials from Databricks secrets (scope: `mcop`)
# MAGIC - [x] Pydantic schemas for validation (ProjectMetadata, BusinessRequest)
# MAGIC - [x] Sample business document (Czech/English mix)
# MAGIC - [x] OpenAI SDK with Azure endpoint and JSON mode
# MAGIC - [x] Pydantic validation after parsing
# MAGIC - [x] Results saved to DBFS (`/dbfs/FileStore/mcop/tool0_samples/`)
# MAGIC
# MAGIC **Key Configuration:**
# MAGIC - **Endpoint:** Both `.cognitiveservices.azure.com` AND `.openai.azure.com` are valid per Azure documentation
# MAGIC - **Current:** https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/
# MAGIC - **Deployment:** test-gpt-5-mini
# MAGIC - **Model:** gpt-5-mini-2025-08-07
# MAGIC - **SDK:** openai==1.30.1 (supports both endpoint formats)
# MAGIC
# MAGIC **Next Steps:**
# MAGIC 1. Verify files in DBFS: `dbutils.fs.ls("dbfs:/FileStore/mcop/tool0_samples/")`
# MAGIC 2. Run Tool 1 (Entity Mapping) using Tool 0 output
# MAGIC 3. Run Tool 2 (Structure Classification) using Tool 0 + Tool 1 outputs
# MAGIC 4. Run Tool 3 (Quality Validation) using all previous outputs
