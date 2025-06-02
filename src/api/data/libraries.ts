import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"

export const getContent = async (libraryId: string, contentId: string) => {
  const response = await ocapi.get(
    DATA_API_TYPE,
    `/libraries/${libraryId}/content/${contentId}`,
  )
  return response
}

export const updateContent = async (
  libraryId: string,
  contentId: string,
  content: Record<string, any>,
) => {
  const body = content ? { ...content } : {}
  const response = await ocapi.patch(
    DATA_API_TYPE,
    `/libraries/${libraryId}/content/${contentId}`,
    {
      body,
    },
  )
  return response
}
