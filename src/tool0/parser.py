"""
Business Request Parser (Tool 0) - MVP Implementation

Parses standardized Markdown business documents into structured JSON using LangGraph.
Uses create_agent with response_format for structured output.
"""

from typing import Tuple, Dict, Any
from langchain.agents import create_agent
from .schemas import BusinessRequest


# System prompt for parsing business documents
SYSTEM_PROMPT = """You are a business requirements parser. Your task is to extract structured information from business request documents.

Documents may contain a mix of Czech and English. Common section headers include:
- "Projekt" / "Project" - project metadata (name, sponsor, date)
- "Cíl" / "Goal" - main project objective
- "Rozsah" / "Scope" - what is in/out of scope
- "Klíčové entity & metriky" / "Key entities & metrics" - business entities and KPIs
- "Očekávané zdroje" / "Expected sources" - data sources
- "Omezení" / "Constraints" - limitations and requirements
- "Požadované artefakty" / "Required artifacts" - deliverables

IMPORTANT INSTRUCTIONS:
1. Extract information into the structured format exactly as specified
2. Use "unknown" for any missing sections
3. Ensure dates are in ISO 8601 format (YYYY-MM-DD)
4. Extract lists as arrays of strings, not concatenated text
5. For project metadata, look for project name, sponsor name, and submission date
6. Any additional metadata fields should go into the "extra" dictionary
7. Be thorough - extract all relevant information from the document
"""


def parse_business_request(
    document: str, model: str = "openai:gpt-5-mini"
) -> Tuple[Dict[str, Any], str, str]:
    """Parse a business request document into structured JSON.

    Args:
        document: Markdown document containing business request
        model: LLM model to use (default: openai:gpt-5-mini)

    Returns:
        Tuple of (parsed_json, raw_response, prompt) for audit trail:
        - parsed_json: Dict representation of BusinessRequest
        - raw_response: Raw response from LLM
        - prompt: Full prompt sent to LLM (system + user message)

    Raises:
        ValueError: If parsing fails or validation errors occur

    Example:
        >>> doc = '''
        ... # Projekt
        ... Název: Analytics Platform
        ... Sponzor: Jan Novák
        ... Datum: 2025-10-30
        ...
        ... ## Cíl
        ... Vytvořit analytickou platformu pro reporting.
        ... '''
        >>> result, raw, prompt = parse_business_request(doc)
        >>> print(result['project_metadata']['project_name'])
        'Analytics Platform'
    """
    try:
        # Create agent with structured output
        # Always use explicit ToolStrategy wrapper for consistency
        from langchain.agents.structured_output import ToolStrategy

        agent = create_agent(
            model=model,
            response_format=ToolStrategy(BusinessRequest),
            system_prompt=SYSTEM_PROMPT,
        )

        # Prepare user message
        user_message = f"""Parse the following business request document:

{document}

Extract all information into the structured format."""

        # Invoke agent
        result = agent.invoke({"messages": [{"role": "user", "content": user_message}]})

        # Extract structured response
        structured_response = result.get("structured_response")

        if not structured_response:
            raise ValueError("No structured response returned from agent")

        # Convert to dict
        parsed_json = (
            structured_response.model_dump()
            if hasattr(structured_response, "model_dump")
            else structured_response.dict()
        )

        # Extract raw response (full message content if available)
        raw_response = str(
            result.get("messages", [])[-1]
            if result.get("messages")
            else structured_response
        )

        # Full prompt for audit
        full_prompt = f"System: {SYSTEM_PROMPT}\n\nUser: {user_message}"

        return (parsed_json, raw_response, full_prompt)

    except Exception as e:
        # Log error and re-raise with context
        error_msg = f"Failed to parse business request: {str(e)}"
        raise ValueError(error_msg) from e


def parse_business_request_with_logging(
    document: str,
    model: str = "openai:gpt-5-mini",
    log_to_file: bool = False,
    output_dir: str = "data/tool0_samples",
) -> Tuple[Dict[str, Any], str, str]:
    """Parse business request and optionally log results to file.

    This is a convenience wrapper around parse_business_request that adds
    file logging capability for audit trail purposes.

    Args:
        document: Markdown document containing business request
        model: LLM model to use
        log_to_file: If True, save results to output_dir
        output_dir: Directory to save JSON and prompt files

    Returns:
        Same as parse_business_request: (parsed_json, raw_response, prompt)
    """
    from pathlib import Path
    import json
    from datetime import datetime

    # Parse document
    parsed_json, raw_response, prompt = parse_business_request(document, model)

    # Log to file if requested
    if log_to_file:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().isoformat()

        # Save JSON result
        json_file = output_path / f"{timestamp}.json"
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(parsed_json, f, indent=2, ensure_ascii=False)

        # Save prompt and raw response
        md_file = output_path / f"{timestamp}.md"
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(f"# Parse Request - {timestamp}\n\n")
            f.write(f"## Prompt\n\n{prompt}\n\n")
            f.write(f"## Raw Response\n\n{raw_response}\n\n")
            f.write(
                f"## Parsed JSON\n\n```json\n{json.dumps(parsed_json, indent=2, ensure_ascii=False)}\n```\n"
            )

        print(f"✅ Results saved to {output_dir}/")
        print(f"   - {json_file.name}")
        print(f"   - {md_file.name}")

    return (parsed_json, raw_response, prompt)
