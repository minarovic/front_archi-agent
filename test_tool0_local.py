#!/usr/bin/env python3
"""
Quick local test of Tool 0 parser with Azure OpenAI.
Run: python3 test_tool0_local.py
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import json

# Load environment variables
load_dotenv()


# Define Pydantic schemas
class ProjectMetadata(BaseModel):
    """Metadata about the business project request."""

    project_name: str = Field(description="Name of the project")
    sponsor: str = Field(description="Name of the project sponsor")
    submitted_at: str = Field(
        description="Date when the request was submitted, in ISO 8601 format (YYYY-MM-DD)"
    )
    extra: dict[str, str] = Field(
        default_factory=dict, description="Additional metadata fields"
    )

    @field_validator("submitted_at")
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

    project_metadata: ProjectMetadata = Field(description="Project metadata")
    goal: str = Field(default="unknown", description="Main goal or objective")
    scope_in: str = Field(default="unknown", description="What is included in scope")
    scope_out: str = Field(default="unknown", description="What is excluded from scope")
    entities: list[str] = Field(
        default_factory=list, description="Key business entities"
    )
    metrics: list[str] = Field(default_factory=list, description="Key metrics or KPIs")
    sources: list[str] = Field(
        default_factory=list, description="Expected data sources"
    )
    constraints: list[str] = Field(
        default_factory=list, description="Constraints or requirements"
    )
    deliverables: list[str] = Field(
        default_factory=list, description="Required deliverables"
    )


# Get Azure configuration
AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

if not all([AZURE_ENDPOINT, AZURE_API_KEY, DEPLOYMENT_NAME]):
    raise ValueError("Missing Azure configuration in .env file")

print(f"☁️ Azure OpenAI configured")
print(f"   Endpoint: {AZURE_ENDPOINT}")
print(f"   Deployment: {DEPLOYMENT_NAME}\n")

# Sample business document
business_document = """# Žádost o datový projekt – Supplier Risk Insights 2.0

## Projekt
**Název:** Supplier Risk Insights 2.0
**Sponzor:** Marek Hrubý (VP Procurement Excellence)
**Datum:** 2025-10-28

## Cíl
Dodat konsolidovaný pohled na spolehlivost dodavatelů napříč BA/BS datamarťy a SAP ECC zdroji.

## Rozsah

### In Scope
- Historická data o purchase orders (posledních 36 měsíců).
- Dimenze dodavatel, produkt, dodací lokace.

### Out of Scope
- Forecasting budoucích objednávek.
- Integrace s CRM.

## Klíčové entity
- Supplier Master
- Purchase Order Header

## Metriky
- Supplier Reliability Index
- Average Goods Receipt Lead Time

## Očekávané zdroje
- Databricks Unity Catalog: dm_ba_purchase
- SAP ECC tabulky: EKKO, EKPO

## Omezení
- GDPR: žádná osobní data
- Data retention: pouze 3 roky
"""

print(f"📄 Business document loaded ({len(business_document)} characters)\n")

# System prompt
SYSTEM_PROMPT = """You are a business requirements parser. Extract structured information from business documents.
Documents may contain Czech/English text. Return valid JSON conforming to the BusinessRequest schema."""

# Create OpenAI client
print("🔄 Parsing document with Azure OpenAI...")
client = OpenAI(api_key=AZURE_API_KEY, base_url=AZURE_ENDPOINT, max_retries=0)

user_message = f"Parse the following business request document:\n\n{business_document}\n\nReturn valid JSON."

try:
    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        response_format={"type": "json_object"},
        timeout=30.0,
    )

    raw_json = response.choices[0].message.content
    print("✅ OpenAI response received\n")

    # Parse and validate with Pydantic
    parsed = BusinessRequest.model_validate_json(raw_json)

    print("=" * 80)
    print("📊 PARSED BUSINESS REQUEST")
    print("=" * 80)
    print(json.dumps(parsed.model_dump(), indent=2, ensure_ascii=False))
    print("=" * 80)
    print("\n✅ SUCCESS! Tool 0 parser working correctly.")

except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}")
    print(f"   {str(e)}")
    import traceback

    traceback.print_exc()
