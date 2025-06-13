import type { R2Bucket } from "@cloudflare/workers-types"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerServerResources = async (
  server: McpServer,
  bucket: R2Bucket,
) => {
  try {
    // List all .md files in the resources directory
    const list = await bucket.list({ prefix: "resources/" })

    if (!list.objects.length) {
      console.warn(
        "No resource files found in R2 bucket under 'resources/' prefix",
      )
      return []
    }

    const resources = await Promise.all(
      list.objects
        .filter((obj) => obj.key.endsWith(".md"))
        .map(async (obj) => {
          try {
            // Get the file content from R2
            const object = await bucket.get(obj.key)
            if (!object) {
              console.warn(`Failed to retrieve ${obj.key} from R2 bucket`)
              return null
            }

            const text = await object.text()

            // Extract the filename without the .md extension
            const filename = obj.key.split("/").pop()!
            const name = filename.replace(".md", "")

            // Register the resource with the MCP server
            return server.resource(
              name,
              `document://${name}.md`,
              async (uri) => ({
                contents: [
                  {
                    text,
                    uri: uri.href,
                    mimeType: "text/markdown",
                    name: name
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" "),
                    description: `Reference for the ${name} in the SFCC OCAPI documentation`,
                  },
                ],
              }),
            )
          } catch (error) {
            console.error(`Error processing resource ${obj.key}:`, error)
            return null
          }
        }),
    )

    // Filter out any null results from failed resources
    const validResources = resources.filter((resource) => resource !== null)

    console.log(
      `Successfully loaded ${validResources.length} resources from R2 bucket`,
    )
    return validResources
  } catch (error) {
    console.error("Error loading resources from R2 bucket:", error)
    return []
  }
}
