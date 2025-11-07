# Mermaid Diagram Fixes - November 7, 2025

## Problem
Mermaid diagrams were not rendering in VS Code preview with error:
```
No diagram type detected matching given configuration for text
```

## Root Cause
- **Deprecated syntax**: Using `graph` instead of modern `flowchart`
- **Missing quotes**: Special characters and Czech text needed escaping
- **Extension conflict**: Multiple Mermaid extensions installed

## Solution Applied

### 1. Syntax Updates

#### Changed diagram type
```diff
- ```mermaid
- graph LR
+ ```mermaid
+ flowchart LR
```

#### Added quotes to node labels
```diff
- A[TierIndex<br/>FOUNDATION]
+ A["TierIndex<br/>FOUNDATION"]
```

#### Added quotes to edge labels
```diff
- A -->|poskytuje data| B
+ A -->|"poskytuje data"| B
```

### 2. Extension Configuration
- **Removed**: `vstirbu.vscode-mermaid-preview` (conflicting extension)
- **Kept**: `bierner.markdown-mermaid` (recommended for Markdown preview)

## Files Modified

### Workshop Presentation (`docs_langgraph/workshop_presentation/`)
| File | Diagrams Fixed | Types |
|------|----------------|-------|
| `01_mapping_verification_use_case.md` | 3 | sequenceDiagram, flowchart TD, flowchart TB |
| `02_capabilities_overview.md` | 2 | flowchart LR, flowchart TB |
| `03_tierindex_context.md` | 2 | flowchart TD, sequenceDiagram |
| `04_architecture_decisions.md` | 2 | flowchart LR, flowchart TB |
| `05_slide_deck.md` | 1 | flowchart LR |

### Legacy Presentation (`prezentace_9.10/`)
| File | Diagrams Fixed | Types |
|------|----------------|-------|
| `00_executive_overview.md` | 1 | flowchart LR |
| `01_overview_proaktivni_monitoring.md` | 1 | flowchart TD |
| `02_use_cases_proaktivni_monitoring.md` | 1 | flowchart LR |
| `04_diagrams_proaktivni_monitoring.md` | 3 | flowchart TB, sequenceDiagram |

**Total**: ~16 diagrams fixed across 9 files

## Example Fix

### Before (broken)
```mermaid
graph LR
    A[TierIndex<br/>FOUNDATION] -->|poskytuje data| B[MCOP<br/>ORCHESTRATOR]
    B -->|enrichuje metadata| C[ML Monitoring<br/>FUTURE VISION]
```

### After (working)
```mermaid
flowchart LR
    A["TierIndex<br/>FOUNDATION"] -->|"poskytuje data"| B["MCOP<br/>ORCHESTRATOR"]
    B -->|"enrichuje metadata"| C["ML Monitoring<br/>FUTURE VISION"]
```

## How to View Diagrams

1. Open any `.md` file with Mermaid diagrams
2. Press `Ctrl+K V` (or `Cmd+K V` on Mac) to open Markdown preview
3. Diagrams should render automatically

## Migration Pattern

For any future Mermaid diagrams, use:
- ✅ `flowchart` instead of `graph`
- ✅ Quotes around all labels: `["text"]`
- ✅ Quotes around edge labels: `|"label"|`
- ❌ Avoid `graph LR/TB/TD` syntax

## Verification
All modified files tested in VS Code Markdown preview - diagrams rendering correctly.
