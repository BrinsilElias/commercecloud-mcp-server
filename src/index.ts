import { McpAgent } from "agents/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { version } from "../package.json"

import { registerShopApiTools } from "./api/shop"
import { registerDataApiTools } from "./api/data"
import { registerServerResources } from "./api/resources"

export class CommerceCloudMCP extends McpAgent<Env> {
  server = new McpServer(
    {
      name: "commercecloud-mcp-server",
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
    // Register all tools from the Shop and Data APIs
    registerShopApiTools(this.server)
    registerDataApiTools(this.server)

    // Load resources from R2 bucket
    if (this.env.MCP_RESOURCES) {
      await registerServerResources(this.server, this.env.MCP_RESOURCES)
    }
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return CommerceCloudMCP.serveSSE("/sse").fetch(request, env, ctx)
    }

    if (url.pathname === "/mcp") {
      return CommerceCloudMCP.serve("/mcp").fetch(request, env, ctx)
    }

    return new Response("Not found", { status: 404 })
  },
}
