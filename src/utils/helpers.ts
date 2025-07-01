import type { UpStreamAuthorizeUrlParams } from "./types"

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
      { access_token: null, refresh_token: null },
      new Response("Missing code", { status: 400 }),
    ]
  }

  const resp = await fetch(upstream_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
    },
    body: new URLSearchParams({
      redirect_uri,
      grant_type: "authorization_code",
      code,
    }).toString(),
  })
  if (!resp.ok) {
    console.log(await resp.text())
    return [
      { access_token: null, refresh_token: null },
      new Response("Failed to fetch access token", { status: 500 }),
    ]
  }
  const body: { access_token: string; refresh_token: string } = await resp.json()
  const { access_token, refresh_token } = body
  if (!access_token || !refresh_token) {
    return [
      { access_token: null, refresh_token: null },
      new Response("Missing access token", { status: 400 }),
    ]
  }
  return [{ access_token, refresh_token }, null]
}
