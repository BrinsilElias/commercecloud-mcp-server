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
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"

export const registerShopApiTools = (server: McpServer) => {
  // Products API
  getProductById(server)
  getProductsByIds(server)

  // Orders API
  orderSearch(server)
  getOrderById(server)

  // Content API
  getContentsByIds(server)
  contentSearch(server)

  // Customers API
  getCustomerById(server)
  getCustomerBasketById(server)
  getCustomerOrderById(server)

  // Baskets API
  getBasketById(server)

  // Categories API
  getCategoryById(server)
  getCategoriesByIds(server)
}
