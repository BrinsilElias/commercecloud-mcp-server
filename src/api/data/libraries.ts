import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { getContentByIdSchema, updateContentByIdSchema } from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"

export const getContentById = (server: McpServer) => {
  server.tool(
    "get-content-by-id",
    "Fetches a content by its id using the SFCC OCAI - Data API " +
      "This requires the content id to be provided as an input ",
    getContentByIdSchema.shape,
    async ({ id, libraryId }: { id: string; libraryId: string }) => {
      const content = await ocapi.get(
        DATA_API_TYPE,
        `/libraries/${libraryId}/content/${id}`,
      )
      return {
        content: [{ type: "text", text: JSON.stringify(content, null, 2) }],
      }
    },
  )
}

export const updateContentById = (server: McpServer) => {
  server.tool(
    "update-content-by-id",
    "Updates a content by its id using the SFCC OCAI - Data API " +
      "This requires the content id and library id to be provided as an input " +
      "The content to update needs to be provided as an input",
    updateContentByIdSchema.shape,
    async ({
      id,
      libraryId,
      content,
    }: {
      id: string
      libraryId: string
      content: Record<string, any>
    }) => {
      const body = content ? { ...content } : {}
      const updatedContent = await ocapi.patch(
        DATA_API_TYPE,
        `/libraries/${libraryId}/content/${id}`,
        {
          body,
        },
      )
      return {
        content: [
          { type: "text", text: JSON.stringify(updatedContent, null, 2) },
        ],
      }
    },
  )
}
