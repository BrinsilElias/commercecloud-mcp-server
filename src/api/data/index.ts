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

export const registerDataApiTools = (server: McpServer) => {
  // Categories API
  categorySearch(server)

  // Products API
  productSearch(server)
  updateProductById(server)

  // Custom Objects API
  getCustomObject(server)
  updateCustomObject(server)
  createCustomObject(server)
  customObjectSearch(server)

  // Libraries API
  getContentById(server)
  updateContentById(server)

  // Customer Lists API
  getCustomerListById(server)
  getCustomerByCustomerNumber(server)

  // Jobs API
  jobExecutionSearch(server)
}
