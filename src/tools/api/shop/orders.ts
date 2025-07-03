import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { SHOP_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getOrderById = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-order-by-id",
    {
      title: "Get order by ID",
      description:
        "Fetches an order by its id using the SFCC OCAI - Shop API " +
        "This requires the order id to be provided as an input ",
      inputSchema: {
        id: z.string().describe("The id of the order to fetch"),
      },
    },
    async ({ id }: { id: string }) => {
      const order = await ocapi.get(SHOP_API_TYPE, `/orders/${id}`, {
        auth: true,
      })
      return {
        content: [{ type: "text", text: JSON.stringify(order) }],
      }
    },
  )
}

export const orderSearch = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "order-search",
    {
      title: "Search orders",
      description:
        "Searches for orders using the SFCC OCAI - Shop API " +
        "This requires the search query to be provided as an input " +
        "Additional options need to be provided to filter the search results " +
        "Use order-search-usage resource to use the queries filed in the options",
      inputSchema: {
        fields: z.array(z.string()).describe("The fields to search in"),
        search_phrase: z.string().describe("The search phrase to search for"),
      },
    },
    async ({ fields, search_phrase }: { fields: string[]; search_phrase: string }) => {
      const orders = await ocapi.post(SHOP_API_TYPE, `/order_search`, {
        auth: true,
        body: {
          query: {
            text_query: {
              fields,
              search_phrase,
            },
          },
          select: "(**)",
        },
      })
      return {
        content: [{ type: "text", text: JSON.stringify(orders) }],
      }
    },
  )
}
