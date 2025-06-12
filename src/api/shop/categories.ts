import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { getCategoryByIdSchema, getCategoriesByIdsSchema } from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"

export const getCategoryById = (server: McpServer) => {
  server.tool(
    "get-category-by-id",
    "Fetches a category by their id using the SFCC OCAI - Shop API This requires the category id to be provided as an input",
    getCategoryByIdSchema.shape,
    async ({ id }: { id: string }) => {
      const category = await ocapi.get(SHOP_API_TYPE, `/categories/${id}`)
      return {
        content: [{ type: "text", text: JSON.stringify(category, null, 2) }],
      }
    },
  )
}

export const getCategoriesByIds = (server: McpServer) => {
  server.tool(
    "get-categories-by-ids",
    "Fetches a list of categories by their ids using the SFCC OCAI - Shop API This requires the category ids to be provided as an input",
    getCategoriesByIdsSchema.shape,
    async ({ ids }: { ids: string[] }) => {
      const categories = await ocapi.get(
        SHOP_API_TYPE,
        `/categories/(${ids.join(",")})`,
      )
      return {
        content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
      }
    },
  )
}
