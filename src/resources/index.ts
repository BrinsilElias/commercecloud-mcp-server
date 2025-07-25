import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { readFile, readdir } from "fs/promises"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createServerResources = async (server: McpServer) => {
  const resourcesDir = join(__dirname, "../src/resources/files")
  const files = await readdir(resourcesDir)

  return await Promise.all(
    files.map(async (file) => {
      const name = file.replace(/\.[^.]*$/, "")
      const text = await readFile(join(resourcesDir, file), "utf8")

      return server.registerResource(
        name,
        `document://${name}`,
        {
          title: name,
          description: `Resource for ${name}`,
          mimeType: "text/markdown",
        },
        async (uri) => ({
          contents: [
            {
              text,
              uri: uri.href,
              mimeType: "text/markdown",
              name: name,
            },
          ],
        }),
      )
    }),
  )
}
