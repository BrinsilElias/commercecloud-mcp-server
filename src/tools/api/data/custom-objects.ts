import z from "zod"
import { OcapiClient } from "@/services/ocapi"
import { DATA_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getCustomObject = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-custom-object",
    {
      title: "Get a custom object",
      description:
        "Fetches a custom object by its type and key using the SFCC OCAI - Data API " +
        "This requires the object type and key to be provided as an input",
      inputSchema: {
        site_id: z.string().describe("The site ID of the custom object to fetch"),
        object_type: z.string().describe("The type of the custom object to fetch"),
        object_key: z.string().describe("The key of the custom object to fetch"),
      },
    },
    async ({
      site_id,
      object_type,
      object_key,
    }: {
      site_id: string
      object_type: string
      object_key: string
    }) => {
      ocapi.setMethod("GET")
      const customObject = await ocapi.call(
        DATA_API_TYPE,
        `/sites/${site_id}/custom_objects/${object_type}/${object_key}`,
      )
      return {
        content: [{ type: "text", text: JSON.stringify(customObject) }],
      }
    },
  )
}

export const manageCustomObject = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "manage-custom-object",
    {
      title: "Create or update a custom object",
      description:
        "Creates or updates a custom object by its type and key using the SFCC OCAI - Data API. " +
        "Use operation 'create' for new custom objects (PUT method) or 'update' for existing custom objects (PATCH method). " +
        "This requires the object type and key to be provided as an input " +
        "The object data needs to be provided as an input",
      inputSchema: {
        site_id: z.string().describe("The site ID of the custom object to create or update"),
        object_type: z.string().describe("The type of the custom object to create or update"),
        object_key: z.string().describe("The key of the custom object to create or update"),
        object: z.record(z.string(), z.any()).describe("The object data"),
        operation: z
          .enum(["create", "update"])
          .describe(
            "The operation to perform: 'create' for new custom objects (PUT method) or " +
              "'update' for existing custom objects (PATCH method)",
          ),
      },
    },
    async ({
      object_type,
      object_key,
      object,
      operation,
      site_id,
    }: {
      object_type: string
      object_key: string
      object: Record<string, any>
      operation: "create" | "update"
      site_id: string
    }) => {
      const body = object ? { ...object } : {}
      ocapi.setMethod(operation === "create" ? "PUT" : "PATCH")
      const resultCustomObject = await ocapi.call(
        DATA_API_TYPE,
        `/sites/${site_id}/custom_objects/${object_type}/${object_key}`,
        { body },
      )
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultCustomObject),
          },
        ],
      }
    },
  )
}

export const customObjectSearch = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "custom-object-search",
    {
      title: "Search for custom objects",
      description:
        "Searches for custom objects using the SFCC OCAI - Data API " +
        "This requires the object type and search query to be provided as an input " +
        "Additional options can be provided to filter the search results",
      inputSchema: {
        object_type: z.string().describe("The type of the custom object to search"),
        fields: z.array(z.string()).describe("The fields to search in"),
        search_phrase: z.string().describe("The search phrase to search for"),
      },
    },
    async ({
      object_type,
      fields,
      search_phrase,
    }: {
      object_type: string
      fields: string[]
      search_phrase: string
    }) => {
      ocapi.setMethod("POST")
      const customObjects = await ocapi.call(
        DATA_API_TYPE,
        `/custom_objects_search/${object_type}`,
        {
          body: {
            query: {
              text_query: {
                fields,
                search_phrase,
              },
            },
            select: "(**)",
          },
        },
      )
      return {
        content: [{ type: "text", text: JSON.stringify(customObjects) }],
      }
    },
  )
}
