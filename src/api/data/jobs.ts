import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { searchSchema } from "./schema"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"

export const jobExecutionSearch = (server: McpServer) => {
  server.tool(
    "job-execution-search",
    "Fetches a list of job executions using the SFCC OCAI - Data API " +
      "This requires the search options to be provided as an input",
    searchSchema.shape,
    async (options: Record<string, any>) => {
      const body = options ? { ...options } : {}
      const jobExecution = await ocapi.post(
        DATA_API_TYPE,
        `/job_execution_search`,
        { body },
      )
      return {
        content: [
          { type: "text", text: JSON.stringify(jobExecution, null, 2) },
        ],
      }
    },
  )
}
