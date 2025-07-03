import { decode } from "hono/jwt"
import { env } from "cloudflare:workers"
import { HTTPException } from "hono/http-exception"
import { getUpstreamAuthorizeUrl, fetchUpstreamAuthToken } from "./helpers"

import type { Context } from "hono"
import type { AuthRequest } from "@cloudflare/workers-oauth-provider"
import type { ApprovalDialogOptions, Props } from "./types"

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

export async function redirectToUpstreamAuthorize(c: Context, oAuthReqInfo: AuthRequest) {
  // Create enhanced state object with security parameters
  const stateData = {
    oAuthReqInfo,
    timestamp: Date.now(),
  }

  const authorizeUrl = getUpstreamAuthorizeUrl({
    upstream_url: `https://account.demandware.com/dwsso/oauth2/authorize`,
    client_id: env.SFCC_CLIENT_ID,
    redirect_uri: new URL("/callback", c.req.url).href,
    state: btoa(JSON.stringify(stateData)),
    response_type: "code",
  })

  return c.redirect(authorizeUrl, 302)
}

export async function parseRedirectApproval(req: Request) {
  if (req.method !== "POST") {
    throw new HTTPException(405, { message: "Method not allowed" })
  }

  const formData = await req.formData()
  const action = formData.get("action")
  const encodedState = formData.get("state")

  if (action !== "approve") {
    throw new HTTPException(400, { message: "Authorization denied" })
  }

  if (!encodedState || typeof encodedState !== "string") {
    throw new HTTPException(400, { message: "Missing authorization state" })
  }

  try {
    return JSON.parse(atob(encodedState))
  } catch (error) {
    throw new HTTPException(400, { message: "Invalid authorization state" })
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

export function renderErrorPage(c: Context, statusCode: number = 404) {
  const is404 = statusCode === 404
  const title = is404 ? "404 - Page Not Found" : `${statusCode} - Server Error`
  const message = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : "An internal server error occurred while processing your request."

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="page-container">
          <!-- Error Icon -->
          <div class="error-icon">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L4.216 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <!-- Error Title -->
          <h1 class="error-title">
            ${title}
          </h1>
          <!-- Error Message -->
          <p class="error-message">
            ${message}
          </p>
          <!-- Action Buttons -->
          <div class="button-group">
            <a href="/" class="btn btn-primary">
              Go Home
            </a>
            <button 
              type="button" 
              onclick="window.history.back()"
              class="btn btn-secondary"
            >
              Go Back
            </button>
          </div>
          <!-- Footer with meta information -->
          <div class="error-meta">
            <p>Error Code: ${statusCode}</p>
            <p>Commerce Cloud MCP Server</p>
          </div>
        </div>
      </body>
    </html>
  `)
}

export async function handleCallback(c: Context) {
  let email: string = ""
  let code: string | undefined
  let stateParam: string | undefined

  code = c.req.query("code") as string
  stateParam = c.req.query("state") as string

  if (!stateParam) {
    throw new HTTPException(400, { message: "Missing state parameter" })
  }

  let stateData: any
  try {
    stateData = JSON.parse(atob(stateParam))
  } catch (error) {
    throw new HTTPException(400, { message: "Invalid state parameter" })
  }

  const { oAuthReqInfo, timestamp } = stateData
  const { clientId } = oAuthReqInfo

  if (!clientId) {
    throw new HTTPException(400, { message: "Invalid OAuth request" })
  }

  // Validate state freshness (10 minutes max)
  if (Date.now() - timestamp > 10 * 60 * 1000) {
    throw new HTTPException(400, { message: "Authentication session expired" })
  }

  if (!code) {
    throw new HTTPException(400, { message: "Missing authorization code" })
  }

  const { access_token, refresh_token, expires_in } = await fetchUpstreamAuthToken({
    upstreamUrl: `https://account.demandware.com/dw/oauth2/access_token`,
    clientId: c.env.SFCC_CLIENT_ID,
    clientSecret: c.env.SFCC_CLIENT_SECRET,
    code,
    redirectUri: new URL("/callback", c.req.url).href,
    grantType: "authorization_code",
  })

  if (!access_token || !expires_in) {
    throw new HTTPException(502, { message: "Failed to obtain access token" })
  }

  const { payload } = decode(access_token)
  email = (payload.sub || payload.subname || "") as string

  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oAuthReqInfo,
    scope: oAuthReqInfo.scope,
    userId: email,
    metadata: {
      loginTimestamp: timestamp,
    },
    props: {
      email,
      access_token,
      refresh_token,
      expires_in: Date.now() + Number(expires_in) * 1000,
    } as Props,
  })

  return c.redirect(redirectTo, 302)
}
