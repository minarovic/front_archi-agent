## Introduction

This use case outlines a three-step investigative workflow utilizing Sayari API endpoints to uncover detailed information about entities.

Conduct an investigation workflow in three steps:

1. [Entity Search](/api/api-reference/search/search-entity): Search for entities of interest against the Sayari Knowledge Graph and retrieve an initial profile.
2. [Entity](/api/api-reference/entity/get-entity): Access the detailed profile of the entity, including relationships and records.
3. [Traversal/Ownership](/api/api-reference/traversal/ownership): Explore relationships using Traversals and uncover an entity's ownership connections and holdings.

## Step 1: Entity Search

Initiating an investigation starts with identifying and searching for entities of interest within the Sayari Knowledge Graph.

**Example Case**: Investigating Oleg Deripaska, a Russian billionaire

**Making a  Request**

```json
POST https://api.sayari.com/v1/search/entity?limit=1
{
  "filter": {
    "country": [
      "RUS"
    ],
    "entity_type": [
      "person"
    ]
  },
  "q": "Oleg Deripaska",
  "fields": [
    "name"
  ]
}
```

**Response Review**

The response provides a detailed profile, including name, addresses, identifiers, relationship counts, source counts, and risk indicators for Oleg Deripaska:

**Data Summary**:

- **Sayari Entity ID**: `data[].id` returns the Sayari entity ID.
- **PEP Status**: `data[].pep` is true, indicating a politically exposed person.
- **Relationship Depth**: `data[].degree` of 103 indicates the number of relationships.
- **Russian Tax ID**: `data[].identifiers` shows the specific identifier.
- **DOB Confirmation**: `data[].date_of_birth` provides age verification.

**Key Relationship Counts**:

- **Beneficial Ownership**: `data[].relationship_count.beneficial_owner_of` indicates beneficial ownership over a company.
- **Directorships**: `data[].relationship_count.director_of` reveals director roles.
- **Shareholdings**: `data[].relationship_count.shareholder_of` shows extensive corporate interests.

**Risk Factors**:

- **Sanctions**: `data[].risk.sanctioned` is true, signaling financial and geopolitical restrictions.
- **Reputational Risks**: `data[].risk.reputational_risk_bribery_and_corruption` indicates potential ethical concerns.

This initial search suggests a deeper investigation is warranted.

## Step 2:  Full Profile Review

After successfully using Entity Search, we'll now proceed to Entity to retrieve the full profile.

**Making a Request**

```bash
# Use the `entity_id` from Entity Search.
GET https://api.sayari.com/v1/entity/2C2Jb953-IeDXWd1arRMVw
```

**Response Review**

While similar to Search, the Entity payload provides additional context about key areas such as related entities and resources. Entity requests include paginated lists of attributes and relationships.


## Step 3: Traversal Ownership Exploration

The Traversal/Ownership endpoint is designed to map out direct and indirect ownership structures up to 50 entities deep.

Specifically, the Ownership request contains the following relationship types:
- `shareholder_of`
- `beneficial_owner_of`
- `owner_of`
- `has_subsidiary`
- `has_branch`

**Making a  Request**

```bash
# Use the `entity_id` from Entity Search.
GET https://api.sayari.com/v1/downstream/2C2Jb953-IeDXWd1arRMVw
```

**Response Review**

Exploring the response, we uncover second-, third-, and fourth-degree connections, highlighting entities that warrant further scrutiny. Additional query parameters can refine these findings to pinpoint specific areas of interest.

<Check>
Congratulations! You have successfully navigated through an investigative workflow using the Sayari API, from initial entity search to detailed ownership exploration.
</Check>
