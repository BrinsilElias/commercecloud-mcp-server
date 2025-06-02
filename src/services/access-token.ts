import { env } from "../utils/env"
import type { GrantType } from "../utils/types"

export const createOAuthToken = async (
  grantType: GrantType,
): Promise<string> => {
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
    throw new Error(
      `Failed to create OAuth token: ${response.status} \n ${JSON.stringify(error)}`,
    )
  }

  const data = await response.json()
  return data.access_token
}
