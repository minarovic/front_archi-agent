The Sayari API uses conventional HTTP response codes to indicate the success or failure of an API request.

## Success

All successful requests will be indicated with **`2xx`** status codes.

| Code | Response | Description                                             |
| ---- | -------- | ------------------------------------------------------- |
| 200  | Ok       | Successful GET request. Everything worked as expected.  |
| 201  | Created  | Successful POST request. Everything worked as expected. |

## Errors

**`4xx`** range codes indicate errors based on provided information. **`5xx`** range codes indicate server-side errors.

Error codes in the **`4xx`** range often include an error code for clarity.

| Code | Response               | Description                                                                                                                                    |
| ---- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 400  | Bad Request            | Incorrectly formatted request.                                                                                                                 |
| 401  | Unauthorized           | Request made without valid token.                                                                                                              |
| 404  | Not Found              | Resource not found or does not exist.                                                                                                          |
| 405  | Method Not Allowed     | Request made with an unsupported HTTP method. Currently only GET and POST are supported.                                                       |
| 406  | Not Acceptable         | Request made in an unacceptable state. This is most commonly due to parameter validation errors.                                               |
| 415  | Unsupported Media Type | Accept header on request set to an unsupported media type. Currently only application/json and text/csv are supported for indicated resources. |
| 429  | Rate Limited           | Too many requests within too short of a period. The reply will contain a retry-after header that indicates when the client can safely retry.   |
| 500  | Internal Server Error  | Internal server error occurred.                                                                                                                |

**Error format:**

```json
{
  "status": 500,
  "success": false,
  "messages": ["Internal Server Error"]
}
```

Validation messages on request parameters will also be displayed in the **messages** field to give more information on the failed request.
