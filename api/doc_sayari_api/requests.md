The Sayari API utilizes standard HTTP verbs:

- `GET` for retrieving resources (parameters in URL query string)
- `POST` for requesting resources (JSON-encoded request bodies)

See the [API reference](/api/api-reference) for details per endpoint.

Example `GET` request
```bash
curl --request GET \
     --url 'https://api.sayari.com/v1/resolution?name=VICTORIA%20BECKHAM&country=GBR&type=person' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc'
```
Example `POST` request

```bash
curl --request POST \
     --url https://api.sayari.com/v1/search/entity \
     --header 'accept: application/json' \
     --header 'authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc' \
     --header 'content-type: application/json' \
     --data '
{
  "filter": {
    "country": [
      "GBR"
    ],
    "entity_type": [
      "person"
    ]
  },
  "q": "Victoria Beckham",
  "fields": [
    "name"
  ]
}
'
```
