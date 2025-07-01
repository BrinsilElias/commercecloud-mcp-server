import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { SHOP_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getProducts = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-products",
    {
      title: "Get product(s)",
      description: "Get one or multiple products by ID(s) using the SFCC OCAI - Shop API",
      inputSchema: {
        ids: z.array(z.string()).describe("Array of product ID(s)"),
        expand: z.array(z.string()).describe(
          "The fields to expand in the product data:\
        all, availability, bundled_products, links, promotions, options,\
        images, prices, variations, set_products, recommendations",
        ),
      },
    },
    async ({ ids, expand }: { ids: string | string[]; expand?: string[] }) => {
      ocapi.setMethod("GET")

      // Handle both single ID and array of IDs
      const productIds = Array.isArray(ids) ? ids : [ids]
      const path =
        productIds.length === 1
          ? `/products/${productIds[0]}`
          : `/products/(${productIds.join(",")})`

      const response = await ocapi.call(SHOP_API_TYPE, path, {
        queryParams: {
          expand: expand || "",
        },
      })
      return {
        content: [{ type: "text", text: JSON.stringify(response) }],
      }
    },
  )
}
