import { z } from "zod"

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

export const getCustomerListByIdSchema = z.object({
  id: z
    .string()
    .describe(
      "The id of the customer list to fetch, this is always set to the site id",
    ),
})

export const getCustomerByCustomerNumberSchema = z.object({
  id: z
    .string()
    .describe(
      "The id of the customer list to fetch, this is always set to the site id",
    ),
  customerNumber: z.string().describe("The customer number to fetch"),
})
