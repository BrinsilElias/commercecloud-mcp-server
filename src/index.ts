import { McpAgent } from "agents/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { version } from "../package.json"

import { registerShopApiTools } from "./api/shop"
import { registerDataApiTools } from "./api/data"
import { registerServerResources } from "./api/resources"

import { defaultHandler } from "./services/oauth-handler"
import { OAuthProvider } from "@cloudflare/workers-oauth-provider"

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

export default new OAuthProvider({
  apiHandlers: {
    "/sse": CommerceCloudMCP.serveSSE("/sse") as any,
    "/mcp": CommerceCloudMCP.serve("/mcp") as any,
  },
  // @ts-expect-error
  defaultHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
})
