import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { getBasketByIdSchema } from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getBasketById = (server: McpServer) => {
  server.tool(
    "get-basket-by-id",
    "Fetches a basket by their id using the SFCC OCAI - Shop API This requires the basket id to be provided as an input",
    getBasketByIdSchema.shape,
    async ({ id }: { id: string }) => {
      const basket = await ocapi.get(SHOP_API_TYPE, `/baskets/${id}`, {
        auth: {
          isAuthRequired: true,
          grantType: "bm_user_grant",
        },
      })
      return {
        content: [{ type: "text", text: JSON.stringify(basket, null, 2) }],
      }
    },
  )
}
