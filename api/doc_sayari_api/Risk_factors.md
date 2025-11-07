---
title: Risk factors
subtitle: Learn how to succesfully implement Sayari Risk Factors via API
---

## Overview
Sayari has three methods for determining Risk Factors. This guide details how to properly identify and implement each.

<Note>
Review our [Risk Factor Documentation](/sayari-library/ontology/risk-factors/risk-details) for the full list of risk factors and their visibility method: (seed, network, psa)
</Note>

<CardGroup cols={3}>
  <Card title="Seed Risk" icon="seedling">
    Direct associations between entities and authoritative risk sources.
  </Card>
  <Card title="Network Risk" icon="network-wired">
    Risk exposure through business relationships, ownership structures, and trading activity.
  </Card>
  <Card title="PSA Risk" icon="code-branch">
    Risk propagation through possibly-same-as entity groups.
  </Card>
</CardGroup>

## Getting Started

Every Risk Factor object in the API response follows a consistent structure:

<CodeBlocks>
```json title="Entity Response - Risk - Field Descriptions"
{
    "risk": {
        "some_risk_factor_name": {
            // The unique identifier for this risk factor
            "value": true,
            // Boolean for Seed/PSA risks, numeric for Network risks
            "metadata": {
            // Additional context about the risk factor
                "source": ["..."],
            },
            "level": "critical"
            // Risk severity: critical, high, or elevated
        }
    }
}
```
</CodeBlocks>

## Seed Risk

Seed Risk Factors identify direct connections between entities and authoritative risk sources like sanctions lists, regulatory databases, or adverse media records.

<Steps>

  ### Identify Seed Risk
  The values for Seed Risk are returned as booleans
  <CodeBlocks>
  ```json title="Entity Response - Seed Risk"
  {
      "risk": {
          "wro_entity": {
              "value": true,
              "metadata": {
                  "source": ["USA CBP Withhold Release Orders and Findings List"]
              },
              "level": "critical"
          }
      },
  ```
  </CodeBlocks>

  ### Review Risk Intelligence on the Entity Profile

  Each Seed Risk Factor includes a matching [`risk_intelligence`](/sayari-library/ontology/attributes#risk-intelligence) object that contains detailed metadata about the source generating the risk.

  <CodeBlocks>
  ```json title="Entity Response - Risk Intelligence" {4}
    "risk_intelligence": {
        "data": [{
            "properties": {
                "type": "wro_entity",
                "authority": "USA Department of Homeland Security",
                "list": "USA CBP Withhold Release Orders and Findings List",
                "status": "Active",
                "from_date": "1995-10-06"
            },
            "record": ["b222c03b9eb324d0969f40af61bb4e36"]
        }]
    }
}
```
  </CodeBlocks>
  <Note>
      While the`risk_intelligence` object is only available for Seed Risk factors; each Target entity associated with a Network Risk Factor will have an associated Seed Risk. From that Seed Risk, the `risk_intelligence` object can be obtained.
  </Note>
</Steps>

### Best Practices
- Always check the [`risk_intelligence`](/sayari-library/ontology/attributes#risk-intelligence) object for complete context
- Review all metadata fields including authority, list, status, and dates
- Track the source lists generating each Risk Factor

## Network Risk
Network risk factors analyze entity relationships to detect indirect risk exposure through business networks, ownership structures and trading relationships throughout the Sayari Knowledge Graph.

<Steps>

### Identify Network Risk

Network risk values are numeric and represent the distance ("hops") between an entity and its nearest risk target through the network of relationships. The number indicates how many edges or relationships exist in the chain linking source to target.

<CodeBlocks>
```json title="Entity Response - Network Risk" wordWrap {3}
{
"ofac_50_percent_rule": {
    "value": 3,
    "metadata": {},
    "level": "high"
},
```
</CodeBlocks>

### Identify traversal parameters to create paths to Target Entities

Network risk parameters can be obtained in two ways:
1. Reference the [Risk Factor Documentation](/sayari-library/ontology/risk-factors/risk-details) for parameter specifications
2. Programmatically parse them from the [Sayari ontology endpoint](https://graph.sayari.com/api/v1/ontology)

These parameters define the methodology for calculating network risk by specifying relationship types, traversal depth, and risk factor combinations.

<Accordion title='Network Risk Params'>
  ```json
    -max_depth: 6
    -PSA: True
    -Seed Risk: ['ofac_sdn']
    -Relationships: ['subsidiary_of', 'has_shareholder']
  ```
</Accordion>

### Call the Traversal Endpoint
Query the [/traversal endpoint](/api/api-reference/traversal/traversal) pairing the `entity_id` from step #1 with the Network Risk Params obtained in Step #2. This will return the complete risk path from source to targets.

<CodeBlocks>
```json title="Traversal - Network Risk" wordWrap
# Base URL
GET api.sayari.com/v1/traversal/:id

# Query Parameters
relationships:
  - has_shareholder
  - subsidiary_of
psa: true
max_depth: 6
ofac_sdn: true
export_controls: true

# Example curl command
curl -X GET "api.sayari.com/v1/traversal/123?relationships=has_shareholder&relationships=subsidiary_of&psa=true&max_depth=6&ofac_sdn=true&export_controls=true"
```
</CodeBlocks>
<Warning>
Network analysis can be computationally intensive. Modify the `max_depth` parameter judiciously to balance thoroughness with performance.
</Warning>

</Steps>

### Best Practices
- Reference and Monitor the [Risk Factor Documentation](/sayari-library/ontology/risk-factors/risk-details) or [ontology endpoint](https://graph.sayari.com/api/v1/ontology) for accurate traversal parameters.
- Monitor response times for deep traversals and consider reducing `max_depth` if performance is a concern.


## PSA risk factors

PSA (Possibly-Same-As) risk factors identify potential risk through entity similarities that suggest a relationship but lack definitive proof for merging via [Entity Resolution](/sayari-library/entity-resolution/entity-resolution).

<Steps>

### Identify PSA Risk
Similar to Seed Risk, the values for PSA Risk are returned as booleans. Each PSA Risk will reference the associated entity in the PSA group carrying the risk.

<CodeBlocks>
```json title="Entity Response - PSA Risk" {6-7}
{
    "risk": {
        "psa_export_controls": {
            "value": true,
            "metadata": {
                "export_controls_entity": [
                    "uiLYAQIp356DCBA9DNz3jQ"
                ]
            },
            "level": "critical"
        }
    }
}
```
</CodeBlocks>

### Call the Entity Endpoint
Query the [/entity endpoint](/api/api-reference/entity/get-entity) using the   `entity_id` returned in the metadata from Step #1.
  ```
  GET api.sayari.com/v1/entity/{entity_id}
  ```

### Review Enity Risk

<CodeBlocks>
  ```json title="Entity Response - PSA Risk"
  {
      "risk": {
          "export_controls": {
              "value": true,
              "metadata": {
                  "source": ["USA Consolidated Screening List"]
              },
              "level": "critical"
          }
      }
  }
  ```
</CodeBlocks>

### Evaluate risk intelligence
  Review detailed metadata about the source generating the risk:

  <CodeBlocks>
  ```json title="Entity Response - Risk Intelligence"
  {
      "risk_intelligence": {
          "data": [{
              "properties": {
                  "type": "export_controls",
                  "list": "Entity List (EL)",
                  "License Policy": "Case-by-case basis"
              }
          }]
      }
  }
  ```
  </CodeBlocks>

</Steps>

### Best Practices
- Always retrieve and review the referenced entity profile
- Evaluate the [`risk_intelligence`](/sayari-library/ontology/attributes#risk-intelligence) data for PSA-connected entities

## FAQ

<AccordionGroup>
  <Accordion title="What do the risk factor values represent?">
    Seed and PSA Risk factors return boolean values indicating presence/absence of risk. Network Risk returns numeric values showing the number of relationship "hops" to the nearest risk target.
  </Accordion>

  <Accordion title="How can I get network risk parameters?">
    Network risk parameters can be obtained either from the [Risk Factor Documentation](/sayari-library/ontology/risk-factors/risk-details) or programmatically from the [Sayari ontology endpoint](graph.sayari.com/api/v1/ontology)
  </Accordion>

  <Accordion title="Where can I find the complete list of risk factors?">
    The complete list of risk factors and their visibility methods (seed, network, psa) can be found in the [Risk Factor Documentation](/sayari-library/ontology/risk-factors/risk-details)
  </Accordion>

  <Accordion title="How frequently are existing Risk Factors updated?">
      Sayari provides (24 hour) updates for sanctions list and watchlist data. Network Risk Factors are refreshed approximately every two weeks in coordination with our Knowledge Graph Data Builds to ensure comprehensive risk assessment across entity relationships.
  </Accordion>

  <Accordion title="How frequently are new Risk Factors added?">
      New Risk Factors are continuously evaluated and added to enhance Sayari's risk coverage. [Follow our Sayari Product Change Log](https://sayari.notion.site/a76a2688bd5740bd8b901bb52e474ac1?v=4e796473af8249a0a773c1ca9e983b96) for announcements about newly introduced risk factors and coverage expansions.
  </Accordion>

  <Accordion title="How can I provide feedback about risk?">
      For questions or feedback about risk factors, contact your Sayari Representative. We actively incorporate user feedback to improve our risk methodology and data sources.
  </Accordion>
</AccordionGroup>
