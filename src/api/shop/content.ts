import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { contentSearchSchema, getContentsByIdsSchema } from "./schema"

export const getContentsByIds: ServerToolDefinition = {
  toolName: "get-contents-by-ids",
  toolDescription:
    "Fetches multiple contents by their ids using the SFCC OCAI - Shop API " +
    "This requires the content ids to be provided as an input ",
  toolSchema: getContentsByIdsSchema.shape,
  toolHandler: async ({ ids }: { ids: string[] }) => {
    const contents = await ocapi.get(
      SHOP_API_TYPE,
      `/content/(${ids.join(",")})`,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(contents, null, 2) }],
    }
  },
}

export const contentSearch: ServerToolDefinition = {
  toolName: "content-search",
  toolDescription:
    "Searches for contents using the SFCC OCAI - Shop API " +
    "This requires the search query to be provided as an input " +
    "Additional options need to be provided to filter the search results",
  toolSchema: contentSearchSchema.shape,
  toolHandler: async (options: { options: Record<string, any> }) => {
    const queryParams = options ? { ...options } : {}
    const contents = await ocapi.get(SHOP_API_TYPE, `/content_search`, {
      queryParams,
    })
    return {
      content: [{ type: "text", text: JSON.stringify(contents, null, 2) }],
    }
  },
}
