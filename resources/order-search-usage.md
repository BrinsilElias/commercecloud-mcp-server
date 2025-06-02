# Search orders

## Endpoint Information

**Operation ID:** Search orders  
**Method:** POST  
**URL:** https://{host}/s/{siteId}/dw/shop/v25_6/order_search

## Description

Searches for orders.

The query attribute specifies a complex query that can be used to narrow down the search.

> **Note:** Search fields are mandatory now and no default ones are supported.
>
> As with the old order search version, the new one always uses Search Service and requires Order Incremental Indexing to be enabled. Otherwise, HTTP 500 response will occur.

## Supported Search Fields

- affiliate_partner_id
- affiliate_partner_name
- business_type
- channel_type
- confirmation_status (String)
- created_by
- creation_date
- last_modified
- currency_code
- customer_email
- customer_name
- customer_no
- export_after
- export_status (String)
- external_order_no
- external_order_status
- global_party_id
- last_modified
- order_no
- original_order_no
- payment_status (String)
- replaced_order_no
- replacement_order_no
- shipping_status (String)
- status (String)
- total_gross_price
- total_net_price
- order.has_holds
- coupon_line_items.coupon_code
- coupon_line_items.coupon_id
- holds.type
- invoices.status
- order_items.status
- payment_instruments.credit.card_type
- payment_instruments.payment_method_id
- product_items.product_id
- return_cases.return_case_number
- shipments.shipping_method_id
- shipping_orders.shipping_order_number

The sort order of the retrieved orders can be specified by the "sorts" parameter. It is a list of objects presenting field name and sort direction ("asc" or "desc").

Custom attributes can be used as search fields and as sort fields too. A prefix "c\_" must be added to them.

> **Important:** The sum of the values of the start and count parameters should not be more than 10000.

## Request Example

### cURL

```bash
curl "https://{host}/s/{siteId}/dw/shop/v25_6/order_search" \
  -X POST \
  -H "content-type: application/json" \
  -d '{
    "query": {
      "text_query": {
        "fields": [
          "customer_email"
        ],
        "search_phrase": "example@non.existing.com"
      }
    },
    "select": "(**)",
    "sorts": [
      {
        "field": "customer_name",
        "sort_order": "asc"
      }
    ]
  }'
```

### Media type:

```json
{
  "query": {
    "text_query": {
      "fields": ["customer_email"],
      "search_phrase": "example@non.existing.com"
    }
  },
  "select": "(**)",
  "sorts": [
    {
      "field": "customer_name",
      "sort_order": "asc"
    }
  ]
}
```

## Request Parameters

| Name             | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| count            | integer         | The number of returned documents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                  |                 | **Min value:** 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                  |                 | **Max value:** 200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| db*start_record* | integer         | The zero-based index of the record that we want to start with, used to optimize special handling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                  |                 | **Min value:** 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| expand           | array of string | List of expansions to be applied to each search results. Expands are optional                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| query            | any             | Required. Document representing a query. A query contains a set of objects that define criteria used to select records. A query can contain one of the following: <ul><li>match_all_query - returns all records.</li><li>term_query - matches records where a field (or fields) exactly match some simple value (including null).</li><li>text_query - matches records where a field (or fields) contain a search phrase.</li><li>boolean_query - formulates a complex boolean expression using query objects as criteria.</li><li>filtered_query - allows for filtering of records based on both a query and a filter.</li></ul> |
| select           | string          | The field to be selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| sorts            | array           | The list of sort clauses configured for the search request. Sort clauses are optional.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|                  |                 | **Example:** `[{"field": "customer_name", "sort_order": "asc"}]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| start            | integer         | The zero-based index of the first search hit to include in the result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|                  |                 | **Min value:** 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## Responses

### Example

```json
{
  "count": 1,
  "hits": [
    {
      "data": {
        "adjusted_merchandize_total_tax": 3.75,
        "adjusted_shipping_total_tax": 0,
        "billing_address": {
          "city": "Boston",
          "country_code": "US",
          "first_name": "Jane",
          "full_name": "Jane Doe",
          "last_name": "Doe",
          "postal_code": "29199"
        },
        "channel_type": "callcenter",
        "c_created_by": "testAgent"
      },
      "relevance": 2.822207450866699
    }
  ],
  "select": "(**)",
  "start": 0,
  "total": 1
}
```

### Media type:

```json
{
  "count": 1,
  "hits": [
    {
      "data": {
        "adjusted_merchandize_total_tax": 3.75,
        "adjusted_shipping_total_tax": 0,
        "billing_address": {
          "city": "Boston",
          "country_code": "US",
          "first_name": "Jane",
          "full_name": "Jane Doe",
          "last_name": "Doe",
          "postal_code": "29199"
        },
        "channel_type": "callcenter",
        "c_created_by": "testAgent"
      },
      "relevance": 2.822207450866699
    }
  ],
  "select": "(**)",
  "start": 0,
  "total": 1
}
```

### Response Parameters

| Name             | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| count            | integer         | The number of returned documents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| data             | array           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| db*start_record* | integer         | The zero-based index of the record that we want to start with, used to optimize special handling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|                  |                 | **Min value:** 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| expand           | array of string | List of expansions to be applied to each search results. Expands are optional                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| hits             | array           | The sorted array of search hits. This array can be empty.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|                  |                 | **Example:** `[{"data": {"adjusted_merchandize_total_tax": 3.75, "adjusted_shipping_total_tax": 0, "billing_address": {"city": "Boston", "country_code": "US", "first_name": "Jane", "full_name": "Jane Doe", "last_name": "Doe", "postal_code": "29199"}, "channel_type": "callcenter", "c_created_by": "testAgent"}, "relevance": 2.822207450866699}]`                                                                                                                                                                                                                                                                |
| next             | object          | Data that can be used to get the next and previous page of a Data API results object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| previous         | object          | Data that can be used to get the next and previous page of a Data API results object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| query            | any             | Document representing a query. A query contains a set of objects that define criteria used to select records. A query can contain one of the following: <ul><li>match_all_query - returns all records.</li><li>term_query - matches records where a field (or fields) exactly match some simple value (including null).</li><li>text_query - matches records where a field (or fields) contain a search phrase.</li><li>boolean_query - formulates a complex boolean expression using query objects as criteria.</li><li>filtered_query - allows for filtering of records based on both a query and a filter.</li></ul> |
| select           | string          | The field to be selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| sorts            | array           | The list of sort clauses configured for the search request. Sort clauses are optional.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                  |                 | **Example:** `[{"field": "customer_name", "sort_order": "asc"}]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| start            | integer         | The zero-based index of the first search hit to include in the result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                  |                 | **Min value:** 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| total            | integer         | The number of returned documents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
