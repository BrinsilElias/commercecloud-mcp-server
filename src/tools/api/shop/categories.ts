import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { SHOP_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getCategories = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-categories",
    {
      title: "Get categor(ies)",
      description: "Get one or multiple categories by ID(s) using the SFCC OCAI - Shop API",
      inputSchema: {
        ids: z.array(z.string()).describe("Array of category ID(s)"),
      },
    },
    async ({ ids }: { ids: string[] }) => {
      // Build path based on number of IDs
      const path = ids.length === 1 ? `/categories/${ids[0]}` : `/categories/(${ids.join(",")})`
      const response = await ocapi.get(SHOP_API_TYPE, path)
      return {
        content: [{ type: "text", text: JSON.stringify(response) }],
      }
    },
  )
}
