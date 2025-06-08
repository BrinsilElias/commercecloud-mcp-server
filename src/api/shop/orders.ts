import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { getOrderByIdSchema, searchSchema } from "./schema"

export const getOrderById: ServerToolDefinition = {
  toolName: "get-order-by-id",
  toolDescription:
    "Fetches an order by its id using the SFCC OCAI - Shop API " +
    "This requires the order id to be provided as an input ",
  toolSchema: getOrderByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const order = await ocapi.get(SHOP_API_TYPE, `/orders/${id}`, {
      auth: {
        isAuthRequired: true,
        grantType: "bm_user_grant",
      },
    })
    return {
      content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
    }
  },
}

export const orderSearch: ServerToolDefinition = {
  toolName: "order-search",
  toolDescription:
    "Searches for orders using the SFCC OCAI - Shop API " +
    "This requires the search query to be provided as an input " +
    "Additional options need to be provided to filter the search results " +
    "Use order-search-usage resource to use the queries filed in the options",
  toolSchema: searchSchema.shape,
  toolHandler: async (options: Record<string, any>) => {
    const body = options ? { ...options } : {}
    const orders = await ocapi.post(SHOP_API_TYPE, `/order_search`, {
      auth: {
        isAuthRequired: true,
        grantType: "bm_user_grant",
      },
      body,
    })
    return {
      content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
    }
  },
}
