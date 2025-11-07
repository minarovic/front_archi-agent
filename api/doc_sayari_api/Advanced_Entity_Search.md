## Introduction

The Sayari Search API provides powerful search capabilities through [Lucene Query Syntax](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html). This guide will help you construct effective queries, from basic searches to complex combinations of search techniques.

## Getting Started

<Steps>
  ### Enable Advanced Query
    Set the `advanced` parameter to `true` in your API request.
    ```json {6}
    {
      "q": "Your lucene query here",
      "filter": {
        // Additional filters
      },
      "advanced": true
    }
    ```
  ### Construct the Query
  Follow our term guidance
    ```json {2}
    {
      "q": "(name.value:Apple OR identifier.value: 0796001839)",
      "filter":
      {
        "entity_type": ["company"],
        "country": ["USA"]
      },
      "advanced": true
    }
    ```
    ### Submit the Query

    ```json
    curl -X POST "https://api.sayari.com/v1/search/entity" \
         -H "Authorization: Bearer <token>" \
         -H "Content-Type: application/json" \
         -d '{
      "q": "(name.value:Apple OR identifier.value: 0796001839)",
      "filter": {
        "entity_type": ["company"],
        "country": ["USA"]
      },
      "advanced": true
    }'
  ```
</Steps>


## Term Modifiers

### Boolean Operators

```json {2}
{
  "q": "(name.value:Apple AND address.value:Cupertino)",
  "filter": {
    "entity_type": ["company"],
    "country": ["USA"]
  },
  "advanced": true
}
```
This query demonstrates the use of the boolean `AND` operator to combine multiple search conditions. Boolean operators must be uppercase (`AND`, `OR`) and allow you to create logical relationships between search terms:

- `AND`: Requires both conditions to be true
- `OR`: Requires at least one condition to be true, alternatively a pipe `|` can be utilized.
- `NOT`: Excludes matches that meet the condition

The example finds companies that must have both "Apple" in their name `AND` "Cupertino" in their address, filtered to only include USA-based companies.

### Exact Terms (Quotation Marks)

```json {2}
{
  "q": "name.value:\"Green Apple\"",
  "filter": {
    "entity_type": ["company"],
    "country": ["USA"]
  },
  "advanced": true
}
```
This query uses quotation marks (`" "`) to search for an exact match of "Green Apple" as a term in the company name.  Filters are utilized to only include matches that include companies with a country context in the USA.


### Excluding Terms (Hyphen)

```json {2}
{
  "q": "-name.value:\"Green\" AND name.value:\"Apple\"",
  "filter": {
    "entity_type": ["company"]
  },
  "advanced": true
}
```
This query uses a hyphen (`-`) to exclude the term "Green" and the `AND` operator to require "Apple", searching for company entities that do not have "Green" but do have the exact term "Apple" in their name. Please note, the hyphen is applied to the field, not the value.

### Fuzzy Search (Tilde)

```json {2}
{
  "q": "name.value:Aple~2 AND name.value:Green",
  "filter": {
    "entity_type": ["company"]
  },
  "advanced": true
}
```
This query uses the tilde (`~`) followed by a number to perform a fuzzy search, finding companies with names similar to "Apple", allowing for up to 2 character differences. It's combined with an exact match for "Green".

### Boosted Terms Search (Caret)

```json {2}
{
  "q": "name.value:Green^4 AND name.value:Apple",
  "filter": {
    "entity_type": ["company"]
  },
  "advanced": true
}
```
This query uses the caret (`^`) followed by a number to boost the term "Green", giving it higher relevance in the search results. It's combined with a regular search for "Apple".


### Grouping and Field Grouping (Parentheses)

```json {2}
{
  "q": "(name.value:\"Apple\") AND (address.value:Cupertino) AND (identifier.value:549300GF4NZMYB9VP153)",
  "filter": {
    "entity_type": ["company"],
    "country": ["USA"]
  },
  "advanced": true
}
```
This query uses boolean operators to find companies that must have "Apple" in the name, "Cupertino" in the address `AND` "549300GF4NZMYB9VP153" as an identifier. This can help narrow does to specific attributes.

### Complex Query Combining Multiple Techniques

```json {2}
{
  "q": "(name.value:\"Apple\"^4 AND address.value:\"Cupertino\"^2) OR (identifier.value:\"549300GF4NZMYB9VP153\" AND business_purpose.value:\"technology\"~4)",
  "filter": {
    "entity_type": ["company"],
    "country": ["USA"]
  },
  "advanced": true
}
```
This query demonstrates how to combine multiple search techniques (Quotation Marks, Boosting, Fuzzy Search, Grouping) to create a precise search. The query prioritizes companies named "Apple" in "Cupertino", while also allowing for an alternate search path using a specific identifier and approximate business purpose matching.
