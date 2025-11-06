---
id: SCR-20250918-07
type: story
status: planned
priority: must-have
severity:
updated: 2025-09-18
---

# Immediate Impact Analysis in Case of Crisis

Brief
- As a crisis manager I want an immediate overview of impacted suppliers and projects when a crisis occurs so that I can minimize damage and act fast.

Acceptance criteria
- [ ] User can input affected supplier or region.
- [ ] System identifies impacted Tier-1 suppliers, projects, and parts.
- [ ] Alternative suppliers are suggested from internal database.
- [ ] Outputs are timestamped and logged for audit.

Notes
- Related components: Risk Analysis Agent, Relationship Mapping Agent, Data Synthesis Agent.
- External APIs: Sayari + DnB.
- Internal: Azure SQL Database (pre-loaded supplier structure).
- Source scenario: Group 3.2 Crisis Impact Analysis.

## Dependencies
- **Depends on:**
  - SCR-20250918-06 (Sub-Supplier Mapping) - requires complete supply chain visibility for impact propagation
  - SCR-20250918-05 (Hidden Risk Detection) - risk accumulation patterns inform impact severity
  - SCR-20250918-03 (Early Warning) - alert infrastructure for crisis notifications
  - Project/parts data integration (not yet implemented)
- **Blocks:**
  - SCR-20250918-09 (What-If Scenarios) - provides impact analysis foundation for scenario modeling
- **Shared components:**
  - Crisis response algorithms, impact propagation analysis, alternative supplier identification

## Potential Duplicates
- **Functional overlap** with SCR-20250918-09 (What-If Scenarios) - both analyze supply chain impacts
- **Component overlap** with existing crisis management capabilities

## Implementation Notes
- Requires <5 minute response time for crisis scenarios (performance critical)
- Impact propagation algorithms needed for calculating downstream effects
- Alternative supplier recommendations require real-time sourcing intelligence
- Integration with project management systems needed for affected projects mapping

How to place this file
- Save under must-have/
- After saving, regenerate board.
