<Warning>
As of **2024-02-09** v0 was officially sunset, and is no longer supported.
</Warning>

# Authentication

- v0 : `sayari.auth0.com/oauth/token`
- v1 : `api.sayari.com/oauth/token`

The old endpoint will be officially deprecated on the sunset date. Previously, issued user credentials, `CLIENT_ID` and `CLIENT_SECRET` will still be valid via the new endpoint. For the new endpoint, Bearer tokens obtained from the resource remain valid for 24 hours. Ensure to include the token in the Authorization header for all subsequent API requests.


# Pagination

In v0 all endpoints used offset pagination, but in v1 we have moved some endpoints to using token pagination. View our [Pagination](/api/key-concepts/pagination) page for details.


Offset Pagination: Arguments

- `limit`: integer optional A limit on the number of objects to be returned. Defaults to 100.
- `offset`: integer optional Number of results to skip before returning response. Defaults to 0.

Impact Endpoints:

- Search
- Traversals
- Record
- Entity References

Token Pagination: Arguments:

- `next`: string optional Token to retrieve the next page of results
- `prev`: string optional Token to retrieve the previous page of results
- `limit`: integer optional A limit on the number of objects to be returned. Defaults to 100.

Impacted Endpoints:

- Entity
    - Relationships
    - Attributes
    - Possibly Same As entities
    - Record References

# Responses

We will now throw 429 errors when rate limits are hit. View our [Response Status Codes](/api/key-concepts/response-status-codes) for details.

# Types

No Change:

- Dates
- Countries
- Source
- EmbeddedRecord
- PossiblySameAsMatches

Updated:

- EmbeddedEntity

No breaking changes here, but wanted to highlight additional fields and enhancements in v1:

- `translated_label`: An optional string.
- `company_type`: An optional string.
- `registration_date`: An optional string.
- `latest_status`: An optional object with `status` as a string and an optional `date`.
- `shipment_arrival`: An optional string.
- `shipment_departure`: An optional string.
- `hs_code`: An optional string.
- `risk`: A complex object with a record structure, including `value`, `metadata`, and `level`.


Data Type & Structural Enhancements in v1:

- `identifiers`: In v1, each identifier includes an additional `label` string.
- `relationship_count` and `source_count` are defined as `Record<string, number>` and `Record<string, { count: number; label: string }>` respectively in v1, which is a more explicit and restrictive type than the more generic object definition in v0.


v1 full object
```json
export type EmbeddedEntity = {
  id: string
  label: string
  degree: number
  entity_url: string
  pep: boolean
  psa_count: number
  sanctioned: boolean
  closed: boolean
  psa_sanctioned?: string
  translated_label?: string
  company_type?: string
  registration_date?: string
  latest_status?: { status: string; date?: string }
  shipment_arrival?: string
  shipment_departure?: string
  hs_code?: string
  type: string
  identifiers: { type: string; value: string; label: string }[]
  addresses: string[]
  date_of_birth?: string
  countries: string[]
  relationship_count: Record<string, number>
  source_count: Record<string, { count: number; label: string }>
  risk: Record<
    string,
    {
      value: string | boolean | number
      metadata: Record<string, (string | boolean | number)[]>
      level: "critical" | "high" | "elevated" | "relevant"
    }
  >
}
```

PathSegment
```json
type TraversalPath = {
  target: EmbeddedEntity
  path: {
    field: string
    entity: EmbeddedEntity
    relationship: RelationshipProperties
    relationships: RelationshipProperties[]
  }
  []:
}
type TraversalPath = {
  source: string
  target: EmbeddedEntity
  path: {
    field: string
    entity: EmbeddedEntity
    relationships: Record<
      string,
      {
        values: RelationshipProperties[]
        former?: true
        start_date?: string
        end_date?: string
        last_observed?: string
      }
    >
  }[]
}
```

The main difference is that we have combined the relationship and relationship properties into one object. The object keys are the relationship type and the value can be seen above.

The `RelationshipProperties` type looks as follows:

```json
type RelationshipProperties = {
  record?: string
  attributes: Record<string, Record<string, Literal>[]>
  from_date?: Date
  date?: Date
  to_date?: Date
  acquisition_date?: Date
  publication_date?: Date
  former?: true
}
```

# Endpoints

All v1 endpoints are prepended with a `v1` in the path.

## Entity

New token pagination for:

- Relationships
- Attributes
- Possibly Same As entities
- Record References
- Relationships API has changed:

Previously you would request relationships: `/entity/:id?relationships.[field].offset=0&relationships.[field].limit=10`

Now we use the `type` param to determine with relationships type to fetch (leave undefined for relationships of all types). We have also added some new params that can be used to filter and sort relationships `v1/entity/:id?relationships.type=[field]&relationships.limit=10`

All new params for relationships are listed below. Visit our [API Reference](/api/api-reference) for details.


- `relationships.next`: integer optional The pagination token for the next page of relationship results
- `relationships.prev`: integer optional The pagination token for the previous page of relationship results
- `relationships.limit`: integer optional Limit total relationship values. Defaults to 100.
- `relationships.type`: integer optional Filter relationships to relationship type, e.g. director_of or has_shareholder
- `relationships.sort`: string optional Sorts relationships by As Of date or Shareholder percentage, e.g. date or -shares
- `relationships.startDate`: date optional Filters relationships to after a date
- `relationships.endDate`: date optional Filters relationships to before a date
- `relationships.minShares`: integer optional Filters relationships to greater than or equal to a Shareholder percentage
- `relationships.country`: string[] optional Filters relationships to a list of countries

Additionally we now support an additional Content Type

- application/vnd.ms-excel Microsoft Excel XLSX response. All previously supported content types are supported as well.


## Entity Summary

No Change

## Traversal

We have added additional params that you can now use to filter traversals. Note that we no longer support the `watchlist` boolean param and have instead replaced it with the `sanctioned` param.

- `sanctioned`: boolean optional Filter paths to only those that end at an entity appearing on a watchlist. Defaults to not filtering paths by sanctioned status.
- `pep`: boolean optional Filter paths to only those that end at an entity appearing on a pep list. Defaults to not filtering paths by pep status.
- `min_shares`: integer optional Set minimum percentage of share ownership for traversal. Defaults to 0.
- `include_unknown_shares`: boolean optional Also traverse relationships when share percentages are unknown. Only useful when min_shares is set greater than 0. Defaults to true.
- `exclude_former_relationships`: boolean optional Include relationships that were valid in the past but not at the present time. Defaults to false.
- `exclude_closed_entities`: boolean optional Include entities that existed in the past but not at the present time. Defaults to false.
The response has changed significantly, see the updated PathSegment type above.

```json
{
 min_depth: number,
 max_depth: number,
 relationships: string[],
 countries: string[],
 types: string[],
 name: string,
 watchlist: boolean,
 psa: boolean,
 offset: number,
 limit: number,
 next: boolean,
 data: TraversalPath[],
 explored_count: number,
}
```

## UBO / Ownership / Watchlist

- All still supported but again the traversal response has changed slightly, see PathSegment update above.

## Shortest Path

- The Shortest Path endpoint returns a response identifying the shortest traversal path connecting each pair of entities.
- New endpoint in v1. Visit our [API Reference](/api/api-reference) for details.

## Record

No Change

## Search

- added a `geo_facets` param that allows you to return search geo bound facets in results giving counts by geo tile.

## Resolution

- The resolution endpoint has been renamed.
- v0: `/resolve/entity`
- v1: `/v1/resolution`
- `dob` renamed to `date_of_birth`
- We no longer support the `fuzziness.[field]` or strict params.
- Support both GET and POST requests. Visit our [API Reference](/api/api-reference) for details.


