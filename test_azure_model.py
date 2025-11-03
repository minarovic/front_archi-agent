#!/usr/bin/env python3
"""
Test script for Azure AI Foundry model connection.
This script tests the connection to Azure OpenAI using gpt-5-mini model.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI


def main():
    # Load environment variables from .env file
    load_dotenv()

    # Get configuration from environment
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

    if not all([endpoint, api_key, deployment_name]):
        raise ValueError(
            "Missing required environment variables. "
            "Please set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT_NAME in .env file"
        )

    print(f"Connecting to Azure OpenAI...")
    print(f"Endpoint: {endpoint}")
    print(f"Deployment: {deployment_name}")

    # Create OpenAI client with Azure endpoint
    client = OpenAI(base_url=endpoint, api_key=api_key)

    # Test the model with a simple request
    print(f"\nSending test request to {deployment_name}...")

    try:
        response = client.chat.completions.create(
            model=deployment_name,  # Use deployment name
            messages=[
                {
                    "role": "user",
                    "content": "What is the capital of France?",
                },
            ],
        )

        print("\n✅ Success! Model response:")
        print("-" * 50)
        print(response.choices[0].message.content)
        print("-" * 50)
        print(f"\nModel used: {response.model}")
        print(f"Tokens used: {response.usage.total_tokens}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise


if __name__ == "__main__":
    main()
