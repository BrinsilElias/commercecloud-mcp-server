import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"

export const categorySearch = async (options: Record<string, any>) => {
  const body = options ? { ...options } : {}
  const response = await ocapi.post(DATA_API_TYPE, `/category_search`, {
    body,
  })
  return response
}
