import { getContentsByIdsSchema, contentSearchSchema } from "../utils/schemas"
import { OcapiClient, SHOP_API_TYPE } from "@commercecloud/common"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getContentsByIds = (server: McpServer, ocapi: OcapiClient) => {
  server.tool(
    "get-contents-by-ids",
    "Fetches multiple contents by their ids using the SFCC OCAI - Shop API " +
      "This requires the content ids to be provided as an input ",
    getContentsByIdsSchema.shape,
    async ({ ids }: { ids: string[] }) => {
      const contents = await ocapi.get(
        SHOP_API_TYPE,
        `/content/(${ids.join(",")})`,
      )
      return {
        content: [{ type: "text", text: JSON.stringify(contents, null, 2) }],
      }
    },
  )
}

export const contentSearch = (server: McpServer, ocapi: OcapiClient) => {
  server.tool(
    "content-search",
    "Searches for contents using the SFCC OCAI - Shop API " +
      "This requires the search query to be provided as an input " +
      "Additional options need to be provided to filter the search results",
    contentSearchSchema.shape,
    async (options: Record<string, any>) => {
      const queryParams = options ? { ...options } : {}
      const contents = await ocapi.get(SHOP_API_TYPE, `/content_search`, {
        queryParams,
      })
      return {
        content: [{ type: "text", text: JSON.stringify(contents, null, 2) }],
      }
    },
  )
}
