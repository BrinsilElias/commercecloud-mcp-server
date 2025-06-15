# Search Categories API

**Operation ID:** `Search Categories`
**Method:** `POST`
**Endpoint:** `https://{host}/s/-/dw/data/v25_6/category_search`

Searches for catalog categories anywhere they appear.

> ℹ️ By default, this returns the **first level of subcategories**. To retrieve deeper levels, use the `levels` parameter. Higher values may impact performance if the category tree is large.

---

## Searchable Attributes

- `id`: _String_
- `name`: _String_
- `description`: _String_
- `creation_date`: _DateTime_
- `online`: _Boolean_
- `catalog_id`: _String_

## Sortable Attributes

- `id`: _String_
- `name`: _String_
- `description`: _String_
- `creation_date`: _DateTime_
- `online`: _Boolean_
- `position`: _Double_

---

## Request Example (cURL)

```bash
curl "https://{host}/s/-/dw/data/v25_6/category_search" \
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

### `levels`: _integer_

- Defines depth of subcategory hierarchy to retrieve.
- **Min:** 0

### `count`: _integer_

- Number of results to return.
- **Min:** 1, **Max:** 200

### `db_start_record_`: _integer_

- Starting index for result set.
- **Min:** 0

### `expand`: _array of strings_

- Optional expansions to include in the response.

### `query`: _any (Required)_

- A complex object for filtering results. Types include:

  - `match_all_query`
  - `term_query`
  - `text_query`
  - `boolean_query`
  - `filtered_query`

### `select`: _string_

- Fields to include in the response.

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

- Index of first result to include.
- **Min:** 0

---

## Response Example (Error)

### MalformedSearchParameterException

Occurs when the query is invalid or malformed.

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

- `arguments`: _object_ – Map of key-value fault details.
- `cause`: _object_ – Underlying exception cause.
- `display_message_pattern`: _string_ – Localized display pattern (if `display_locale` is provided).
- `message`: _string_ – Error message text.
- `stack_trace`: _string_ – Full Java stack trace.
- `type`: _string_ – Exception name.

---
