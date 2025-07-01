import { searchPrompt } from "./search"
import { updateContentPrompt } from "./content"
import { updateProductPrompt } from "./product"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerPrompts = (server: McpServer) => {
  updateContentPrompt(server)
  updateProductPrompt(server)
  searchPrompt(server)
}
