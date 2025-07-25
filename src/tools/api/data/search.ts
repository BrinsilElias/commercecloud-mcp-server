import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { DATA_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const search = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "search-resource",
    {
      title: "Search",
      description: "Search for data using the SFCC OCAI - Data API",
      inputSchema: {
        type: z
          .enum(["product_search", "category_search", "job_execution_search"])
          .describe("The type of the data to search for"),
        fields: z.array(z.string()).describe("The fields to search in"),
        search_phrase: z.string().describe("The search phrase to search for"),
      },
    },
    async ({
      type,
      fields,
      search_phrase,
    }: {
      type: string
      fields: string[]
      search_phrase: string
    }) => {
      const data = await ocapi.post(DATA_API_TYPE, `/${type}`, {
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
        content: [{ type: "text", text: JSON.stringify(data) }],
      }
    },
  )
}
