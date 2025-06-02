# Update/Create Content Asset

**Operation ID:** `Update/Create content asset`

**Method:** `PATCH`, `PUT`

**Endpoint:**

```
https://{host}/s/-/dw/data/v25_6/libraries/{library_id}/content/{content_id}
```

## Description

Updates a content asset.

### Headers

- `If-Match` (Required): ETag representing the last known base-point for the content asset.

  - **409** - If missing (`IfMatchRequiredException`)
  - **412** - If value doesn't match server's ETag (`InvalidIfMatchException`)

### Behavior

- Updates are atomic; either complete or not done.
- If the content asset is locked, server returns:

  - **409** - `ResourceLockedException`

## Fault Responses

- **400** - `ContentIdAlreadyInUseException`: Content asset ID to change to already exists.
- **412** - `ResourceLockedException`: Request body ID doesn't match URL ID.
- **404** - `ContentNotFoundException`: Unknown content asset ID.
- **404** - `LibraryNotFoundException`: Unknown library ID.

## Request Example (cURL)

```bash
curl "https://{host}/s/-/dw/data/v25_6/libraries/{library_id}/content/{content_id}" \
  -X PATCH \
  -H "content-type: application/json" \
  -H "If-Match: {etag}" \
  -d '{
    "description": {
      "default": "Global My Account Banner"
    },
    "id": "account-banner",
    "name": {
      "default": "My Account Banner"
    },
    "online": {
      "default": false
    },
    "searchable": {
      "default": false
    },
    "site_map_change_frequency": {
      "default": "never"
    },
    "site_map_included": {
      "default": 0
    },
    "site_map_priority": {
      "default": 0
    },
    "c_body": {
      "default": {
        "source": "<p>This is the account banner body.</p>"
      }
    }
  }'
```

## Path Parameters

### `library_id` (string, required)

- ID of the shared or private library (site-id).
- Min: 1 character
- Max: 256 characters

### `content_id` (string, required)

- ID of the content asset to update.
- Min: 1 character
- Max: 256 characters

## Request Body Example

```json
{
  "description": {
    "default": "Global My Account Banner"
  },
  "id": "account-banner",
  "name": {
    "default": "My Account Banner"
  },
  "online": {
    "default": false
  },
  "searchable": {
    "default": false
  },
  "site_map_change_frequency": {
    "default": "never"
  },
  "site_map_included": {
    "default": 0
  },
  "site_map_priority": {
    "default": 0
  },
  "c_body": {
    "default": {
      "source": "<p>This is the account banner body.</p>"
    }
  }
}
```

## Response Attributes

- `classification_folder_id` (string): ID of the default classification folder. Read-only.
- `classification_folder_link` (string): Link to the default classification folder. Read-only.
- `description` (object): Localized description.
- `id` (string): ID of the content asset. (1-256 chars)
- `link` (string): Link to the content asset.
- `name` (object): Localized name.
- `online` (object): Whether the asset is online.
- `page_description` (object): Localized page description.
- `page_keywords` (object): Localized page keywords.
- `page_title` (object): Localized page title.
- `page_url` (object): Localized page URL.
- `searchable` (object): Whether the asset is searchable.
- `site_map_change_frequency` (object): Sitemap change frequency.
- `site_map_included` (object): Include in sitemap (0 or 1).
- `site_map_priority` (object): Sitemap priority (0.0 = no priority).
- `template` (string): Rendering template.

## Error Example

### `ContentIdAlreadyInUseException`

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

### Fields

- `arguments` (object): Fault arguments, used for client error messaging.
- `cause` (object): Cause of the error.
- `display_message_pattern` (string): Localized display message.
- `message` (string): Exception message.
- `stack_trace` (string): Java stack trace.
- `type` (string): Name of the Java exception.
