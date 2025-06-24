import { decode } from "hono/jwt"
import { env } from "cloudflare:workers"
import {
  getUpstreamAuthorizeUrl,
  generateSecureRandomString,
  fetchUpstreamAuthToken,
  generateRequestId,
} from "./helpers"
import { OAuthError } from "./oauth-errors"
import { ERROR_TYPES } from "./constants"

import type { Context } from "hono"
import type { AuthRequest } from "@cloudflare/workers-oauth-provider"
import type { ApprovalDialogOptions, ErrorPageOptions } from "./types"

function sanitizeHtml(unsafe: string): string {
  if (typeof unsafe !== "string") {
    return ""
  }

  return (
    unsafe
      // Handle null bytes and control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Basic HTML entities (order matters - & must be first)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      // Additional security characters
      .replace(/`/g, "&#96;")
      .replace(/\//g, "&#47;")
      .replace(/\\/g, "&#92;")
      // Handle potential script injection patterns
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      // Limit length to prevent DoS
      .substring(0, 1000)
      .trim()
  )
}

export async function redirectToUpstreamAuthorize(
  c: Context,
  oAuthReqInfo: AuthRequest,
) {
  // Generate secure random values for state and nonce
  const nonce = generateSecureRandomString(32)

  // Create enhanced state object with security parameters
  const stateData = {
    oAuthReqInfo,
    nonce,
    timestamp: Date.now(),
  }

  const authorizeUrl = getUpstreamAuthorizeUrl({
    upstream_url: `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
    client_id: env.MICROSOFT_CLIENT_ID,
    scope: "openid email profile",
    redirect_uri: new URL("/callback", c.req.url).href,
    state: btoa(JSON.stringify(stateData)),
    nonce,
    response_mode: "form_post",
    response_type: "code",
    prompt: "select_account",
  })

  return c.redirect(authorizeUrl, 302)
}

export async function parseRedirectApproval(req: Request) {
  if (req.method !== "POST") {
    throw new OAuthError(405, "Method not allowed", generateRequestId())
  }

  const formData = await req.formData()
  const action = formData.get("action")
  const encodedState = formData.get("state")

  if (action !== "approve") {
    throw new OAuthError(400, "Authorization denied", generateRequestId())
  }

  if (!encodedState || typeof encodedState !== "string") {
    throw new OAuthError(
      400,
      "Missing authorization state",
      generateRequestId(),
    )
  }

  try {
    return JSON.parse(atob(encodedState))
  } catch (error) {
    throw new OAuthError(
      400,
      "Invalid authorization state",
      generateRequestId(),
    )
  }
}

export function renderApprovalPage(c: Context, options: ApprovalDialogOptions) {
  const { client, server, state } = options
  const encodedState = btoa(JSON.stringify(state))

  // Sanitize any untrusted content
  const serverName = sanitizeHtml(server.name)
  const clientName = sanitizeHtml(client?.clientName || "MCP Client")
  const logoUrl = sanitizeHtml(server.logo || "")

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Authorize ${serverName}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="page-container">
          <!-- Header -->
          <div class="header">
            ${
              logoUrl
                ? `
              <div class="logo-container">
                <img src="${logoUrl}" alt="${serverName}" class="logo-image">
              </div>
            `
                : `
              <div class="logo-placeholder">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            `
            }
            <h1 class="title">
              Authorize Access
            </h1>
            <p class="subtitle">
              <span class="client-name">${clientName}</span> wants to connect to
              <span class="server-name">${serverName}</span>
            </p>
          </div>
          <!-- Permissions Info -->
          <div class="permissions-info">
            <div class="permissions-content">
              <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>This will allow the client to access your MCP server and its resources.</p>
            </div>
          </div>
          <!-- Action Buttons -->
          <div class="form-container">
            <form action="${new URL(c.req.raw.url).pathname}" method="post">
              <input type="hidden" name="state" value="${encodedState}">
              <div class="button-group">
                <button 
                  type="submit" 
                  name="action" 
                  value="approve"
                  class="btn btn-primary"
                >
                  Authorize Access
                </button>

                <button 
                  type="button" 
                  name="action" 
                  value="deny"
                  class="btn btn-secondary"
                  onclick="window.close()"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              Only authorize applications you trust
            </p>
          </div>
        </div>
      </body>
    </html>
  `)
}

export function renderErrorPage(c: Context, options: ErrorPageOptions) {
  const {
    errorType,
    message,
    statusCode,
    requestId,
    showRetry = true,
    retryUrl,
  } = options
  const errorInfo = ERROR_TYPES[errorType]

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${errorInfo.title} - Commerce Cloud MCP Server</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="page-container">
          <!-- Error Icon -->
          <div class="error-icon">
            ${errorInfo.icon}
          </div>
          <!-- Error Title -->
          <h1 class="error-title">
            ${errorInfo.title}
          </h1>
          <!-- Error Message -->
          <p class="error-message">
            ${message}
          </p>
          <!-- Action Buttons -->
          <div class="button-group">
            ${
              showRetry
                ? `
            <a href="${retryUrl}" class="btn btn-error">
              Try Again
            </a>
            `
                : ""
            }
            <button 
              type="button" 
              onclick="window.close()"
              class="btn btn-secondary"
            >
              Close Window
            </button>
          </div>
          <!-- Footer with meta information -->
          <div class="error-meta">
            <p>Error Code: ${statusCode}</p>
            ${requestId ? `<p>Request ID: ${requestId}</p>` : ""}
            <p>Commerce Cloud MCP Server</p>
          </div>
        </div>
      </body>
    </html>
  `)
}

export async function handleCallback(c: Context) {
  let name: string = ""
  let email: string = ""
  let code: string | undefined
  let stateParam: string | undefined
  const requestId = generateRequestId()

  // Handle both GET (query params) and POST (form data) responses
  if (c.req.method === "POST") {
    const formData = await c.req.formData()
    code = formData.get("code") as string
    stateParam = formData.get("state") as string
  } else {
    code = c.req.query("code") as string
    stateParam = c.req.query("state") as string
  }

  if (!stateParam) {
    throw new OAuthError(400, "Missing state parameter", generateRequestId())
  }

  let stateData: any
  try {
    stateData = JSON.parse(atob(stateParam))
  } catch (error) {
    throw new OAuthError(400, "Invalid state parameter", generateRequestId())
  }

  const { oAuthReqInfo, nonce, timestamp } = stateData
  const { clientId } = oAuthReqInfo

  if (!clientId) {
    throw new OAuthError(400, "Invalid OAuth request", generateRequestId())
  }

  // Validate state freshness (10 minutes max)
  if (Date.now() - timestamp > 10 * 60 * 1000) {
    throw new OAuthError(
      400,
      "Authentication session expired",
      generateRequestId(),
    )
  }

  if (!nonce) {
    throw new OAuthError(400, "Missing security nonce", generateRequestId())
  }

  if (!code) {
    throw new OAuthError(400, "Missing authorization code", generateRequestId())
  }

  const [{ access_token, id_token }, errResponse] =
    await fetchUpstreamAuthToken({
      upstream_url: `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      client_id: c.env.MICROSOFT_CLIENT_ID,
      client_secret: c.env.MICROSOFT_CLIENT_SECRET,
      code,
      redirect_uri: new URL("/callback", c.req.url).href,
    })

  if (errResponse) {
    throw new OAuthError(
      502,
      "Failed to obtain access token",
      generateRequestId(),
    )
  }

  if (id_token) {
    const { payload } = decode(id_token)

    // Validate nonce
    if (payload.nonce !== nonce) {
      throw new OAuthError(400, "Invalid security nonce", generateRequestId())
    }

    // Validate audience
    if (payload.aud !== c.env.MICROSOFT_CLIENT_ID) {
      throw new OAuthError(400, "Invalid token audience", generateRequestId())
    }

    // Validate issuer
    const expectedIssuer = `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/v2.0`
    if (payload.iss !== expectedIssuer) {
      throw new OAuthError(400, "Invalid token issuer", generateRequestId())
    }

    name = (payload.name || payload.preferred_username || "") as string
    email = (payload.email || payload.preferred_username || "") as string
  }

  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oAuthReqInfo,
    scope: oAuthReqInfo.scope,
    userId: email || "unknown_user",
    metadata: {
      nonce,
      loginTimestamp: timestamp,
      requestId,
    },
    props: {
      access_token,
      name,
      email,
    },
  })

  return c.redirect(redirectTo, 302)
}
