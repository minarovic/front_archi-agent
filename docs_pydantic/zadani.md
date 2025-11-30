### **Funkční Specifikace: Metadata Copilot (LangGraph Agent)**

Toto je zadání pro vývoj AI agenta "Metadata Copilot", jehož cílem je automatizovaná analýza metadat datamartů.

#### **1\. Cíl a Architektura**

Cílem je vytvořit agenta, který funguje jako **inteligentní orchestrátor s RAG schopnostmi** \[cite: 'Popis cíle pro LLM Copilot agenta', 'Ahoj, Marek\!'\]. Agent musí porovnat **business požadavek** (co žadatel chce) s **technickou realitou** (co je v datových katalozích) a vygenerovat analýzu a artefakty.
Architektura musí být postavena jako **orchestrátor** (např. pomocí **LangGraph** \[cite: 'Tech stack v průběhu všech verzí: LangGraph (orchestrace)'\]), který volá různé deterministické nástroje a specializované LLM (RAG) k analýze a generování výstupů \[cite: 'Pro generování textů, SQL/M dotazů a vysvětlení využij RAG nad interními standardy.'\]. Agent **musí používat deterministické kroky** pro ingest, normalizaci a základní analýzu \[cite: 'Jak máš pracovat:'\].
Finální architektura musí být modulární, aby v budoucnu podporovala rozdělení na specializované sub-agenty (Modeling, Quality, Security) řízené centrálním supervisorem \[cite: 'v1.4 — Multi‑agent (dělení odpovědností)', 'Router/Supervisor v LangGraphu...'\].

#### **2\. Vstupní Data (Dva zdroje)**

Agent zpracovává dva primární typy vstupů, které musí umět propojit:
**A. Business Kontext (Požadavek na projekt)**

* **Formát:** Textový dokument nebo Markdown obsahující vyplněnou šablonu "Požadavek na datový projekt".
* **Účel:** Pochopení cíle, rozsahu a klíčových business entit.
* **Klíčové Atributy ke Zpracování:**
  * Cíl a účel projektu: Proč se projekt dělá.
  * Rozsah / hranice: Co je a co není součástí (např. "pouze BS nákup", "nezahrnuje BA").
  * Klíčové entity a atributy: Jaké business pojmy žadatel zmínil (např. "objednávky", "dodavatelé").
  * Zdroje dat: Jaké systémy žadatel očekává (např. "SAP").

**B. Technická Metadata (Datové Katalogy)**

* **Formát:** Offline metadata exporty ve formátu **JSON** nebo **XML** \[cite: 15, 'Vstupy:'\].
* **Referenční Vstup:** Prototypovým vstupem je soubor BA-BS\_Datamarts\_scanned\_metadata\_extration.json.
* **Cílové Systémy:** Collibra, Databricks Unity Catalog, SAP.
* **Klíčové Atributy ke Zpracování:**
  * fullName a displayName: Pro technickou identifikaci a filtrování.
  * id a Hierarcy Relation: Pro mapování technických vztahů \[cite: '...dimv\_bs\_purchase\_ekl\_created\_date'\].
  * typeName: Pro rozlišení typů objektů (Schema, View, Column).
  * articulationScore a validationResult: Pro hodnocení kvality governance \[cite: 17, 'Vyhodnotit kvalitu...'\].
  * securityClassification, sourceTags: Pro bezpečnostní analýzu \[cite: 18, 'Provést bezpečnostní...'\].
  * description a descriptionFromSourceSystem: Pro sémantickou analýzu.

#### **3\. Komponenty a Nástroje (Agent Tools)**

Agent v LangChain/LangGraph bude potřebovat sadu definovaných nástrojů (funkcí):

* **Tool 0: Analyzátor Požadavků (RAG-LLM)**
  * **Nový nástroj:** Funkce pro načtení a parsování textového/Markdown dokumentu "Požadavek na datový projekt". Musí extrahovat klíčové entity, cíle a rozsah do strukturované podoby (např. JSON).
* **Tool 1: Datové Konektory (Ingest)**
  * Funkce pro načtení a parsování vstupních JSON/XML z katalogů \[cite: 15, 'Vstupy:'\]. Musí být schopna **filtrovat** metadata na základě kontextu získaného z Tool 0\.
* **Tool 2: Strukturální Analyzátor (Deterministický)**
  * Funkce, která projde *filtrovaná* metadata a identifikuje vztahy \[cite: '...dimv\_bs\_purchase\_ekl\_created\_date'\].
  * Aplikuje heuristiku pro rozpoznání **faktových a dimenzionálních tabulek** \[cite: 16, 'Identifikovat strukturu...'\].
* **Tool 3: Analyzátor Kvality (Deterministický)**
  * Funkce, která extrahuje **validationResult** a **articulationScore** \[cite: 17, 'Vyhodnotit kvalitu...'\] pro relevantní objekty.
  * Detekuje anomálie jako **"Missing from source"** \[cite: 17, 'Vyhodnotit kvalitu...'\].
* **Tool 4: Bezpečnostní Analyzátor (Deterministický)**
  * Funkce, která skenuje metadata a hledá **securityClassification**, tagy **PII** nebo **sensitive** \[cite: 18, 'Provést bezpečnostní...'\].
* **Tool 5: Generátor ER Diagramu (Tool)**
  * Funkce, která generuje kód v syntaxi **Mermaid** \[cite: 19, 'Generovat artefakty:', 'ER diagram ve formátu Mermaid'\] na základě výstupu Tool 2\.
* **Tool 6: Generátor Skriptů (RAG-LLM)**
  * Funkce, která volá LLM (obohatí RAG o business kontext z Tool 0\) pro generování **Power Query (M) skriptů** \[cite: 'Generovat artefakty:', 'Power Query (M) skript'\] a SQL dotazů.
* **Tool 7: Generátor Reportů (RAG-LLM)**
  * Funkce, která volá LLM (obohatí RAG o business kontext z Tool 0\) pro sepsání **Governance reportu** (v JSON/Markdown) \[cite: 'Generovat artefakty:', 'Governance report (JSON/Markdown)'\] a návrhu **RLS** \[cite: 18, 'Navrhnout RLS...'\]. Tento report musí **porovnat očekávání** (z Tool 0\) s **realitou** (z Tool 3 a 4).

#### **4\. Základní Logika Grafu (Agent Workflow)**

Po spuštění agenta musí orchestrátor (LangGraph) provést následující kroky:

1. **Node 0: Načtení Business Kontextu**
   * Agent zavolá **Tool 0 (Analyzátor Požadavků)**.
   * Načte a extrahuje informace z dokumentu "Požadavek na datový projekt".
   * Uloží kontext (cíle, rozsah, entity) do stavu (state) grafu.
2. **Node 1: Ingest & Filtrování Metadat**
   * Agent zavolá **Tool 1 (Konektory)**.
   * Načte technická metadata (JSON/XML).
   * **Klíčový krok:** Okamžitě filtruje metadata na základě kontextu z Node 0 (např. pokud je rozsah "pouze BS", ignoruje všechny objekty dm\_ba\_purchase).
3. **Node 2: Paralelní Analýza (Scatter/Gather)**
   * Agent paralelně spustí deterministické analyzátory nad *filtrovanými* daty:
     * **Tool 2 (Struktura):** Identifikuje fakta, dimenze, hierarchie.
     * **Tool 3 (Kvalita):** Identifikuje articulationScore, validationResult.
     * **Tool 4 (Bezpečnost):** Identifikuje PII, RLS kandidáty.
4. **Node 3: Konsolidace & Rozhodování (Router)**
   * Agent shromáždí výsledky analýz.
   * *Příklad logiky:* Pokud **Tool 3** nahlásí articulationScore: 0.0 \[cite: '...dimv\_bs\_purchase\_ekl\_created\_date'\] u entity, která byla v **Node 0** označena jako klíčová, Tool 7 to označí jako blokační problém.
5. **Node 4: Generování Artefaktů (Paralelní)**
   * Agent spustí generátory, které nyní využívají **jak business kontext (z Node 0), tak technickou analýzu (z Node 2/3)**:
     * **Tool 5 (ER Diagram):** Vygeneruje Mermaid kód.
     * **Tool 6 (Skripty):** Zavolá RAG-LLM pro vytvoření M skriptů.
     * **Tool 7 (Reporty):** Zavolá RAG-LLM pro sepsání Governance a RLS reportů.
6. **Node 5: Finalizace**
   * Agent shromáždí všechny vygenerované artefakty (Mermaid kód, M skripty, Markdown report) a vrátí je uživateli.

#### **5\. Požadavky na RAG**

RAG komponenta musí být naplněna **interními standardy** \[cite: 'Pro generování textů, SQL/M dotazů a vysvětlení využij RAG nad interními standardy.'\] a **obohatit je o dynamický kontext** z **Tool 0 (Analyzátor Požadavků)**. Musí obsahovat:

* Interní směrnice pro pojmenovávání, modelovací guidelines, šablony M/SQL, RLS best-practices.
* Schopnost porovnat entity z požadavku (např. "dodavatelé") s technickými názvy tabulek (např. dimv\_supplier\_master).

#### **6\. Výstupní Artefakty (Dodávka)**

Výsledkem jednoho běhu agenta musí být sada souborů:

* structure.json (seznam faktů, dimenzí, hierarchií)
* diagram.md (obsahující Mermaid kód ER diagramu \[cite: 19, 'Generovat artefakty:'\])
* governance\_report.md (slovní popis rizik, hlavně articulationScore a validationResult \[cite: 17, 'Vyhodnotit kvalitu...'\], **v kontextu business požadavku**)
* security\_report.md (návrh RLS a seznam PII/sensitive dat \[cite: 18, 'Provést bezpečnostní...'\])
* query.m (příklad M skriptu pro Power Query \[cite: 'Generovat artefakty:'\])