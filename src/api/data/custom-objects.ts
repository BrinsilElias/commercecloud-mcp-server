import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { env } from "../../utils/env"
import {
  getOrDeleteCustomObjectSchema,
  createOrUpdateCustomObjectSchema,
  customObjectSearchSchema,
} from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"

const { SFCC_SITE_ID } = env

export const getCustomObject = (server: McpServer) => {
  server.tool(
    "get-custom-object",
    "Fetches a custom object by its type and key using the SFCC OCAI - Data API " +
      "This requires the object type and key to be provided as an input",
    getOrDeleteCustomObjectSchema.shape,
    async ({
      object_type,
      object_key,
    }: {
      object_type: string
      object_key: string
    }) => {
      const customObject = await ocapi.get(
        DATA_API_TYPE,
        `/sites/${SFCC_SITE_ID}/custom_objects/${object_type}/${object_key}`,
      )
      return {
        content: [
          { type: "text", text: JSON.stringify(customObject, null, 2) },
        ],
      }
    },
  )
}

export const updateCustomObject = (server: McpServer) => {
  server.tool(
    "update-custom-object",
    "Updates a custom object by its type and key using the SFCC OCAI - Data API " +
      "This requires the object type and key to be provided as an input " +
      "The object to update needs to be provided as an input",
    createOrUpdateCustomObjectSchema.shape,
    async ({
      object_type,
      object_key,
      object,
    }: {
      object_type: string
      object_key: string
      object: Record<string, any>
    }) => {
      const body = object ? { ...object } : {}
      const updatedCustomObject = await ocapi.patch(
        DATA_API_TYPE,
        `/sites/${SFCC_SITE_ID}/custom_objects/${object_type}/${object_key}`,
        { body },
      )
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(updatedCustomObject, null, 2),
          },
        ],
      }
    },
  )
}

export const createCustomObject = (server: McpServer) => {
  server.tool(
    "create-custom-object",
    "Creates a custom object by its type and key using the SFCC OCAI - Data API " +
      "This requires the object type and key to be provided as an input " +
      "The object to create needs to be provided as an input",
    createOrUpdateCustomObjectSchema.shape,
    async ({
      object_type,
      object_key,
      object,
    }: {
      object_type: string
      object_key: string
      object: Record<string, any>
    }) => {
      const body = object ? { ...object } : {}
      const createdCustomObject = await ocapi.put(
        DATA_API_TYPE,
        `/sites/${SFCC_SITE_ID}/custom_objects/${object_type}/${object_key}`,
        { body },
      )
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(createdCustomObject, null, 2),
          },
        ],
      }
    },
  )
}

export const customObjectSearch = (server: McpServer) => {
  server.tool(
    "custom-object-search",
    "Searches for custom objects using the SFCC OCAI - Data API " +
      "This requires the object type and search query to be provided as an input " +
      "Additional options can be provided to filter the search results",
    customObjectSearchSchema.shape,
    async ({
      object_type,
      options,
    }: {
      object_type: string
      options: Record<string, any>
    }) => {
      const body = options ? { ...options } : {}
      const customObjects = await ocapi.post(
        DATA_API_TYPE,
        `/custom_objects_search/${object_type}`,
        { body },
      )
      return {
        content: [
          { type: "text", text: JSON.stringify(customObjects, null, 2) },
        ],
      }
    },
  )
}
