import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"
import { env } from "../../utils/env"

const { SFCC_SITE_ID } = env

export const getCustomObject = async (
  objectType: string,
  objectKey: string,
) => {
  const response = await ocapi.get(
    DATA_API_TYPE,
    `/sites/${SFCC_SITE_ID}/custom_objects/${objectType}/${objectKey}`,
  )
  return response
}

export const updateCustomObject = async (
  objectType: string,
  objectKey: string,
  object: Record<string, any>,
) => {
  const body = object ? { ...object } : {}
  const response = await ocapi.patch(
    DATA_API_TYPE,
    `/sites/${SFCC_SITE_ID}/custom_objects/${objectType}/${objectKey}`,
    {
      body,
    },
  )
  return response
}

export const createCustomObject = async (
  objectType: string,
  objectKey: string,
  object: Record<string, any>,
) => {
  const body = object ? { ...object } : {}
  const response = await ocapi.put(
    DATA_API_TYPE,
    `/sites/${SFCC_SITE_ID}/custom_objects/${objectType}/${objectKey}`,
    {
      body,
    },
  )
  return response
}

export const customObjectSearch = async (
  objectType: string,
  options: Record<string, any>,
) => {
  const body = options ? { ...options } : {}
  const response = await ocapi.post(
    DATA_API_TYPE,
    `/custom_objects_search/${objectType}`,
    {
      body,
    },
  )
  return response
}
