import { z } from "zod"
import { envSchema } from "./env"
import type { ClientInfo } from "@cloudflare/workers-oauth-provider"

export type ApiType = "shop" | "data"
export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH"
export type GrantType = "client_credentials" | "bm_user_grant"
export type OcapiClientEnv = z.infer<typeof envSchema>

export interface OcapiRequestOptions {
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
  redirect_uri: string
  state?: string
  nonce?: string
  response_type?: "code" | "id_token" | "code id_token"
}

