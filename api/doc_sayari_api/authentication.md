Access the Sayari API using JSON Web Token (JWT) access tokens. Set `CLIENT_ID` and `CLIENT_SECRET` to obtain a bearer token.

<Info>
Interested and need credentials? Fill out [this form](https://forms.gle/XUyftN1iTECoCJrz7) and our team will get in touch.
</Info>

Example token request

```bash
curl --request POST \
     --url https://api.sayari.com/oauth/token \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "client_id": $CLIENT_ID,
  "client_secret": $CLIENT_SECRET,
  "audience": "sayari.com",
  "grant_type": "client_credentials"
}
'
```

Example token response
```json
{
  "access_token": "sk_test_4eC39HqLyjWDarjtT1zdp7dc",
  "expires_in": 86400,
  "token_type": "Bearer"
}
```

**Token usage**

- Valid for 24 hours; renew as needed.
- Include the token in the `Authorization` header for API requests.

Example request
```bash
curl 'https://api.sayari.com/search/entity?q=china' -H"Authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc"
```
