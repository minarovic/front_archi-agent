# CORE Concepts – TierIndex Fundamental Architecture

**Type:** CORE (Immutable Foundation)
**Version:** 1.0
**Last Updated:** 2025-10-22
**Audience:** 📊 Architects, 👨‍💻 Developers, 👨‍💼 Business
**Purpose:** Define fundamental TierIndex concepts that do NOT change with implementation details

---

## 1. What IS TierIndex?

**TierIndex** je předpočítaný dodavatelský graf pro Škoda Auto, který zachycuje vztahy mezi entitami (supplier, manufacturers, owners) napříč Tier 1, Tier 2, a Tier 3 hierarchií.

### Klíčové charakteristiky:
- **Předpočítaný (pre-computed):** Graf je připravený v advance, ne real-time
- **Verz ovaný:** Každá změna je auditovatelná přes Baseline + Changesety
- **Read-only pro runtime:** Orchestrátor čte hotový graf, nepočítá ho za běhu
- **Business-ready:** Data jsou normalizovaná, validated, připravená pro API

---

## 2. Fundamental Data Structures

### Entity (Dodavatel, Výrobce, Vlastník)

**Definice:** Subjekt v dodavatelském řetězci s unikátní identifikací.

**Příklady:**
- Tier 1 supplier dodávající přímo do Škoda výroby
- Tier 2 subdodavatel poskytující komponenty Tier 1
- Beneficial owner s majoritním podílem v Tier 1 entitě

**Základní atributy:**
- Unikátní identifikátor (entity_id)
- Název a země působení
- Typ entity (supplier, manufacturer, owner)
- Tier level (1, 2, 3)

### Edge (Vztah mezi entitami)

**Definice:** Směrovaný vztah mezi dvěma entitami reprezentující business connection.

**Kategorie vztahů:**
1. **Supply:** Dodavatelské vztahy (ships_to, procures_from)
2. **Ownership:** Vlastnické vztahy (shareholder_of, beneficial_owner_of)
3. **Control:** Řídící vztahy (director_of, officer_of)

**Základní atributy:**
- Source entity ID (odkud vztah vede)
- Target entity ID (kam vztah vede)
- Typ vztahu (raw_type)
- Kategorie (supply/ownership/control)

### Tier (Hierarchická úroveň)

**Definice:** Hierarchická pozice entity vzhledem k Škoda Auto jako root entitě.

**Tier klasifikace:**
- **Tier 1:** Přímý dodavatel do Škoda (ships_to Škoda, >25% ownership)
- **Tier 2:** Subdodavatel Tier 1 entity (ships_to Tier 1, 5-25% ownership)
- **Tier 3:** Subdodavatel Tier 2 entity (ships_to Tier 2, <5% ownership)

---

## 3. Baseline + Changeset Architecture

### Baseline (Referenční snapshot)

**Definice:** Kompletní snapshot TierIndex grafu v daný moment.

**Obsahuje:**
- Všechny entity s jejich atributy
- Všechny edges mezi entitami
- Všechny tier assignments pro root entity (Škoda)
- Metadata: baseline_version, snapshot_date, checksum

**Účel:**
- Výchozí bod pro všechny dotazy
- Rollback point při chybách
- Auditní trail pro compliance

**Příklad identifikátoru:** `TierIndex.baseline_v1` (2025-09-15)

### Changeset (Inkrementální změna)

**Definice:** Sada operací (add/remove/update) aplikovaných nad baseline.

**Obsahuje:**
- Seznam operací (edge operations)
- Timestamp a changeset_id
- Metadata: source (dnb/sayari/manual), applied_count

**Účel:**
- Rychlá aktualizace bez full recompute
- Historie změn (kdo, kdy, proč)
- Možnost rollback jednotlivých changesetů

**Příklad identifikátoru:** `cs_20250916_1430` (changeset z 16.9.2025 14:30)

### Manifest (Audit Trail)

**Definice:** Záznam o aktuálně publikované kombinaci baseline + aplikovaných changesetů.

**Obsahuje:**
- baseline_version (odkaz na použitý baseline)
- applied_changesets (seznam changeset IDs v pořadí aplikace)
- published_at (timestamp publikace)
- checksum (SHA256 pro verifikaci integrity)

**Účel:**
- Garantovat reprodukovatelnost (stejný manifest = stejný graf)
- Auditní trail pro compliance
- Detekce corruption (checksum mismatch)

**Příklad:**
```json
{
  "manifest_id": "manifest_20250916_1500",
  "baseline_version": "TierIndex.baseline_v1",
  "applied_changesets": ["cs_20250916_1430", "cs_20250916_1445"],
  "published_at": "2025-09-16T15:00:00Z",
  "checksum": "a1b2c3d4e5f6..."
}
```

---

## 4. Scope Boundaries

### Co JE v TierIndex scope:

✅ **Entity model:** Dodavatelé, výrobci, owners v Škoda supply chain
✅ **Relationship model:** Supply/ownership/control relationships
✅ **Tier hierarchy:** Klasifikace Tier 1/2/3 vzhledem ke Škoda
✅ **Versioning:** Baseline + changeset lifecycle
✅ **Audit trail:** Manifest, checksums, lineage tracking

### Co NENÍ v TierIndex scope:

❌ **Real-time computation:** Graf je předpočítaný, ne live query
❌ **Frontend UI:** TierIndex je datový layer, ne aplikace
❌ **External API integration:** Sayari/D&B jsou source systems, ne součást TierIndex
❌ **ML predictions:** Predikční modely jsou konzumenti TierIndex, ne jeho součást
❌ **Business metrics:** Calculated metrics (SPOF score, Combined Risk) jsou odvozené, ne core

---

## 5. Key Principles

### Pre-computing (ne real-time)

**Proč předpočítávat:**
- Rekurzivní graf traversal je výpočetně nákladný (Tier 3 může mít 1000+ upstream entit)
- SLA requirements: <100ms API latency není možné s live graph traversal
- Konzistence: Všichni uživatelé vidí stejný snapshot (ne partial/inconsistent data)

**Trade-off:**
- Předpočítání: 4-6 hodin (weekly full baseline recalculation)
- Runtime: <100ms API response (read-only from pre-computed graph)

### Versioning (auditability)

**Proč verzovat:**
- Compliance: Musíme dokázat, že odpověď z 15.9.2025 14:30 byla správná podle dat v ten moment
- Rollback: Při chybě můžeme vrátit na poslední validní manifest
- Testování: QA team může replikovat production data z manifestu

**Mechanismus:**
- Baseline = major version (týdenní recompute)
- Changeset = minor version (denní incremental update)
- Manifest = audit record (baseline + changesets snapshot)

### Read-Only Runtime

**Proč read-only:**
- Orchestrátor nesmí měnit TierIndex za běhu (riziko inconsistency)
- Všechny změny jdou přes controlled changeset workflow
- Separation of concerns: Data team spravuje TierIndex, orchestrátor ho konzumuje

**Benefit:**
- Paralelní dotazy bez race conditions
- Caching friendly (immutable data = perfect for CDN/Redis)
- Rollback friendly (žádné side-effects při runtime)

---

## 6. Relationship to Other Systems

### TierIndex ≠ Source Systems

- **Sayari API:** External data provider (ownership, relationships)
- **D&B API:** External data provider (company profiles, financials)
- **Škoda master data:** Internal data source (Tier 1 suppliers list)

**TierIndex role:** Integrátor a normalizátor across source systems

### TierIndex ≠ Runtime Orchestrator

- **Orchestrator:** LangGraph agent answering business questions
- **TierIndex:** Pre-computed graph powering orchestrator

**Separation:** Orchestrator čte TierIndex, nepočítá ho

### TierIndex ≠ Frontend Application

- **Frontend:** React app pro business users
- **TierIndex:** API backend serving graph data

**Separation:** Frontend konzumuje TierIndex přes API, neupravuje ho přímo

---

## 7. Consistency Guarantees

### Atomicity (Changeset Application)

- Changeset se aplikuje atomicky: buď všechny operace, nebo žádná
- Partial application není možná (riziko inconsistent state)
- Failed changeset = rollback + error log

### Idempotency (Re-application Safety)

- Stejný changeset aplikovaný 2× = stejný výsledek (no side-effects)
- Edge operations jsou deterministic (edge_key = source_id:target_id:raw_type)
- Manifest checksum detekuje accidental re-application

### Eventual Consistency (Source Updates)

- Sayari/D&B update → Bronze ingestion → Silver normalization → Gold baseline
- Latency: 24 hours (daily full refresh) OR 15 minutes (changeset application)
- Trade-off: Freshness vs. performance (ne real-time, ale predictable SLA)

---

## Change Log

### Version 1.0 (2025-10-22)
- Initial CORE concepts definition
- Extracted from: tierindex_slovnik_pojmu.md, physical_model.md, background_monitoring.md
- Approved by: [Pending architect review]

---

## Related Documentation

**IMPLEMENTATION (Mutable):**
- `physical_model.md` - Delta Lake tables, partitioning, Z-ORDER
- `SLA.md` - Performance targets, availability numbers
- `background_monitoring/` - Runtime monitoring implementation

**ORGANIZATIONAL (Temporary):**
- Workshop briefs, meeting notes, presentations

---

**📖 Read Time:** ~15 minutes
**✅ Self-Contained:** No external references required
**🔒 Change Control:** Architect approval + CHANGELOG entry required
