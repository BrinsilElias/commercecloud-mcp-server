import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { getContentByIdSchema, updateContentByIdSchema } from "./schema"

export const getContentById: ServerToolDefinition = {
  toolName: "get-content-by-id",
  toolDescription:
    "Fetches a content by its id using the SFCC OCAI - Data API " +
    "This requires the content id to be provided as an input ",
  toolSchema: getContentByIdSchema.shape,
  toolHandler: async ({ id, libraryId }: { id: string; libraryId: string }) => {
    const content = await ocapi.get(
      DATA_API_TYPE,
      `/libraries/${libraryId}/content/${id}`,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(content, null, 2) }],
    }
  },
}

export const updateContentById: ServerToolDefinition = {
  toolName: "update-content-by-id",
  toolDescription:
    "Updates a content by its id using the SFCC OCAI - Data API " +
    "This requires the content id and library id to be provided as an input " +
    "The content to update needs to be provided as an input",
  toolSchema: updateContentByIdSchema.shape,
  toolHandler: async ({
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
}
