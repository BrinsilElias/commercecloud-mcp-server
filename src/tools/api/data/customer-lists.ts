import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { DATA_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getCustomerListById = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-customer-list-by-id",
    {
      title: "Get customer list by ID",
      description:
        "Fetches a customer list using the list id from the SFCC OCAI - Data API " +
        "This requires the list id to be provided as an input and the list id is always set to the site id",
      inputSchema: {
        id: z
          .string()
          .describe("The id of the customer list to fetch, this is always set to the site id"),
      },
    },
    async ({ id }: { id: string }) => {
      ocapi.setMethod("GET")
      const customerList = await ocapi.call(DATA_API_TYPE, `/customer_lists/${id}`)
      return {
        content: [{ type: "text", text: JSON.stringify(customerList) }],
      }
    },
  )
}

export const getCustomerByCustomerNumber = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-customer-by-customer-number",
    {
      title: "Get customer by customer number",
      description:
        "Fetches a customer by their customer number using the SFCC OCAI - Data API " +
        "This requires the customer number to be provided as an input",
      inputSchema: {
        id: z
          .string()
          .describe("The id of the customer list to fetch, this is always set to the site id"),
        customerNumber: z.string().describe("The customer number to fetch"),
      },
    },
    async ({ id, customerNumber }: { id: string; customerNumber: string }) => {
      ocapi.setMethod("GET")
      const customer = await ocapi.call(
        DATA_API_TYPE,
        `/customer_lists/${id}/customers/${customerNumber}`,
      )
      return {
        content: [{ type: "text", text: JSON.stringify(customer) }],
      }
    },
  )
}
