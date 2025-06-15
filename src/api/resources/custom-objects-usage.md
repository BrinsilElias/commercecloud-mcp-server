# Create/Update Site-Specific Custom Object

**Operation ID:** `Create site specific Custom Object`

**Method:** `PUT`, `PATCH`

**Endpoint:**

```
https://{host}/s/-/dw/data/v25_6/sites/{site_id}/custom_objects/{object_type}/{key}
```

## Description

Creates a site-specific Custom Object using the request body.

> ⚠️ If a Custom Object with the same key exists, it will be **overwritten**.

### Notes

- Use custom properties prefixed with `c_`.
- For localizable strings, use a map structure:

  ```json
  "c_localized_field": {
    "en_US": "Value in English",
    "fr_FR": "Valeur en Français"
  }
  ```

## Fault Responses

- **400** - `MalformedKeyParameterException`: Object key format is invalid (integer expected).
- **404** - `ObjectTypeNotFoundException`: Unknown object type ID.
- **404** - `CustomObjectNotFoundException`: Unknown object key.

## Request Example (cURL)

```bash
curl "https://{host}/s/-/dw/data/v25_6/sites/{site_id}/custom_objects/{object_type}/{key}" \
  -X PUT \
  -H "content-type: application/json" \
  -d '{
    "key_property": "key_attribute",
    "object_type": "my_object_type",
    "c_boolean": true,
    "c_date": "2015-02-03T00:00:00.000Z",
    "c_email": "jdoe@salesforce.com",
    "c_integer": 42,
    "c_number": 42,
    "c_string": "some text"
  }'
```

## Path Parameters

### `site_id` (string, required)

- ID of the site
- Min: 1 character

### `object_type` (string, required)

- ID of the object type
- Min: 1 character

### `key` (string, required)

- Key attribute of the Custom Object
- Min: 1 character

## Request Body Example

```json
{
  "key_property": "key_attribute",
  "object_type": "my_object_type",
  "c_boolean": true,
  "c_date": "2015-02-03T00:00:00.000Z",
  "c_email": "jdoe@salesforce.com",
  "c_integer": 42,
  "c_number": 42,
  "c_string": "some text"
}
```

## Response Attributes

- `key_property` (string): Name of the key property (ignored in input).
- `key_value_integer` (integer): ID when key type is Integer (ignored in input).
- `key_value_string` (string): ID when key type is String (ignored in input).
- `object_type` (string): ID of the object type (ignored in input).

## Error Example

### `MalformedKeyParameterException`

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

- `arguments` (object): Additional fault data for client-side error messaging.
- `cause` (object): Root cause of the exception.
- `display_message_pattern` (string): Localized message format (if `display_locale` is set).
- `message` (string): Exception message.
- `stack_trace` (string): Java stack trace.
- `type` (string): Java exception class name.
