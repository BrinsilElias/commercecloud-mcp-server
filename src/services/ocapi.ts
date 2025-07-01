import type { ApiType, OcapiClientEnv, OcapiRequestOptions, RequestMethod } from "../utils/types"
import { createOAuthToken } from "./access-token"
import { DATA_API_TYPE } from "../utils/constants"

export class OcapiClient {
  private env: OcapiClientEnv
  private instanceUrl: string
  private version: string
  private clientId: string
  private method: RequestMethod = "GET"
  private siteId: string

  constructor(env: OcapiClientEnv) {
    this.env = env
    this.version = env.SFCC_VERSION
    this.clientId = env.SFCC_CLIENT_ID
    this.siteId = env.SFCC_DEFAULT_SITE_ID
    this.instanceUrl = env.SFCC_INSTANCE_URL
  }

  private buildUrl(
    apiType: ApiType,
    path: string,
    queryParams?: Record<string, string | string[]>,
  ): string {
    const baseUrl = `${this.instanceUrl}/s/${apiType === "shop" ? this.siteId : "-"}/dw/${apiType}/${this.version}`
    const url = new URL(baseUrl + path)

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        const valueToAppend = Array.isArray(value) ? value.join(",") : value
        url.searchParams.append(key, valueToAppend)
      })
    }

    return url.toString()
  }

  private createHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-dw-client-id": this.clientId,
      ...additionalHeaders,
    }
  }

  private async httpClient(
    apiType: ApiType,
    path: string,
    options: OcapiRequestOptions = {},
  ): Promise<any> {
    const {
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
      method: this.method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OCAPI request failed: ${response.status} \n ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  setMethod(method: RequestMethod): void {
    this.method = method
  }

  call(apiType: ApiType, path: string, options?: OcapiRequestOptions): Promise<any> {
    return this.httpClient(apiType, path, options)
  }
}
