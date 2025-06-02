import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"

export const getContents = async (content_ids: string[]) => {
  const response = await ocapi.get(
    SHOP_API_TYPE,
    `/content/(${content_ids.join(",")})`,
  )
  return response
}

export const contentSearch = async (options: Record<string, any>) => {
  const queryParams = options ? { ...options } : {}
  const response = await ocapi.get(SHOP_API_TYPE, `/content_search`, {
    queryParams,
  })
  return response
}
