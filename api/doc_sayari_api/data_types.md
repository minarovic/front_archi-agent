The Sayari API uses specific data types to structure the information returned in API responses.

## Dates

- **Format:** **`YYYY[-MM[-DD]]`**
- **Description:** Dates are formatted as year-month-day, though partial dates (for example, just year `**2000**` or year-month `**2000-10**`) are acceptable. This flexibility accommodates data where full date details might not be available.
- **Usage:** Dates are common in fields indicating time frames, like **`from_date`**, **`to_date`**, or **`publication_date`**.

## Countries

- **Format:** ISO 3166-1 alpha-3 codes
- **Description:** Countries are represented using three-letter codes as defined by the International Organization for Standardization (ISO). This ensures consistency and ease of understanding across international datasets.
- **Usage:** This data type is useful in filtering or identifying the geographical context of entities or records.

## Source

- **Description:** This type provides metadata about the data source, including its unique identifier, a human-readable label, and the associated country.
- **Usage:** Source information is essential for understanding the origin of the data, which can be critical for verification or compliance purposes.

**Example:**

```json title="Sample Source Object"
{
  "id": "b9dc2ca839c318d04910a8a680131fdf",
  "label": "Albania Trade Register Extracts",
  "country": "ALB"
}
```

## EmbeddedEntity

<Tip>After June 25th, 2024, use the `trade_count` object, to understand if an entity has related shipments.</Tip>

- **Description:** This data type represents a summarized view of an entity, such as a `company` or `person`, within the dataset. It includes identifiers, basic attributes, and links to detailed information.
- **Usage:** This type is used to provide a snapshot of an entity, often in the context of relationships or search results.

```json title="Sample Embedded Entity Object"
{
  "id": "123",
  "label": "ACME Co.",
  "type": "company",
  "entity_url": "/entity/123",
  "identifiers": [{ "type": "uk_company_number", "value": "12345" }],
  "countries": ["GBR"],
  "closed": false,
  "trade_count": {
    "sent": 969,
    "received": 109
    },
  "pep": false,
  "sanctioned": false,
  "psa_sanctioned": "123456",
  "psa_count": 2,
  "source_count": {
    "some_source_id": {
      "count": 2,
      "label": "Some Source Label"
    }
  },
  "degree": 304,
  "addresses": ["32535 31st Rd, Arkansas City, KS, 67005"],
  "date_of_birth": "1990-08-03",
  "relationship_count": {
    "has_shareholder": 300,
    "shareholder_of": 4
  }
}
```

## **EmbeddedRecord**

- **Description:** This is a concise representation of a record, typically a document or filing, including its source, publication and acquisition dates, and a reference count.
- **Usage:** This is useful for making quick reference to official records or documents linked to an entity.

```json title="Sample Embedded Record Object"
{
  "id": "abc",
  "label": "Some Record - 1/14/2020",
  "source": "some_source_id",
  "publication_date": "2019-02-04",
  "acquisition_date": "2019-02-05",
  "references_count": 2,
  "record_url": "record/abc",
  "source_url": "https://entity.com/company/12345"
}
```

## PathSegment

- **Description:** This type details a segment of a relationship path in the data, showing how different entities are connected through various relationships.
- **Usage:** Often used in network analysis or due diligence, this type is key in understanding complex inter-entity relationships.

```json title="Sample Path Segment Object"
{
  "field": "shareholder_of",
  "relationships": {
    "shareholder_of": {
      "values": [
        {
          "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/123567",
          "attributes": {
            "shares": [
              {
                "percentage": 100,
                "monetary_value": 2100000,
                "currency": "USD"
              }
            ]
          },
          "date": "2018-06-14"
        }
      ]
    },
    "director_of": {
      "values": [
        {
          "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/123567",
          "attributes": {
            "position": [{ "value": "Director" }]
          },
          "from_date": "2007-12-01",
          "to_date": "2015-05-01",
          "acquisition_date": "2021-04-14",
          "publication_date": "2021-04-14"
        }
      ],
      "former": true
    }
  },
  "entity": EmbeddedEntity
}
```

## PossiblySameAsMatches

- **Description:** This type indicates potential matches for an entity based on similarity in attributes or relationships. It's used to suggest possible connections or identity overlaps.
- **Usage:** Entities are grouped as *possibly the same* and may qualify as potentially duplicate or related entities. This data type is important for risk and entity assessment.

```json title="Sample PSA Object"
{
  "name": [
    {
      "target": "John Smith",
      "source": "John C Smith"
    }
  ],
  "date_of_birth": [
    {
      "target": "1970-05-02",
      "source": "1970-05"
    }
  ]
}
```
