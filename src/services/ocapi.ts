import type {
  ApiType,
  OcapiClientEnv,
  OcapiRequestOptions,
  Props,
  RequestMethod,
} from "../utils/types"
import { DATA_API_TYPE } from "../utils/constants"
import { fetchUpstreamAuthToken } from "../utils/helpers"

export class OcapiClient {
  private instanceUrl: string
  private version: string
  private clientId: string
  private clientSecret: string
  private siteId: string
  private accessToken: string
  private refreshToken: string
  private expiresIn: number

  constructor(env: OcapiClientEnv, props: Props) {
    this.version = env.SFCC_VERSION
    this.clientId = env.SFCC_CLIENT_ID
    this.clientSecret = env.SFCC_CLIENT_SECRET
    this.siteId = env.SFCC_DEFAULT_SITE_ID
    this.instanceUrl = env.SFCC_INSTANCE_URL
    this.accessToken = props.access_token
    this.refreshToken = props.refresh_token
    this.expiresIn = props.expires_in
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

  private async ensureValidToken(): Promise<void> {
    const bufferTime = 60 * 1000 // 1 minute buffer
    if (Date.now() >= this.expiresIn - bufferTime) {
      const { access_token, refresh_token, expires_in } = await fetchUpstreamAuthToken({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.refreshToken,
        upstreamUrl: "https://account.demandware.com/dw/oauth2/access_token",
        grantType: "refresh_token",
      })

      this.accessToken = access_token
      this.refreshToken = refresh_token
      this.expiresIn = Date.now() + Number(expires_in) * 1000
    }
  }

  private async httpClient(
    method: RequestMethod,
    apiType: ApiType,
    path: string,
    options: OcapiRequestOptions = {},
  ): Promise<any> {
    const { body, queryParams, headers = {}, auth = apiType === DATA_API_TYPE } = options

    const url = this.buildUrl(apiType, path, queryParams)
    const requestHeaders = this.createHeaders(headers)

    if (auth) {
      await this.ensureValidToken()
      requestHeaders.Authorization = `Bearer ${this.accessToken}`
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OCAPI request failed: ${response.status} \n ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  get(apiType: ApiType, path: string, options?: OcapiRequestOptions): Promise<any> {
    return this.httpClient("GET", apiType, path, options)
  }

  post(apiType: ApiType, path: string, options?: OcapiRequestOptions): Promise<any> {
    return this.httpClient("POST", apiType, path, options)
  }

  put(apiType: ApiType, path: string, options?: OcapiRequestOptions): Promise<any> {
    return this.httpClient("PUT", apiType, path, options)
  }

  patch(apiType: ApiType, path: string, options?: OcapiRequestOptions): Promise<any> {
    return this.httpClient("PATCH", apiType, path, options)
  }
}
