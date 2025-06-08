import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { getCategoryByIdSchema, getCategoriesByIdsSchema } from "./schema"

export const getCategoryById: ServerToolDefinition = {
  toolName: "get-category-by-id",
  toolDescription:
    "Fetches a category by their id using the SFCC OCAI - Shop API " +
    "This requires the category id to be provided as an input",
  toolSchema: getCategoryByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const category = await ocapi.get(SHOP_API_TYPE, `/categories/${id}`)
    return {
      content: [{ type: "text", text: JSON.stringify(category, null, 2) }],
    }
  },
}

export const getCategoriesByIds: ServerToolDefinition = {
  toolName: "get-categories-by-ids",
  toolDescription:
    "Fetches a list of categories by their ids using the SFCC OCAI - Shop API " +
    "This requires the category ids to be provided as an input",
  toolSchema: getCategoriesByIdsSchema.shape,
  toolHandler: async ({ ids }: { ids: string[] }) => {
    const categories = await ocapi.get(
      SHOP_API_TYPE,
      `/categories/(${ids.join(",")})`,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
    }
  },
}
