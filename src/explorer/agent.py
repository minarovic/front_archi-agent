"""Pydantic AI Explorer Agent for metadata exploration.

This module provides an AI agent that can explore Collibra metadata
using natural language queries.

Usage:
    from src.explorer.agent import create_explorer_agent, ExplorerDeps
    from src.explorer.mock_client import CollibraAPIMock

    client = CollibraAPIMock()
    deps = ExplorerDeps(collibra=client, session_id="test-123")
    agent = create_explorer_agent()

    result = await agent.run("List all fact tables", deps=deps)
    print(result.output)
"""

import os
from dataclasses import dataclass
from typing import Optional

from pydantic_ai import Agent, RunContext

from .mock_client import CollibraAPIMock


# ============================================================================
# Dependencies
# ============================================================================


@dataclass
class ExplorerDeps:
    """Dependencies for the Explorer Agent.

    Attributes:
        collibra: Mock Collibra API client
        session_id: Unique session identifier for logging
    """

    collibra: CollibraAPIMock
    session_id: str


# ============================================================================
# System Prompt
# ============================================================================

SYSTEM_PROMPT = """You are a Metadata Explorer Agent that helps users understand
and navigate their data warehouse metadata from Collibra.

You have access to the following tools:
- list_tables: List all available tables, optionally filtered by schema
- get_table_details: Get detailed information about a specific table
- find_relationships: Find foreign key and hierarchy relationships for a table
- search_columns: Search for columns matching a pattern across all tables
- get_lineage: Get upstream sources and downstream consumers for a table

When answering questions:
1. Use the appropriate tools to gather information
2. Provide clear, structured responses
3. Include relevant details like table types (FACT, DIMENSION), column counts, confidence scores
4. Explain relationships between tables when relevant
5. Suggest related tables or columns when helpful

The data comes from a purchase/procurement data mart with:
- dm_bs_purchase: Business Purchasing schema
- dm_ba_purchase: Business Analytics schema
- Fact tables for orders and delivery performance
- Dimension tables for suppliers, products, etc.

Be helpful, concise, and accurate. If you're not sure about something, say so.
"""


# ============================================================================
# Agent Factory
# ============================================================================


def create_explorer_agent(
    model: str | None = None,
) -> Agent[ExplorerDeps, str]:
    """Create an Explorer Agent instance.

    Args:
        model: Model name to use. Defaults to Azure OpenAI from env vars.

    Returns:
        Configured Pydantic AI agent
    """
    # Default to Azure OpenAI model
    if model is None:
        # Check for Azure endpoint (indicates Azure OpenAI)
        if os.getenv("AZURE_OPENAI_ENDPOINT"):
            deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o-mini")
            model = f"azure:{deployment}"
        else:
            model = "openai:gpt-4o-mini"

    agent = Agent(
        model=model,
        deps_type=ExplorerDeps,
        system_prompt=SYSTEM_PROMPT,
    )

    # Register tools
    _register_tools(agent)

    return agent


def _register_tools(agent: Agent[ExplorerDeps, str]) -> None:
    """Register all tools with the agent."""

    @agent.tool
    async def list_tables(
        ctx: RunContext[ExplorerDeps],
        schema: Optional[str] = None,
    ) -> str:
        """List all available tables with their types and column counts.

        Args:
            ctx: Run context with dependencies
            schema: Optional schema name to filter by (e.g., 'dm_bs_purchase')

        Returns:
            Formatted string with table list
        """
        tables = ctx.deps.collibra.list_tables(schema=schema)

        if not tables:
            if schema:
                return f"No tables found in schema '{schema}'"
            return "No tables found in the catalog"

        lines = [f"Found {len(tables)} tables:"]
        for t in tables:
            lines.append(
                f"  [{t['table_type']:10}] {t['name']}: "
                f"{t['column_count']} columns, confidence={t['confidence']:.2f}"
            )
            if t.get("description"):
                lines.append(f"              {t['description'][:80]}")

        return "\n".join(lines)

    @agent.tool
    async def get_table_details(
        ctx: RunContext[ExplorerDeps],
        table_name: str,
    ) -> str:
        """Get detailed information about a specific table.

        Args:
            ctx: Run context with dependencies
            table_name: Name of the table (case-insensitive)

        Returns:
            Formatted string with table details
        """
        table = ctx.deps.collibra.get_table(table_name)

        if "error" in table:
            return table["error"]

        lines = [
            f"Table: {table['name']}",
            f"Full name: {table['full_name']}",
            f"Type: {table['table_type']}",
            f"Schema: {table.get('schema', 'N/A')}",
            f"Confidence: {table.get('confidence', 0):.2f}",
            "",
        ]

        if table.get("description"):
            lines.append(f"Description: {table['description']}")
            lines.append("")

        if table.get("grain"):
            lines.append(f"Grain: {table['grain']}")

        if table.get("business_key"):
            lines.append(f"Business Key: {table['business_key']}")

        if table.get("measures"):
            lines.append(f"Measures: {', '.join(table['measures'])}")

        if table.get("attributes"):
            lines.append(f"Attributes: {', '.join(table['attributes'])}")

        if table.get("date_columns"):
            lines.append(f"Date Columns: {', '.join(table['date_columns'])}")

        columns = table.get("columns", [])
        if columns:
            lines.append("")
            lines.append(f"Columns ({len(columns)}):")
            for col in columns[:20]:  # Limit to first 20
                lines.append(f"  - {col['name']} ({col['type']})")
            if len(columns) > 20:
                lines.append(f"  ... and {len(columns) - 20} more columns")

        return "\n".join(lines)

    @agent.tool
    async def find_relationships(
        ctx: RunContext[ExplorerDeps],
        table_name: str,
    ) -> str:
        """Find foreign key and hierarchy relationships for a table.

        Args:
            ctx: Run context with dependencies
            table_name: Name of the table to find relationships for

        Returns:
            Formatted string with relationships
        """
        relationships = ctx.deps.collibra.get_relationships(table_name)

        if not relationships:
            return f"No relationships found for table '{table_name}'"

        lines = [f"Relationships for '{table_name}':"]
        for rel in relationships:
            rel_type = rel["relationship_type"]
            if rel_type == "HIERARCHY":
                lines.append(
                    f"  HIERARCHY: {rel['from_table']} is child of {rel['to_table']} "
                    f"(confidence={rel['confidence']:.2f})"
                )
            else:
                lines.append(
                    f"  FK: {rel['from_table']}.{rel['join_column']} -> {rel['to_table']} "
                    f"(confidence={rel['confidence']:.2f})"
                )

        return "\n".join(lines)

    @agent.tool
    async def search_columns(
        ctx: RunContext[ExplorerDeps],
        pattern: str,
    ) -> str:
        """Search for columns matching a pattern across all tables.

        Args:
            ctx: Run context with dependencies
            pattern: Wildcard pattern (e.g., '*supplier*', 'order_*', '*_id')

        Returns:
            Formatted string with matching columns
        """
        columns = ctx.deps.collibra.search_columns(pattern)

        if not columns:
            return f"No columns found matching pattern '{pattern}'"

        lines = [f"Found {len(columns)} columns matching '{pattern}':"]
        for col in columns:
            lines.append(f"  {col['table']}.{col['column']} ({col['column_type']})")

        return "\n".join(lines)

    @agent.tool
    async def get_lineage(
        ctx: RunContext[ExplorerDeps],
        table_name: str,
    ) -> str:
        """Get upstream sources and downstream consumers for a table.

        Args:
            ctx: Run context with dependencies
            table_name: Name of the table

        Returns:
            Formatted string with lineage information
        """
        lineage = ctx.deps.collibra.get_lineage(table_name)

        if "error" in lineage:
            return lineage["error"]

        lines = [
            f"Lineage for '{table_name}':",
            f"",
            f"Upstream Sources:",
        ]
        for src in lineage["upstream"]:
            lines.append(f"  <- {src}")

        lines.extend(
            [
                "",
                "Downstream Consumers:",
            ]
        )
        for dst in lineage["downstream"]:
            lines.append(f"  -> {dst}")

        lines.extend(
            [
                "",
                f"Refresh Frequency: {lineage['refresh_frequency']}",
            ]
        )

        return "\n".join(lines)


# ============================================================================
# Convenience Functions
# ============================================================================


async def explore(
    query: str,
    client: CollibraAPIMock | None = None,
    session_id: str = "default",
) -> str:
    """Run a single exploration query.

    This is a convenience function for simple use cases.

    Args:
        query: Natural language query about the metadata
        client: Optional pre-configured mock client
        session_id: Session identifier for logging

    Returns:
        Agent's response string
    """
    if client is None:
        client = CollibraAPIMock()

    deps = ExplorerDeps(collibra=client, session_id=session_id)
    agent = create_explorer_agent()

    result = await agent.run(query, deps=deps)
    return result.output


# ============================================================================
# Test/Demo
# ============================================================================

if __name__ == "__main__":
    import asyncio

    async def demo():
        print("=== Explorer Agent Demo ===\n")

        try:
            client = CollibraAPIMock()
            deps = ExplorerDeps(collibra=client, session_id="demo-123")
            agent = create_explorer_agent()

            queries = [
                "List all available tables",
                "What is the dimv_supplier table?",
                "Find columns related to supplier",
            ]

            for query in queries:
                print(f"Q: {query}")
                print("-" * 40)
                result = await agent.run(query, deps=deps)
                print(result.output)
                print()

        except Exception as e:
            print(f"Error: {e}")
            print("\nNote: Agent requires AZURE_OPENAI_ENDPOINT or OPENAI_API_KEY")

    asyncio.run(demo())
