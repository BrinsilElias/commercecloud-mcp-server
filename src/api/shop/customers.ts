import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import {
  getCustomerByIdSchema,
  getCustomerBasketByIdSchema,
  getCustomerOrderByIdSchema,
} from "./schema"

export const getCustomerById: ServerToolDefinition = {
  toolName: "get-customer-by-id",
  toolDescription:
    "Fetches a customer by their customer id using the SFCC OCAI - Shop API " +
    "This requires the customer id to be provided as an input",
  toolSchema: getCustomerByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const customer = await ocapi.get(SHOP_API_TYPE, `/customers/${id}`, {
      auth: {
        isAuthRequired: true,
        grantType: "bm_user_grant",
      },
    })
    return {
      content: [{ type: "text", text: JSON.stringify(customer, null, 2) }],
    }
  },
}

export const getCustomerBasketById: ServerToolDefinition = {
  toolName: "get-customer-basket-by-id",
  toolDescription:
    "Fetches a customers basket by their customer id using the SFCC OCAI - Shop API " +
    "This requires the customer id to be provided as an input",
  toolSchema: getCustomerBasketByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const basket = await ocapi.get(SHOP_API_TYPE, `/customers/${id}/baskets`, {
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

export const getCustomerOrderById: ServerToolDefinition = {
  toolName: "get-customer-order-by-id",
  toolDescription:
    "Fetches a customers order by their customer id using the SFCC OCAI - Shop API " +
    "This requires the customer id to be provided as an input",
  toolSchema: getCustomerOrderByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const order = await ocapi.get(SHOP_API_TYPE, `/customers/${id}/orders`, {
      auth: {
        isAuthRequired: true,
        grantType: "bm_user_grant",
      },
    })
    return {
      content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
    }
  },
}
