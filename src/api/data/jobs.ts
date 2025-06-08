import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { ServerToolDefinition } from "../../utils/types"
import { searchSchema } from "./schema"

export const jobExecutionSearch: ServerToolDefinition = {
  toolName: "job-execution-search",
  toolDescription:
    "Fetches a list of job executions using the SFCC OCAI - Data API " +
    "This requires the search options to be provided as an input",
  toolSchema: searchSchema.shape,
  toolHandler: async (options: { options: Record<string, string> }) => {
    const body = options ? { ...options } : {}
    const jobExecution = await ocapi.post(
      DATA_API_TYPE,
      `/job_execution_search`,
      { body },
    )
    return {
      content: [{ type: "text", text: JSON.stringify(jobExecution, null, 2) }],
    }
  },
}
