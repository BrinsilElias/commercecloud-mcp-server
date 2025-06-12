import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"
import {
  getCustomerByIdSchema,
  getCustomerBasketByIdSchema,
  getCustomerOrderByIdSchema,
} from "./schema"

export const getCustomerById = (server: McpServer) => {
  server.tool(
    "get-customer-by-id",
    "Fetches a customer by their customer id using the SFCC OCAI - Shop API This requires the customer id to be provided as an input",
    getCustomerByIdSchema.shape,
    async ({ id }: { id: string }) => {
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
  )
}

export const getCustomerBasketById = (server: McpServer) => {
  server.tool(
    "get-customer-basket-by-id",
    "Fetches a customers basket by their customer id using the SFCC OCAI - Shop API This requires the customer id to be provided as an input",
    getCustomerBasketByIdSchema.shape,
    async ({ id }: { id: string }) => {
      const basket = await ocapi.get(
        SHOP_API_TYPE,
        `/customers/${id}/baskets`,
        {
          auth: {
            isAuthRequired: true,
            grantType: "bm_user_grant",
          },
        },
      )
      return {
        content: [{ type: "text", text: JSON.stringify(basket, null, 2) }],
      }
    },
  )
}

export const getCustomerOrderById = (server: McpServer) => {
  server.tool(
    "get-customer-order-by-id",
    "Fetches a customers order by their customer id using the SFCC OCAI - Shop API This requires the customer id to be provided as an input",
    getCustomerOrderByIdSchema.shape,
    async ({ id }: { id: string }) => {
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
  )
}
