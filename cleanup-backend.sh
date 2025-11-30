#!/bin/bash
# Cleanup script: Remove backend code from front_archi-agent repo
# This repo should contain only frontend (React 19 + Vite) code

set -e

echo "🧹 Cleaning up backend files from front_archi-agent..."
echo ""

# Backend Python code
echo "📦 Removing Python source code..."
rm -rf src/
rm -rf tests/

# Notebooks
echo "📓 Removing Databricks notebooks..."
rm -rf notebooks/

# Scripts
echo "🔧 Removing backend scripts..."
rm -rf scripts/

# Data directories
echo "💾 Removing data directories..."
rm -rf data/

# Documentation (backend-specific)
echo "📚 Removing backend documentation..."
rm -rf docs_pydantic/

# Root Python files
echo "🐍 Removing root Python files..."
rm -f requirements.txt
rm -f test_azure_model.py
rm -f test_tool0_local.py
rm -f databricks.yml
rm -f Dockerfile

# Python virtual environment (if exists)
echo "🔒 Removing Python virtual environment..."
rm -rf .venv/

# Python cache
echo "🗑️  Removing Python cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true

echo ""
echo "✅ Backend cleanup complete!"
echo ""
echo "📋 Remaining structure (frontend only):"
echo "   - frontend/          (React 19 + Vite app)"
echo "   - .github/           (CI/CD workflows)"
echo "   - scrum/             (Sprint planning)"
echo "   - AGENTS.md          (AI agent guidelines)"
echo "   - README.md          (needs update)"
echo ""
echo "🔍 Verify with: git status"
echo "📝 Next steps:"
echo "   1. git add -A"
echo "   2. git commit -m 'chore: Remove backend code (moved to archi-agent repo)'"
echo "   3. git push origin main"
