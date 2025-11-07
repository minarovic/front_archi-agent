## Summary
The Sayari API employs a tiered rate limiting system to ensure reliable access and maintain performance. Different endpoints have different rate limits based on their complexity and resource requirements.

<Note>Note: Sayari reserves the right to adjust rate limits to account for surges in activity in order to maintain platform stability</Note>

```json
{
  "status": 429,
  "success": false,
  "messages": ["Too many requests within too short of a period."]
}
```

## Rate Limits

### Tier 1: Advanced Endpoints
The following endpoints have a rate limit of 30 requests permitted in a 10-second period. Exceeding this limit will result in a 10-second block.

- /v1/search
- /v1/traversal
- /v1/ubo
- /v1/downstream
- /v1/watchlist
- /v1/shortest_path
- /v1/supply_chain/upstream

### Tier 2: Standard Endpoints
All other endpoints have a rate limit of 400 requests allowed in a 1-minute period. Exceeding this limit will result in a 1-minute block.

Standard endpoints include, but are not limited to:

- /v1/resolution
- /v1/entity
- /v1/entity_summary
- /v1/record
- /v1/sources
- /v1/projects
- /v1/notifications
- /v1/attribute
- /v1/resource

## Rate Limit Comparison

| Tier     | Requests | Time Period | Block Duration |
| -------- | -------- | ----------- | -------------- |
| Advanced | 30       | 10 seconds  | 10 seconds     |
| Standard | 400      | 1 minute    | 1 minute       |

- Advanced endpoints allow 3 requests per second on average, with a shorter block duration.
- Standard endpoints allow approximately 6.66 requests per second on average, but with a longer block duration if exceeded.

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What happens if the limit is exceeded?">
    If the rate limit is exceeded, a block will be enforced. For advanced endpoints, this block will last 10 seconds. For standard endpoints, the block will last 1 minute. During this time, you will be temporarily blocked from making further requests to the affected endpoint(s).
  </Accordion>
  <Accordion title="Can I increase the rate limit maximums?">
    If you're consistently hitting our max limits on a regular basis, please reach out to your Account Manager to discuss your needs.
  </Accordion>
  <Accordion title="How do I know which tier an endpoint belongs to?">
    Advanced endpoints are explicitly listed in the "Tier 1" section. All other endpoints fall under the standard rate limit (Tier 2). If you're unsure about a specific endpoint, you can assume it's in the standard tier or contact our support team for clarification.
  </Accordion>
</AccordionGroup>
