import { OcapiClient, DATA_API_TYPE } from "@commercecloud/common"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { searchSchema, updateProductByIdSchema } from "../utils/schemas"

export const productSearch = (server: McpServer, ocapi: OcapiClient) => {
  server.tool(
    "product-search",
    "Searches for products using the SFCC OCAI - Data API " +
      "This requires the search query to be provided as an input " +
      "Additional options can be provided to filter the search results",
    searchSchema.shape,
    async (options: Record<string, any>) => {
      const body = options ? { ...options } : {}
      const response = await ocapi.post(DATA_API_TYPE, `/product_search`, {
        body,
      })
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      }
    },
  )
}

export const updateProductById = (server: McpServer, ocapi: OcapiClient) => {
  server.tool(
    "update-product-by-id",
    "Updates a product by its id using the SFCC OCAI - Data API " +
      "This requires the product id to be provided as an input " +
      "The product to update needs to be provided as an input",
    updateProductByIdSchema.shape,
    async ({ id, product }: { id: string; product: Record<string, any> }) => {
      const body = product ? { ...product } : {}
      const response = await ocapi.patch(DATA_API_TYPE, `/products/${id}`, {
        body,
      })
      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      }
    },
  )
}
