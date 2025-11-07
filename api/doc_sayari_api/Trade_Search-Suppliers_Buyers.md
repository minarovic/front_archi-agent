
## Introduction

This guide covers the [Suppliers](/api/api-reference/trade/search-suppliers) & [Buyers](/api/api-reference/trade/search-buyers) endpoints.

Due to the similar nature of these endpoints, this guide focuses on suppliers. However, the same principles and structure apply to buyers. The key difference is the entity of interest, simply:

- The buyer is the `company` entity receiving and importing goods.
- The supplier is the `company` entity shipping and exporting goods.

We recommend using these endpoints when the principal object you are looking to return is the supplier or buyer `company` entity and a summary of their shipment metadata.

For guidance on how to utilize the Shipments endpoint, which returns the `shipment` entity as the principal object, check out our [Guide: Trade Search - Shipments](/api/guides/trade-search-shipments).

## Supplier & Buyer Request

The following example demonstrates how to search for cotton shipments departing from China to Vietnam after January 1, 2023, with a summary of trade data:

<Info>
Note: We have used the same filters as the example in the [Guide: Trade Search - Shipment](/api/guides/trade-search-shipments) to demonstrate how these endpoints differ.
</Info>

```json
POST https://api.sayari.com/v1/trade/search/suppliers
{
  "filter": {
    "departure_country": ["CHN"],
    "arrival_country": ["VNM"],
    "hs_code": ["52"],
    "arrival_date": ["2023-01-01"]
  },
  "facets": true
}
```
## Response Review

Responses are structured to provide a comprehensive view of the trade data, with a default and max limit of 100 suppliers per response. You can adjust this limit as needed and may use offset pagination to navigate through larger datasets of up to 100 paginations.
### Understanding Facets

Facets offer a macro-level overview of trade activity, with results ranked by highest count. By summarizing various aspects of trade data, facets help you understand the breadth of your search results and identify focus areas. The below facets are available, providing a breakdown of relevant counts:

**Supplier Risk:**
Counts of specific risk factors associated with supplier entities, based on our risk factor ontology. Review our risk factor ontology for details.
```json
"supplier_risk": [
{
"key": "owned_by_sanctioned_entity",
"doc_count": 8
},
```

**Buyer Risk:**
Counts of specific risk factors associated with buyer entities, based on our risk factor ontology. Review our risk factor ontology for details.
```json
"buyer_risk": [
{
"key": "export_to_soe",
"doc_count": 478
},
```

**Supplier Country:**
Country counts per supplier country
```json
"supplier_country": [
{
"key": "CHN",
"doc_count": 25318,
"label": "China"
},
```

**Buyer Country:**
Country counts per buyer country
```json
"buyer_country": [
{
"key": "VNM",
"doc_count": 28678,
"label": "Vietnam"
},
```

### Understanding the Suppliers & Buyers Object

<Info>
Visit our [ontology page](/sayari-library/ontology) to get a better understanding of our enum types and risk factors.
</Info>

Each entity object in the response provides the following detailed information:

**Entity Overview:**
- `data`: An array of entity (Supplier & Buyer) hits
- `data[].id`: The Sayari `entity_id`
- `data[].label`: The name of the entity
- `data[].degree`: The number edges, or relationships, the entity has
- `data[].type`: Specifies the entity type, which will always be `company`
- `data[].pep`: Indicates whether the entity is politically exposed (`false` in this case, meaning it's not)
- `data[].sanctioned`: Shows if the entity is on any sanctions lists (`false` here, meaning it's not)
- `data[].closed`: Status indicating if the entity is currently operational (`false` here, meaning the entity is active)

**Entity Attribute Data:**
- `data[].addresses`: Lists physical locations associated with the entity across various countries
- `data[].countries`: Includes countries where the entity operates or has related source data

**Relationship and Trade Activity:**
- `data[].relationship_count`: Breaks down the entity's trading relationships, including the number of entities it ships to and receives from
- `data[].source_count`: Details the data sources contributing to the entity's profile

**Entity Risk:**
- `data[].risk`: Contains risk factors like `owned_by_sanctioned_entity`, assessing the entity's risk level

**Metadata and Trade Details:**

- `data[].metadata`: Provides insights into trade activities, including the latest shipment date, total shipments, and Harmonized System (HS) codes for the traded goods



```json
{
  "data": [
    {
      "id": "WT_MMBH-nO_M_K7kYFxyYQ",
      "label": "UNITED WELL TRADING LIMITED",
      "degree": 24303,
      "entity_url": "/v1/entity/WT_MMBH-nO_M_K7kYFxyYQ",
      "pep": false,
      "psa_id": "249108827632",
      "psa_count": 39,
      "sanctioned": false,
      "closed": false,
      "type": "company",
      "identifiers": [],
      "addresses": [
        "16/F , RAILWAY PLAZA , NOS.39 CHATHAM ROAD SOUTH , TSIM SHA TSUI , KOWLOON , HONG KONG , HK",
        "NO.2 , 1/F , FACTORY 4 , 2 CENTURY ROAD , TORCH DEVELOPMENT ZONE , ZHONGSHAN , GUANGDONG PROVINCE , CN",
        "NO.2 , 1/F , FACTORY 4 , 2 CENTURY ROAD , TORCH DEVELOPMENT ZONE , ZHONGSHAN , GUANGDONG PROVINCE , CHINA , CN"
      ],
      "countries": [
        "VNM",
        "JPN",
        "CHN",
        "HKG",
        "KOR"
      ],
      "relationship_count": {
        "ships_to": 25,
        "receives_from": 14,
        "receiver_of": 2996,
        "shipper_of": 21270
      },
      "source_count": {
        "ee100f9b5dfdae8991ba43f5de6e1854": {
          "count": 2,
          "label": "Panama Imports & Exports (January 2022 - Present)"
        },
        "ce462e9deea545cce35df38c48512a0c": {
          "count": 8,
          "label": "India Imports & Exports (January 2023 - Present)"
        },
        "e5de7b52cc88ef4cd1a10e201bdf46ee": {
          "count": 22497,
          "label": "Vietnam Imports & Exports (January 2023 - Present)"
        },
        "31df3cc3a57cc4a39dcc29dd4b9ce5e5": {
          "count": 800,
          "label": "Mexico Imports & Exports (January 2022 - Present)"
        },
        "16a4cc2d0f467fa993b28587d542a25d": {
          "count": 999,
          "label": "USA Imports (2021 - Present)"
        }
      },
      "risk": {
        "basel_aml": {
          "value": 7.1,
          "metadata": {
            "country": [
              "VNM"
            ]
          },
          "level": "relevant"
        },
        "cpi_score": {
          "value": 39,
          "metadata": {
            "country": [
              "VNM"
            ]
          },
          "level": "relevant"
        }
      },
      "user_attribute_count": {},
      "user_record_count": 0,
      "user_related_entities_count": 0,
      "user_relationship_count": {},
      "related_entities_count": 24303,
      "attribute_count": {
        "contact": 5,
        "address": 36,
        "country": 7,
        "name": 1
      },
      "metadata": {
        "latestShipmentDate": "2023-10-31",
        "shipments": 1145,
        "hsCodes": [
          {
            "key": "520931",
            "doc_count": 541,
            "value": "Fabrics, woven; containing 85% or more by weight of cotton, dyed, plain weave, weighing more than 200g/m2",
            "value_simple": "Heavy major cotton fabrics"
          },
          {
            "key": "520939",
            "doc_count": 496,
            "value": "Fabrics, woven; containing 85% or more by weight of cotton, dyed, of weaves n.e.c. in item no. 5209.3, weighing more than 200g/m2",
            "value_simple": "Heavy major cotton fabrics"
          },
          {
            "key": "52093100",
            "doc_count": 486,
            "value": "Fabrics, woven; containing 85% or more by weight of cotton, dyed, plain
```

<Check>
Congratulations! This concludes our Trade Search - Suppliers & Buyers Guide. Whether you're conducting in-depth research or simply exploring global trade patterns, we hope our API offers the data and insights you need.
</Check>
