import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import {
  renderApprovalPage,
  redirectToUpstreamAuthorize,
  parseRedirectApproval,
  handleCallback,
  renderErrorPage,
} from "@/utils/workers-oauth-utils"

import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider"

const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>()

app.get("/authorize", async (c) => {
  const oAuthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw)
  const { clientId } = oAuthReqInfo

  if (!clientId) {
    throw new HTTPException(400, { message: "Invalid authorization request" })
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
    throw new HTTPException(400, { message: "Invalid authorization approval" })
  }

  return redirectToUpstreamAuthorize(c, state.oAuthReqInfo)
})

app.get("/callback", handleCallback)

app.onError((err, c) => {
  console.error("OAuth Error:", {
    error: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    timestamp: new Date().toISOString(),
  })

  // Determine status code from error
  let statusCode = 500
  if (err instanceof HTTPException) {
    statusCode = err.status
  }

  // Return error page with appropriate status code
  return renderErrorPage(c, statusCode)
})

export { app as defaultHandler }
