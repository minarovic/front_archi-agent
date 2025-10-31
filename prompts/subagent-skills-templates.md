# Subagent + Skills templates (VS Code Copilot + Anthropic Skills)

This file provides ready-to-use prompts for combining VS Code Copilot Chat subagents with our Skills-based workflow in this repo.

Note: Subagents are currently available only in VS Code Insiders. Use the keyword `#runSubagent` to run an isolated subagent that returns a final result without intermediate turns.

## Research-heavy task (isolate context)

Prompt:

"Proveď rešerši dostupných mechanismů autentizace pro tuto aplikaci #runSubagent. Zaměř se na:
- OAuth (PKCE, confidential/public clients)
- OIDC vs. SAML
- Integrace s Azure AD/Entra ID a GitHub
- Threat model (token hijacking, refresh token rotation)

Na konci vrať:
- Tabulku variant (pro/contra, bezpečnost, složitost, UX)
- Doporučení pro náš stack (Databricks/Collibra/SAP)
- Konkrétní kroky zavedení"

Tip: Přidej explicitní výstupní formát (Markdown tabulka + checklist), aby subagent vrátil strukturovaný výsledek.

## Use Skills for deterministic checks

Po rešerši spusť naše dovednosti (Skills) pro ověření a dokumentaci:

- Backlog validator: `.claude/skills/scrum/backlog-validator/`
- LangChain compliance checker: `.claude/skills/langchain/compliance-checker/`

Doporučený prompt (v hlavním chatu nebo v dalším kroku):

"Zkontroluj, že výsledná story v `scrum/backlog/tool0-business-parser.md` má aktuální frontmatter podle šablony a pak ověř LangChain best practices v `src/tool0/parser.py`. Popiš zjištění a navrhni konkrétní úpravy."

Poznámka: Copilot subagent neumí nativně používat Anthropic Skills runtime. Pro využití obsahu Skills v VS Code chatu odkazuj na konkrétní soubory (SKILL.md, README.md) nebo zvaž zabalení opakovaných úloh do MCP nástroje.

## Mixed workflow (research → propose → validate)

1) Research (subagent):
"Zmapuj požadavky na GDPR a RLS pro naše datové zdroje #runSubagent. Výstup: seznam constraintů + návrh politik v Unity Catalog."

2) Návrh změn (hlavní chat):
"Navrhni konkrétní změny v repo (soubor, diff, proč)."

3) Validace (Skills obsah):
"Přečti `.claude/skills/langchain/compliance-checker/SKILL.md` a ověř, že `src/tool0/` odpovídá zásadám (ToolStrategy pattern, Field descriptions)."

## RAG / dokumentace (přes MCP)

Subagenti mají přístup k MCP nástrojům. Využij `docsLangchain` MCP server pro rychlé ověření vzorů LangGraph:

"Ověř v dokumentaci LangGraph (MCP) aktuální pattern pro structured output (create_agent + response_format) #runSubagent. Zapiš shrnutí a odkazy."

## Doporučení

- Subagenty používej na dlouhé rešerše a komplexní analýzy, aby zůstal hlavní chat čistý.
- Na deterministické kroky a validace drž obsah ve Skills (SKILL.md + skripty) – progresivní načítání neplýtvá kontextem.
- Pokud se opakovaně volají skripty, zvaž MCP wrapper, aby je mohl subagent spouštět přes nástroje.

---

Autor: MCOP
Verze: 2025-10-30
