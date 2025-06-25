import { OcapiClient } from "@commercecloud/common"
import { getContentsByIds, contentSearch } from "./shop"
import { getContentById, updateContentById } from "./data"
import { env } from "../utils/env"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  getContentsByIds(server, ocapi)
  contentSearch(server, ocapi)
  getContentById(server, ocapi)
  updateContentById(server, ocapi)
}
