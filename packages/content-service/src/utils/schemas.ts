import { z } from "zod"

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
