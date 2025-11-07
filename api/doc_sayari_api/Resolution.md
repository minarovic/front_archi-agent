
## Introduction

This guide covers the [Resolution endpoint](/api/api-reference/resolution/resolution).

Resolution leverages elastic search and natural language processing (NLP) techniques to accurately match queries with the most relevant results. The response includes an entity attribute profile, an `entity_id`, and an explanation with `match_strength`, helping you understand the confidence level for each match.

The Resolution endpoint is recommended for screening purposes or when clients need to validate entities of interest against the Sayari Knowledge Graph.

<Info>
Please note: Sayari consistently enhances and refines its match resolution logic. Consequently, the results outlined in the guide below are for demonstration purposes and may not reflect the latest updates.
</Info>

## Entity Request

To initiate a request, at a minimum, the `name` of the entity is required. For optimal results, we advise providing additional attributes such as `address`, `country`, and `type` to facilitate high-confidence matches.

The endpoint also supports `identifier`, `contact`, and `date_of_birth` attributes. Although not mandatory, including these attributes significantly increases the likelihood of obtaining accurate matches by offering more specific query parameters.

## Sample Request - Medium Confidence

The following example demonstrates a request yielding medium confidence results with multiple plausible matches:

Given only `name` and `country` attributes, there might be multiple entities with the name "Victoria Beckham" in Great Britain, despite it being a relatively unique name.

**Parameters**

- `name`: Victoria Beckham
- `country`: GBR

```bash
curl --request GET \
curl -X GET "https://api.sayari.com/v1/resolution?name=victoria+beckham&country=GBR" \
     -H "Authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc"
```

### Response Review

The response lists four potential matches. Without additional attributes like an `address` or `identifier`, we cannot assign a `match_strength` of "strong", which leads to all matches being categorized as "weak". However, each match has `highQualityMatchName`: true, which indicates a high-quality match for the name and suggests a unique match possibility.


**Data Summary**
- `data`: An array of match hits
- `data[].entity_id`: The matched Sayari entity ID for subsequent calls
- `data[].label`: The name of the matched Sayari entity
- `data[].type`: The type of the matched Sayari entity
- `data[].identifiers`: Unique identifiers for the matched entity
- `data[].addresses`: Physical locations associated with the entity
- `data[].countries`: Countries where the entity operates
- `data[].sources`: Data sources contributing to the entity information
- `data[].matched_queries`: Fields that matched the search query, confirming the relevance
- `data[].explanation`: Includes highlighted text to emphasize the match and `match_strength` to indicate result confidence

```json
{
  "query": {
    "country": "GBR",
    "name": "VICTORIA BECKHAM",
    "type": "person"
  },
  "result": {
    "score": 142.09607,
    "entity_id": "uvMxmRmbVbGdvGy5wLpNpA",
    "label": "VICTORIA BECKHAM",
    "type": "person",
    "addresses": [
      "СОЕДИНЕННОЕ КОРОЛЕВСТВО | LONDON, W6 7DN | 202 HAMMERSMITH ROAD, GB"
    ],
    "countries": [
      "GBR",
      "KAZ"
    ],
    "sources": [
      "95d4ee257c785546e66a87a37fa183f4"
    ],
    "typed_matched_queries": [
      "name|0",
      "type|0",
      "country|1",
      "country|0",
      "looseName|0",
      "type|2"
    ],
    "matched_queries": [
      "name",
      "type",
      "country"
    ],
    "highlight": {
      "type": [
        "<em>PERSON</em>"
      ],
      "name": [
        "<em>VICTORIA</em> <em>BECKHAM</em>"
      ],
      "country": [
        "<em>GBR</em>"
      ]
    },
    "explanation": {
      "type": [
        {
          "matched": "<em>PERSON</em>",
          "uploaded": "person"
        }
      ],
      "name": [
        {
          "matched": "<em>VICTORIA</em> <em>BECKHAM</em>",
          "uploaded": "VICTORIA BECKHAM",
          "nameCustomTfIdfScore": 0.5416772821044128,
          "highQualityMatchName": true,
          "isDeletionRecommended": false
        }
      ],
      "country": [
        {
          "matched": "<em>GBR</em>",
          "uploaded": "GBR"
        }
      ]
    },
    "match_strength": {
      "value": "weak"
    }
  }
}

```

## Sample Request - High Confidence

Enhancing the query with an `address` attribute and specifying a `type` can lead to a high-confidence match and fewer results:

**Parameters**

- `name`: Victoria Beckham
- `address`: Hammersmith Road, London, W6 7DN
- `country`: GBR
- `type`: person

```bash
curl -X GET "https://api.sayari.com/v1/resolution?name=victoria+beckham&address=Hammersmith+Road%2C+London%2C+W6+7DN&type=person&country=GBR" \
     -H "Authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc"

```

### Response Review

Incorporating the `address` and `type` attributes allows the Resolution endpoint to return a single, high-confidence match with a `match_strength` of "strong".


```json
{
  "query": {
    "country": "GBR",
    "name": "VICTORIA BECKHAM",
    "type": "person",
    "address": "Hammersmith Road, London, W6 7DN"
  },
  "result": {
    "score": 274.4378,
    "entity_id": "uvMxmRmbVbGdvGy5wLpNpA",
    "label": "VICTORIA BECKHAM",
    "type": "person",
    "addresses": [
      "СОЕДИНЕННОЕ КОРОЛЕВСТВО | LONDON, W6 7DN | 202 HAMMERSMITH ROAD, GB"
    ],
    "countries": ["GBR", "KAZ"],
    "sources": ["95d4ee257c785546e66a87a37fa183f4"],
    "typed_matched_queries": [
      "type|1",
      "strictAddressNormalNameCombo",
      "type|0",
      "name|StrictV2|0",
      "address|StrictV2|0",
      "address|NormalV2|0",
      "country|0",
      "name|NormalV2|0",
      "strictNameNormalAddressCombo"
    ],
    "matched_queries": [
      "type",
      "strictAddressNormalNameCombo",
      "name",
      "address",
      "country",
      "strictNameNormalAddressCombo"
    ],
    "highlight": {
      "type": ["<em>PERSON</em>"],
      "name": ["<em>VICTORIA</em> <em>BECKHAM</em>"],
      "address": [
        "СОЕДИНЕННОЕ КОРОЛЕВСТВО | <em>LONDON</em>, <em>W6</em> <em>7DN</em> | 202 <em>HAMMERSMITH</em> <em>ROAD</em>, GB"
      ],
      "country": ["<em>GBR</em>"]
    },
    "explanation": {
      "type": [
        {
          "matched": "<em>PERSON</em>",
          "uploaded": "person"
        }
      ],
      "name": [
        {
          "matched": "<em>VICTORIA</em> <em>BECKHAM</em>",
          "uploaded": "VICTORIA BECKHAM",
          "nameCustomTfIdfScore": 0.5416772821044128,
          "highQualityMatchName": true,
          "isDeletionRecommended": false
        }
      ],
      "address": [
        {
          "matched": "СОЕДИНЕННОЕ КОРОЛЕВСТВО | <em>LONDON</em>, <em>W6</em> <em>7DN</em> | 202 <em>HAMMERSMITH</em> <em>ROAD</em>, GB",
          "uploaded": "Hammersmith Road, London, W6 7DN"
        }
      ],
      "country": [
        {
          "matched": "<em>GBR</em>",
          "uploaded": "GBR"
        }
      ]
    },
    "match_strength": "strong"
  }
}

```
<Check>
Congratulations! You just completed the Resolution Guide.
</Check>
