import { buildUrl, createHeaders } from "../utils/helpers"
import type { ApiType, OcapiRequestOptions } from "../utils/types"
import { createOAuthToken } from "./access-token"
import { DATA_API_TYPE } from "../utils/constants"

export const ocapiRequest = async <T>(
  apiType: ApiType,
  path: string,
  options: OcapiRequestOptions = {},
): Promise<T> => {
  const {
    method = "GET",
    body,
    queryParams,
    headers = {},
    auth = {
      isAuthRequired: apiType === DATA_API_TYPE,
      grantType: "client_credentials",
    },
  } = options

  const url = buildUrl(apiType, path, queryParams)
  const requestHeaders = createHeaders(headers)

  if (auth.isAuthRequired) {
    const accessToken = await createOAuthToken(auth.grantType)
    requestHeaders.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      `OCAPI request failed: ${response.status} \n ${JSON.stringify(error)}`,
    )
  }

  return response.json()
}

export const ocapi = {
  get: (
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ) => ocapiRequest(apiType, path, { ...options }),

  post: (
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ) => ocapiRequest(apiType, path, { ...options, method: "POST" }),

  put: (
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ) => ocapiRequest(apiType, path, { ...options, method: "PUT" }),

  delete: (
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ) => ocapiRequest(apiType, path, { ...options, method: "DELETE" }),

  patch: (
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ) => ocapiRequest(apiType, path, { ...options, method: "PATCH" }),
}
