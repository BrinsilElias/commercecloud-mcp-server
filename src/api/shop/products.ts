import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { getProductByIdSchema, getProductsByIdsSchema } from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getProductById = (server: McpServer) => {
  server.tool(
    "get-product-by-id",
    "Get a product by ID using the SFCC OCAI - Shop API",
    getProductByIdSchema.shape,
    async ({ id, options }: { id: string; options?: Record<string, any> }) => {
      const response = await ocapi.get(SHOP_API_TYPE, `/products/${id}`, {
        queryParams: options || {},
      })
      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      }
    },
  )
}

export const getProductsByIds = (server: McpServer) => {
  server.tool(
    "get-products-by-ids",
    "Get multiple products by their IDs using the SFCC OCAI - Shop API",
    getProductsByIdsSchema.shape,
    async ({
      ids,
      options,
    }: {
      ids: string[]
      options?: Record<string, any>
    }) => {
      const response = await ocapi.get(
        SHOP_API_TYPE,
        `/products/(${ids.join(",")})`,
        {
          queryParams: options || {},
        },
      )
      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      }
    },
  )
}
