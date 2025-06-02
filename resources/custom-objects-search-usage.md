# Search Custom Objects API

**Operation ID:** `Search custom objects`
**Method:** `POST`
**Endpoint:** `https://{host}/s/-/dw/data/v25_6/custom_objects_search/{object_type}`

Searches custom objects for a specific custom object type.

> 🔒 The `{object_type}` path parameter is required and identifies the custom object type to search.

---

## Searchable Attributes

- `key_value_string`: _String_
- `key_value_integer`: _Integer_
- `creation_date`: _Date_
- `last_modified`: _Date_
- `site_id`: _String_
- Any _custom attribute_

> ℹ️ Only searchable attributes can be used for sorting.

---

## Request Example (cURL)

```bash
curl "https://{host}/s/-/dw/data/v25_6/custom_objects_search/{object_type}" \
  -X POST \
  -H "content-type: application/json" \
  -d '{
    "count": 0,
    "db_start_record_": 0,
    "expand": [""],
    "query": "",
    "select": "",
    "sorts": [
      {
        "field": "",
        "sort_order": "asc"
      }
    ],
    "start": 0
  }'
```

---

## Request Fields

### `object_type`: _string (Required)_

- ID of the custom object type.
- **Min length:** 1

### `count`: _integer_

- Number of documents to return.
- **Min:** 1, **Max:** 200

### `db_start_record_`: _integer_

- Zero-based index to start from.
- **Min:** 0

### `expand`: _array of strings_

- List of expansions to apply (optional).

### `query`: _any (Required)_

A complex filter object that supports:

- `match_all_query`
- `term_query`
- `text_query`
- `boolean_query`
- `filtered_query`

### `select`: _string_

- Fields to include in the response.

### `sorts`: _array_

- Optional sorting rules.

```json
[
  {
    "field": "id",
    "sort_order": "asc"
  }
]
```

### `start`: _integer_

- Index of the first search result to include.
- **Min:** 0

---

## Response Errors

### `TypeMissmatchException`

Occurs when the query value type doesn't match the field type.

### `ObjectTypeNotFoundException`

Occurs when the specified `object_type` doesn't exist.

#### Example Error Response

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

#### Error Fields

- `arguments`: _object_ – Key-value details of the fault.
- `cause`: _object_ – Nested error details.
- `display_message_pattern`: _string_ – Localized message template.
- `message`: _string_ – Main error message.
- `stack_trace`: _string_ – Java stack trace.
- `type`: _string_ – Exception type name.

---
