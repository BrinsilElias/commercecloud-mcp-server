# Search Products API

**Operation ID:** `Search Products`
**Method:** `POST`
**Endpoint:** `https://{host}/s/-/dw/data/v25_6/product_search`

Searches for products.

## Searchable Attributes

Attributes are grouped into different **buckets**:

### Main:

- `id`: _String_
- `name`: _String_
- `online`: _SiteSpecific Boolean_
- `searchable`: _SiteSpecific Boolean_
- `valid_from`: _SiteSpecific DateTime_
- `valid_to`: _SiteSpecific DateTime_
- `type`: _ProductType_
- `creation_date`: _DateTime_
- `last_modified`: _DateTime_

### Catalog:

- `catalog_id`: _String_

### Category:

- `category_id`: _String_

### Special:

- `type`: Enum `{"item", "set", "bundle", "master", "part_of_product_set", "bundled", "variant", "variation_group", "option", "retail_set", "part_of_retail_set"}`

---

## Sortable Attributes

- `id`: _String_
- `name`: _String_
- `creation_date`: _DateTime_

---

## Notes

- Specifying `catalog_id` or `category_id` returns only explicitly assigned products.
- Disjunctions (OR) are allowed **only within the same bucket**. Cross-bucket ORs will throw exceptions.

---

## Expand Options

Use the `expand` parameter to retrieve extra product data:

- `all`: All product properties
- `availability`: `ats`, `in_stock`, `online`
- `categories`: `assigned_categories`
- `images`: `image`
- `all_images`: `image`, `image_groups`
- `prices`: `price`, `price_currency`
- `sets`: `set_products`, `product_sets`
- `bundles`: `product_bundles`, `bundled_products`

---

## Request Example (cURL)

```bash
curl "https://{host}/s/-/dw/data/v25_6/product_search" \
  -X POST \
  -H "content-type: application/json" \
  -d '{
    "count": 0,
    "db_start_record_": 0,
    "expand": [""],
    "query": "",
    "select": "",
    "sorts": [{
      "field": "",
      "sort_order": "asc"
    }],
    "start": 0
  }'
```

---

## Request Fields

### `site_id`: _string_

- The site context.

### `count`: _integer_

- Number of results to return.
- **Min:** 1, **Max:** 200

### `db_start_record_`: _integer_

- Zero-based record index for optimized handling.
- **Min:** 0

### `expand`: _array of strings_

- Optional expansions to include in results.

### `query`: _any (Required)_

- Defines selection criteria.

  - `match_all_query`
  - `term_query`
  - `text_query`
  - `boolean_query`
  - `filtered_query`

### `select`: _string_

- Fields to return.

### `sorts`: _array_

- Optional sort criteria.

```json
[
  {
    "field": "id",
    "sort_order": "asc"
  }
]
```

### `start`: _integer_

- Zero-based index for first result.
- **Min:** 0

---

## Response Example (Error)

### MalformedSearchParameterException

Indicates that the search query is ill-formed.

```json
{
  "arguments": {},
  "cause": {
    "cause": "",
    "message": "",
    "type": ""
  },
  "display_message_pattern": "",
  "message": "",
  "stack_trace": "",
  "type": ""
}
```

### Error Object Fields

- `arguments`: _object_ – key-value pairs to support client-side error messaging.
- `cause`: _object_ – root cause details.
- `display_message_pattern`: _string_ – localized error format (if `display_locale` is provided).
- `message`: _string_ – main error message.
- `stack_trace`: _string_ – Java stack trace.
- `type`: _string_ – exception type.

---
