# CORE Data Model – TierIndex Schemas and Rules

**Type:** CORE (Immutable Foundation)
**Version:** 1.0
**Last Updated:** 2025-10-22
**Audience:** 📊 Data Architects, 👨‍💻 Developers
**Purpose:** Define fundamental data schemas that ALL implementations MUST follow

---

## 1. Entity Schema (Dodavatel, Výrobce, Vlastník)

### Required Fields

| Field Name      | Data Type   | Constraints           | Description                                 |
| --------------- | ----------- | --------------------- | ------------------------------------------- |
| `entity_id`     | STRING(255) | PRIMARY KEY, NOT NULL | Unikátní identifikátor entity               |
| `entity_type`   | STRING(50)  | NOT NULL              | Typ entity (supplier/manufacturer/owner)    |
| `name`          | STRING(500) | NOT NULL              | Oficiální název entity                      |
| `country`       | STRING(2)   | ISO 3166-1 alpha-2    | Země působení (CZ, DE, CN, etc.)            |
| `tier_level`    | INT         | 1, 2, 3, nebo NULL    | Hierarchická úroveň (NULL = not classified) |
| `source_system` | STRING(50)  | NOT NULL              | Origin system (sayari/dnb/internal)         |

### Optional Fields (Extended Attributes)

Optional fields MAY be added by implementations but are NOT required for CORE functionality:

- `duns_number`: D&B identifier (when available)
- `sayari_id`: Sayari identifier (when available)
- `address`: Physical address
- `industry_code`: NACE/NAICS classification
- `employee_count`: Number of employees
- `revenue`: Annual revenue (currency-specific)

### Entity Type Values

**Canonical entity types:**
```json
{
  "entity_types": [
    "supplier",        // Dodavatel komponent/services
    "manufacturer",    // Výrobce/OEM
    "owner",          // Vlastník (beneficial owner, shareholder)
    "parent_company", // Mateřská společnost
    "subsidiary"      // Dceřiná společnost
  ]
}
```

### Example Entity

```json
{
  "entity_id": "DUNS_123456789",
  "entity_type": "supplier",
  "name": "Continental Automotive Czech Republic",
  "country": "CZ",
  "tier_level": 1,
  "source_system": "dnb"
}
```

---

## 2. Edge Schema (Vztah mezi entitami)

### Required Fields

| Field Name         | Data Type   | Constraints           | Description                                 |
| ------------------ | ----------- | --------------------- | ------------------------------------------- |
| `edge_id`          | STRING(255) | PRIMARY KEY, NOT NULL | Unikátní identifikátor hrany                |
| `source_entity_id` | STRING(255) | FOREIGN KEY, NOT NULL | ID zdrojové entity                          |
| `target_entity_id` | STRING(255) | FOREIGN KEY, NOT NULL | ID cílové entity                            |
| `raw_type`         | STRING(100) | NOT NULL              | Canonical edge type (viz taxonomie)         |
| `category`         | STRING(50)  | NOT NULL              | Kategorie vztahu (supply/ownership/control) |
| `direction`        | STRING(20)  | NOT NULL              | Směr vztahu (outbound/inbound)              |

### Optional Fields

- `confidence`: DECIMAL(3,2) - Confidence score (0.00-1.00)
- `from_date`: DATE - Start date of relationship
- `to_date`: DATE - End date of relationship (NULL = active)
- `former`: BOOLEAN - Historical relationship flag
- `ownership_percentage`: DECIMAL(5,2) - For ownership relationships

### Canonical Edge Types (Taxonomy)

#### Supply Category
```json
{
  "supply": [
    "ships_to",         // Source ships products to target
    "procures_from",    // Source procures from target
    "receives_from",    // Source receives from target
    "supplies_to",      // Source supplies components to target
    "carrier_of",       // Source transports for target
    "shipper_of",       // Source ships for target
    "notify_party_of"   // Source notified of target shipments
  ]
}
```

#### Ownership Category
```json
{
  "ownership": [
    "parent_of",            // Source is parent of target
    "subsidiary_of",        // Source is subsidiary of target
    "shareholder_of",       // Source holds shares in target
    "beneficial_owner_of",  // Source is beneficial owner of target
    "ultimate_parent_of",   // Source is ultimate parent of target
    "domestic_parent_of",   // Source is domestic parent of target
    "partner_of",           // Source is business partner of target
    "branch_of"             // Source is branch of target
  ]
}
```

#### Control Category
```json
{
  "control": [
    "director_of",              // Source is director at target
    "officer_of",               // Source is officer at target
    "manager_of",               // Source manages target
    "employee_of",              // Source employed by target
    "registered_agent_of",      // Source is registered agent for target
    "legal_representative_of"   // Source represents target legally
  ]
}
```

### Edge Key (Idempotency)

**Canonical format:** `source_entity_id:target_entity_id:raw_type`

**Purpose:** Unique identification for changeset operations (add/remove/update)

**Example:** `DUNS_123456789:DUNS_987654321:ships_to`

### Example Edge

```json
{
  "edge_id": "edge_20250915_001234",
  "source_entity_id": "DUNS_123456789",
  "target_entity_id": "SKODA_AUTO_CZ",
  "raw_type": "ships_to",
  "category": "supply",
  "direction": "outbound",
  "confidence": 0.95,
  "from_date": "2020-01-15"
}
```

---

## 3. Tier Assignment Schema

### Required Fields

| Field Name           | Data Type   | Constraints           | Description                         |
| -------------------- | ----------- | --------------------- | ----------------------------------- |
| `tier_assignment_id` | STRING(255) | PRIMARY KEY, NOT NULL | Unikátní identifikátor tier záznamu |
| `root_entity_id`     | STRING(255) | FOREIGN KEY, NOT NULL | Root entity (Škoda Auto)            |
| `entity_id`          | STRING(255) | FOREIGN KEY, NOT NULL | Entity being classified             |
| `tier_level`         | INT         | 1, 2, 3               | Assigned tier                       |
| `effective_from`     | DATE        | NOT NULL              | Start date of tier assignment       |

### Optional Fields

- `effective_to`: DATE - End date (NULL = current)
- `classification_reason`: STRING(500) - Why this tier was assigned
- `confidence`: DECIMAL(3,2) - Tier classification confidence

### Tier Classification Rules

#### Tier 1 Rules

**Definition:** Direct supplier to Škoda OR majority owner (>25%)

**Classification conditions (ANY of):**
```python
def is_tier1(edge, entity):
    return (
        # Direct supply to Škoda
        (edge.raw_type in ["ships_to", "supplies_to"] and
         edge.target_entity_id == SKODA_ROOT) OR

        # Majority ownership
        (edge.raw_type in ["shareholder_of", "beneficial_owner_of"] and
         edge.ownership_percentage > 25) OR

        # Critical supply partner
        (edge.category == "supply" and
         edge.meta.supply_criticality == "high")
    )
```

#### Tier 2 Rules

**Definition:** Supplier to Tier 1 entity OR minority owner (5-25%)

**Classification conditions (ANY of):**
```python
def is_tier2(edge, entity, target_tier):
    return (
        # Supply to Tier 1
        (edge.raw_type in ["ships_to", "supplies_to"] and
         target_tier == 1) OR

        # Minority ownership
        (edge.raw_type in ["shareholder_of", "beneficial_owner_of"] and
         5 <= edge.ownership_percentage <= 25) OR

        # Logistics partner
        (edge.raw_type in ["carrier_of", "shipper_of"])
    )
```

#### Tier 3 Rules

**Definition:** Supplier to Tier 2 entity OR small owner (<5%)

**Classification conditions (ANY of):**
```python
def is_tier3(edge, entity, target_tier):
    return (
        # Supply to Tier 2
        (edge.raw_type in ["ships_to", "supplies_to"] and
         target_tier == 2) OR

        # Small ownership stake
        (edge.raw_type in ["shareholder_of", "beneficial_owner_of"] and
         edge.ownership_percentage < 5) OR

        # Administrative relationship
        (edge.raw_type in ["notify_party_of", "registered_agent_of"])
    )
```

### Example Tier Assignment

```json
{
  "tier_assignment_id": "tier_20250915_001234",
  "root_entity_id": "SKODA_AUTO_CZ",
  "entity_id": "DUNS_123456789",
  "tier_level": 1,
  "effective_from": "2020-01-15",
  "classification_reason": "Direct supplier - ships_to relationship"
}
```

---

## 4. Manifest Schema (Audit Trail)

### Required Fields

| Field Name           | Data Type     | Constraints           | Description                       |
| -------------------- | ------------- | --------------------- | --------------------------------- |
| `manifest_id`        | STRING(255)   | PRIMARY KEY, NOT NULL | Unikátní identifikátor manifestu  |
| `baseline_version`   | STRING(100)   | NOT NULL              | Baseline snapshot identifier      |
| `applied_changesets` | ARRAY<STRING> | NOT NULL              | Ordered list of changeset IDs     |
| `published_at`       | TIMESTAMP     | NOT NULL              | Publication timestamp             |
| `checksum`           | STRING(64)    | NOT NULL              | SHA256 hash for integrity         |
| `status`             | STRING(50)    | NOT NULL              | Manifest status (draft/published) |

### Manifest Status Values

```json
{
  "statuses": [
    "draft",      // Manifest created but not validated
    "validated",  // Passed all quality checks
    "published",  // Live for orchestrator consumption
    "archived",   // Superseded by newer manifest
    "revoked"     // Pulled due to data quality issue
  ]
}
```

### Changeset Array Ordering

**CRITICAL:** `applied_changesets` array MUST be ordered chronologically

**Reason:** Changesets are applied sequentially - order matters for correctness

**Example:**
```json
{
  "applied_changesets": [
    "cs_20250915_0300",  // Applied first
    "cs_20250915_1500",  // Applied second
    "cs_20250916_0300"   // Applied third
  ]
}
```

### Checksum Calculation

**Algorithm:** SHA256 over concatenated baseline + changesets

```python
def calculate_manifest_checksum(baseline_version, applied_changesets):
    """
    Calculate deterministic checksum for manifest integrity verification
    """
    import hashlib

    # Concatenate baseline + changesets in order
    combined = f"{baseline_version}:{'|'.join(applied_changesets)}"

    # SHA256 hash
    return hashlib.sha256(combined.encode('utf-8')).hexdigest()
```

**Purpose:** Detect corruption or tampering

### Example Manifest

```json
{
  "manifest_id": "manifest_20250916_1500",
  "baseline_version": "TierIndex.baseline_v1",
  "applied_changesets": [
    "cs_20250915_0300",
    "cs_20250915_1500",
    "cs_20250916_0300"
  ],
  "published_at": "2025-09-16T15:00:00Z",
  "checksum": "a1b2c3d4e5f6789...",
  "status": "published"
}
```

---

## 5. Validation Rules

### Entity Validation

1. **entity_id uniqueness:** No duplicate entity_ids across snapshots
2. **country code:** Must be valid ISO 3166-1 alpha-2 (CZ, DE, CN, etc.)
3. **tier_level bounds:** NULL OR 1, 2, 3 (no other values)
4. **entity_type validity:** Must be in canonical entity_types list
5. **name non-empty:** name field cannot be empty string

### Edge Validation

1. **No self-references:** `source_entity_id != target_entity_id`
2. **Valid entity references:** Both source and target must exist in entity registry
3. **Category consistency:** `raw_type` must map to correct `category`
   - Example: `ships_to` → category MUST be `supply`
   - Example: `shareholder_of` → category MUST be `ownership`
4. **Confidence bounds:** If present, confidence MUST be [0.00, 1.00]
5. **Date logic:** If both from_date and to_date present, `from_date < to_date`
6. **Ownership percentage:** Only valid for ownership category (0-100%)

### Tier Assignment Validation

1. **Valid tier levels:** tier_level MUST be 1, 2, or 3 (no NULL)
2. **Root entity exists:** root_entity_id must reference valid entity
3. **Classified entity exists:** entity_id must reference valid entity
4. **Date validity:** effective_from must be valid date
5. **No duplicate assignments:** One entity can have only ONE active tier per root

### Manifest Validation

1. **Baseline exists:** baseline_version must reference published baseline
2. **Changesets exist:** All changeset IDs in applied_changesets must exist
3. **Chronological order:** applied_changesets MUST be ordered by timestamp
4. **Checksum match:** Calculated checksum must match stored checksum
5. **Status transition:** Valid transitions (draft→validated→published→archived)

---

## 6. Constraints and Invariants

### Referential Integrity

- Edge `source_entity_id` → Entity `entity_id` (MUST exist)
- Edge `target_entity_id` → Entity `entity_id` (MUST exist)
- Tier Assignment `root_entity_id` → Entity `entity_id` (MUST exist)
- Tier Assignment `entity_id` → Entity `entity_id` (MUST exist)

### Cascade Rules

**When entity deleted:**
- All edges referencing entity MUST be removed
- All tier assignments for entity MUST be removed

**When edge deleted:**
- Tier assignments MAY need recalculation (if tier depends on this edge)

### Uniqueness Constraints

- Entity: `entity_id` is PRIMARY KEY (unique across all snapshots)
- Edge: `edge_key` (source:target:raw_type) is unique per snapshot
- Tier Assignment: (root_entity_id, entity_id, effective_from) is unique
- Manifest: `manifest_id` is PRIMARY KEY (unique forever)

---

## Change Log

### Version 1.0 (2025-10-22)
- Initial CORE data model definition
- Entity/Edge/Tier schemas with required fields
- Canonical edge type taxonomy (supply/ownership/control)
- Tier classification rules (Tier 1/2/3 logic)
- Manifest schema with checksum verification
- Validation rules and constraints
- Extracted from: physical_model.md, background_monitoring_data_model.md
- Approved by: [Pending architect review]

---

## Related Documentation

**CORE:**
- `01_core_concepts.md` - TierIndex fundamental concepts
- `02_core_principles.md` - Why architecture decisions
- `04_core_constraints.md` - Platform requirements

**IMPLEMENTATION:**
- `physical_model.md` - Delta Lake implementation (partitioning, Z-ORDER)
- `background_monitoring_data_model.md` - Extended attributes, metadata

---

**📖 Read Time:** ~18 minutes
**✅ Self-Contained:** Complete schema definitions included
**🔒 Change Control:** Architect approval + CHANGELOG entry + migration guide required
