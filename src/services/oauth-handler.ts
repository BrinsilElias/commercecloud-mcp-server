import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import {
  renderApprovalPage,
  redirectToUpstreamAuthorize,
  parseRedirectApproval,
  handleCallback,
} from "../utils/workers-oauth-utils"
import { OAuthError } from "../utils/oauth-errors"
import { generateRequestId } from "../utils/helpers"

import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider"

const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>()

app.get("/authorize", async (c) => {
  const oAuthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw)
  const { clientId } = oAuthReqInfo

  if (!clientId) {
    throw new OAuthError(
      400,
      "Invalid authorization request",
      generateRequestId(),
    )
  }

  return renderApprovalPage(c, {
    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),
    server: {
      name: "Commerce Cloud MCP Server",
      description:
        "An MCP server that helps connect your AI applications with your Salesforce Commerce Cloud instance",
      logo: "/tryzens-logo.png",
    },
    state: { oAuthReqInfo },
  })
})

app.post("/authorize", async (c) => {
  const state = await parseRedirectApproval(c.req.raw)

  if (!state.oAuthReqInfo) {
    throw new OAuthError(
      400,
      "Invalid authorization approval",
      generateRequestId(),
    )
  }

  return redirectToUpstreamAuthorize(c, state.oAuthReqInfo)
})

app.get("/callback", handleCallback)
app.post("/callback", handleCallback)

app.onError((err, c) => {
  const requestId = generateRequestId()

  console.error(`OAuth Error [${requestId}]:`, {
    error: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    timestamp: new Date().toISOString(),
  })

  // Handle custom OAuth errors
  if (err instanceof OAuthError) {
    return err.getResponse(c)
  }

  // Handle standard HTTP exceptions
  if (err instanceof HTTPException) {
    const oauthError = new OAuthError(
      err.status,
      err.message || "An authentication error occurred",
      generateRequestId(),
    )
    return oauthError.getResponse(c)
  }

  // Handle unexpected errors
  const oauthError = new OAuthError(
    500,
    "An unexpected error occurred during authentication",
    generateRequestId(),
  )

  return oauthError.getResponse(c)
})

export { app as defaultHandler }
