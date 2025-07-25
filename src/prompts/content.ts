import { z } from "zod"
import { completable } from "@modelcontextprotocol/sdk/server/completable.js"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const createContentPrompt = (server: McpServer) => {
  server.registerPrompt(
    "content-create",
    {
      title: "Content Asset Creation from CSV",
      description: "Create a new content asset in Commerce Cloud from a CSV file",
      argsSchema: {
        libraryId: completable(z.string(), () => {
          return ["RefArchSharedLibrary", "LibraryRefArch", "LibraryRefArchGlobal"]
        }),
        customInstructions: z.string().optional().describe("Design instructions or requirements"),
      },
    },
    ({ libraryId, customInstructions }: { libraryId: string; customInstructions?: string }) => {
      const promptContent = `Create a new content asset in Commerce Cloud from a attached CSV file.

**Config:** Library ID: ${libraryId} ${customInstructions ? `| Custom: ${customInstructions}` : ""}

**Steps:**
1. **Read**: Read the attached CSV file line by line.
2. **Analyze**: Review current content structure.
   - Each row contains the details of a content asset.
   - The column headers are the attributes of the content asset.
   - Each column is an attribute value of the content asset.
4. **Permission**: Ask for permission to create the content asset.
5. **Create**: Use \`manage-content-by-id\` tool to create the content assets.
   - If there are multiple content assets in the csv file, create them one by one.
   - Call \`manage-content-by-id\` tool for each content asset.
   - Use the following schema for the payload for the \`manage-content-by-id\` tool:
     \`\`\`json
     {
      "id": "string",
      "description": {
        "default": "string"
      },
      "name": {
        "default": "string"
      },
      "online": {
        "default": boolean
      },
      "searchable": {
        "default": boolean
      },
      "c_body": {
        "default": {
          "source": "string"
        }
      }
    }'
     \`\`\``

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
${
  designLink
    ? `  - Use the \`get_figma_data\` tool to get the design data from ${designLink} as a reference`
    : ""
}
4. **Preview**: Provide a preview of the code generated.
5. **Permission**: Ask for permission to update the content asset.
6. **Update**: Use \`manage-content-by-id\` with new content
   - Remove \`<head>\` tags, use \`<style>\` tags only
   - When updating content asset use the tags inside the body, no need to include the body tags.`

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
