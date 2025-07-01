import { z } from "zod"
import { OcapiClient } from "@/services/ocapi"
import { DATA_API_TYPE } from "@/utils/constants"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const getProduct = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "get-product",
    {
      title: "Get a product by ID",
      description:
        "Get a product by ID using the SFCC OCAI - Data API" +
        "Additional options can be provided to expand the product data",
      inputSchema: {
        id: z.string().describe("The id of the product to get"),
        expand: z
          .array(z.string())
          .describe(
            "Expand product data:\
            all, availability, images, all_images, categories, options, prices, variations, sets, bundles",
          )
          .optional(),
      },
    },
    async ({ id, expand }: { id: string; expand?: string[] }) => {
      ocapi.setMethod("GET")
      const response = await ocapi.call(DATA_API_TYPE, `/products/${id}`, {
        queryParams: expand ? { expand } : {},
      })
      return {
        content: [{ type: "text", text: JSON.stringify(response) }],
      }
    },
  )
}

export const manageProduct = (server: McpServer, ocapi: OcapiClient) => {
  server.registerTool(
    "manage-product",
    {
      title: "Create or update a product",
      description:
        "Creates or updates a product using the SFCC OCAI - Data API. " +
        "Use operation 'create' for new products (PUT method) or 'update' for existing products (PATCH method). " +
        "This requires the product id and product data to be provided as input.",
      inputSchema: {
        id: z.string().describe("The id of the product to create or update"),
        product: z.record(z.string(), z.any()).describe("The product data"),
        operation: z.enum(["create", "update"]).describe(
          "The operation to perform: 'create' for new products (PUT method) or \
          'update' for existing products (PATCH method)",
        ),
      },
    },
    async ({
      id,
      product,
      operation,
    }: {
      id: string
      product: Record<string, any>
      operation: "create" | "update"
    }) => {
      ocapi.setMethod(operation === "create" ? "PUT" : "PATCH")

      const body = product ? { ...product } : {}
      const response = await ocapi.call(DATA_API_TYPE, `/products/${id}`, {
        body,
      })
      return {
        content: [{ type: "text", text: JSON.stringify(response) }],
      }
    },
  )
}
