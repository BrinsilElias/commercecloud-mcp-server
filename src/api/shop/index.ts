import { getBasketById } from "./baskets"
import { orderSearch, getOrderById } from "./orders"
import { getContentsByIds, contentSearch } from "./content"
import { getProductById, getProductsByIds } from "./products"
import { getCategoryById, getCategoriesByIds } from "./categories"
import {
  getCustomerById,
  getCustomerBasketById,
  getCustomerOrderById,
} from "./customers"
import { env } from "../../utils/env"
import { OcapiClient } from "../../services/ocapi"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerShopApiTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  // Products API
  getProductById(server, ocapi)
  getProductsByIds(server, ocapi)

  // Orders API
  orderSearch(server, ocapi)
  getOrderById(server, ocapi)

  // Content API
  getContentsByIds(server, ocapi)
  contentSearch(server, ocapi)

  // Customers API
  getCustomerById(server, ocapi)
  getCustomerBasketById(server, ocapi)
  getCustomerOrderById(server, ocapi)

  // Baskets API
  getBasketById(server, ocapi)

  // Categories API
  getCategoryById(server, ocapi)
  getCategoriesByIds(server, ocapi)
}
