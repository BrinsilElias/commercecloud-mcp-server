import { env } from "../utils/env"
import type { GrantType } from "../utils/types"

interface TokenCache {
  token: string
  expiresAt: number
}

const tokenCache: Record<GrantType, TokenCache | null> = {
  client_credentials: null,
  bm_user_grant: null,
}

const TOKEN_BUFFER_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = "AuthenticationError"
  }
}

const isTokenValid = (cache: TokenCache | null): boolean => {
  if (!cache) return false
  return Date.now() < cache.expiresAt - TOKEN_BUFFER_TIME
}

export const createOAuthToken = async (
  grantType: GrantType,
): Promise<string> => {
  // Check if we have a valid cached token
  if (isTokenValid(tokenCache[grantType])) {
    return tokenCache[grantType]!.token
  }

  let baseUrl: URL
  let credentials: string
  let body: URLSearchParams

  const {
    SFCC_CLIENT_ID,
    SFCC_CLIENT_PASSWORD,
    SFCC_OAUTH_URL,
    SFCC_INSTANCE_URL,
    SFCC_BM_USER_ID,
    SFCC_BM_USER_SECURITY_TOKEN,
  } = env

  try {
    switch (grantType) {
      case "client_credentials":
        baseUrl = new URL(SFCC_OAUTH_URL)
        credentials = Buffer.from(
          `${SFCC_CLIENT_ID}:${SFCC_CLIENT_PASSWORD}`,
        ).toString("base64")
        body = new URLSearchParams({ grant_type: "client_credentials" })
        break
      case "bm_user_grant":
        baseUrl = new URL(`${SFCC_INSTANCE_URL}/dw/oauth2/access_token`)
        baseUrl.searchParams.append("client_id", SFCC_CLIENT_ID)
        credentials = Buffer.from(
          `${SFCC_BM_USER_ID}:${SFCC_BM_USER_SECURITY_TOKEN}:${SFCC_CLIENT_PASSWORD}`,
        ).toString("base64")
        body = new URLSearchParams({
          grant_type:
            "urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken",
        })
        break
    }

    const response = await fetch(baseUrl.toString(), {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new AuthenticationError(
        `Failed to create OAuth token: ${response.status}`,
        error,
      )
    }

    const data = await response.json()

    // Cache the token with expiration
    tokenCache[grantType] = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }

    return data.access_token
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError("Failed to create OAuth token", error)
  }
}
