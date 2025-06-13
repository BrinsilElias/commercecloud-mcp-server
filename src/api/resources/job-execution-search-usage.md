# Search Job Executions API (v25_6)

## Endpoint

```
POST /s/-/dw/data/v25_6/job_execution_search
```

## Description

Searches for job executions using complex query criteria.

---

## Searchable Attributes

- `id` _(String)_
- `job_id` _(String)_
- `start_time` _(Date)_
- `end_time` _(Date)_
- `status` _(String)_

## Sortable Attributes

- `job_id`
- `start_time`
- `end_time`
- `status`

---

## Request Body Parameters

| Field              | Type              | Description                                       |
| ------------------ | ----------------- | ------------------------------------------------- |
| `count`            | integer           | Number of returned documents _(min: 1, max: 200)_ |
| `db_start_record_` | integer           | Record index to start with _(min: 0)_             |
| `expand`           | array of strings  | Optional expands for search results               |
| `query`            | object (required) | Query definition object                           |
| `select`           | string            | Field(s) to be selected                           |
| `sorts`            | array             | List of sorting options                           |
| `start`            | integer           | Index of the first hit to include _(min: 0)_      |

---

## Example Request

```bash
curl "https://{host}/s/-/dw/data/v25_6/job_execution_search" \
  -X POST \
  -H "content-type: application/json" \
  -d '{
    "count": 10,
    "db_start_record_": 0,
    "expand": [""],
    "query": {
      "term_query": {
        "fields": ["status"],
        "operator": "is",
        "values": ["OK"]
      }
    },
    "select": "",
    "sorts": [
      {
        "field": "start_time",
        "sort_order": "asc"
      }
    ],
    "start": 0
  }'
```

---

## Query Object Types

- `match_all_query`
- `term_query`
- `text_query`
- `boolean_query`
- `filtered_query`

---

## Example Query Only

```json
{
  "query": {
    "term_query": {
      "fields": ["status"],
      "operator": "is",
      "values": ["OK"]
    }
  }
}
```

---

## Example Response

```json
{
  "count": 1,
  "hits": [
    {
      "id": "cdYS39aaabttcaaadpCLYBAOMV",
      "job_id": "ImportProducts_stg",
      "start_time": "2015-12-16T09:49:08.905Z",
      "end_time": "2015-12-16T09:49:11.905Z",
      "status": "finished",
      "log_file_name": "Job-ImportProducts_stg@Sites-Site-20151216094909124.log",
      "duration": 3000,
      "exit_status": {
        "code": "OK",
        "message": "OK",
        "status": "ok"
      },
      "is_log_file_existing": true,
      "is_restart": true,
      "modification_time": "2015-12-16T09:49:11.617Z",
      "domain_names": ["Sites-Site", "Sites-SiteGenesis-Site"]
    }
  ]
}
```

---

## Pagination

Response includes `next` and `previous` objects to assist with pagination.

---

## Notes

- The `query` attribute must follow one of the valid query formats.
- Only `sortable` fields can be used in the `sorts` clause.
- Returned `hits` may be empty if no matching jobs are found.
