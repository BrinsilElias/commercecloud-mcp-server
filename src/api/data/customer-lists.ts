import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import {
  getCustomerByCustomerNumberSchema,
  getCustomerListByIdSchema,
} from "./schema"

export const getCustomerListById: ServerToolDefinition = {
  toolName: "get-customer-list-by-id",
  toolDescription:
    "Fetches a customer list using the list id from the SFCC OCAI - Data API " +
    "This requires the list id to be provided as an input and the list id is always set to the site id",
  toolSchema: getCustomerListByIdSchema.shape,
  toolHandler: async ({ id }: { id: string }) => {
    const customerList = await ocapi.get(DATA_API_TYPE, `/customer_lists/${id}`)
    return {
      content: [{ type: "text", text: JSON.stringify(customerList, null, 2) }],
    }
  },
}

export const getCustomerByCustomerNumber: ServerToolDefinition = {
  toolName: "get-customer-by-customer-number",
  toolDescription:
    "Fetches a customer by their customer number using the SFCC OCAI - Data API " +
    "This requires the customer number to be provided as an input",
  toolSchema: getCustomerByCustomerNumberSchema.shape,
  toolHandler: async ({
    id,
    customerNumber,
  }: {
    id: string
    customerNumber: string
  }) => {
    const customer = await ocapi.get(
      DATA_API_TYPE,
      `/customer_lists/${id}/customers/${customerNumber}`,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(customer, null, 2) }],
    }
  },
}
