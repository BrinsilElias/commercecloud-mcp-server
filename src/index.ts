import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { createServerResources } from "./utils/helpers"
import { version } from "../package.json"

import { registerShopApiTools } from "./api/shop"
import { registerDataApiTools } from "./api/data"

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

  // Register all tools from the Shop and Data APIs
  registerShopApiTools(server)
  registerDataApiTools(server)

  await createServerResources(server)
  await server.connect(transport)
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
