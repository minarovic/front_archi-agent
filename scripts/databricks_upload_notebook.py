#!/usr/bin/env python3
"""
Upload a local Jupyter notebook (.ipynb) to Databricks Workspace using the official SDK.

Usage:
  python3 scripts/databricks_upload_notebook.py \
    --local notebooks/tool0_parser_demo.ipynb \
    --workspace-path /Users/minarovic@metawizards.com/archi-agent/notebooks/tool0_parser_demo \
    --overwrite

Requires:
  - ~/.databrickscfg with a DEFAULT profile (or set DATABRICKS_CONFIG_PROFILE)
  - databricks-sdk installed
"""
from __future__ import annotations
import argparse
import base64
import os
from pathlib import Path

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.workspace import ImportFormat, Language


def upload_notebook(
    local_path: Path, workspace_path: str, overwrite: bool = True
) -> None:
    if not local_path.exists():
        raise FileNotFoundError(f"Local file not found: {local_path}")
    if local_path.suffix.lower() != ".ipynb":
        raise ValueError(
            "This helper expects a .ipynb file. For .py use ImportFormat.SOURCE."
        )

    content_b64 = base64.b64encode(local_path.read_bytes()).decode("utf-8")

    w = (
        WorkspaceClient()
    )  # Uses DEFAULT profile unless DATABRICKS_CONFIG_PROFILE is set

    parent = os.path.dirname(workspace_path.rstrip("/")) or "/"
    if parent:
        w.workspace.mkdirs(parent)

    w.workspace.import_(
        path=workspace_path,
        format=ImportFormat.JUPYTER,
        language=Language.PYTHON,
        content=content_b64,
        overwrite=overwrite,
    )

    print(f"Uploaded {local_path} -> {workspace_path}")


def main():
    p = argparse.ArgumentParser(description="Upload .ipynb to Databricks Workspace")
    p.add_argument("--local", required=True, help="Path to local .ipynb file")
    p.add_argument(
        "--workspace-path",
        required=True,
        help="Target path in Databricks Workspace (e.g. /Users/name@company.com/dir/notebook)",
    )
    p.add_argument(
        "--overwrite", action="store_true", help="Overwrite if notebook exists"
    )
    args = p.parse_args()

    upload_notebook(
        Path(args.local).expanduser(), args.workspace_path, overwrite=args.overwrite
    )


if __name__ == "__main__":
    main()
