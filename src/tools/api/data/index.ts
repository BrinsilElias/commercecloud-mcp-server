import { search } from "./search"
import { OcapiClient } from "@/services/ocapi"
import { manageProduct, getProduct } from "./products"
import { getContentById, manageContentById } from "./libraries"
import { getCustomerListById, getCustomerByCustomerNumber } from "./customer-lists"
import { manageCustomObject, getCustomObject, customObjectSearch } from "./custom-objects"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerDataApiTools = (server: McpServer, ocapi: OcapiClient) => {
  // Products API
  getProduct(server, ocapi)
  manageProduct(server, ocapi)

  // Custom Objects API
  getCustomObject(server, ocapi)
  manageCustomObject(server, ocapi)
  customObjectSearch(server, ocapi)

  // Libraries API
  getContentById(server, ocapi)
  manageContentById(server, ocapi)

  // Customer Lists API
  getCustomerListById(server, ocapi)
  getCustomerByCustomerNumber(server, ocapi)

  // Common Search API
  search(server, ocapi)
}
