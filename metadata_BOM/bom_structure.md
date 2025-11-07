# TI-Syncro Variant BOM Handbook for LLM Database Design

## 1. Scope and Context
- TI-Syncro (project DSL) is the integrated product data environment that links development, logistics, and production at Skoda Auto.
- The Variant Structural BOM (VSS) in the Technical Information System (TIS) captures engineering usage locations, configurable nodes, and PR-driven rules.
- Hand-over-to-Manufacturing (H2M) transfers validated VSS data into production views and applies plant-specific filters.
- The Production Structural BOM (P-SSL) and Production Baukasten (P-BK) extend the data with color, logistics, and material flow attributes for every plant.
- This handbook consolidates the domain knowledge so an LLM can construct a relational data model without encountering duplicate or conflicting statements.

### 1.1 Core applications and ownership
| Application | Description | Primary responsibilities | Owning department |
| --- | --- | --- | --- |
| TIS / VSS | Engineering view of the Variant Structural BOM | Create and maintain nodes, variants, and PR descriptions for development | ESD |
| E-BK Cockpit | Engineering Baukasten management | Create, release, and hand over development kits (E-BK) | ESD |
| H2M Cockpit | Hand-over-to-manufacturing workflow | Configure filters, trigger nightly conversion from VSS to P-SSL | PPS-1 |
| P-SSL Cockpit | Production structural BOM management | Aggregate plant BOMs, integrate color, taufung, timing data | PLV |
| P-BK Cockpit | Production Baukasten management | Maintain production kits (P-BK) and logistics adjustments | PLV |
| MF Cockpit | Taufung (material flow) management | Register sourcing paths and depth-of-manufacture data | PPS-1 |
| Farb Cockpit | Color cockpit | Assign color variants to reference vehicles and kits | ESD |
| Termin Cockpit | Timing cockpit | Control engineering and production milestone dates (TS1, TS2, TS3, TE) | PLV |
| MPS Cockpit | Material and raw material planning | Plan sheet metal, bar stock, and other internal supplies | PKG / PPx / PFx |
| MARA / TEIVON | Material master system | Create and approve part numbers and master attributes | ESD |

### 1.2 BOM perspectives
| Perspective | Description | Data source | Notes |
| --- | --- | --- | --- |
| Variant Structural BOM (VSS) | Engineering structure with configurable usage locations and PR logic | TIS | Source for H2M conversion |
| Production Structural BOM (P-SSL) | Plant-specific BOM enriched with color, logistics, and taufung | P-SSL Cockpit | Updated nightly from VSS |
| Engineering Baukasten (E-BK) | Development kits released for manufacturing | E-BK Cockpit | Auto-converted to P-BK after release |
| Production Baukasten (P-BK) | Production kits used for planning and logistics | P-BK Cockpit | Receives E-BK via E2P interface |
| Reference vehicle view | Colorised BOMs for representative vehicles | Farb Cockpit | Supports visualization and validation |

## 2. Node types in the Variant Structural BOM
Each node identifies a usage location rather than a physical part. Nodes organize the tree, host variants, and reference materials through PR-controlled assignments.

### 2.1 Node summary
| Code | Name | Purpose | Naming convention | Typical children |
| --- | --- | --- | --- | --- |
| VSTUP | Entry node | Root node for a vehicle or aggregate class | Vehicle/aggregate class code (e.g., 3V0) | MIO, Structural |
| MIO | Millionen-Varianten node | Usage location without a fixed part number; groups many potential variants | Middle group plus part suffix of representative variants; assembly areas start with 890_xxx or 000_000 | Structural, PBE, MK |
| S | Structural node | Usage location with definitive part numbers that is still decomposed | Middle group + suffix of assigned part number | Structural, PBE, MK |
| PBE | Produkt-Basis-Ebene | Lowest structural level; no further decomposition | Middle group + suffix of assigned part | Variant (material) |
| DUM | Dummy node | Virtual node introduced for structuring and clarity | Prefix `DUM_` + descriptive text | Structural, PBE, MK |
| MK | Montage block | Collects items belonging to multiple usage locations (e.g., fasteners) | Middle group + suffix + `_MK` | Variant (material) |
| EXT | External node | References structures maintained outside the current BOM | External reference identifier | Structural, PBE |
| VAR | Position variant | Represents a configuration option under a node | Numeric sequence (100, 200, 300, ...) | Material assignments |

### 2.2 Node details

#### Entry node
- Represents the highest entry into the BOM for a vehicle series or aggregate.
- Name equals the product class (example: `3V0` -> Skoda Superb).
- Usually has exactly one variant; assigned material must be flagged as configurable.
- MBT (Modellbeschreibung Technik) rules are stored on the variant.

#### MIO node
- Used where no unique part numbers exist; supports millions of combinations.
- Also acts as a structuring container for assembly areas or Sammler nodes.
- Variant records act as proxies for groups of configurations.
- Naming follows the dominant part number pattern or `890_xxx` for assembly areas.

#### Structural node (S)
- Identifies a usage location with clear part numbers but still decomposed lower.
- Bundles all variants for completeness checks and reporting.
- May contain subordinate structural nodes, PBE nodes, or montage blocks.

#### PBE node
- Leaf-level usage location without further structural breakdown.
- Contains individual parts, purchased assemblies, or E-Baukasten variants.
- Sum of all PBE nodes uniquely defines a product configuration.

#### Dummy node
- Audi-specific virtual node used purely for structuring.
- Displayed without an arrow head in TI-Syncro.
- Does not carry materials directly but can host subordinate nodes.

#### Montage block (MK)
- Groups parts that belong to several usage locations, such as fasteners.
- Helps logistics collect reusable bundles across nodes.
- Naming pattern appends `_MK` to the base identifier.

#### External node
- Represents connections to externally maintained structures or supplier kits.
- Stores reference IDs and mapping metadata instead of local variants.

#### Position variant
- Comparable to a takt in the assembly structure.
- Numbering typically uses increments of 100 (100, 200, 300, ...).
- Variants hold PR descriptions, quantities, statuses, and history (sequence records).

## 3. Position-level data

### 3.1 Material master (MARA / TEIVON)
Material data define the component independently of usage. Store them once per material number.

| Attribute | Description |
| --- | --- |
| `material_number` | Unique part number entered without spaces (`3V0.955.665` shown with dots for readability) |
| `material_type` | Differentiates single parts, assemblies, kits |
| `material_group` | Purchasing/material group classification |
| `description_long` | Official material description |
| `component_kind` | Part vs assembly indicator |
| `quality_indicator` | Quality group or inspection requirement |
| `weight_gross` / `weight_net` | Available in multiple weight categories |
| `supplier_code` | Primary supplier or manufacturing plant |
| `color_relevance_flag` | Indicates dependency on color (Farbrelevanzkennzeichen) |
| `type_test_flag` | Marks relevance for regulatory testing (Typpruefrelevanzkennzeichen) |
| `drawing_number` / `drawing_date` | Latest approved drawing metadata |
| `bmg_status` | Approval status of the construction sample (BMG) |
| `ebk_reference` | Link to E-Baukasten if part of a kit |

### 3.2 Structural data (usage in VSS / P-SSL)
Structural data describe how a material is used on a specific node variant.

| Attribute | Description |
| --- | --- |
| `product_class_code` | Vehicle or aggregate class (entry node) |
| `plant_code` | Manufacturing plant receiving the data (P-SSL / P-BK) |
| `node_id` | Identifier of the usage location |
| `node_type` | Entry, MIO, Structural, PBE, Dummy, MK, External |
| `variant_code` | Position variant number (100, 200, ...) |
| `sequence_no` | Sequence identifier for change history |
| `pr_description` | Beziehungswissen / PR rule controlling validity |
| `quantity` | Quantity per usage location |
| `uom` | Unit of measure |
| `release_status` | Status values (e.g., engineering `E`, released `1`) |
| `valid_from` / `valid_to` | Effectivity window |
| `taufung_path_id` | Material flow routing reference |
| `color_code` | Link to colour assignments for P-SSL |
| `termin_key` | Timing key (TS1, TS2, TS3, TE) |
| `change_doc_id` | Reference to change documents or MBOM approvals |

### 3.3 Variant management artifacts
- **Sequence**: Captures chronological changes for a node variant; used to reconstruct history.
- **Splittstand**: Automatically generated record when a PR description with logical OR splits into multiple physical variants.
- **Variant history**: Maintains release trajectory, responsible engineer, and timestamps.
- **Variant-to-module links**: Identify which cockpit controls the variant attributes.

## 4. Core data entities and relationships

### 4.1 Product class
- Represents a vehicle series or aggregate that anchors a BOM.
- Attributes: `class_code`, `description`, `lifecycle_status`, `responsible_department`.
- One product class owns one entry node.

### 4.2 BOM node
- Stores hierarchy: `node_id`, `parent_node_id`, `node_type`, `node_code`, `name`.
- Foreign keys: `product_class_id`, `module_owner_id`.
- Supports adjacency list (parent-child), path enumeration, or closure table for queries.

### 4.3 Node variant
- Attributes: `node_variant_id`, `node_id`, `variant_code`, `sequence_no`, `release_status`, `valid_from`, `valid_to`.
- Holds relationships to materials, PR rules, timing, and taufung.
- History tables capture prior versions.

### 4.4 Material
- References the shared material master (`material_id`, `material_number`, `description_long`, etc.).
- Linked to node variants through usage assignments.

### 4.5 Usage assignment (node-material relationship)
- Junction entity with `node_variant_id`, `material_id`, `quantity`, `uom`, `scrap_factor`, `assembly_notes`.
- Stores `pr_rule_id`, `color_code`, `taufung_path_id`, `termin_key`.

### 4.6 PR rule (Beziehungswissen / TEGUE)
- Defines conditional logic controlling whether a material is installed.
- Attributes: `pr_rule_id`, `expression_raw`, `expression_normalized`, `source_module`, `mbt_reference`.
- Optional child records for atomic PR numbers (`pr_rule_conditions`).

### 4.7 Documents and approvals
- `documents`: `document_id`, `doc_number`, `doc_type`, `version`, `status`.
- `node_documents`: links documents to nodes or variants (`role`: drawing, release note, MBT).
- Supports traceability for audits.

### 4.8 Modules and ownership
- `modules`: `module_id`, `name`, `scope`, `owning_department`.
- `node_module_roles`: identifies which module governs which attribute set (e.g., Farb controls `color_code`).

### 4.9 Lifecycle events
- Capture milestones such as H2M conversion, P-SSL update, production release.
- Attributes: `event_id`, `node_variant_id`, `event_type`, `source_module`, `event_timestamp`, `status_before`, `status_after`.

## 5. Lifecycle and cockpit interactions
1. **Development authoring (TIS / VSS)**  
   Engineering creates entry nodes, MIO/structural breakdown, variants, and PR rules. Materials must exist in MARA/TEIVON before they can be assigned.
2. **Engineering kits (E-BK)**  
   Development Baukasten collect related parts. Upon release (`veroeffentlicht`) and assignment of a manufacturing plant, the system triggers automatic creation of production kits (P-BK).
3. **Hand-over-to-manufacturing (H2M)**  
   H2M cockpit applies plant filters, validates completeness, and initiates nightly conversions from VSS data to plant BOMs (P-SSL). Configuration covers product classes and target plants.
4. **Production enrichment (P-SSL & P-BK)**  
   Logistics teams adjust plant BOMs, apply color, taufung, and timing data. P-BK cockpit enables planning functions and consumption calculations.
5. **Supporting modules**  
   - **MF cockpit** maintains taufung (material flow) paths and production depth.  
   - **Farb cockpit** assigns colour variants to reference vehicles and kits.  
   - **Termin cockpit** manages milestone dates (TS1, TS2, TS3, TE) for components.  
   - **MPS cockpit** plans raw materials and feeds sourcing data into P-BK.

## 6. Database modeling blueprint

### 6.1 Recommended tables
| Table | Key columns | Purpose | Notes |
| --- | --- | --- | --- |
| `product_classes` | `product_class_id` (PK), `class_code`, `description`, `lifecycle_status` | Represents vehicle or aggregate classes | `class_code` matches entry node name |
| `modules` | `module_id`, `name`, `scope`, `owning_department` | Catalogue of TI-Syncro cockpits and systems | Supports governance links |
| `bom_nodes` | `node_id` (PK), `product_class_id` (FK), `parent_node_id`, `node_type`, `node_code`, `name`, `module_id` | Stores hierarchy of usage locations | Use adjacency list plus computed path |
| `node_variants` | `node_variant_id`, `node_id`, `variant_code`, `sequence_no`, `release_status`, `valid_from`, `valid_to` | Captures configuration options under each node | `variant_code` numeric, increments of 100 |
| `variant_history` | `history_id`, `node_variant_id`, `sequence_no`, `change_doc_id`, `changed_by`, `changed_at`, `status` | Persists historical states | Sequence aligns with TIS |
| `materials` | `material_id`, `material_number`, `material_type`, `material_group`, `description_long`, `weight_gross`, `weight_net`, `supplier_code`, `color_relevance_flag`, `type_test_flag`, `drawing_number`, `drawing_date`, `bmg_status` | Mirrors MARA master data | Accept updates from TEIVON |
| `node_materials` | `node_material_id`, `node_variant_id`, `material_id`, `quantity`, `uom`, `scrap_factor`, `assembly_notes`, `pr_rule_id`, `color_code`, `taufung_path_id`, `termin_key` | Junction table linking variants to materials | Supports effectivity and logistics fields |
| `pr_rules` | `pr_rule_id`, `node_variant_id`, `expression_raw`, `expression_normalized`, `source_module`, `mbt_reference` | Stores Beziehungswissen expressions | Normalize syntax for evaluation |
| `pr_rule_conditions` | `condition_id`, `pr_rule_id`, `pr_number`, `operator`, `value`, `logical_group` | Breaks PR expressions into atomic tokens | Enables rule analytics |
| `taufung_paths` | `taufung_path_id`, `description`, `source_location`, `target_location`, `depth_of_manufacture_flag` | Represents material flow routes | Owned by MF cockpit |
| `color_assignments` | `color_assignment_id`, `color_code`, `description`, `reference_vehicle_id`, `source_module` | Captures Farb cockpit results | Connect to `node_materials` |
| `termin_controls` | `termin_id`, `termin_key`, `milestone_type`, `planned_date`, `responsible` | Timing data from Termin cockpit | Link by `termin_key` |
| `documents` | `document_id`, `doc_number`, `doc_type`, `version`, `status`, `source_system` | Engineering and release documents | Connect to nodes or materials |
| `node_documents` | `node_document_id`, `node_id`, `document_id`, `role`, `valid_from`, `valid_to` | Traceability between BOM and documents | Role examples: drawing, release note |
| `lifecycle_events` | `event_id`, `node_variant_id`, `event_type`, `source_module`, `event_timestamp`, `status_before`, `status_after` | Captures handover, approvals, conversions | Supports auditing |
| `module_permissions` | `permission_id`, `module_id`, `attribute_name`, `control_level` | Defines which module governs which attribute | Prevents conflicting updates |

### 6.2 Relationship map
- `product_classes` 1..n `bom_nodes`; root node flagged with `node_type = VSTUP`.
- `bom_nodes` self-reference via `parent_node_id` to build the hierarchy.
- `bom_nodes` 1..n `node_variants`; each variant unique per node and sequence.
- `node_variants` 1..n `node_materials`; each record references a `material`.
- `node_materials` optionally reference `pr_rules`, `taufung_paths`, `color_assignments`, and `termin_controls`.
- `pr_rules` can have many `pr_rule_conditions`.
- `modules` connect to `bom_nodes`, `node_variants`, and attribute governance through `module_permissions`.
- `documents` link to nodes, variants, materials, and lifecycle events for traceability.
- `lifecycle_events` reference the affected `node_variant` and the originating `module`.

### 6.3 Implementation tips
- Store raw PR expressions exactly as entered, then maintain a normalized form for evaluation by rule engines.
- Apply surrogate keys for internal tables while preserving natural keys (`material_number`, `class_code`, `node_code`) for integration.
- Use temporal tables or validity columns (`valid_from`, `valid_to`) to mirror TI-Syncro history behaviour.
- Pre-compute hierarchical paths or use closure tables to accelerate tree traversal queries.
- Enforce uniqueness on (`node_id`, `variant_code`, `sequence_no`) and on (`material_number`) to avoid conflicting records.

## 7. Data governance and business rules
- Materials must exist and be approved in MARA/TEIVON before they can be assigned to VSS nodes.
- Entry nodes carry configurable materials and must include MBT rule references.
- Naming rules: MIO nodes follow the dominant part number group; assembly areas use `890_xxx`; complete vehicle Sammler use `000_000`.
- Variant codes are numeric and unique within a node; reserve gaps (100 increments) for future inserts.
- Splittstand records originate from logical OR conditions and must be preserved to retain PR semantics.
- Release statuses (`E`, `1`, etc.) control visibility in downstream cockpits; database constraints should reflect allowed transitions.
- Taufung, color, and timing attributes are owned by their respective cockpits; changes require module-level authorization.
- Nightly H2M conversions should be logged as lifecycle events with source `H2M`.

## 8. Glossary and abbreviations
- **BMG**: Approval status of the construction sample.
- **BOM**: Bill of Material.
- **DSL**: Durchgaengiger Stuecklistenlauf, TI-Syncro programme name.
- **E-BK**: Engineering Baukasten, development kit.
- **H2M**: Handover to Manufacturing, conversion process from VSS to P-SSL.
- **MBT**: Modellbeschreibung Technik, technical model description rules.
- **MIO node**: Millionen-Varianten node for high-variance usage locations.
- **P-BK**: Production Baukasten used for logistics planning.
- **P-SSL**: Produktionsstrukturliste, production structural BOM.
- **PBE node**: Produkt-Basis-Ebene, lowest structural level.
- **PR rule**: Beziehungswissen describing installation conditions.
- **Splittstand**: Automatically created variant after splitting PR logic.
- **Taufung**: Material flow path from supplier to usage location.
- **TIS**: Technisches Informationssystem containing the Variant Structural BOM.
- **Variant**: Position-level entry controlling materials via PR rules.
