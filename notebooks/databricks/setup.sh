#!/bin/bash
# Databricks MCOP Setup Script
# This script automates the setup of MCOP tools on Databricks

set -e  # Exit on error

echo "🚀 MCOP Databricks Setup"
echo "======================="
echo ""

# Check if Databricks CLI is installed
if ! command -v databricks &> /dev/null; then
    echo "❌ Databricks CLI not found. Installing..."
    pip install databricks-cli
    echo "✅ Databricks CLI installed"
fi

# Check if configured
if [ ! -f ~/.databrickscfg ]; then
    echo "⚠️  Databricks CLI not configured. Please run:"
    echo "   databricks configure --token"
    echo ""
    echo "   Then re-run this script."
    exit 1
fi

echo "✅ Databricks CLI configured"
echo ""

# Step 1: Create secret scope
echo "📦 Step 1: Creating secret scope 'mcop'..."
if databricks secrets list-scopes | grep -q "mcop"; then
    echo "   ℹ️  Scope 'mcop' already exists, skipping"
else
    databricks secrets create-scope --scope mcop
    echo "   ✅ Secret scope 'mcop' created"
fi
echo ""

# Step 2: Add Azure OpenAI credentials
echo "🔐 Step 2: Adding Azure OpenAI credentials..."
echo ""
echo "   Please enter your Azure OpenAI details:"
echo ""

read -p "   Azure OpenAI Endpoint (e.g., https://your-resource.cognitiveservices.azure.com/openai/v1/): " AZURE_ENDPOINT
read -sp "   Azure OpenAI API Key: " AZURE_API_KEY
echo ""
read -p "   Azure OpenAI Deployment Name (e.g., test-gpt-5-mini): " DEPLOYMENT_NAME
echo ""

# Create temporary files for secrets
echo "$AZURE_ENDPOINT" > /tmp/azure-openai-endpoint.txt
echo "$AZURE_API_KEY" > /tmp/azure-openai-api-key.txt
echo "$DEPLOYMENT_NAME" > /tmp/azure-openai-deployment-name.txt

# Add secrets
databricks secrets put --scope mcop --key azure-openai-endpoint --string-value "$AZURE_ENDPOINT"
databricks secrets put --scope mcop --key azure-openai-api-key --string-value "$AZURE_API_KEY"
databricks secrets put --scope mcop --key azure-openai-deployment-name --string-value "$DEPLOYMENT_NAME"

# Clean up temporary files
rm /tmp/azure-openai-*.txt

echo "   ✅ Azure OpenAI credentials added"
echo ""

# Verify secrets
echo "🔍 Verifying secrets..."
databricks secrets list --scope mcop
echo ""

# Step 3: Create DBFS directories
echo "📁 Step 3: Creating DBFS directories..."
databricks fs mkdirs dbfs:/FileStore/mcop/metadata/
databricks fs mkdirs dbfs:/FileStore/mcop/tool0_samples/
databricks fs mkdirs dbfs:/FileStore/mcop/tool1/
databricks fs mkdirs dbfs:/FileStore/mcop/tool2/
databricks fs mkdirs dbfs:/FileStore/mcop/tool3/
echo "   ✅ DBFS directories created"
echo ""

# Step 4: Upload metadata file
echo "📤 Step 4: Uploading metadata file..."
METADATA_FILE="docs_langgraph/BA-BS_Datamarts_metadata.json"

if [ -f "$METADATA_FILE" ]; then
    databricks fs cp "$METADATA_FILE" dbfs:/FileStore/mcop/metadata/BA-BS_Datamarts_metadata.json --overwrite
    echo "   ✅ Metadata file uploaded"
else
    echo "   ⚠️  Metadata file not found at: $METADATA_FILE"
    echo "   Please upload manually:"
    echo "   databricks fs cp <path-to-file> dbfs:/FileStore/mcop/metadata/BA-BS_Datamarts_metadata.json"
fi
echo ""

# Step 5: Upload notebooks (optional)
echo "📓 Step 5: Upload notebooks to Databricks Workspace?"
read -p "   Upload notebooks now? (y/n): " UPLOAD_NOTEBOOKS

if [ "$UPLOAD_NOTEBOOKS" == "y" ]; then
    read -p "   Enter your Databricks email (e.g., user@example.com): " USER_EMAIL

    WORKSPACE_PATH="/Workspace/Users/$USER_EMAIL/mcop"

    echo "   Creating workspace directory: $WORKSPACE_PATH"
    databricks workspace mkdirs "$WORKSPACE_PATH"

    echo "   Uploading notebooks..."
    databricks workspace import_dir notebooks/databricks "$WORKSPACE_PATH" --overwrite

    echo "   ✅ Notebooks uploaded to: $WORKSPACE_PATH"
else
    echo "   ℹ️  Skipping notebook upload. You can upload manually via UI."
fi
echo ""

# Step 6: Summary
echo "✅ Setup Complete!"
echo "================="
echo ""
echo "📋 Next Steps:"
echo "   1. Navigate to Databricks Workspace → $WORKSPACE_PATH (if uploaded)"
echo "   2. Attach notebooks to a cluster"
echo "   3. Run Tool 0 → Tool 1 → Tool 2 → Tool 3 in sequence"
echo ""
echo "📂 DBFS Structure:"
echo "   dbfs:/FileStore/mcop/"
echo "   ├── metadata/ (uploaded)"
echo "   ├── tool0_samples/ (empty)"
echo "   ├── tool1/ (empty)"
echo "   ├── tool2/ (empty)"
echo "   └── tool3/ (empty)"
echo ""
echo "🔐 Secrets Created:"
databricks secrets list --scope mcop
echo ""
echo "📚 Documentation: notebooks/databricks/README.md"
echo ""
echo "🎉 Happy coding!"
