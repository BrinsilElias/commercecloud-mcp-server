import { jobExecutionSearch } from "./jobs"
import { categorySearch } from "./categories"
import { productSearch, updateProductById } from "./products"
import { getContentById, updateContentById } from "./libraries"
import {
  createCustomObject,
  getCustomObject,
  updateCustomObject,
  customObjectSearch,
} from "./custom-objects"
import {
  getCustomerListById,
  getCustomerByCustomerNumber,
} from "./customer-lists"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"
import { OcapiClient } from "../../services/ocapi"
import { env } from "../../utils/env"

const ocapi = new OcapiClient(env)

export const registerDataApiTools = (server: McpServer) => {
  // Categories API
  categorySearch(server, ocapi)

  // Products API
  productSearch(server, ocapi)
  updateProductById(server, ocapi)

  // Custom Objects API
  getCustomObject(server, ocapi)
  updateCustomObject(server, ocapi)
  createCustomObject(server, ocapi)
  customObjectSearch(server, ocapi)

  // Libraries API
  getContentById(server, ocapi)
  updateContentById(server, ocapi)

  // Customer Lists API
  getCustomerListById(server, ocapi)
  getCustomerByCustomerNumber(server, ocapi)

  // Jobs API
  jobExecutionSearch(server, ocapi)
}
