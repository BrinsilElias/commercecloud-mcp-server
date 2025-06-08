import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { getProductByIdSchema, getProductsByIdsSchema } from "./schema"

export const getProductById: ServerToolDefinition = {
  toolName: "get-product-by-id",
  toolDescription: "Get a product by ID using the SFCC OCAI - Shop API",
  toolSchema: getProductByIdSchema.shape,
  toolHandler: async ({
    id,
    options,
  }: {
    id: string
    options: Record<string, any>
  }) => {
    const response = await ocapi.get(SHOP_API_TYPE, `/products/${id}`, {
      queryParams: options || {},
    })
    return {
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
    }
  },
}

export const getProductsByIds: ServerToolDefinition = {
  toolName: "get-products-by-ids",
  toolDescription:
    "Get multiple products by their IDs using the SFCC OCAI - Shop API",
  toolSchema: getProductsByIdsSchema.shape,
  toolHandler: async ({
    ids,
    options,
  }: {
    ids: string[]
    options: Record<string, any>
  }) => {
    const response = await ocapi.get(
      SHOP_API_TYPE,
      `/products/(${ids.join(",")})`,
      {
        queryParams: options || {},
      },
    )
    return {
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
    }
  },
}
