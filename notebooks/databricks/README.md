# Databricks Deployment Guide - MCOP Tools

This guide covers deployment of all MCOP tools (Tool 0-3) to Databricks using **Pydantic Graph** orchestration.

## Overview

All tools are available in two versions:
- **Local** (`notebooks/tool*_demo_graph.ipynb`) - For local development with `.env` file
- **Databricks** (`notebooks/databricks/tool*_databricks.ipynb`) - For Databricks with secrets

## Architecture Summary

| Tool   | Purpose                     | Nodes               | LLM Calls             | Dependencies                 |
| ------ | --------------------------- | ------------------- | --------------------- | ---------------------------- |
| Tool 0 | Business Request Parser     | 1 (single LLM call) | 1                     | OpenAI SDK + Pydantic        |
| Tool 1 | Entity-to-Candidate Mapping | 5                   | 2 (ranking + mapping) | Pydantic AI + Pydantic Graph |
| Tool 2 | Structural Classification   | 5                   | 1 (classify)          | Pydantic AI + Pydantic Graph |
| Tool 3 | Quality Validation          | 4                   | 1 (risk assessment)   | Pydantic AI + Pydantic Graph |

**Total size:** ~15MB (vs 330MB LangGraph) = **95% reduction**

## Prerequisites

### 1. Databricks Workspace
- **Tier:** Standard or higher (no Unity Catalog required)
- **Cluster:** Any runtime with Python 3.10+
- **Example:** sandbox-single-node (used in testing)

### 2. Azure OpenAI Service
- **Model:** gpt-5-mini-2025-08-07 (or compatible)
- **Deployment:** test-gpt-5-mini
- **Region:** Sweden Central (or your region)
- **API Version:** 2024-10-21

## Setup Steps

### Step 1: Create Databricks Secret Scope

Use Databricks CLI or UI to create a secret scope:

```bash
# Install Databricks CLI
pip install databricks-cli

# Configure authentication
databricks configure --token

# Create secret scope
databricks secrets create-scope --scope mcop
```

Or use the Databricks UI:
1. Navigate to Settings → Admin Console → Secrets
2. Create new scope: `mcop`

### Step 2: Add Azure OpenAI Credentials

```bash
# Add endpoint
databricks secrets put --scope mcop --key azure-openai-endpoint
# Paste: https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/

# Add API key
databricks secrets put --scope mcop --key azure-openai-api-key
# Paste: <your-api-key>

# Add deployment name
databricks secrets put --scope mcop --key azure-openai-deployment-name
# Paste: test-gpt-5-mini
```

**Verify secrets:**
```bash
databricks secrets list --scope mcop
```

Expected output:
```
Key (Type)
azure-openai-endpoint (REDACTED)
azure-openai-api-key (REDACTED)
azure-openai-deployment-name (REDACTED)
```

### Step 3: Upload Metadata Files to DBFS

Upload the BA-BS metadata export to DBFS:

```bash
# Create directory
databricks fs mkdirs dbfs:/FileStore/mcop/metadata/

# Upload metadata file
databricks fs cp docs_langgraph/BA-BS_Datamarts_metadata.json \
  dbfs:/FileStore/mcop/metadata/BA-BS_Datamarts_metadata.json
```

Or use Databricks UI:
1. Navigate to Data → DBFS → FileStore
2. Create folder: `mcop/metadata/`
3. Upload `BA-BS_Datamarts_metadata.json`

### Step 4: Upload Notebooks to Databricks

```bash
# Upload all Databricks notebooks
databricks workspace import_dir \
  notebooks/databricks \
  /Workspace/Users/<your-email>/mcop/
```

Or use Databricks UI:
1. Navigate to Workspace
2. Create folder: `mcop`
3. Upload all `*_databricks.ipynb` files

## Running the Pipeline

### Tool 0: Business Request Parser

**Purpose:** Parse Markdown business documents into structured JSON.

**Dependencies:** None (first tool in pipeline)

**Steps:**
1. Open `tool0_parser_databricks.ipynb`
2. Attach to cluster
3. Run all cells
4. Verify output in DBFS: `dbfs:/FileStore/mcop/tool0_samples/`

**Output:**
- `<timestamp>.json` - Parsed business request
- `<timestamp>.md` - Audit trail (prompt + raw response)

**Expected runtime:** ~30 seconds

---

### Tool 1: Entity-to-Candidate Mapping

**Purpose:** Map business entities to BS metadata candidates using Pydantic Graph.

**Dependencies:**
- Tool 0 output in `dbfs:/FileStore/mcop/tool0_samples/`
- BS metadata in `dbfs:/FileStore/mcop/metadata/`

**Steps:**
1. Open `tool1_ingest_databricks.ipynb`
2. Attach to cluster
3. Run all cells
4. Verify output in DBFS: `dbfs:/FileStore/mcop/tool1/`

**Output:**
- `filtered_dataset_graph.json` - Final mappings
- `graph_state/tool1_state.json` - Checkpoint (resumability)
- `tool1_graph.mmd` - Mermaid diagram

**Expected runtime:** ~2-3 minutes (2 LLM calls)

---

### Tool 2: Structural Classification

**Purpose:** Classify entities as FACT/DIMENSION and detect relationships.

**Dependencies:**
- Tool 0 output
- Tool 1 output in `dbfs:/FileStore/mcop/tool1/`
- BS metadata

**Steps:**
1. Open `tool2_structure_databricks.ipynb`
2. Attach to cluster
3. Run all cells
4. Verify output in DBFS: `dbfs:/FileStore/mcop/tool2/`

**Output:**
- `structure_graph.json` - Classification results
- `graph_state/tool2_state.json` - Checkpoint
- `tool2_graph.mmd` - Mermaid diagram

**Expected runtime:** ~1-2 minutes (1 LLM call)

---

### Tool 3: Quality Validation

**Purpose:** Hybrid quality validation (deterministic + LLM risk assessment).

**Dependencies:**
- Tool 0 output
- Tool 2 output in `dbfs:/FileStore/mcop/tool2/`
- BS metadata

**Steps:**
1. Open `tool3_quality_databricks.ipynb`
2. Attach to cluster
3. Run all cells
4. Verify output in DBFS: `dbfs:/FileStore/mcop/tool3/`

**Output:**
- `quality_report_graph.json` - Quality metrics + recommendations
- `graph_state/tool3_state.json` - Checkpoint
- `tool3_graph.mmd` - Mermaid diagram

**Quality Metrics:**
- Articulation scores (0-100)
- Validation results (pass/warning/fail)
- Risk level (high/medium/low)
- P0-P2 prioritized recommendations

**Expected runtime:** ~1-2 minutes (1 LLM call)

## DBFS Directory Structure

After running all tools, your DBFS structure should look like:

```
dbfs:/FileStore/mcop/
├── metadata/
│   └── BA-BS_Datamarts_metadata.json (uploaded manually)
├── tool0_samples/
│   ├── 2025-11-09T12:34:56.json (example timestamp)
│   └── 2025-11-09T12:34:56.md
├── tool1/
│   ├── filtered_dataset_graph.json
│   ├── tool1_graph.mmd
│   └── graph_state/
│       └── tool1_state.json
├── tool2/
│   ├── structure_graph.json
│   ├── tool2_graph.mmd
│   └── graph_state/
│       └── tool2_state.json
└── tool3/
    ├── quality_report_graph.json
    ├── tool3_graph.mmd
    └── graph_state/
        └── tool3_state.json
```

## Troubleshooting

### Issue: Secrets Not Found

**Error:** `KeyError: 'azure-openai-endpoint'`

**Solution:**
```bash
# Verify secret scope exists
databricks secrets list-scopes

# Verify keys exist
databricks secrets list --scope mcop

# Re-create if needed
databricks secrets put --scope mcop --key azure-openai-endpoint
```

### Issue: Metadata File Not Found

**Error:** `FileNotFoundError: BS metadata not found`

**Solution:**
```bash
# Verify file exists
databricks fs ls dbfs:/FileStore/mcop/metadata/

# Re-upload if missing
databricks fs cp docs_langgraph/BA-BS_Datamarts_metadata.json \
  dbfs:/FileStore/mcop/metadata/
```

### Issue: Tool 1 Cannot Find Tool 0 Output

**Error:** `FileNotFoundError: No Tool 0 outputs found`

**Solution:**
1. Run Tool 0 first (it's independent)
2. Verify output exists:
   ```bash
   databricks fs ls dbfs:/FileStore/mcop/tool0_samples/
   ```
3. Re-run Tool 0 if missing

### Issue: Package Installation Fails

**Error:** `ERROR: pip's dependency resolver...`

**Solution:**
1. Restart Python kernel: `dbutils.library.restartPython()`
2. Clear cache: `%pip cache purge`
3. Reinstall: `%pip install --no-cache-dir pydantic-ai[graph]>=0.0.49`

### Issue: Graph Execution Hangs

**Symptom:** Node execution never completes

**Solution:**
1. Check cluster logs for errors
2. Verify Azure OpenAI endpoint is reachable
3. Check API key validity
4. Increase cluster resources if needed

## Performance Tips

### 1. Use Smaller Clusters for Development
- Tool 0-3 don't require large clusters
- Single-node clusters are sufficient
- Save costs during development

### 2. Leverage Checkpointing
- All tools use `FileStatePersistence`
- Resume from last successful node
- Useful for debugging/iteration

### 3. Monitor Token Usage
- Tool 1: ~2000 tokens (2 LLM calls)
- Tool 2: ~1500 tokens (1 LLM call)
- Tool 3: ~1000 tokens (1 LLM call)
- Total pipeline: ~4500 tokens per run

### 4. Batch Processing
- Process multiple business requests in parallel
- Use Databricks Jobs for scheduling
- Store results in Delta tables (optional)

## Migration from Local to Databricks

If you have working local notebooks, migration steps:

1. **Replace `.env` with secrets:**
   ```python
   # Local
   load_dotenv()
   AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")

   # Databricks
   AZURE_ENDPOINT = dbutils.secrets.get(scope="mcop", key="azure-openai-endpoint")
   ```

2. **Replace local paths with DBFS:**
   ```python
   # Local
   Path.cwd().parent / 'data' / 'tool0_samples'

   # Databricks
   Path('/dbfs/FileStore/mcop/tool0_samples')
   ```

3. **Add package installation:**
   ```python
   %pip install pydantic-ai[graph]>=0.0.49
   dbutils.library.restartPython()
   ```

4. **Set environment variables for Pydantic AI:**
   ```python
   os.environ["OPENAI_BASE_URL"] = AZURE_ENDPOINT
   os.environ["OPENAI_API_KEY"] = AZURE_API_KEY
   ```

## Next Steps

### Integration with Delta Lake
```python
# Save Tool 3 quality report to Delta table
import pyspark.sql.functions as F
from delta.tables import DeltaTable

# Read JSON from DBFS
quality_df = spark.read.json('/dbfs/FileStore/mcop/tool3/quality_report_graph.json')

# Write to Delta
quality_df.write.format("delta").mode("append").save("/delta/mcop/quality_reports")
```

### Databricks Workflows
Create a workflow to run all tools in sequence:
1. Navigate to Workflows → Create Job
2. Add tasks: Tool0 → Tool1 → Tool2 → Tool3
3. Set dependencies (Tool1 depends on Tool0, etc.)
4. Schedule (e.g., daily at 8 AM)

### Unity Catalog Integration (Optional)
If you upgrade to Unity Catalog tier:
```python
# Replace DBFS paths with UC volumes
# /dbfs/FileStore/mcop/ → /Volumes/catalog/schema/mcop/
```

## Support

For issues or questions:
1. Check this guide first
2. Review notebook cell outputs for errors
3. Check Databricks cluster logs
4. Verify Azure OpenAI service status
5. Contact MCOP team: [your-contact]

## Changelog

- **2025-11-09:** Initial Databricks deployment guide
  - 4 notebooks created (Tool 0-3)
  - Pydantic Graph orchestration
  - DBFS-based persistence
  - Secrets management
  - 95% dependency reduction vs LangGraph
