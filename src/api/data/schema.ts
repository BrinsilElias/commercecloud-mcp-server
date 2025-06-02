import { z } from "zod"

export const getOrDeleteCustomObjectSchema = z.object({
  object_type: z.string().describe("The type of the custom object to fetch"),
  objectKey: z.string().describe("The key of the custom object to fetch"),
})

export const createOrUpdateCustomObjectSchema = z.object({
  object_type: z.string().describe("The type of the custom object to update"),
  objectKey: z.string().describe("The key of the custom object to update"),
  object: z.record(z.string(), z.any()).describe("The object to update"),
})

export const updateProductByIdSchema = z.object({
  id: z.string().describe("The id of the product to update"),
  product: z.record(z.string(), z.any()).describe("The product to update"),
})

export const getContentByIdSchema = z.object({
  id: z.string().describe("The id of the content to fetch"),
  libraryId: z
    .string()
    .describe("The id of the library to fetch the content from"),
})

export const updateContentByIdSchema = z.object({
  id: z.string().describe("The id of the content to update"),
  libraryId: z
    .string()
    .describe("The id of the library to update the content in"),
  content: z.record(z.string(), z.any()).describe("The content to update"),
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

export const customObjectSearchSchema = z.object({
  object_type: z.string().describe("The type of the custom object to search"),
  options: z.object({
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
  }),
})
