# Metadata Copilot – Post-MVP Backlog

## Bezpečnost a Governance
- **Tool 4 – Bezpečnostní Analyzátor:** Detekce `securityClassification`, PII tagů a návrh RLS politik.
- `security_report.md` – strukturovaný výstup s doporučením RLS a klasifikací dat.

## Artefakty & Vizualizace
- **Tool 5 – Generátor ER Diagramu:** Tvorba Mermaid diagramu (`diagram.md`).
- **Tool 6 – Generátor Skriptů:** RAG generování Power Query (M) a SQL dotazů (`query.m`).

## Rozšířená Orchestrace
- Multi-agentní topologie (Supervisor + Specialist Agents pro Modeling, Quality, Security).
- Router logika pro dynamické rozhodování podle typu požadavku (BA vs. BS, reporting vs. compliance).

## Kvalita a Autonomie
- Automatická validace výstupů (unit/regression testy nad referenčními metadaty).
- Monitoring kvality vstupních exportů a upozornění na nekompletnost dat.
- Vylepšená heuristika pro kategorizaci faktů/dimenzí (přidání ML/embedding podpory).

## Integrace & UX
- CLI/REST wrapper pro spouštění agenta s parametry projektu.
- Integrace s interní wiki / ticketing systémem pro vytváření následných úkolů.
