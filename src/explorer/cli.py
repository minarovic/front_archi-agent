"""Interactive CLI for the Explorer Agent.

Usage:
    python -m src.explorer.cli

    # With specific data paths
    python -m src.explorer.cli --summary data/analysis/ba_bs_datamarts_summary.json

    # Single query mode
    python -m src.explorer.cli --query "List all fact tables"
"""

import argparse
import asyncio
import os
import sys
import uuid
from typing import Optional

from dotenv import load_dotenv

from .mock_client import CollibraAPIMock
from .agent import create_explorer_agent, ExplorerDeps


def print_banner():
    """Print welcome banner."""
    print(
        """
╔═══════════════════════════════════════════════════════════════╗
║           MCOP Metadata Explorer Agent                        ║
║                                                               ║
║  Ask questions about your data warehouse metadata.            ║
║  Type 'help' for available commands, 'quit' to exit.          ║
╚═══════════════════════════════════════════════════════════════╝
"""
    )


def print_help():
    """Print help message."""
    print(
        """
Available Commands:
  help          Show this help message
  quit, exit    Exit the CLI
  stats         Show statistics about loaded metadata
  tables        Quick list of all tables
  schemas       Quick list of all schemas

Example Questions:
  "List all fact tables"
  "What columns does dimv_supplier have?"
  "Find columns with 'supplier' in the name"
  "What is the lineage for factv_purchase_order?"
  "How are the tables related?"
"""
    )


async def run_repl(
    client: CollibraAPIMock,
    session_id: str,
) -> None:
    """Run interactive REPL loop.

    Args:
        client: Mock Collibra client
        session_id: Session identifier
    """
    deps = ExplorerDeps(collibra=client, session_id=session_id)
    agent = create_explorer_agent()

    print_banner()

    # Show stats on startup
    stats = client.get_stats()
    print(f"Loaded {stats['total_tables']} tables, {stats['total_columns']} columns")
    print(f"Tables by type: {stats['tables_by_type']}")
    print()

    while True:
        try:
            # Get user input
            user_input = input("You> ").strip()

            if not user_input:
                continue

            # Handle special commands
            cmd = user_input.lower()

            if cmd in ("quit", "exit", "q"):
                print("Goodbye!")
                break

            if cmd == "help":
                print_help()
                continue

            if cmd == "stats":
                stats = client.get_stats()
                print(f"Session: {session_id}")
                print(f"Loaded at: {stats['loaded_at']}")
                print(f"Total tables: {stats['total_tables']}")
                print(f"Total columns: {stats['total_columns']}")
                print(f"Total schemas: {stats['total_schemas']}")
                print(f"Tables by type: {stats['tables_by_type']}")
                print(f"Relationships: {stats['relationships']}")
                print(f"Hierarchies: {stats['hierarchies']}")
                continue

            if cmd == "tables":
                tables = client.list_tables()
                for t in tables:
                    print(f"  [{t['table_type']:10}] {t['name']}")
                continue

            if cmd == "schemas":
                for schema in client.list_schemas():
                    print(
                        f"  {schema['name']}: {schema['total_views']} views, "
                        f"{schema['dimensions']} dims, {schema['facts']} facts"
                    )
                continue

            # Run agent for natural language queries
            print("Thinking...")
            result = await agent.run(user_input, deps=deps)
            print()
            print("Agent>", result.output)
            print()

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")
            continue


async def run_single_query(
    client: CollibraAPIMock,
    query: str,
) -> None:
    """Run a single query and exit.

    Args:
        client: Mock Collibra client
        query: Query to run
    """
    deps = ExplorerDeps(collibra=client, session_id=str(uuid.uuid4()))
    agent = create_explorer_agent()

    print(f"Query: {query}")
    print("-" * 40)

    result = await agent.run(query, deps=deps)
    print(result.output)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Interactive CLI for MCOP Metadata Explorer Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m src.explorer.cli
  python -m src.explorer.cli --query "List all tables"
  python -m src.explorer.cli --summary path/to/summary.json
        """,
    )

    parser.add_argument(
        "--summary",
        default="data/analysis/ba_bs_datamarts_summary.json",
        help="Path to datamarts summary JSON",
    )
    parser.add_argument(
        "--structure",
        default="data/tool2/structure.json",
        help="Path to tool2 structure JSON",
    )
    parser.add_argument(
        "--query",
        "-q",
        help="Single query to run (non-interactive mode)",
    )
    parser.add_argument(
        "--session-id",
        default=None,
        help="Session ID for logging",
    )

    args = parser.parse_args()

    # Load environment variables
    load_dotenv()

    # Check for required API credentials
    if not os.getenv("AZURE_OPENAI_ENDPOINT") and not os.getenv("OPENAI_API_KEY"):
        print("Warning: No API credentials found.")
        print("Set AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY")
        print("  or OPENAI_API_KEY environment variables.")
        print()

    # Initialize mock client
    try:
        client = CollibraAPIMock(
            summary_path=args.summary,
            structure_path=args.structure,
        )
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("\nRun the pipeline first to generate data files:")
        print(
            "  python -m src.orchestrator.pipeline data/analysis/ba_bs_datamarts_summary.json bs"
        )
        sys.exit(1)

    # Generate session ID if not provided
    session_id = args.session_id or str(uuid.uuid4())[:8]

    # Run single query or REPL
    if args.query:
        asyncio.run(run_single_query(client, args.query))
    else:
        asyncio.run(run_repl(client, session_id))


if __name__ == "__main__":
    main()
