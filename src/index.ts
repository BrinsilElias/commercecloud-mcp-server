import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { env } from "@/utils/env"
import { version } from "../package.json"
import { OcapiClient } from "@/services/ocapi"

import { registerShopApiTools } from "@/tools/api/shop"
import { registerDataApiTools } from "@/tools/api/data"
import { createServerResources } from "@/resources"
import { registerPrompts } from "@/prompts"

// Create an MCP server
const server = new McpServer(
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

// Start the server
async function startServer() {
  const transport = new StdioServerTransport()

  const ocapiClient = new OcapiClient(env)
  // Register all tools from the Shop and Data APIs
  registerShopApiTools(server, ocapiClient)
  registerDataApiTools(server, ocapiClient)
  registerPrompts(server)

  await createServerResources(server)
  await server.connect(transport)
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
