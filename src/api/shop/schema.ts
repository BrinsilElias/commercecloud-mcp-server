import { z } from "zod"

export const getProductsByIdsSchema = z.object({
  ids: z.array(z.string()).describe("The ids of the products to fetch"),
  options: z
    .object({
      inventory_ids: z
        .array(z.string())
        .describe(
          "The optional inventory list ids, for which the availability should be shown.",
        ),
      locale: z.string().describe("The locale context."),
      expand: z
        .array(z.string())
        .describe("The fields to expand in the product data"),
      currency: z
        .string()
        .describe("The currency mnemonic specified for price."),
      all_images: z
        .boolean()
        .describe(
          "The flag that indicates whether to retrieve the whole image model for the requested product.",
        ),
    })
    .partial()
    .optional(),
})

export const getProductByIdSchema = z.object({
  id: z.string().describe("The id of the product to fetch"),
  options: z
    .object({
      inventory_ids: z
        .array(z.string())
        .describe(
          "The optional inventory list ids, for which the availability should be shown.",
        ),
      locale: z.string().describe("The locale context."),
      expand: z
        .array(z.string())
        .describe(
          "The expand parameter. A comma separated list with the allowed values (availability, bundled_products, links, promotions, options, images, prices, variations, set_products, recommendations)",
        )
        .optional(),
      currency: z
        .string()
        .describe("The currency mnemonic specified for price."),
      all_images: z
        .boolean()
        .describe(
          "The flag that indicates whether to retrieve the whole image model for the requested product.",
        ),
    })
    .partial()
    .optional(),
})

export const getOrderByIdSchema = z.object({
  id: z.string().describe("The id of the order to fetch"),
})

export const searchSchema = z.object({
  count: z.number().describe("The number of results to return.").optional(),
  db_start_record_: z
    .number()
    .describe("The index of the first result to return.")
    .optional(),
  expand: z
    .array(z.string())
    .describe("The fields to expand in the result data")
    .optional(),
  query: z
    .object({
      match_all_query: z.record(z.string(), z.any()).describe(
        "A match all query simply matches all documents (namespace and document type).\
          This query comes in handy if you just want to filter a search result or really do not have any constraints.",
      ),
      term_query: z.record(z.string(), z.any()).describe(
        "A term query matches one (or more) value(s) against one (or more) document field(s).\
        A document is considered a hit if one of the values matches (exactly) with at least one of the given fields",
      ),
      text_query: z
        .record(z.string(), z.any())
        .describe(
          "A text query is used to match some text (i.e. a search phrase possibly consisting of multiple terms) against one or multiple fields.",
        ),
      bool_query: z
        .record(z.string(), z.any())
        .describe(
          "A boolean query allows construction of full logical expression trees consisting of other queries (usually term and text queries).",
        ),
      filtered_query: z
        .record(z.string(), z.any())
        .describe(
          "A filtered query allows to filter the result of a (possibly complex) query using a (possibly complex) filter.",
        ),
    })
    .partial()
    .describe("The field to query documents"),
  select: z
    .string()
    .describe("The fields to select in the result data")
    .optional(),
  sorts: z
    .array(
      z.object({
        field: z.string().describe("The field to sort by."),
        sort_order: z.enum(["asc", "desc"]).describe("The order to sort by."),
      }),
    )
    .describe("The fields to sort by.")
    .optional(),
  start: z
    .number()
    .describe("The index of the first result to return.")
    .optional(),
})

export const getContentsByIdsSchema = z.object({
  ids: z.array(z.string()).describe("The ids of the contents to fetch"),
})

export const contentSearchSchema = z.object({
  count: z.number().describe("The number of contents to return.").optional(),
  refine: z
    .string()
    .describe(
      "Parameter that represents a refinement attribute/value(s) pair. Refinement attribute id and value(s) are separated by '='. \
      Multiple values are supported by a sub-set of refinement attributes and can be provided by separating them using a pipe (URL encoded = '|'). \
      Value ranges can be specified like this: refine=foo=(100..500) \
      Multiple refine parameters can be provided by adding an underscore in combination with an integer counter right behind the parameter name and a counter range 1..9. I.e. refine_1=c_refinementType=type1|type2|type3. \
      The following system refinement attribute ids are supported: \
      fdid: Allows to refine per single content folder id. Multiple folder ids are not supported.",
    )
    .optional(),
  locale: z.string().describe("The locale context.").optional(),
  q: z.string().describe("The search query which has to be a text/phrase."),
  sort: z
    .string()
    .describe("The id of the sorting option to sort the search hits.")
    .optional(),
  start: z
    .number()
    .describe("The index of the first search hit to return.")
    .optional(),
})

export const getCustomerByIdSchema = z.object({
  id: z.string().describe("The id of the customer to fetch"),
  expand: z
    .array(z.string())
    .describe(
      "The expand parameter. A comma separated list with the allowed values ( addresses, paymentinstruments ).",
    )
    .optional(),
})

export const getCustomerBasketByIdSchema = z.object({
  id: z.string().describe("The id of the customer to fetch"),
})

export const getCustomerOrderByIdSchema = z.object({
  id: z.string().describe("The id of the customer to fetch"),
  count: z
    .number()
    .describe(
      "the maximum number of instances per request; default value is 10",
    )
    .optional(),
  until: z
    .string()
    .describe(
      "The until date specifying the date time range to filter orders\
      (inclusive, null allowed, ISO8601 date time format: yyyy-MM-dd'T'HH:mmZ).",
    )
    .optional(),
  status: z
    .array(z.string())
    .describe(
      "The order status of the orders to be retrieved.\
      Status included: created, new, open, completed, cancelled, replaced, failed.",
    )
    .optional(),
  from: z
    .string()
    .describe(
      "The from date specifying the date time range to filter orders\
      (inclusive, null allowed, ISO8601 date time format: yyyy-MM-dd'T'HH:mmZ).",
    )
    .optional(),
  start: z
    .number()
    .describe(
      "the result set index to return the first instance for; default value is 0",
    )
    .optional(),
})

export const getBasketByIdSchema = z.object({
  id: z.string().describe("The id of the basket to fetch"),
})

export const getCategoryByIdSchema = z.object({
  id: z.string().describe("The id of the category to fetch"),
  levels: z
    .array(z.number())
    .describe(
      "Specifies how many levels of nested subcategories you want the server to return.\
      The default value is 1. Valid values are 0, 1, or 2. Only online subcategories are returned.",
    )
    .optional(),
  locale: z.string().describe("The locale context.").optional(),
})

export const getCategoriesByIdsSchema = z.object({
  ids: z.array(z.string()).describe("The ids of the categories to fetch"),
  levels: z
    .array(z.number())
    .describe(
      "Specifies how many levels of nested subcategories you want the server to return.\
      The default value is 1. Valid values are 0, 1, or 2. Only online subcategories are returned.",
    )
    .optional(),
  locale: z.string().describe("The locale context.").optional(),
})
