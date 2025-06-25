import { getProductById, getProductsByIds } from "./shop"
import { productSearch, updateProductById } from "./data"
import { OcapiClient } from "@commercecloud/common"
import { env } from "../utils/env"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  getProductById(server, ocapi)
  getProductsByIds(server, ocapi)
  productSearch(server, ocapi)
  updateProductById(server, ocapi)
}
