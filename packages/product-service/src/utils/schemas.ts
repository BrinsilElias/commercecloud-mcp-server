import { z } from "zod"

export const updateProductByIdSchema = z.object({
  id: z.string().describe("The id of the product to update"),
  product: z.record(z.string(), z.any()).describe("The product to update"),
})

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
        .describe(
          "The expand parameter. A comma separated list with the allowed values (availability, bundled_products, links, promotions, options, images, prices, variations, set_products, recommendations)",
        ),
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
