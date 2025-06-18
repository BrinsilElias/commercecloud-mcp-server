import { HTTPException } from "hono/http-exception"
import { renderErrorPage } from "./workers-oauth-utils"

import type { Context } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"

export class OAuthError extends HTTPException {
  public readonly details?: string
  public readonly requestId?: string

  constructor(
    status: ContentfulStatusCode,
    message: string,
    requestId: string,
  ) {
    super(status, { message })
    this.requestId = requestId
  }

  getResponse(c?: Context): Response {
    if (c) {
      return renderErrorPage(c, {
        errorType:
          this.status >= 500 ? "SERVER_ERROR" : "AUTHENTICATION_FAILED",
        message: this.message,
        statusCode: this.status,
        requestId: this.requestId,
        showRetry: true,
        retryUrl: "/authorize",
      })
    }

    return new Response(this.message, { status: this.status })
  }
}

export function extractErrorDetails(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unknown error occurred"
}
