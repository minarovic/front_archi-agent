## Introduction
This guide focuses on how to utilize the [Entity Search endpoint](/api/api-reference/search/search-entity). Entity Search is a powerful tool for discovering entities or records of interest within the Sayari Knowledge Graph, primarily designed for lead-generation activities.

<Tip>
For entity matching at scale, we recommend utilizing the [Resolution Matching endpoint](/api/api-reference/resolution/resolution).
</Tip>

## Getting Started

<Steps>
 ### Basic Search Structure
   Entity Search supports both GET and POST methods. Both examples below are equivalent:
   ```json
   GET /v1/search/entity?q=Apple

   POST /v1/search/entity
   {
     "q": "Apple"
   }
   ```
   The request will search against all available fields: name, address, identifier, business_purpose, and contact information.

   <Note>
   GET requests require URL encoding of all search arguments (e.g., `foo OR (bar~5)` becomes `foo%20OR%20(bar~5)`).
   </Note>

 ### Field-Specific Search
   Narrow your search to specific fields for more targeted results:
   ```json {3}
   {
     "q": "Apple",
     "fields": ["name"]
   }
   ```

 ### Apply Filters
   Further refine your results using filters:
   ```json {4-6}
   {
     "q": "Apple",
     "fields": ["name"],
     "filter": {
       "entity_type": ["company"],
       "country": ["USA"]
     }
   }
   ```

 ### Include Facets
   Add facets to analyze your filtered results by country, source, and entity type:
   ```json {8}
   {
     "q": "Apple",
     "fields": ["name"],
     "filter": {
       "entity_type": ["company"],
       "country": ["USA"]
     },
     "facets": true
   }
   ```

 ### Submit the Query
 ```json
 curl -X POST "https://api.sayari.com/v1/search/entity" \
      -H "Authorization: Bearer <token>" \
      -H "Content-Type: application/json" \
      -d '{
   "q": "apple",
   "fields": ["name"],
   "filter": {
     "entity_type": ["company"],
     "country": ["USA"]
   },
   "advanced": false,
   "facets": true
 }'
```
</Steps>

<Tip>
Ready to learn about advanced search capabilities? Visit our [Advanced Search Guide](/api/guides/advanced_search) for details on using Lucene Query Syntax and complex search techniques.
</Tip>

## Key Concepts

### Corporate Extensions
Global company corporate extension terms that appear in names such as: `Inc`, `LLC`, `private company`, or `s.a.g.r` are treated as stop words / noise, and do not factor into matching logic.

### Response Ranking
Entity Search prioritizes connections; entities with a higher `degree` (number of relationships) will be sorted to the top.
```json {6}
{
   "data": [
       {
           "id": "WS1zKrBef9JXaSL3BTk6Eg",
           "label": "Apple Incorporated",
           "degree": 81
       }
   ]
}
```

### Result Explainability

Sayari entities are resolved via multiple sources, resulting in arrays of attributes. The matches segment helps you understand which terms matched against the entity's attributes.

```json
{
  "matches": {
    "name": [
      "<em>Apple</em> Inc",
      "<em>Apple</em> Incorporated"
    ],
    "address": [
      "ONE APPLE PARK WAY, <em>Cupertino</em>, CA, 95014"
    ]
  }
}
```
