import { McpServer } from "@modelcontextprotocol/sdk/server/mcp"
import { readFile, readdir } from "fs/promises"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createServerResources = async (server: McpServer) => {
  const resourcesDir = join(__dirname, "../resources")
  const files = await readdir(resourcesDir)

  return await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const name = file.replace(".md", "")
        const text = await readFile(join(resourcesDir, file), "utf8")

        return server.resource(name, `document://${name}.md`, async (uri) => ({
          contents: [
            {
              text,
              uri: uri.href,
              mimeType: "text/markdown",
              name: name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              description: `Reference for the ${name} in the SFCC OCAPI documentation`,
            },
          ],
        }))
      }),
  )
}
