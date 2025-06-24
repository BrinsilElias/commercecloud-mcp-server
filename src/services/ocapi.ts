import type {
  ApiType,
  OcapiClientEnv,
  OcapiRequestOptions,
} from "../utils/types"
import { createOAuthToken } from "./access-token"
import { DATA_API_TYPE } from "../utils/constants"

export class OcapiClient {
  private env: OcapiClientEnv

  constructor(env: OcapiClientEnv) {
    this.env = env
  }

  private buildBaseUrl(apiType: ApiType): string {
    const { SFCC_INSTANCE_URL, SFCC_SITE_ID, SFCC_VERSION } = this.env
    return `${SFCC_INSTANCE_URL}/s/${apiType === "shop" ? SFCC_SITE_ID : "-"}/dw/${apiType}/${SFCC_VERSION}`
  }

  private buildUrl(
    apiType: ApiType,
    path: string,
    queryParams?: Record<string, string | string[]>,
  ): string {
    const baseUrl = this.buildBaseUrl(apiType) + path
    const url = new URL(baseUrl)

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        const valueToAppend = Array.isArray(value) ? value.join(",") : value
        url.searchParams.append(key, valueToAppend)
      })
    }

    return url.toString()
  }

  private createHeaders(
    additionalHeaders?: Record<string, string>,
  ): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-dw-client-id": this.env.SFCC_CLIENT_ID,
      ...additionalHeaders,
    }
  }

  private async httpClient(
    apiType: ApiType,
    path: string,
    options: OcapiRequestOptions = {},
  ): Promise<any> {
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

    const url = this.buildUrl(apiType, path, queryParams)
    const requestHeaders = this.createHeaders(headers)

    if (auth.isAuthRequired) {
      const accessToken = await createOAuthToken(this.env, auth.grantType)
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

  get(
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ): Promise<any> {
    return this.httpClient(apiType, path, { ...options })
  }

  post(
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ): Promise<any> {
    return this.httpClient(apiType, path, { ...options, method: "POST" })
  }

  put(
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ): Promise<any> {
    return this.httpClient(apiType, path, { ...options, method: "PUT" })
  }

  delete(
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ): Promise<any> {
    return this.httpClient(apiType, path, { ...options, method: "DELETE" })
  }

  patch(
    apiType: ApiType,
    path: string,
    options?: Omit<OcapiRequestOptions, "method">,
  ): Promise<any> {
    return this.httpClient(apiType, path, { ...options, method: "PATCH" })
  }
}
