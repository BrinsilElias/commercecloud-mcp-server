import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { searchSchema } from "./schema"

export const categorySearch: ServerToolDefinition = {
  toolName: "category-search",
  toolDescription:
    "Searches for categories using the SFCC OCAI - Data API " +
    "This requires the search query to be provided as an input " +
    "Additional options can be provided to filter the search results",
  toolSchema: searchSchema.shape,
  toolHandler: async (options: Record<string, any>) => {
    const body = options ? { ...options } : {}
    const categories = await ocapi.post(DATA_API_TYPE, `/category_search`, {
      body,
    })
    return {
      content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
    }
  },
}
