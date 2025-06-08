import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { getBasketByIdSchema } from "./schema"

export const getBasketById: ServerToolDefinition = {
  toolName: "get-basket-by-id",
  toolDescription:
    "Fetches a basket by their id using the SFCC OCAI - Shop API " +
    "This requires the basket id to be provided as an input",
  toolSchema: getBasketByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const basket = await ocapi.get(SHOP_API_TYPE, `/baskets/${id}`, {
      auth: {
        isAuthRequired: true,
        grantType: "bm_user_grant",
      },
    })

    return {
      content: [{ type: "text", text: JSON.stringify(basket, null, 2) }],
    }
  },
}
