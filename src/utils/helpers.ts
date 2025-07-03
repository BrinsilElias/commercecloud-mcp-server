import { HTTPException } from "hono/http-exception"
import type { OAuthTokenResponse, UpStreamAuthorizeUrlParams } from "./types"

export function getUpstreamAuthorizeUrl(params: UpStreamAuthorizeUrlParams) {
  const upstream = new URL(params.upstream_url)

  upstream.searchParams.set("client_id", params.client_id)
  upstream.searchParams.set("response_type", params.response_type || "code")
  upstream.searchParams.set("redirect_uri", params.redirect_uri)

  if (params.state) upstream.searchParams.set("state", params.state)
  if (params.nonce) upstream.searchParams.set("nonce", params.nonce)

  return upstream.href
}

export async function fetchUpstreamAuthToken({
  clientId,
  clientSecret,
  code,
  redirectUri,
  upstreamUrl,
  grantType,
  refreshToken,
}: {
  clientId: string
  clientSecret: string
  grantType: "authorization_code" | "refresh_token"
  refreshToken?: string
  code?: string
  redirectUri?: string
  upstreamUrl: string
}): Promise<OAuthTokenResponse> {
  let reqBody
  if (grantType === "authorization_code") {
    reqBody = new URLSearchParams({
      grant_type: grantType,
      code: code || "",
      redirect_uri: redirectUri || "",
    })
  } else if (grantType === "refresh_token") {
    reqBody = new URLSearchParams({
      grant_type: grantType,
      refresh_token: refreshToken || "",
    })
  }

  const resp = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: reqBody?.toString(),
  })

  if (!resp.ok) {
    throw new HTTPException(500, { message: "Failed to fetch access token" })
  }

  const body: OAuthTokenResponse = await resp.json()
  const { access_token, refresh_token, expires_in, token_type, scope } = body

  if (!access_token || !refresh_token || !expires_in)
    throw new HTTPException(400, { message: "Missing access token" })

  return { access_token, refresh_token, expires_in, token_type, scope }
}
