import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import {
  getCustomerByCustomerNumberSchema,
  getCustomerListByIdSchema,
} from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getCustomerListById = (server: McpServer) => {
  server.tool(
    "get-customer-list-by-id",
    "Fetches a customer list using the list id from the SFCC OCAI - Data API " +
      "This requires the list id to be provided as an input and the list id is always set to the site id",
    getCustomerListByIdSchema.shape,
    async ({ id }: { id: string }) => {
      const customerList = await ocapi.get(
        DATA_API_TYPE,
        `/customer_lists/${id}`,
      )
      return {
        content: [
          { type: "text", text: JSON.stringify(customerList, null, 2) },
        ],
      }
    },
  )
}

export const getCustomerByCustomerNumber = (server: McpServer) => {
  server.tool(
    "get-customer-by-customer-number",
    "Fetches a customer by their customer number using the SFCC OCAI - Data API " +
      "This requires the customer number to be provided as an input",
    getCustomerByCustomerNumberSchema.shape,
    async ({ id, customerNumber }: { id: string; customerNumber: string }) => {
      const customer = await ocapi.get(
        DATA_API_TYPE,
        `/customer_lists/${id}/customers/${customerNumber}`,
      )
      return {
        content: [{ type: "text", text: JSON.stringify(customer, null, 2) }],
      }
    },
  )
}
