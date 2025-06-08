import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { createServerResources } from "./utils/helpers"
import { version } from "../package.json"

import { shopApi } from "./api/shop"
import { dataApi } from "./api/data"

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

  Object.keys(shopApi).forEach((serverToolDefinition) => {
    server.tool(
      shopApi[serverToolDefinition].toolName,
      shopApi[serverToolDefinition].toolDescription,
      shopApi[serverToolDefinition].toolSchema,
      shopApi[serverToolDefinition].toolHandler,
    )
  })

  Object.keys(dataApi).forEach((serverToolDefinition) => {
    server.tool(
      dataApi[serverToolDefinition].toolName,
      dataApi[serverToolDefinition].toolDescription,
      dataApi[serverToolDefinition].toolSchema,
      dataApi[serverToolDefinition].toolHandler,
    )
  })

  // Create server resources from markdown files
  await createServerResources(server)
  await server.connect(transport)
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
