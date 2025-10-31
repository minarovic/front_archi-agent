#!/usr/bin/env python3
"""
Normalize Copilot subagent outputs (Markdown or JSON) into a canonical JSON artifact
under scrum/artifacts/YYYY-MM-DD_subagent-normalized.json.

Usage:
  python3 .claude/skills/subagent/subagent-normalizer/normalize.py --input <path>
  python3 .claude/skills/subagent/subagent-normalizer/normalize.py  # auto-detect newest
"""
from __future__ import annotations
import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional, Any

SEARCH_DIRS = [
    Path("scrum/artifacts/subagents"),
    Path("data/analysis"),
]

EXPECTED_KEYS = {"totals", "counts", "validation", "articulation", "data_quality"}


def _newest_candidate() -> Optional[Path]:
    candidates: list[Path] = []
    for base in SEARCH_DIRS:
        if base.exists():
            for p in base.rglob("*"):
                if p.is_file() and p.suffix.lower() in {".md", ".json"}:
                    candidates.append(p)
    if not candidates:
        return None
    candidates.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return candidates[0]


essay_json_block_re = re.compile(
    r"Metrics JSON\s*```json\s*(\{[\s\S]*?\})\s*```",
    re.IGNORECASE,
)


def _load_input(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return json.loads(text)
    # Try to extract JSON from a Markdown section named "Metrics JSON"
    m = essay_json_block_re.search(text)
    if not m:
        # Fallback: try to find first JSON object in file
        alt = re.search(r"(\{[\s\S]*\})", text)
        if not alt:
            raise ValueError(
                "No JSON block found in Markdown. Expected a 'Metrics JSON' fenced block or a JSON object."
            )
        block = alt.group(1)
    else:
        block = m.group(1)
    return json.loads(block)


def _validate_payload(payload: dict[str, Any]) -> None:
    missing = [k for k in EXPECTED_KEYS if k not in payload]
    if missing:
        # Only warn; still allow normalization to proceed for flexibility
        print(f"[WARN] Missing expected top-level keys: {missing}", file=sys.stderr)


def _write_artifact(payload: dict[str, Any]) -> Path:
    out_dir = Path("scrum/artifacts")
    out_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y-%m-%d")
    out_path = out_dir / f"{ts}_subagent-normalized.json"
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return out_path


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Normalize subagent outputs into canonical JSON artifact"
    )
    parser.add_argument(
        "--input", "-i", help="Path to Markdown or JSON input", default=None
    )
    args = parser.parse_args(argv)

    try:
        in_path: Optional[Path]
        if args.input:
            in_path = Path(args.input)
            if not in_path.exists():
                raise FileNotFoundError(f"Input file not found: {in_path}")
        else:
            in_path = _newest_candidate()
            if not in_path:
                raise FileNotFoundError("No input found in default search directories.")
        payload = _load_input(in_path)
        if not isinstance(payload, dict):
            raise ValueError("Loaded payload is not a JSON object.")
        _validate_payload(payload)
        out_path = _write_artifact(payload)
        print(f"WROTE {out_path}")
        return 0
    except Exception as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
