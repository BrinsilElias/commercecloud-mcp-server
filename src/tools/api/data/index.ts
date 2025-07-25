import { search } from "./search"
import { OcapiClient } from "@/services/ocapi"
import { manageProduct, getProduct } from "./products"
import { getContentById, manageContentById } from "./libraries"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerDataApiTools = (server: McpServer, ocapi: OcapiClient) => {
  // Products API
  getProduct(server, ocapi)
  manageProduct(server, ocapi)

  // Libraries API
  getContentById(server, ocapi)
  manageContentById(server, ocapi)

  // Common Search API
  search(server, ocapi)
}
