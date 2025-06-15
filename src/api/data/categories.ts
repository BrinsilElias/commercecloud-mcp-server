import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { searchSchema } from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const categorySearch = (server: McpServer) => {
  server.tool(
    "category-search",
    "Searches for categories using the SFCC OCAI - Data API " +
      "This requires the search query to be provided as an input " +
      "Additional options can be provided to filter the search results",
    searchSchema.shape,
    async (options: Record<string, any>) => {
      const body = options ? { ...options } : {}
      const categories = await ocapi.post(DATA_API_TYPE, `/category_search`, {
        body,
      })
      return {
        content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
      }
    },
  )
}
