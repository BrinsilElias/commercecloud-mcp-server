import z from "zod"
import { OcapiClient } from "@/services/ocapi"
import { DATA_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getContentById = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-content-by-id",
    {
      title: "Get content by ID",
      description:
        "Fetches a content by its id using the SFCC OCAI - Data API " +
        "This requires the content id to be provided as an input ",
      inputSchema: {
        id: z.string().describe("The id of the content to fetch"),
        libraryId: z.string().describe("The id of the library to fetch the content from"),
      },
    },
    async ({ id, libraryId }: { id: string; libraryId: string }) => {
      const content = await ocapi.get(DATA_API_TYPE, `/libraries/${libraryId}/content/${id}`)
      return {
        content: [{ type: "text", text: JSON.stringify(content) }],
      }
    },
  )
}

export const manageContentById = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "manage-content-by-id",
    {
      title: "Create or update content by ID",
      description:
        "Creates or updates a content by its id using the SFCC OCAI - Data API. " +
        "Use operation 'create' for new content (PUT method) or 'update' for existing content (PATCH method). " +
        "This requires the content id and library id to be provided as an input " +
        "The content data needs to be provided as an input",
      inputSchema: {
        id: z.string().describe("The id of the content to create or update"),
        libraryId: z.string().describe("The id of the library to create or update the content in"),
        content: z.record(z.string(), z.any()).describe("The content data"),
        operation: z
          .enum(["create", "update"])
          .describe(
            "The operation to perform: 'create' for new content (PUT method) or " +
              "'update' for existing content (PATCH method)",
          ),
      },
    },
    async ({
      id,
      libraryId,
      content,
      operation,
    }: {
      id: string
      libraryId: string
      content: Record<string, any>
      operation: "create" | "update"
    }) => {
      const body = content ? { ...content } : {}
      const resultContent =
        operation === "create"
          ? await ocapi.put(DATA_API_TYPE, `/libraries/${libraryId}/content/${id}`, { body })
          : await ocapi.patch(DATA_API_TYPE, `/libraries/${libraryId}/content/${id}`, { body })
      return {
        content: [{ type: "text", text: JSON.stringify(resultContent) }],
      }
    },
  )
}
