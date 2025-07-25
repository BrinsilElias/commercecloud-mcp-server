import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { SHOP_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getContentsByIds = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-contents-by-ids",
    {
      title: "Get contents by IDs",
      description:
        "Fetches multiple contents by their ids using the SFCC OCAI - Shop API " +
        "This requires the content ids to be provided as an input ",
      inputSchema: {
        ids: z.array(z.string()).describe("The ids of the contents to fetch"),
      },
    },
    async ({ ids }: { ids: string[] }) => {
      const contents = await ocapi.get(SHOP_API_TYPE, `/content/(${ids.join(",")})`)
      return {
        content: [{ type: "text", text: JSON.stringify(contents) }],
      }
    },
  )
}

export const contentSearch = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "content-search",
    {
      title: "Search content",
      description:
        "Searches for contents using the SFCC OCAI - Shop API " +
        "This requires the search query to be provided as an input " +
        "Additional options need to be provided to filter the search results",
      inputSchema: {
        q: z.string().describe("The search query which has to be a text/phrase."),
      },
    },
    async (options: Record<string, any>) => {
      const queryParams = options ? { ...options } : {}
      const contents = await ocapi.get(SHOP_API_TYPE, `/content_search`, {
        queryParams,
      })
      return {
        content: [{ type: "text", text: JSON.stringify(contents) }],
      }
    },
  )
}
