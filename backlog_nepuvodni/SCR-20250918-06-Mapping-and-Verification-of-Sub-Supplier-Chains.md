---
id: SCR-20250918-06
type: story
status: planned
priority: must-have
severity:
updated: 2025-09-18
---

# Mapping and Verification of Sub-Supplier Chains (N-Tier)

Brief
- As a procurement manager I want to map the complete sub-supplier structure down to Tier-2/3+ so that I have transparency and can uncover hidden risks.

Acceptance criteria
- [ ] User can select Tier-1 supplier or project as starting point.
- [ ] System maps N-Tier chain using Sayari + DnB data.
- [ ] Critical risks (SPOF, vendor lock-in, geographic clusters) are highlighted.
- [ ] Conflicts between data sources trigger verification workflow.

Notes
- Related components: Relationship Mapping Agent, Entity Resolution Agent.
- External APIs: Sayari (complete supply chain endpoints), DnB FamilyTree.
- Source scenario: Group 3.1 Mapping N-Tier.

## Dependencies
- **Depends on:**
  - SCR-20250911-SupplyChainGraph-UI - graph visualization for N-tier display
  - SCR-20250910-03 (Ownership Enrichment Tier1) - entity resolution and relationship data
  - FE-20250914-Dual-Tree-UI-Contract - UI framework for hierarchical supplier display
  - Sayari upstream traversal API integration (full endpoint access)
- **Blocks:**
  - SCR-20250918-05 (Hidden Risk Detection) - provides N-tier mapping foundation
  - SCR-20250918-07 (Crisis Impact Analysis) - enables impact propagation through supply tiers
- **Shared components:**
  - Relationship Mapping Agent, Entity Resolution Agent, graph traversal algorithms

## Potential Duplicates
- **Core component overlap** with SCR-20250911-SupplyChainGraph-UI - both create supply chain visualizations
- **Functional similarity** with FE-20250914-Dual-Tree-UI-Contract for hierarchical data display
- **API overlap** with Sayari integration in other stories

## Implementation Notes
- Central story for supply chain transparency leveraging Azure Edge relational architecture
- Azure SQL Database enables efficient relational queries for N-tier supplier relationships
- Complete Sayari API access provides comprehensive supply chain data without limitations
- SQL-based pattern recognition algorithms for SPOF and vendor lock-in detection
- Systematic data integration eliminates need for conflict resolution workflows

How to place this file
- Save under must-have/
- After saving, regenerate board.
