import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

const getSearchConfig = (searchType: string) => {
  switch (searchType) {
    case "product":
      return {
        tool: "product-search",
        fields: ["id", "name", "type", "catalog_id", "category_id"],
        description: "Search products by ID, name, type, catalog ID, or category ID",
      }
    case "order":
      return {
        tool: "order-search",
        fields: ["order_no", "customer_no", "customer_name", "status", "customer_email"],
        description: "Search orders by order number, customer ID, or status",
      }
    case "category":
      return {
        tool: "category-search",
        fields: ["id", "name", "description"],
        description: "Search categories by ID, name, or description",
      }
    case "job-execution":
      return {
        tool: "job-execution-search",
        fields: ["id", "job_id", "start_time", "end_time", "status"],
        description: "Search job executions by ID, job ID, start time, end time, or status",
      }
  }
}

export const searchPrompt = (server: McpServer) => {
  server.registerPrompt(
    "search-resource",
    {
      title: "Commerce Cloud Data API Search",
      description:
        "Generate optimized search queries for Commerce Cloud Data API across all searchable entity types",
      argsSchema: {
        searchType: z
          .enum(["product", "order", "category", "job-execution"])
          .describe("The type of entity to search for"),
        fields: z.string().describe("The fields to search in"),
        searchPhrase: z.string().describe("The search phrase or term to look for"),
        customInstructions: z
          .string()
          .optional()
          .describe("Additional search requirements or filters"),
      },
    },
    ({
      searchType,
      fields,
      searchPhrase,
      customInstructions = "",
    }: {
      searchType: "product" | "order" | "category" | "job-execution"
      fields: string
      searchPhrase: string
      customInstructions?: string
    }) => {
      const config = getSearchConfig(searchType)
      const promptContent = `Execute Commerce Cloud Data API search for ${searchType} entities.

**Search Config:** Type: ${searchType} | Phrase: "${searchPhrase}"${customInstructions ? ` | Custom: ${customInstructions}` : ""}

**Recommended Approach:**
1. **Tool**: Use \`${config?.tool ? config.tool : ""}\` for this search
2. **Fields**: Recommended search fields: ${config?.fields.join(", ")}
   - ${config?.description}
3. **Parameters**:
   - fields: ${fields}
   - search_phrase: "${searchPhrase}"

**Search Strategy:**
- Use specific field names for targeted searches
- Apply filters based on returned data structure

Execute the search and analyze results for insights and patterns.`

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
