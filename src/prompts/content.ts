import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const updateContentPrompt = (server: McpServer) => {
  server.registerPrompt(
    "content-update",
    {
      title: "Content Asset UI Redesign",
      description:
        "Generate a modern UI redesign for a Commerce Cloud content asset with Bootstrap components",
      argsSchema: {
        contentId: z.string().describe("The content asset ID to redesign"),
        libraryId: z.string().describe("The content library ID where the asset is located"),
        designLink: z
          .string()
          .url()
          .optional()
          .describe("A link to a Figma design for the content"),
        customInstructions: z.string().describe("Design instructions or requirements"),
      },
    },
    ({
      contentId,
      libraryId,
      customInstructions,
      designLink,
    }: {
      contentId: string
      libraryId: string
      customInstructions: string
      designLink?: string
    }) => {
      const promptContent = `Redesign Commerce Cloud content asset with modern UI.

**Config:** Content ID: ${contentId} | Library ID: ${libraryId}| Custom: ${customInstructions}

**Steps:**
1. **Fetch**: Use \`get-content-by-id\` (${contentId}, ${libraryId})
2. **Analyze**: Review current content structure
3. **Design**: Create modern HTML/CSS with Bootstrap 4
   - Based on the instructions provided, create a UI design
   - Responsive design, semantic HTML, clean typography
   - Hover effects, proper spacing, accessibility
${designLink ? `  - Use the design from ${designLink} as a reference` : ""}
4. **Update**: Use \`manage-content-by-id\` with new content
   - Remove \`<head>\` tags, use \`<style>\` tags only
   - Include all content in \`<body>\` structure`

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
