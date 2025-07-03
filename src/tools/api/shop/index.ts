import { getProducts } from "./products"
import { getCategories } from "./categories"
import { OcapiClient } from "@/services/ocapi"
import { orderSearch, getOrderById } from "./orders"
import { getContentsByIds, contentSearch } from "./content"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerShopApiTools = (server: McpServer, ocapi: OcapiClient) => {
  // Products API
  getProducts(server, ocapi)

  // Orders API
  orderSearch(server, ocapi)
  getOrderById(server, ocapi)

  // Content API
  getContentsByIds(server, ocapi)
  contentSearch(server, ocapi)

  // Categories API
  getCategories(server, ocapi)
}
