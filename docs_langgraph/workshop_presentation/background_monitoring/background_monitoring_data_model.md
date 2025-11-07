# Background Monitoring – Datový slovník & edge taxonomy

> ⚠️ **DAP alignment status:** Tento dokument vznikl před migrací na DAP. Storage matrix a odkazy na Azure služby jsou legacy – pro aktuální stav viz `background_monitoring/background_monitoring.md` a doplň TODO pro Delta/Unity Catalog.

## 📚 Doplňující dokumentace

**Hlavní přehled:** `background_monitoring/background_monitoring.md` (kontext, rozdíly vůči DAP, todo seznam).

**Tento dokument** (data_model):
- Typ: Datový slovník & edge type normalization
- Pro koho: Data architekti, business analytici, governance
- Obsah: Canonical taxonomy, tier rules, validation, JSON schémata
- TODO: Doplnit Unity Catalog metadata, odstranit odkaz na Cosmos/Redis.

**Doplňkový dokument** (implementation):
- Typ: Kompletní implementační specifikace (Legacy – před DAP)
- Pro koho: Vývojáři, DevOps, solution architekti
- Obsah: Loader, Azure/K8s, observability, testing, backlog
- TODO: Přepsat deployment kapitolu na Databricks jobs.

# Background Monitoring Report: Edge Type Normalization & TierIndex Changesets

**Verze:** 2025-09-30 (aktualizováno: DAP compatibility notice)

> ✅ **DAP COMPATIBILITY NOTICE - DATOVÝ MODEL JE PLATNÝ:**
> Tento dokument popisuje **datový model (edge types, tier classification, DnB/Sayari mapping)**, který je **plně kompatibilní s DAP**.
>
> **DAP alignment:**
> - ✅ Edge taxonomy → **Unity Catalog lineage** (canonical types zůstávají stejné)
> - ✅ Tier classification rules → **Delta Lake tier columns** (Python logika přenositelná)
> - ✅ DnB/Sayari mapping → **Bronze layer metadata** (`meta.origin`, `meta.endpoint`)
> - ✅ Validation rules → **Delta Lake constraints** nebo Databricks expectations
>
> **Co se NEMĚNÍ:** Canonical edge types (supply/ownership/control), tier classification logika, JSON Schema struktura
>
> **Co se MĚNÍ:** Storage Selection Matrix (Blob/Redis/Cosmos → Delta Lake) - viz poznámka v Appendixu
>
> **Použití tohoto dokumentu:**
> - ✅ Reference pro edge normalization (DnB/Sayari → canonical types)
> - ✅ Tier classification rules (Tier1/2/3 Python logika)
> - ✅ Validation rules pro Bronze layer constraints
> - 📖 Pro DAP storage viz: `scrum/architecture/physical_model.md` (ignoruj Storage Selection Matrix v Appendixu)

---

## Executive Summary

This report provides a comprehensive analysis and normalization of edge types for the TierIndex changeset system in the AI-agent-Ntier project. The analysis focuses on creating a consistent taxonomy for relationship edges that is compatible with both DnB Direct+ and Sayari API responses, specifically designed for supply chain tier classification and changeset operations.

## Edge Type Normalization

### 1. Sayari API Relationship Types (Supply Chain Focus)

Based on analysis of `api/doc_sayari_api/Relationships.md`, the following relationship types are relevant for supply chain analysis:

#### Supply Chain Relationships
| raw_type          | category | description                               | relevance                         |
| ----------------- | -------- | ----------------------------------------- | --------------------------------- |
| `ships_to`        | supply   | Source entity ships to target entity      | HIGH - Direct supply relationship |
| `procures_from`   | supply   | Source entity procures from target entity | HIGH - Procurement relationship   |
| `receiver_of`     | supply   | Source entity receives shipments          | MEDIUM - Logistics relationship   |
| `carrier_of`      | supply   | Entity transports goods                   | MEDIUM - Logistics relationship   |
| `shipper_of`      | supply   | Entity initiates shipments                | MEDIUM - Logistics relationship   |
| `notify_party_of` | supply   | Entity to be notified of shipment arrival | LOW - Administrative relationship |

#### Ownership Relationships
| raw_type              | category  | description                   | relevance                    |
| --------------------- | --------- | ----------------------------- | ---------------------------- |
| `shareholder_of`      | ownership | Direct ownership with shares  | HIGH - Direct ownership      |
| `beneficial_owner_of` | ownership | Indirect/beneficial ownership | HIGH - Ultimate ownership    |
| `subsidiary_of`       | ownership | Subsidiary relationship       | HIGH - Corporate structure   |
| `parent_of`           | ownership | Parent company relationship   | HIGH - Corporate structure   |
| `partner_of`          | ownership | Business partnership          | MEDIUM - Joint ventures      |
| `branch_of`           | ownership | Branch/division relationship  | MEDIUM - Corporate structure |

#### Control & Management Relationships
| raw_type      | category | description                | relevance           |
| ------------- | -------- | -------------------------- | ------------------- |
| `director_of` | control  | Board/management role      | MEDIUM - Governance |
| `officer_of`  | control  | Executive role (CEO, etc.) | MEDIUM - Management |
| `manager_of`  | control  | Management role            | LOW - Operational   |
| `employee_of` | control  | Employment relationship    | LOW - Personnel     |

### 2. DnB Direct+ Relationship Types

Based on analysis of DnB API specifications (`api_dnb/new_version/`):

#### Family Tree Relationships (FamilyTreeFull endpoint)
| DnB Role            | raw_type             | category  | description                    |
| ------------------- | -------------------- | --------- | ------------------------------ |
| Parent/Headquarters | `parent_of`          | ownership | Source is parent of target     |
| Subsidiary          | `subsidiary_of`      | ownership | Source is subsidiary of target |
| Branch/Division     | `branch_of`          | ownership | Source is branch of target     |
| Global Ultimate     | `ultimate_parent_of` | ownership | Source is ultimate parent      |
| Domestic Ultimate   | `domestic_parent_of` | ownership | Source is domestic parent      |

#### Beneficial Ownership (CMPBOL endpoint)
| DnB Type                   | raw_type              | category  | description         |
| -------------------------- | --------------------- | --------- | ------------------- |
| Ultimate Beneficial Owner  | `beneficial_owner_of` | ownership | UBO relationship    |
| Corporate Beneficial Owner | `beneficial_owner_of` | ownership | CBO relationship    |
| Direct Owner               | `shareholder_of`      | ownership | Direct shareholding |

### 3. Canonical Raw Type Taxonomy

The following canonical values are established for the `raw_type` field:

#### Supply Category
```json
{
  "supply": [
    "ships_to",
    "procures_from",
    "receives_from",
    "supplies_to",
    "carrier_of",
    "shipper_of",
    "notify_party_of"
  # Background monitoring – Selection Matrix (Blob+AFD vs Redis vs Cosmos)
  ]
  Cíl: krátký výběrový přehled pro předpočítaný graf (preloaded + delta cache) v Azure. Primárně držíme jednoduchost a rychlost z RAM.
}
  ## 1) Blob Storage + Azure Front Door (AFD) + RAM v app (doporučená volba)
  - Kdy ANO:
    - Jediný/hlavní region uživatelů; „zero/near‑zero“ runtime API; artefakty ≤ stovky MB.
    - Stačí číst baseline + diffs; runtime traversals děláme z RAM.
  - Checklist (Go‑Live):
    - [ ] Blob Static Website/Container jako origin, gzip artefakty (baseline/diffs/manifest)
    - [ ] Cache‑Control: immutable + dlouhý max‑age; ETag pro manifest
    - [ ] Atomic write: .tmp → ověř → rename; manifest až poslední
    - [ ] Orchestrátor: fallback baseline v image, hot‑reload přes ETag (If‑None‑Match)
  - Rizika: latence při cold fetch manifestu (zmírní AFD); potřeba disciplíny při publikaci.
  - Náklady: nízké (storage + egress + AFD), nejnižší provozní složitost.
```
  ## 2) Azure Cache for Redis (sdílená RAM cache)
  - Kdy ANO:
    - Více replik / rychlé cold starty; sdílené adjacency mapy; min. latence μs–ms.
  - Checklist (Go‑Live):
    - [ ] Volba SKU/paměti + persistence (AOF/RDB) dle SLO
    - [ ] Klíče: entity:{id}, out:{id}, in:{id}; warm‑up job při deploy
    - [ ] Eviction policy „noeviction“; monitoring memory & hit‑rate
    - [ ] Regionální nasazení shodně s app; TLS + auth
  - Rizika: cena za RAM, správa clusteru; multi‑region replikace složitější.
  - Náklady: střední (paměťově orientované).

  ## 3) Azure Cosmos DB (NoSQL)
  - Kdy ANO:
    - Časté inkrementy a potřeba selektivního čtení per‑entity bez načtení celého grafu.
  - Checklist (Go‑Live):
    - [ ] Partition key (např. root/region/tier) + RU sizing & autoscale
    - [ ] Indexing policy, TTL dle stáří diffs; Change Feed (volitelně)
    - [ ] Konzistence (Session/Bounded Staleness) a retry policy
    - [ ] Runtime stále servuj z RAM (Cosmos primárně pro ingest/selektivní dotahy)
  - Rizika: náklady v RUs při traversals; složitější modelování.
  - Náklady: střední–vyšší (dle RU/GB/regions).
#### Ownership Category
  ## Rychlá rozhodovací rubrika
  - Potřebujeme jen rychlé čtení předpočítaného grafu ve stejném regionu? → Blob+AFD.
  - Máme mnoho replik a chceme instant warm cache? → Přidej Redis k Blob+AFD.
  - Potřebujeme selektivní čtení/časté updaty po entitách? → Zvaž Cosmos (runtime ale dál z RAM).
```json
  ## Další kroky (1–2 dny)
  - [ ] PoC měření: cold/hot start, load diffs (20k/40k) – latency, RAM, CPU
  - [ ] Runbook publikace/publish (atomicity, ETag flow, rollback)
  - [ ] Monitoring: index_version, applied_changesets, hit‑rate (AFD/Redis)
{
  "ownership": [
    "parent_of",
    "subsidiary_of",
    "shareholder_of",
    "beneficial_owner_of",
    "ultimate_parent_of",
    "domestic_parent_of",
    "partner_of",
    "branch_of"
  ]
}
```

#### Control Category
```json
{
  "control": [
    "director_of",
    "officer_of",
    "manager_of",
    "employee_of",
    "registered_agent_of",
    "legal_representative_of"
  ]
}
```

## Tier Classification Rules

### Tier Mapping Logic

The tier classification is determined by the combination of `raw_type`, relationship direction, and entity characteristics:

#### Tier 1 Classification Rules
```python
def classify_tier1(edge: RelationshipEdge, source_entity: EntityRef, target_entity: EntityRef) -> bool:
    """
    Tier 1: Direct suppliers with high-impact relationships
    """
    tier1_conditions = [
        # Direct supply relationships where source supplies to Škoda
        (edge.raw_type in ["ships_to", "supplies_to"] and target_entity.is_skoda_entity()),

        # Major ownership relationships (>25% control)
        (edge.raw_type in ["shareholder_of", "beneficial_owner_of"] and
         edge.meta.get("ownership_percentage", 0) > 25),

        # Critical supply chain partners
        (edge.raw_type == "procures_from" and
         edge.meta.get("supply_criticality") == "high")
    ]

    return any(tier1_conditions)
```

#### Tier 2 Classification Rules
```python
def classify_tier2(edge: RelationshipEdge, source_entity: EntityRef, target_entity: EntityRef) -> bool:
    """
    Tier 2: Secondary suppliers and indirect relationships
    """
    tier2_conditions = [
        # Suppliers to Tier 1 entities
        (edge.raw_type in ["ships_to", "supplies_to"] and target_entity.tier_level == 1),

        # Minority ownership relationships (5-25%)
        (edge.raw_type in ["shareholder_of", "beneficial_owner_of"] and
         5 <= edge.meta.get("ownership_percentage", 0) <= 25),

        # Logistical relationships
        (edge.raw_type in ["carrier_of", "shipper_of"])
    ]

    return any(tier2_conditions)
```

#### Tier 3 Classification Rules
```python
def classify_tier3(edge: RelationshipEdge, source_entity: EntityRef, target_entity: EntityRef) -> bool:
    """
    Tier 3: Indirect suppliers and extended network
    """
    tier3_conditions = [
        # Suppliers to Tier 2 entities
        (edge.raw_type in ["ships_to", "supplies_to"] and target_entity.tier_level == 2),

        # Small ownership stakes (<5%)
        (edge.raw_type in ["shareholder_of", "beneficial_owner_of"] and
         edge.meta.get("ownership_percentage", 0) < 5),

        # Administrative relationships
        (edge.raw_type in ["notify_party_of", "registered_agent_of"])
    ]

    return any(tier3_conditions)
```

## Changeset Edge Specification

### Edge Operations Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ntier.skoda.dev/schemas/tierindex-changeset.schema.json",
  "title": "TierIndex Changeset",
  "type": "object",
  "additionalProperties": false,
  "required": ["changeset_id", "timestamp", "operations", "metadata"],
  "properties": {
    "changeset_id": {
      "type": "string",
      "pattern": "^changeset_[0-9]{8}_[0-9]{6}_[a-f0-9]{8}$",
      "description": "Unique changeset identifier: changeset_YYYYMMDD_HHMMSS_hash"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of changeset creation"
    },
    "operations": {
      "type": "array",
      "items": { "$ref": "#/$defs/EdgeOperation" },
      "description": "List of edge operations to apply"
    },
    "metadata": {
      "type": "object",
      "additionalProperties": false,
      "required": ["applied_count", "source"],
      "properties": {
        "applied_count": { "type": "integer", "minimum": 0 },
        "source": { "type": "string", "enum": ["dnb", "sayari", "manual", "system"] },
        "confidence_threshold": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    }
  },
  "$defs": {
    "EdgeOperation": {
      "type": "object",
      "additionalProperties": false,
      "required": ["operation_type", "edge_key"],
      "properties": {
        "operation_type": {
          "type": "string",
          "enum": ["add_edge", "remove_edge", "update_edge"]
        },
        "edge_key": {
          "type": "string",
          "pattern": "^[^:]+:[^:]+:[^:]+$",
          "description": "Unique edge identifier: source_id:target_id:raw_type"
        },
        "edge_data": { "$ref": "#/$defs/RelationshipEdge" },
        "reason": {
          "type": "string",
          "description": "Human-readable reason for the operation"
        }
      }
    },
    "RelationshipEdge": {
      "type": "object",
      "additionalProperties": false,
      "required": ["source_id", "target_id", "raw_type", "category"],
      "properties": {
        "source_id": { "type": "string", "minLength": 1 },
        "target_id": { "type": "string", "minLength": 1 },
        "raw_type": {
          "type": "string",
          "enum": [
            "ships_to", "procures_from", "receives_from", "supplies_to",
            "carrier_of", "shipper_of", "notify_party_of",
            "parent_of", "subsidiary_of", "shareholder_of", "beneficial_owner_of",
            "ultimate_parent_of", "domestic_parent_of", "partner_of", "branch_of",
            "director_of", "officer_of", "manager_of", "employee_of",
            "registered_agent_of", "legal_representative_of"
          ]
        },
        "category": {
          "type": "string",
          "enum": ["supply", "ownership", "control"]
        },
        "confidence": {
          "type": "number",
          "minimum": 0.0,
          "maximum": 1.0,
          "description": "Confidence score for the relationship"
        },
        "from_date": { "type": "string", "format": "date" },
        "date": { "type": "string", "format": "date" },
        "to_date": { "type": "string", "format": "date" },
        "former": { "type": "boolean" },
        "meta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "origin": { "type": "string", "enum": ["dnb", "sayari", "internal"] },
            "endpoint": { "type": "string" },
            "source": { "type": "string" },
            "ownership_percentage": { "type": "number", "minimum": 0, "maximum": 100 },
            "supply_criticality": { "type": "string", "enum": ["low", "medium", "high"] },
            "tier_impact": { "type": "string", "enum": ["tier1", "tier2", "tier3", "none"] }
          }
        }
      }
    }
  }
}
```

### Changeset Operation Examples

#### Add Edge Operation
```json
{
  "changeset_id": "changeset_20250923_143000_a1b2c3d4",
  "timestamp": "2025-09-23T14:30:00Z",
  "operations": [
    {
      "operation_type": "add_edge",
      "edge_key": "DUNS123456789:DUNS987654321:ships_to",
      "edge_data": {
        "source_id": "DUNS123456789",
        "target_id": "DUNS987654321",
        "raw_type": "ships_to",
        "category": "supply",
        "confidence": 0.95,
        "date": "2025-09-23",
        "meta": {
          "origin": "dnb",
          "endpoint": "FamilyTreeFull",
          "supply_criticality": "high",
          "tier_impact": "tier1"
        }
      },
      "reason": "New supply relationship discovered via DnB FamilyTreeFull"
    }
  ],
  "metadata": {
    "applied_count": 1,
    "source": "dnb",
    "confidence_threshold": 0.8
  }
}
```

#### Remove Edge Operation
```json
{
  "changeset_id": "changeset_20250923_143100_b2c3d4e5",
  "timestamp": "2025-09-23T14:31:00Z",
  "operations": [
    {
      "operation_type": "remove_edge",
      "edge_key": "DUNS111222333:DUNS444555666:subsidiary_of",
      "reason": "Relationship terminated - entity sold to third party"
    }
  ],
  "metadata": {
    "applied_count": 1,
    "source": "manual"
  }
}
```

#### Update Edge Operation
```json
{
  "changeset_id": "changeset_20250923_143200_c3d4e5f6",
  "timestamp": "2025-09-23T14:32:00Z",
  "operations": [
    {
      "operation_type": "update_edge",
      "edge_key": "DUNS777888999:DUNS000111222:beneficial_owner_of",
      "edge_data": {
        "source_id": "DUNS777888999",
        "target_id": "DUNS000111222",
        "raw_type": "beneficial_owner_of",
        "category": "ownership",
        "confidence": 0.88,
        "date": "2025-09-23",
        "meta": {
          "origin": "dnb",
          "endpoint": "CMPBOL",
          "ownership_percentage": 35.7,
          "tier_impact": "tier1"
        }
      },
      "reason": "Updated ownership percentage from CMPBOL data"
    }
  ],
  "metadata": {
    "applied_count": 1,
    "source": "dnb",
    "confidence_threshold": 0.8
  }
}
```

## Validation Rules

### Edge Operation Validation

1. **Idempotency**: Each edge is uniquely identified by `edge_key = "source_id:target_id:raw_type"`
2. **No Self-References**: `source_id != target_id` for all edges
3. **Valid Entity References**: Both `source_id` and `target_id` must exist in the entity registry
4. **Category Consistency**: `raw_type` must map to the correct `category` according to the taxonomy
5. **Confidence Bounds**: `confidence` must be in range [0.0, 1.0]
6. **Date Validation**: All date fields must be valid ISO 8601 dates
7. **Meta Constraints**:
   - `ownership_percentage` only valid for ownership category edges
   - `supply_criticality` only valid for supply category edges

### Changeset Validation

1. **Unique Changeset ID**: Format `changeset_YYYYMMDD_HHMMSS_hash` must be unique
2. **Operation Limits**: Maximum 1000 operations per changeset
3. **Atomic Application**: All operations in a changeset succeed or fail together
4. **Duplicate Prevention**: No duplicate `edge_key` within a single changeset

## Implementation Notes

### Edge Key Generation
```python
def generate_edge_key(source_id: str, target_id: str, raw_type: str) -> str:
    """Generate deterministic edge key for idempotency"""
    return f"{source_id}:{target_id}:{raw_type}"
```

### Tier Reassignment Impact
When edges are added or removed, the tier classification system must:

1. **Recalculate Affected Entities**: Update tier assignments for entities whose relationships changed
2. **Cascade Updates**: Update downstream entities if upstream tier classifications change
3. **Maintain Metrics**: Update `tier1_count`, `tier2_count`, `tier3_count` in TierIndex metrics
4. **Log Changes**: Record tier reassignments in changeset metadata

### DnB/Sayari Mapping Consistency

| Source | Endpoint       | DnB/Sayari Type            | Canonical raw_type  | Category  |
| ------ | -------------- | -------------------------- | ------------------- | --------- |
| DnB    | FamilyTreeFull | Parent/Headquarters        | parent_of           | ownership |
| DnB    | FamilyTreeFull | Subsidiary                 | subsidiary_of       | ownership |
| DnB    | CMPBOL         | Ultimate Beneficial Owner  | beneficial_owner_of | ownership |
| DnB    | CMPBOL         | Corporate Beneficial Owner | beneficial_owner_of | ownership |
| Sayari | Relationships  | ships_to                   | ships_to            | supply    |
| Sayari | Relationships  | procures_from              | procures_from       | supply    |
| Sayari | Relationships  | shareholder_of             | shareholder_of      | ownership |
| Sayari | Relationships  | subsidiary_of              | subsidiary_of       | ownership |

## Error Scenarios

### Invalid Edge Operations
```json
{
  "error_type": "invalid_edge_operation",
  "changeset_id": "changeset_20250923_143300_d4e5f6g7",
  "failed_operations": [
    {
      "operation_type": "add_edge",
      "edge_key": "INVALID:INVALID:invalid_type",
      "errors": [
        "raw_type 'invalid_type' not in canonical taxonomy",
        "source_id 'INVALID' does not exist in entity registry"
      ]
    }
  ]
}
```

### Duplicate Edge Detection
```json
{
  "error_type": "duplicate_edge",
  "changeset_id": "changeset_20250923_143400_e5f6g7h8",
  "duplicate_edges": [
    "DUNS123456789:DUNS987654321:ships_to"
  ],
  "action": "skip_duplicate"
}
```

## Performance Considerations

### Memory Impact
- Each edge: ~200 bytes (JSON representation)
- 40k edges: ~8MB memory footprint
- Changeset overhead: ~5KB per changeset

### Processing Time
- Edge validation: ~0.1ms per edge
- Tier recalculation: ~1ms per affected entity
- Changeset application: ~10ms for 100 operations

## Next Steps

1. **Implement Edge Operation Processor**: Create service to apply changesets atomically
2. **Add Tier Recalculation Logic**: Implement cascade updates when edges change
3. **Create Validation Pipeline**: Build comprehensive validation for incoming changesets
4. **Develop Rollback Mechanism**: Enable reverting changeset applications
5. **Add Monitoring**: Implement metrics collection for changeset operations

## Appendix: Smoke Test Examples

### Valid Changeset (Happy Path)
```json
{
  "changeset_id": "changeset_20250923_000000_test0001",
  "timestamp": "2025-09-23T00:00:00Z",
  "operations": [
    {
      "operation_type": "add_edge",
      "edge_key": "TIER1_SUPPLIER:SKODA_AUTO:ships_to",
      "edge_data": {
        "source_id": "TIER1_SUPPLIER",
        "target_id": "SKODA_AUTO",
        "raw_type": "ships_to",
        "category": "supply",
        "confidence": 1.0
      }
    }
  ],
  "metadata": {
    "applied_count": 1,
    "source": "system"
  }
}
```

### Invalid Changeset (Error Cases)
```json
{
  "changeset_id": "changeset_20250923_000001_test0002",
  "timestamp": "2025-09-23T00:00:01Z",
  "operations": [
    {
      "operation_type": "add_edge",
      "edge_key": "INVALID:INVALID:invalid_raw_type",
      "edge_data": {
        "source_id": "INVALID",
        "target_id": "INVALID",
        "raw_type": "invalid_raw_type",
        "category": "invalid_category"
      }
    }
  ],
  "metadata": {
    "applied_count": 0,
    "source": "system"
  }
}
```

---

**Document Status**: Complete
**Last Updated**: 2025-09-23
**Next Review**: 2025-10-01
