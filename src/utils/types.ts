export type ApiType = "shop" | "data"

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type GrantType = "client_credentials" | "bm_user_grant"

export interface OcapiRequestOptions {
  method?: RequestMethod
  body?: Record<string, any>
  queryParams?: Record<string, string | string[]>
  headers?: Record<string, string>
  auth?: {
    isAuthRequired: boolean
    grantType: GrantType
  }
}

export interface OAuthTokenResponse {
  access_token: string
  scope: string
  token_type: string
  expires_in: number
}
