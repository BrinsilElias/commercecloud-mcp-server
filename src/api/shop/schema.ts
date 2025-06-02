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
  options: z.object({
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
    currency: z.string().describe("The currency mnemonic specified for price."),
    all_images: z
      .boolean()
      .describe(
        "The flag that indicates whether to retrieve the whole image model for the requested product.",
      ),
  }),
})

export const productSearchSchema = z.object({
  count: z.number().describe("The number of products to return.").optional(),
  refine: z
    .string()
    .describe(
      "Parameter that represents a refinement attribute/value(s) pair. Refinement attribute id and value(s) are separated by '='. \
      Multiple values are supported by a sub-set of refinement attributes and can be provided by separating them using a pipe (URL encoded = '|').\
      Value ranges can be specified like this: refine=price=(100..500)\
      Multiple refine parameters can be provided by adding an underscore in combination with an integer counter right behind the parameter name and a counter range 1..9. I.e.\
      refine=price_1=(100..500)&refine=price_2=(1000..2000)\
      The following system refinement attribute ids are supported:\
      cgid: Allows to refine per single category id. Multiple category ids are not supported.\
      price: Allows to refine per single price range. Multiple price ranges are not supported.\
      pmid: Allows to refine per promotion id(s).\
      htype: Allow to refine by including only the provided hit types. Accepted types are 'product', 'master', 'set', 'bundle', 'slicing_group' (deprecated), 'variation_group'.\
      orderable_only: Unavailable products will be excluded from the search results if true is set. Multiple refinement values are not supported.",
    )
    .optional(),
  locale: z.string().describe("The locale context."),
  expand: z
    .array(z.string())
    .describe("The fields to expand in the product data")
    .optional(),
  q: z.string().describe("The search query which has to be a text/phrase."),
  currency: z.string().describe("The currency mnemonic specified for price."),
  sort: z
    .string()
    .describe("The id of the sorting option to sort the search hits.")
    .optional(),
  start: z
    .number()
    .describe("The index of the first search hit to return.")
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
  query: z.record(z.unknown()).describe("The query to search for orders."),
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
