import { env } from "./env"
import type { ApiType } from "./types"

export const buildBaseUrl = (apiType: ApiType): string => {
  const { SFCC_INSTANCE_URL, SFCC_SITE_ID, SFCC_VERSION } = env
  return `${SFCC_INSTANCE_URL}/s/${apiType === "shop" ? SFCC_SITE_ID : "-"}/dw/${apiType}/${SFCC_VERSION}`
}

export const buildUrl = (
  apiType: ApiType,
  path: string,
  queryParams?: Record<string, string | string[]>,
): string => {
  const baseUrl = buildBaseUrl(apiType) + path
  const url = new URL(baseUrl)

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      const valueToAppend = Array.isArray(value) ? value.join(",") : value
      url.searchParams.append(key, valueToAppend)
    })
  }

  return url.toString()
}

export const createHeaders = (
  additionalHeaders?: Record<string, string>,
): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "x-dw-client-id": env.SFCC_CLIENT_ID,
    ...additionalHeaders,
  }
}
