# Open Commerce API | B2C Commerce | Salesforce Developers

## Queries

You can use queries to be selective about data returned by OCAPI, which reduces network bandwidth.

A query contains a set of objects that define criteria used to select records. A query can contain one of the following:

- [`match_all_query`](#match_all_query) - returns all records.
- [`term_query`](#term_query) - matches records where a field (or fields) exactly match some simple value (including null).
- [`text_query`](#text_query) - matches records where a field (or fields) contain a search phrase.
- [`boolean_query`](#boolean_query) - formulates a complex boolean expression using query objects as criteria.
- [`filtered_query`](#filtered_query) - allows for filtering of records based on both a query and a filter.

Queries can also contain [nested queries](#nested_query).

A match all query simply matches all documents (namespace and document type). This query comes in handy if you just want to filter a search result or really do not have any constraints.

**Example:**

A term query matches one (or more) value(s) against one (or more) document field(s). A document is considered a hit if one of the values matches (exactly) with at least one of the given fields. The operator "is" can only take one value, while "one_of" can take multiple values. If multiple fields are specified, they are combined using the OR operator. The less and greater operators are not compatible with some search types. To query based on numeric bounds in those cases, you can use a [range filter](https://sfcclearning.com/infocenter/OCAPI/current/data/Documents/RangeFilter.php) on a [filtered query](https://sfcclearning.com/infocenter/OCAPI/current/data/Documents/FilteredQuery.php).

**Elastic only**: If used with multiple fields, the query is internally handled as a boolean OR of DisjointMaxQueries (with the dismax matching a value against all fields). The dismax makes sure that a document carrying a single term in multiple fields does not get higher scores than a document matching multiple terms in multiple fields.

**Example:** (id="my_id")

**Example:** (id IN ("my_id","other_id"))

**Example:** (id=null)

**Example:** ((id IN ('generic', 'keyword')) OR (description IN ('generic', 'keyword'))

- Property: fields
  - Type: [String]
  - Constraints: mandatory=true, minItems=1, nullable=false
  - Description: The document field(s), the value(s) are matched against, combined with the operator.
- Property: operator
  - Type: Enum {is, one_of, is_null, is_not_null, less, greater, not_in, neq}
  - Constraints: mandatory=true, nullable=false
  - Description: Returns the operator to use for the term query.
- Property: values
  - Type: [Object]
  - Constraints:
  - Description: The values, the field(s) are compared against, combined with the operator.

A text query is used to match some text (i.e. a search phrase possibly consisting of multiple terms) against one or multiple fields. In case multiple fields are provided, the phrase conceptually forms a logical OR over the fields. In this case, the terms of the phrase basically have to match within the text, that would result in concatenating all given fields.

**Example:** (coupon_id contains "xmas" )

**Example:** (coupon_id contains "xmas" OR description contains "xmas")

**Example:** (description contains "holiday" AND description contains "bojo")

- Property: fields
  - Type: [String]
  - Constraints: mandatory=true, minItems=1, nullable=false
  - Description: The document fields the search phrase has to match against.
- Property: search_phrase
  - Type: String
  - Constraints: mandatory=true, nullable=false
  - Description: A search phrase, which may consist of multiple terms.

A boolean query allows construction of full logical expression trees consisting of other queries (usually term and text queries). A boolean query basically has 3 sets of clauses that 'must', 'should' and / or 'must not' match. If 'must', 'must_not', or 'should' appear in the same boolean query, they are combined logically using the AND operator. **Example:** (id = 'foo' AND description LIKE 'bar')

**Example:** (id = 'foo' OR description LIKE 'bar')

**Example:** (NOT (id = 'foo' OR description LIKE 'bar'))

**Example:** ((coupon_id LIKE "limit" AND description LIKE "limit per customer") AND NOT (enabled=false))

- Property: must
  - Type: [query {boolean_query, match_all_query, filtered_query, nested_query, term_query, text_query}]
  - Constraints:
  - Description: List of queries that must match.
- Property: must_not
  - Type: [query {boolean_query, match_all_query, filtered_query, nested_query, term_query, text_query}]
  - Constraints:
  - Description: List of queries that must not match.
- Property: should
  - Type: [query {boolean_query, match_all_query, filtered_query, nested_query, term_query, text_query}]
  - Constraints:
  - Description: List of queries that should match.

Queries can be nested.

A filtered query allows to filter the result of a (possibly complex) query using a (possibly complex) filter. **Example:**

- Property: filter
  - Type: Filter {BoolFilter, QueryFilter, Range2Filter, RangeFilter, TermFilter}
  - Constraints: mandatory=true, nullable=false
  - Description: The (possibly complex) filter object.
- Property: query
  - Type: [query {boolean_query, match_all_query, filtered_query, nested_query, term_query, text_query}]
  - Constraints: mandatory=true, nullable=false
  - Description: The query object.

A nested query queries nested documents that are part of a larger document. The classical example is a product master with variants (in one big document) where you want to constrain a search to masters that have variants that match multiple constraints (like color = blue AND size = M). This query is not compatible with some search types.

**Example:** finds all the documents that has firstname = "John" and lastname = "Doe"

- Property: path
  - Type: [String]
  - Constraints:
- Property: query
  - Type: [query {boolean_query, match_all_query, filtered_query, nested_query, term_query, text_query}]
  - Constraints: mandatory=true, nullable=false
- Property: score_mode
  - Type: Enum {avg, total, max, none}
  - Constraints:
