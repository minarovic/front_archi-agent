#!/usr/bin/env python3
"""
Submit and run a Databricks notebook on an existing cluster.

Examples:
  python3 scripts/databricks_run_notebook.py \
    --workspace-path /Users/minarovic@metawizards.com/archi-agent/notebooks/tool0_parser_demo \
    --cluster-id 1107-223945-fh9vy8xe

Notes:
- Uses ~/.databrickscfg DEFAULT profile unless DATABRICKS_CONFIG_PROFILE is set.
- Will wait for the run to finish and print the final state and (if available) the output.
"""
from __future__ import annotations
import argparse
import os
import time
from typing import Dict

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.jobs import NotebookTask, SubmitTask


def kv_list_to_dict(pairs: list[str]) -> Dict[str, str]:
    params: Dict[str, str] = {}
    for p in pairs:
        if "=" not in p:
            raise ValueError(f"Invalid parameter '{p}', expected key=value")
        k, v = p.split("=", 1)
        params[k] = v
    return params


def submit_once(
    w: WorkspaceClient,
    notebook_path: str,
    cluster_id: str,
    base_parameters: Dict[str, str],
):
    """Submit a one-time notebook run using jobs.submit API."""
    submit_resp = w.jobs.submit(
        run_name=f"ad_hoc_{int(time.time())}",
        tasks=[
            SubmitTask(
                task_key="run_notebook",
                existing_cluster_id=cluster_id,
                notebook_task=NotebookTask(
                    notebook_path=notebook_path,
                    base_parameters=base_parameters or None,
                ),
            )
        ],
    )
    return submit_resp.run_id


def wait_for_run(w: WorkspaceClient, run_id: int, poll_seconds: int = 5) -> str:
    while True:
        r = w.jobs.get_run(run_id)
        life = r.state.life_cycle_state
        result = r.state.result_state
        print(f"Run {run_id}: lifecycle={life} result={result}")
        if life in ("TERMINATED", "SKIPPED", "INTERNAL_ERROR"):
            return result or life
        time.sleep(poll_seconds)


def print_output(w: WorkspaceClient, run_id: int) -> None:
    try:
        out = w.jobs.get_run_output(run_id)
        if out and out.notebook_output and out.notebook_output.result:
            print("\n===== NOTEBOOK OUTPUT (truncated) =====")
            print(out.notebook_output.result)
            print("===== END OUTPUT =====\n")
    except Exception as e:
        print(f"No run output available: {e}")


def main():
    ap = argparse.ArgumentParser(
        description="Run a Databricks notebook on an existing cluster"
    )
    ap.add_argument(
        "--workspace-path",
        required=True,
        help="Workspace path to notebook (no .ipynb extension)",
    )
    ap.add_argument("--cluster-id", required=True, help="Existing cluster ID to run on")
    ap.add_argument(
        "--param", action="append", default=[], help="key=value parameter (repeatable)"
    )
    args = ap.parse_args()

    params = kv_list_to_dict(args.param)
    w = WorkspaceClient()
    run_id = submit_once(w, args.workspace_path, args.cluster_id, params)
    final_state = wait_for_run(w, run_id)
    print_output(w, run_id)
    print(f"Final state: {final_state}")


if __name__ == "__main__":
    main()
