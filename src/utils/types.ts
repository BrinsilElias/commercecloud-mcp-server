import { ERROR_TYPES } from "./constants"
import type { ClientInfo } from "@cloudflare/workers-oauth-provider"

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

export interface ApprovalDialogOptions {
  client: ClientInfo | null
  server: {
    name: string
    logo?: string
    description?: string
  }
  state: Record<string, any>
}

export interface UpStreamAuthorizeUrlParams {
  upstream_url: string
  client_id: string
  scope: string
  redirect_uri: string
  state?: string
  nonce?: string
  response_mode?: "query" | "fragment" | "form_post"
  response_type?: "code" | "id_token" | "code id_token"
  prompt?: "none" | "login" | "consent" | "select_account"
  max_age?: number
  login_hint?: string
}

export interface ErrorPageOptions {
  errorType: keyof typeof ERROR_TYPES
  message: string
  details?: string
  statusCode: number
  requestId?: string
  showRetry?: boolean
  retryUrl?: string
}
