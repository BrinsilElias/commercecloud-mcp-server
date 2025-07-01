import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const updateProductPrompt = (server: McpServer) => {
  server.registerPrompt(
    "product-update",
    {
      title: "Product Attribute Update",
      description:
        "Generate and update a specific product attribute using AI-driven content generation",
      argsSchema: {
        productId: z.string().describe("The product ID to update"),
        updateAttribute: z.string().describe("The product attribute to update"),
        updateDetail: z
          .string()
          .describe("Instructions for how to generate or update the attribute value."),
      },
    },
    ({
      productId,
      updateAttribute,
      updateDetail,
    }: {
      productId: string
      updateAttribute: string
      updateDetail: string
    }) => {
      const promptContent = `Update Commerce Cloud product attribute with AI-generated content.

**Config:** Product ID: ${productId} | Attribute: ${updateAttribute} | Task: ${updateDetail}

**Steps:**
1. **Fetch**: Use \`get-product\` (${productId}) with expand 'all'
2. **Analyze**: Review current ${updateAttribute} value and product details
3. **Generate**: Create new content per "${updateDetail}" instructions
4. **Update**: Use \`manage-product\` (${productId}, "update") with ${updateAttribute} field

Ensure content is e-commerce appropriate.`

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: promptContent,
            },
          },
        ],
      }
    },
  )
}
