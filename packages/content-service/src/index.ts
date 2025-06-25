import { McpAgent } from "agents/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { version } from "../package.json"
import { registerTools } from "./api"

export class ContentServiceMcpServer extends McpAgent<Env> {
  server = new McpServer(
    {
      name: "commercecloud-content-service",
      version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  )

  async init() {
    registerTools(this.server)
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === "/mcp") {
      return ContentServiceMcpServer.serve("/mcp").fetch(request, env, ctx)
    }

    return new Response("Not found", { status: 404 })
  },
}
