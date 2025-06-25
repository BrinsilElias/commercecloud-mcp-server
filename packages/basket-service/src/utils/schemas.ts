import { z } from "zod"

export const getBasketByIdSchema = z.object({
  id: z.string().describe("The id of the basket to fetch"),
})
