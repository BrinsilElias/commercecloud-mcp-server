import { McpAgent } from "agents/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { OAuthProvider } from "@cloudflare/workers-oauth-provider"

import { registerPrompts } from "@/prompts"
import { OcapiClient } from "@/services/ocapi"
import { defaultHandler } from "@/services/oauth-handler"
import { registerServerResources } from "@/resources"
import { registerShopApiTools } from "@/tools/api/shop"
import { registerDataApiTools } from "@/tools/api/data"

import type { Props } from "@/utils/types"

import { version } from "../package.json"

export class CommerceCloudMCP extends McpAgent<Env, Record<string, never>, Props> {
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
    const ocapiClient = new OcapiClient(this.env, this.props)
    // Register all tools from the Shop and Data APIs
    registerShopApiTools(this.server, ocapiClient)
    registerDataApiTools(this.server, ocapiClient)

    // Register all prompts
    registerPrompts(this.server)

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
