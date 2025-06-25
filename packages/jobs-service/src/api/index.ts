import { jobExecutionSearch } from "./data"
import { OcapiClient } from "@commercecloud/common"
import { env } from "../utils/env"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  jobExecutionSearch(server, ocapi)
}
