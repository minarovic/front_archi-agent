## [Resolution](/api/api-reference/resolution/resolution)

**Use Case:** Entity Screening and Validation

Resolution utilizes elastic search and natural language processing (NLP) techniques to provide the most accurate matches for your query.  The response includes an entity attribute profile, Sayari `entity_id`, and explanation to help you understand how confident each match is.

<Cards>
  <Card
    title="Guide: Resolution"
    icon="fa-light fa-circle-exclamation-check"
    href="/api/guides/resolution"
  />
    <Card
    title="Use Case: Entity Screening & Verification"
    icon="fa-light fa-screen-users"
    href="/api/use-cases/entity-screening-verification"
  />
</Cards>

## [Entity Search](/api/api-reference/search/search-entity)

**Use Case:** Investigations, Broad Searches, and Exploratory Lead Generation

Best suited for investigative purposes where your search terms might be broad.  Sayari search takes the query term and returns an entity's general profile, relationships, risks, and attributes. Overall, this endpoint is ideal for lead generation.

<Cards>
  <Card
    title="Guide: Entity Search"
    icon="fa-light fa-magnifying-glass"
    href="/api/guides/entity-search"
  />
    <Card
    title="Use Case: Investigations"
    icon="fa-light fa-user-secret"
    href="/api/use-cases/investigations"
  />
</Cards>

## [Trade Search](/api/api-reference/trade/search-shipments)

**Use Case:** Trade Data Searches and Investigations

Designed for searching global trade data, including shipments, buyers, and suppliers, with three specific endpoints: `/shipments`, `/suppliers`, and `/buyers`. The response provides key shipping data, including dates, departure and arrival destinations, risks associated with involved parties, Harmonized System (HS) codes, shipment descriptions, weight and other measures, and much more! Enable `facets` to return summarized trade activity.

<Cards>
  <Card
    title="Guide: Trade Search - Shipments"
    icon="fa-light fa-ship"
    href="/api/guides/trade-search-shipments"
  />
  <Card
    title="Guide: Trade Search - Suppliers & Buyers"
    icon="fa-light fa-ship"
    href="/api/guides/trade-search-suppliers-buyers"
  />
</Cards>

## [Entity](/api/api-reference/entity/get-entity)

**Use Case:** Accessing Full Entity Profiles

After receiving an `entity_id`, use this endpoint to access a comprehensive entity profile from the Sayari Knowledge Graph, including attributes, risk factors, and relationships.

## [Entity Summary](/api/api-reference/entity/entity-summary)

**Use Case:** Accessing Summarized Entity Profiles

Identical to the Entity endpoint but returns a condensed profile without `relationships`, for when a smaller payload is preferred.

## [Traversal](/api/api-reference/traversal/traversal)

**Use Case:** Identifying Relationships and Paths

Identifies paths from a target entity to related entities within the Sayari Knowledge Graph. Filters like `sanctioned` and `regulatory_action` help refine searches. Requires a target entity `id`.

## [Ultimate Beneficial Ownership (UBO)](/api/api-reference/traversal/ubo)

**Use Case:** Uncovering Beneficial Owners

Focuses on identifying the ultimate beneficial owners of a company, offering a simplified query for ownership structures. Requires a target entity `id`.

## [Ownership](/api/api-reference/traversal/ownership)

**Use Case:** Identifying Upstream Ownership

The Ownership endpoint returns paths from a single target entity to up to 50 entities directly or indirectly owned by that entity. This endpoint is a shorthand for the equivalent traversal query. Requires a target entity `id`.

## [Watchlist](/api/api-reference/traversal/watchlist)

**Use Case:** Screening for Politically Exposed Persons (PEPs)

Finds paths to entities on watchlists or identified as PEP, simplifying compliance checks. Requires a target entity `id`.

## [Shortest Path](/api/api-reference/traversal/shortest-path)

**Use Case:** Finding Shortest Connections Between Entities

Determines the shortest path between two entities within the Sayari Knowledge Graph. Requires both entities' `id`.

## [List Sources](/api/api-reference/source/list-sources)

**Use Case:** Discovering Data Sources

Provides a transparent list of data sources utilized by Sayari, with pagination required to view beyond the first 100 sources.

## [Get Sources](/api/api-reference/source/get-source)

**Use Case:** Understanding Specific Data Sources

Returns metadata about a specific source when given the source's `id`, aiding in source verification and understanding.

## [Get Record](/api/api-reference/record/get-record)

**Use Case:** Retrieving Specific Records

Allows for the retrieval of specific records from the Sayari Knowledge Graph, including `document_url`, by specifying the record's `id`.

## [Get Usage](/api/api-reference/info/get-usage)

**Use Case:** Monitoring API Usage

Offers insights into API account usage, detailing views per API path, credits consumed, and the query time period.

## [Project](/api/api-reference/project/get-projects)

**Use Case:** Saving entities for future retrieval, searching, and notifications.

Allows entities to be saved. Saved entities can be searched, filtered, and sorted. Change notifications are also offered for any entities saved in projects.

## [Notification](/api/api-reference/notifications/project-notifications)

**Use Case:** Checking for changes to risk on saved entities.

Notifications are generated when risk changes on entities saved to a project. They can be retrieved for all entities in a project, or just for one saved entity at a time.
