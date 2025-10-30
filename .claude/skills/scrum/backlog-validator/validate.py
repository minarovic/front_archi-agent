#!/usr/bin/env python3
"""
Backlog Validator - validates frontmatter in scrum/backlog/*.md files
"""
import yaml
import json
from pathlib import Path
from datetime import datetime, date
from typing import Dict, List, Any


def convert_dates_to_str(obj: Any) -> Any:
    """Recursively convert date/datetime objects to ISO strings for JSON serialization."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_dates_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_dates_to_str(item) for item in obj]
    return obj


# Valid enum values
VALID_STATUS = ["planned", "in-progress", "done", "blocked"]
VALID_SKILL_STATUS = ["ready_to_execute", "needs_design", "manual_only"]
VALID_TYPES = ["story", "epic", "task"]
VALID_PRIORITIES = ["must-have", "should-have", "could-have", "wont-have"]

REQUIRED_FIELDS = ["id", "type", "status", "priority", "updated"]
SKILL_FIELDS = ["skill_implementation", "skill_status", "skill_time_saved", "skill_created"]


def extract_frontmatter(file_path: Path) -> Dict[str, Any] | None:
    """Extract YAML frontmatter from markdown file."""
    content = file_path.read_text(encoding='utf-8')

    if not content.startswith('---'):
        return None

    # Find second ---
    lines = content.split('\n')
    end_idx = None
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            end_idx = i
            break

    if end_idx is None:
        return None

    yaml_content = '\n'.join(lines[1:end_idx])
    try:
        return yaml.safe_load(yaml_content)
    except yaml.YAMLError:
        return None


def validate_file(file_path: Path) -> Dict[str, Any]:
    """Validate single markdown file."""
    errors = []
    warnings = []

    # Get relative path safely
    try:
        rel_path = str(file_path.relative_to(Path.cwd()))
    except ValueError:
        rel_path = str(file_path)

    # Extract frontmatter
    frontmatter = extract_frontmatter(file_path)

    if frontmatter is None:
        return {
            "file": rel_path,
            "valid": False,
            "errors": ["Missing or invalid YAML frontmatter"],
            "warnings": []
        }    # Check required fields
    for field in REQUIRED_FIELDS:
        if field not in frontmatter:
            errors.append(f"Missing required field: {field}")

    # Check skill fields presence
    for field in SKILL_FIELDS:
        if field not in frontmatter:
            warnings.append(f"Missing skill field: {field} (recommended)")

    # Validate enum values
    if "status" in frontmatter and frontmatter["status"] not in VALID_STATUS:
        errors.append(f"Invalid status: {frontmatter['status']} (must be one of {VALID_STATUS})")

    if "type" in frontmatter and frontmatter["type"] not in VALID_TYPES:
        errors.append(f"Invalid type: {frontmatter['type']} (must be one of {VALID_TYPES})")

    if "priority" in frontmatter and frontmatter["priority"] not in VALID_PRIORITIES:
        errors.append(f"Invalid priority: {frontmatter['priority']} (must be one of {VALID_PRIORITIES})")

    if "skill_status" in frontmatter and frontmatter["skill_status"] not in VALID_SKILL_STATUS:
        errors.append(f"Invalid skill_status: {frontmatter['skill_status']} (must be one of {VALID_SKILL_STATUS})")

    # Validate skill_created is boolean
    if "skill_created" in frontmatter and not isinstance(frontmatter["skill_created"], bool):
        errors.append(f"skill_created must be boolean, got: {type(frontmatter['skill_created']).__name__}")

    return {
        "file": rel_path,
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "frontmatter": frontmatter
    }
def main():
    """Main validation logic."""
    backlog_dir = Path("scrum/backlog")

    if not backlog_dir.exists():
        print(f"Error: {backlog_dir} does not exist")
        return 1

    # Find all markdown files (skip templates)
    md_files = [f for f in backlog_dir.glob("*.md") if not f.name.startswith("_")]

    if not md_files:
        print(f"Warning: No markdown files found in {backlog_dir}")
        return 0

    # Validate each file
    results = []
    for md_file in sorted(md_files):
        result = validate_file(md_file)
        results.append(result)

    # Generate summary
    total_files = len(results)
    valid_files = sum(1 for r in results if r["valid"])
    invalid_files = total_files - valid_files

    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_files": total_files,
        "valid_files": valid_files,
        "invalid_files": invalid_files,
        "validation_results": convert_dates_to_str(results)
    }    # Save to artifacts
    artifacts_dir = Path("scrum/artifacts")
    artifacts_dir.mkdir(exist_ok=True)

    output_file = artifacts_dir / f"{datetime.now().date().isoformat()}_backlog-validation.json"
    output_file.write_text(json.dumps(summary, indent=2, ensure_ascii=False))    # Print summary
    print(f"\n{'='*60}")
    print(f"Backlog Validation Report")
    print(f"{'='*60}")
    print(f"Total files:   {total_files}")
    print(f"Valid files:   {valid_files}")
    print(f"Invalid files: {invalid_files}")
    print(f"\nReport saved to: {output_file}")

    # Print details for invalid files
    if invalid_files > 0:
        print(f"\n{'='*60}")
        print("Errors found:")
        print(f"{'='*60}")
        for result in results:
            if not result["valid"]:
                print(f"\n📄 {result['file']}")
                for error in result["errors"]:
                    print(f"  ❌ {error}")
                for warning in result["warnings"]:
                    print(f"  ⚠️  {warning}")

    return 1 if invalid_files > 0 else 0


if __name__ == "__main__":
    exit(main())
