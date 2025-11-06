---
id: SCR-20250918-02
type: story
status: planned
priority: must-have
severity:
updated: 2025-09-18
---

# Supplier Selection Based on Combined Risk

Brief
- As a procurement specialist I want to objectively compare technically compliant suppliers based on combined risk so that I can select the partner with the lowest overall risk.

Acceptance criteria
- [ ] User can input list of candidate suppliers.
- [ ] System calculates combined risk score (price, stability, geopolitics, ownership, experience).
- [ ] Visualization clearly shows comparative risk across suppliers.
- [ ] Changing weights re-computes the ranking and logs the change.
- [ ] Missing data is highlighted and impacts confidence score.

Notes
- Related components: Risk Analysis Agent, Relationship Mapping Agent, Data Synthesis Agent.
- External APIs: Sayari (/v1/watchlist/{id}), DnB DataBlocks (financial).
- Source scenario: Group 1.2 Combined Risk Selection.

## Dependencies
- **Depends on:**
  - SCR-20250910-04 (Risk Enrichment Tier1) - critical for risk scoring components (failure_score, trend, credit_limit)
  - SCR-20250910-02 (Financial Enrichment Tier1) - financial stability metrics for risk calculation
  - SCR-20250910-03 (Ownership Enrichment Tier1) - ownership complexity and jurisdiction risks
  - SCR-20250910-06 (Multi-Type Synthesis Agent) - combined scoring algorithm
  - SCR-20250910-07 (Frontend Type Display) - visualization for comparative risk display
- **Blocks:**
  - SCR-20250918-03 (Early Warning) - provides risk comparison foundation for monitoring
  - SCR-20250918-04 (Long-Term Stability) - extends comparative analysis to time-series
- **Shared components:**
  - Risk Analysis Agent, Data Synthesis Agent
  - Combined risk scoring algorithms
  - Sayari watchlist integration, DnB financial data

## Potential Duplicates
- **High overlap** with SCR-20250918-01 (Onboarding Screening) - both use multi-source risk assessment
- **Functional similarity** with existing risk analysis in SCR-20250910-04 - same risk components, different use case
- **Partial overlap** with monitoring stories - similar risk calculation but different trigger (manual vs automated)

## Implementation Notes
- Build upon existing Risk Enrichment Tier1 foundation (failure_score, trend analysis)
- Requires weighted scoring algorithm for combining multiple risk dimensions
- Confidence scoring mechanism needed for handling missing data gracefully
- Interactive weight adjustment requires real-time recalculation capabilities
- Visualization component critical for procurement specialist decision-making
- Audit trail needed for weight changes and ranking modifications

How to place this file
- Save under must-have/
- After saving, regenerate board.
