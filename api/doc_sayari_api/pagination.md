API resources support pagination for large collections. Methods include token pagination (for the entity endpoint) and offset pagination (for all others). To navigate the API efficiently, you’ll need an understanding of these methods.

## Token Pagination

We utilize token pagination within the entity endpoint (relationships, possibly_same_as, and referenced_by), where payload size and dynamic item count make this the most effective method.

**How it works**

- Each request returns a token (e.g., **`next`** or **`prev`**) in the response.
- You can use this token in the next request to fetch the subsequent set of data.
- If there is no token in the request, our platform defaults to the first page of results.
- **`limit`** controls the number of items per page, with a maximum and default value specific to each endpoint. The typical default value is 100.

**Arguments**

| Argument | Type              | Description                                                       |
| -------- | ----------------- | ----------------------------------------------------------------- |
| next     | string (optional) | Token to retrieve the next page of results                        |
| prev     | string (optional) | Token to retrieve the previous page of results                    |
| limit    | string (optional) | A limit on the number of objects to be returned. Defaults to 100. |

**Example**

- `next=qr7bvn2`: Fetch the next page of relationships with a specific token.
- `limit=10`: Restrict the results to 10 items per page.

```bash
GET /entity/abc?attributes.name.limit=10&relationships.next=qr7bvn2
```

## Offset Pagination

Offset pagination is straightforward and used when the total item count is known. It is utilized in most endpoints.

**How it works**

- Users fetch data based on **`offset`** (start point) and **`limit`** (number of items to return).
- **`offset`** defines the starting point by skipping a set number of items.
- **`limit`** sets the maximum items to be returned in a response.
- Metadata in the response indicates the availability of more data.

**Arguments**

| Argument | Type               | Description                                                             |
| -------- | ------------------ | ----------------------------------------------------------------------- |
| offset   | integer (optional) | Number of results to skip before returning a response. Defaults to 100. |
| limit    | string (optional)  | A limit on the number of objects to be returned. Defaults to 100.       |

**Example**

- `offset=20`: Begin results from the 21st object.
- `limit=50`: Restrict the results to 50 items per page.

```bash
GET /search/entity?q=China&offset=20&limit=50
```

---

## Paginating Search

Search queries can return many results. Use offset pagination to manage them efficiently.

**Example**

- `offset=100`: Starts the results from the 101st object.
- `limit=50`: Limits the number of results to 50 per page.

```bash
GET /search/entity?q=China&offset=100&limit=50 HTTP/1.1
Accept: application/json
```

The API response will include information about the availability of additional data:

- The `count` field indicates the number of results (10,000 is the max). There may be more results in this response example.
- The `next` field indicates whether more results are available beyond the current page.
- Subsequent requests can adjust the `offset` to access further results.

```json
{
    "offset": 100,
    "limit": 50,
    "next": true,
    "size": {
        "count": 10000,
        "qualifier": "gte"
    },
    "data": [...]
}
```

## Paginating Entities

When working with entities in the Sayari API, you’ll find that each entity can have multiple attributes and relationships, which often leads to extensive datasets. Use token pagination to manage these results efficiently. Pagination “next” or “prev” tokens are passed as query parameters.

**Example combinations**

- `attributes.[field].['next' | 'prev']=[string]` | `?attributes.address.next=qr7bvn2`
- `relationships.['next' | 'prev']=[string]` | `?relationships.next=qr7bvn2`
- `possibly_same_as.['next' | 'prev']=[string]` | `?possibly_same_as.next=qr7bvn2`
- `referenced_by.['next' | 'prev']=[string]` | `?referenced_by.next=qr7bvn2`

**Examples**

- `attributes.name.limit=10`: Limits the number of name attributes to 10 per page.
- `relationships.next=qr7bvn2`: Uses a token to fetch the next page of relationships.
- `relationships.limit=200`: Sets a limit of 200 for the number of relationships per page (which is the maximum for relationships).

```bash
GET /entity/abc?attributes.name.limit=10&relationships.next=qr7bvn2&relationships.limit=200
```

The API response will include information about the availability of additional data:

- The `count` field indicates the number of results per attribute.
- The `next` & `prev` fields contain tokens that can used in the subsequent request to fetch the next or previous set of data.
- The `limit` field indicates the limit per attribute.

```json
{
    ...
    "attributes": {
        "name": {
            "next": "y4rkp09",
            "limit": 10,
            "size": {
                "count": 18,
                "qualifier": "eq"
            },
            "data": [...]
        }
    },
    "relationships": {
        "next": "w98vmfd",
        "prev": "myvc64l",
        "limit": 200,
        "size": {
            "count": 1201,
            "qualifier": "eq"
        },
        "data": [...]
    },
    "possibly_same_as": {
        "limit": 100,
        "size": {
            "count": 12,
            "qualifier": "eq"
        },

        "data": [...]
    },
    "referenced_by": {
        "next": "84ct7eb",
        "limit": 100,
        "size": {
            "count": 300,
            "qualifier": "eq"
        },
        "data": [...]
    }
}
```

## Paginating Records

For records that reference numerous entities, pagination is key to accessing this data in a manageable way. Records utilize offset pagination.

**Example**

- `offset=100`: Starts the results from the 101st object.
- `limit=50`: Limits the number of results to 50 per page.

```json
GET /record/123?references.offset=100&references.limit=100 HTTP/1.1Accept: application/json`
```

The API response will include information about the availability of additional data:

- The `count` field indicates the number of results.
- The `next` & `prev` fields contain tokens that can used in the subsequent request to fetch the next or previous set of data. In the instance below, “next” is `false` , indicating there are no more results.
- The `limit` field indicates the limit returned.

```json
{
    ...
    "references": {
        "next": false,
        "offset": 100,
        "limit": 100,
        "size": {
            "count": 140,
            "qualifier": "eq"
        },
        "data": [...]
    }
}
```

## Paginating Traversals

The traversal endpoints' response paths are paginated via offsets. Because the total number of potential matching paths is very expensive to compute, the response does not include size values. Instead, use the `next` boolean field to determine if there are more pages of results to return.

**Example**

- `offset=20`: Starts the results from the 21st object.

```bash
GET /traversal/123?offset=20&max_depth=8 HTTP/1.1Accept: application/json
```

The API response will include information about the availability of additional data:

- The `next` & `prev` fields contain tokens that can used in the subsequent request to fetch the next or previous set of data. In the instance below, “next” is `true` , indicating there are more results.
- The `limit` field indicates the limit returned.

```json
{
    "offset": 20,
    "limit": 20,
    "next": true,
    "data": [...]
}
```
