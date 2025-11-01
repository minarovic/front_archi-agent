# Tool 1 Task: Entity Mapping

Your task is to map business entities to database candidates (similar to Tool 1 in the Metadata Copilot project).

## Inputs

Read these two files from `testdata/`:
- `tool0_business_request.json` – contains business entities and scope_out (topics to exclude)
- `bs_metadata_candidates.json` – contains available database candidates

## Your Job

For each entity in `tool0_business_request.json`:
1. Find the best matching candidate from `bs_metadata_candidates.json`
2. Consider:
   - Semantic similarity (e.g., "dodavatelé" = "suppliers")
   - Description relevance
   - Avoid candidates related to topics in `scope_out`
3. Return for each mapping:
   - entity name
   - matched candidate displayName
   - confidence score (0.0-1.0)
   - short rationale (1-2 sentences)

## Output Format

Return a simple JSON structure:
```json
{
  "mappings": [
    {
      "entity": "Suppliers (dodavatelé)",
      "candidate_id": "dm_bs_purchase",
      "candidate_name": "Systems>dap_gold_prod>dm_bs_purchase",
      "confidence": 0.95,
      "rationale": "Purchasing data mart directly contains supplier master data..."
    }
  ]
}
```

Keep rationale concise and focus on why the match makes sense.
