import { env } from "../utils/env"
import { getBasketById } from "./shop"
import { OcapiClient } from "@commercecloud/common"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  getBasketById(server, ocapi)
}
