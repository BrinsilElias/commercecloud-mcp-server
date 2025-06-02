import { McpServer } from "@modelcontextprotocol/sdk/server/mcp"
import { env } from "./env"
import type { ApiType } from "./types"
import { readFile, readdir } from "fs/promises"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const buildBaseUrl = (apiType: ApiType): string => {
  const { SFCC_INSTANCE_URL, SFCC_SITE_ID, SFCC_VERSION } = env
  return `${SFCC_INSTANCE_URL}/s/${apiType === "shop" ? SFCC_SITE_ID : "-"}/dw/${apiType}/${SFCC_VERSION}`
}

export const buildUrl = (
  apiType: ApiType,
  path: string,
  queryParams?: Record<string, string | string[]>,
): string => {
  const baseUrl = buildBaseUrl(apiType) + path
  const url = new URL(baseUrl)

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      const valueToAppend = Array.isArray(value) ? value.join(",") : value
      url.searchParams.append(key, valueToAppend)
    })
  }

  return url.toString()
}

export const createHeaders = (
  additionalHeaders?: Record<string, string>,
): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "x-dw-client-id": env.SFCC_CLIENT_ID,
    ...additionalHeaders,
  }
}

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
