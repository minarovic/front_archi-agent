#!/usr/bin/env python3
"""
LangChain Compliance Checker - validates code against LangChain/LangGraph docs
Phase 1 (MVP): Static analysis against local docs_langgraph/*.md
"""
import ast
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Set
import argparse


class LangChainComplianceChecker:
    """Checks Python code compliance with LangChain patterns."""

    # Documented patterns from docs_langgraph/structured_output.md
    VALID_IMPORTS = {
        "langchain.agents": ["create_agent"],
        "langchain.agents.structured_output": ["ToolStrategy", "ProviderStrategy"],
        "pydantic": ["BaseModel", "Field", "field_validator"],
    }

    DEPRECATED_PATTERNS = [
        {
            "pattern": r"response_format=\w+\(",  # Direct schema without strategy
            "message": "Deprecated: Pass schema directly. Use ToolStrategy() or ProviderStrategy()",
            "severity": "error",
            "docs_ref": "docs_langgraph/structured_output.md"
        },
        {
            "pattern": r"from langchain\.prebuilt import create_react_agent",
            "message": "Use 'from langchain.agents import create_agent' instead",
            "severity": "warning",
            "docs_ref": "docs_langgraph/structured_output.md"
        }
    ]

    REQUIRED_PATTERNS = [
        {
            "context": "Pydantic BaseModel fields",
            "pattern": r'Field\([^)]*description=',
            "message": "Pydantic fields should have descriptions",
            "severity": "warning"
        }
    ]

    def __init__(self, docs_dir: Path = Path("docs_langgraph")):
        self.docs_dir = docs_dir
        self.issues = []

    @staticmethod
    def _safe_relative_path(file_path: Path) -> str:
        """Get relative path if possible, otherwise absolute."""
        try:
            return str(file_path.relative_to(Path.cwd()))
        except ValueError:
            return str(file_path)

    def check_file(self, file_path: Path) -> Dict[str, Any]:
        """Check single Python file for compliance."""
        issues = []

        try:
            content = file_path.read_text(encoding='utf-8')
            tree = ast.parse(content, filename=str(file_path))

            # Check imports
            issues.extend(self._check_imports(tree, file_path, content))

            # Check deprecated patterns
            issues.extend(self._check_deprecated_patterns(content, file_path))

            # Check Pydantic models
            issues.extend(self._check_pydantic_models(tree, file_path, content))

            # Check create_agent usage
            issues.extend(self._check_create_agent_usage(tree, file_path, content))

        except SyntaxError as e:
            issues.append({
                "file": str(file_path.relative_to(Path.cwd())),
                "line": e.lineno,
                "severity": "error",
                "issue": f"Syntax error: {e.msg}",
                "recommendation": "Fix Python syntax errors first"
            })
        except Exception as e:
            issues.append({
                "file": self._safe_relative_path(file_path),
                "line": 0,
                "severity": "error",
                "issue": f"Failed to parse file: {str(e)}",
                "recommendation": "Check file encoding and syntax"
            })

        return {
            "file": self._safe_relative_path(file_path),
            "compliant": len([i for i in issues if i["severity"] == "error"]) == 0,
            "issues": issues
        }

    def _check_imports(self, tree: ast.AST, file_path: Path, content: str) -> List[Dict]:
        """Check import statements."""
        issues = []
        found_imports = set()

        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                module = node.module or ""
                for alias in node.names:
                    import_name = f"{module}.{alias.name}"
                    found_imports.add(import_name)

                    # Check if it's a known LangChain import
                    if "langchain" in module:
                        is_valid = False
                        for valid_module, valid_names in self.VALID_IMPORTS.items():
                            if module == valid_module and alias.name in valid_names:
                                is_valid = True
                                break

                        if not is_valid and not module.startswith("langchain.chat_models"):
                            issues.append({
                                "file": self._safe_relative_path(file_path),
                                "line": node.lineno,
                                "severity": "warning",
                                "issue": f"Unverified import: from {module} import {alias.name}",
                                "recommendation": "Verify this import against LangChain docs",
                                "docs_reference": "docs_langgraph/structured_output.md"
                            })

        return issues

    def _check_deprecated_patterns(self, content: str, file_path: Path) -> List[Dict]:
        """Check for deprecated code patterns."""
        issues = []

        for pattern_def in self.DEPRECATED_PATTERNS:
            pattern = pattern_def["pattern"]
            matches = re.finditer(pattern, content)

            for match in matches:
                # Calculate line number
                line_num = content[:match.start()].count('\n') + 1

                issues.append({
                    "file": self._safe_relative_path(file_path),
                    "line": line_num,
                    "severity": pattern_def["severity"],
                    "issue": pattern_def["message"],
                    "recommendation": f"See {pattern_def['docs_ref']}",
                    "docs_reference": pattern_def["docs_ref"],
                    "code_snippet": match.group(0)
                })

        return issues

    def _check_pydantic_models(self, tree: ast.AST, file_path: Path, content: str) -> List[Dict]:
        """Check Pydantic BaseModel definitions."""
        issues = []

        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                # Check if it inherits from BaseModel
                is_pydantic = any(
                    isinstance(base, ast.Name) and base.id == "BaseModel"
                    for base in node.bases
                )

                if is_pydantic:
                    # Check if class has docstring
                    if not ast.get_docstring(node):
                        issues.append({
                            "file": self._safe_relative_path(file_path),
                            "line": node.lineno,
                            "severity": "warning",
                            "issue": f"Pydantic model '{node.name}' missing docstring",
                            "recommendation": "Add class docstring describing the model",
                            "docs_reference": "docs_langgraph/structured_output.md"
                        })

                    # Check fields have descriptions
                    for item in node.body:
                        if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                            field_name = item.target.id

                            # Check if Field() is used
                            if item.value:
                                field_code = ast.unparse(item.value) if hasattr(ast, 'unparse') else ""

                                if "Field(" in field_code:
                                    # Check for description parameter
                                    if "description=" not in field_code:
                                        issues.append({
                                            "file": self._safe_relative_path(file_path),
                                            "line": item.lineno,
                                            "severity": "warning",
                                            "issue": f"Field '{field_name}' in model '{node.name}' missing description",
                                            "recommendation": "Add Field(..., description='...')",
                                            "docs_reference": "docs_langgraph/structured_output.md"
                                        })

        return issues

    def _check_create_agent_usage(self, tree: ast.AST, file_path: Path, content: str) -> List[Dict]:
        """Check create_agent function calls."""
        issues = []

        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                # Check if it's create_agent call
                if isinstance(node.func, ast.Name) and node.func.id == "create_agent":
                    # Check for response_format parameter
                    has_response_format = any(
                        kw.arg == "response_format" for kw in node.keywords
                    )

                    if has_response_format:
                        # Get response_format value
                        response_format_kw = next(
                            kw for kw in node.keywords if kw.arg == "response_format"
                        )

                        # Check if it's wrapped in ToolStrategy or ProviderStrategy
                        if isinstance(response_format_kw.value, ast.Call):
                            func_name = ast.unparse(response_format_kw.value.func) if hasattr(ast, 'unparse') else ""

                            if "ToolStrategy" not in func_name and "ProviderStrategy" not in func_name:
                                issues.append({
                                    "file": self._safe_relative_path(file_path),
                                    "line": node.lineno,
                                    "severity": "error",
                                    "issue": "response_format should use ToolStrategy() or ProviderStrategy()",
                                    "recommendation": "Wrap schema in ToolStrategy(schema) or ProviderStrategy(schema)",
                                    "docs_reference": "docs_langgraph/structured_output.md"
                                })

        return issues

    def check_directory(self, dir_path: Path, recursive: bool = True) -> List[Dict]:
        """Check all Python files in directory."""
        results = []

        pattern = "**/*.py" if recursive else "*.py"
        for py_file in dir_path.glob(pattern):
            # Skip __pycache__ and test files
            if "__pycache__" in str(py_file) or py_file.name.startswith("test_"):
                continue

            result = self.check_file(py_file)
            results.append(result)

        return results


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="LangChain compliance checker")
    parser.add_argument("--file", type=Path, help="Check specific file")
    parser.add_argument("--dir", type=Path, help="Check directory")
    parser.add_argument("--all", action="store_true", help="Check all src/ directory")

    args = parser.parse_args()

    checker = LangChainComplianceChecker()
    results = []

    if args.file:
        results = [checker.check_file(args.file)]
    elif args.dir:
        results = checker.check_directory(args.dir)
    elif args.all:
        src_dir = Path("src")
        if src_dir.exists():
            results = checker.check_directory(src_dir)
        else:
            print("Error: src/ directory not found")
            return 1
    else:
        print("Error: Specify --file, --dir, or --all")
        return 1

    # Generate summary
    total_files = len(results)
    compliant_files = sum(1 for r in results if r["compliant"])
    non_compliant_files = total_files - compliant_files

    total_issues = sum(len(r["issues"]) for r in results)
    errors = sum(len([i for i in r["issues"] if i["severity"] == "error"]) for r in results)
    warnings = sum(len([i for i in r["issues"] if i["severity"] == "warning"]) for r in results)

    summary = {
        "timestamp": datetime.now().isoformat(),
        "phase": "mvp",
        "total_files": total_files,
        "compliant_files": compliant_files,
        "non_compliant_files": non_compliant_files,
        "total_issues": total_issues,
        "errors": errors,
        "warnings": warnings,
        "results": results
    }

    # Save to artifacts
    artifacts_dir = Path("scrum/artifacts")
    artifacts_dir.mkdir(exist_ok=True)

    output_file = artifacts_dir / f"{datetime.now().date()}_langchain-compliance.json"
    output_file.write_text(json.dumps(summary, indent=2, ensure_ascii=False))

    # Print summary
    print(f"\n{'='*60}")
    print(f"LangChain Compliance Report")
    print(f"{'='*60}")
    print(f"Total files:       {total_files}")
    print(f"Compliant files:   {compliant_files}")
    print(f"Non-compliant:     {non_compliant_files}")
    print(f"\nTotal issues:      {total_issues}")
    print(f"  Errors:          {errors}")
    print(f"  Warnings:        {warnings}")
    print(f"\nReport saved to: {output_file}")

    # Print details for non-compliant files
    if non_compliant_files > 0:
        print(f"\n{'='*60}")
        print("Issues found:")
        print(f"{'='*60}")
        for result in results:
            if result["issues"]:
                print(f"\n📄 {result['file']}")
                for issue in result["issues"]:
                    icon = "❌" if issue["severity"] == "error" else "⚠️"
                    print(f"  {icon} Line {issue['line']}: {issue['issue']}")
                    print(f"     💡 {issue['recommendation']}")
                    if "docs_reference" in issue:
                        print(f"     📚 {issue['docs_reference']}")

    return 1 if errors > 0 else 0


if __name__ == "__main__":
    exit(main())
