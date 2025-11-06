---
id: SCR-20250918-01
type: story
status: planned
priority: must-have
severity:
updated: 2025-09-18
---

# Rapid Supplier Onboarding Screening

Brief
- As a procurement specialist I want to quickly screen a new supplier using DnB, Sayari, and internal sources, so that I can minimize the risk of engaging with an unsuitable partner.

Acceptance criteria
- [ ] User can input supplier name or DUNS ID.
- [ ] System aggregates data from DnB (DataBlocks), Sayari (/resolution, /ubo), and SAP.
- [ ] Report includes sanctions, ownership (UBO), financial health, and relevant experience.
- [ ] Report is generated in < 5 minutes and contains timestamp + trace_id.
- [ ] System handles partial source unavailability gracefully and signals missing data.

Notes
- Related components: Entity Resolution Agent, Risk Analysis Agent, Data Synthesis Agent.
- External APIs: Sayari (full API access), DnB DataBlocks API.
- Internal dependencies: Azure SQL Database (supplier master data).
- Source scenario: Group 1.1 Onboarding Screening.

## Dependencies
- **Depends on:**
  - SCR-20250910-02 (Financial Enrichment Tier1) - requires financial data fields (revenue, EBITDA, growth)
  - SCR-20250910-03 (Ownership Enrichment Tier1) - requires UBO and jurisdiction data
  - SCR-20250910-04 (Risk Enrichment Tier1) - requires risk assessment and credit limit data
  - SCR-20250906-13 (Data Synthesis Agent Minimum) - requires synthesis capabilities for multi-source aggregation
- **Blocks:**
  - SCR-20250918-02 (Combined Risk Selection) - provides foundation supplier screening logic
- **Shared components:**
  - Entity Resolution Agent, Risk Analysis Agent, Data Synthesis Agent
  - DnB API integration, Sayari API integration
  - Multi-source data aggregation patterns

## Potential Duplicates
- **Partial overlap** with SCR-20250906-13 (Data Synthesis Agent) - both handle multi-source data aggregation
- **Component overlap** with existing DnB/Sayari integration in must-have stories
- **Functional similarity** to existing supplier screening workflows in done stories

## Implementation Notes
- Leverage Azure Edge Computing for batch processing with <5 minute response times
- Multi-source aggregation using full Sayari + DnB API integration
- Azure SQL Database provides pre-loaded supplier structure for fast lookups
- Systematic data integration patterns replace fallback strategies
- Relational database queries enable efficient multi-source synthesis

How to place this file
- Save under must-have/
- After saving, regenerate board (VS Code Task: "Scrum: Generate Board (.venv)").
