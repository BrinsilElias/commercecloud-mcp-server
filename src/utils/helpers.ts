import { env } from "./env"
import type { ApiType, UpStreamAuthorizeUrlParams } from "./types"

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

export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  )
}

export function getUpstreamAuthorizeUrl(params: UpStreamAuthorizeUrlParams) {
  const upstream = new URL(params.upstream_url)

  upstream.searchParams.set("client_id", params.client_id)
  upstream.searchParams.set("response_type", params.response_type || "code")
  upstream.searchParams.set("redirect_uri", params.redirect_uri)

  const scopes = params.scope.split(" ")
  if (!scopes.includes("openid")) {
    scopes.unshift("openid")
  }
  upstream.searchParams.set("scope", scopes.join(" "))

  if (params.state) upstream.searchParams.set("state", params.state)
  if (params.nonce) upstream.searchParams.set("nonce", params.nonce)

  upstream.searchParams.set("response_mode", params.response_mode || "query")

  if (params.prompt) upstream.searchParams.set("prompt", params.prompt)
  if (params.login_hint)
    upstream.searchParams.set("login_hint", params.login_hint)

  return upstream.href
}

export async function fetchUpstreamAuthToken({
  client_id,
  client_secret,
  code,
  redirect_uri,
  upstream_url,
}: {
  code: string | undefined
  upstream_url: string
  client_secret: string
  redirect_uri: string
  client_id: string
}): Promise<[Record<string, string>, null] | [Record<string, null>, Response]> {
  if (!code) {
    return [
      { access_token: null, id_token: null },
      new Response("Missing code", { status: 400 }),
    ]
  }

  const resp = await fetch(upstream_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri,
      scope: "openid email profile",
      grant_type: "authorization_code",
    }).toString(),
  })
  if (!resp.ok) {
    console.log(await resp.text())
    return [
      { access_token: null, id_token: null },
      new Response("Failed to fetch access token", { status: 500 }),
    ]
  }
  const body: { access_token: string; id_token: string } = await resp.json()
  const { access_token, id_token } = body
  if (!access_token || !id_token) {
    return [
      { access_token: null, id_token: null },
      new Response("Missing access token", { status: 400 }),
    ]
  }
  return [{ access_token, id_token }, null]
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
