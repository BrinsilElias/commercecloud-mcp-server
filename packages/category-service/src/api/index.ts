import { OcapiClient } from "@commercecloud/common"
import { getCategoryById, getCategoriesByIds } from "./shop"
import { categorySearch } from "./data"
import { env } from "../utils/env"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  getCategoryById(server, ocapi)
  getCategoriesByIds(server, ocapi)
  categorySearch(server, ocapi)
}
