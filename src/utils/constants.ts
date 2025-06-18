export const SHOP_API_TYPE = "shop"
export const DATA_API_TYPE = "data"

export const ERROR_TYPES = {
  INVALID_REQUEST: {
    title: "Invalid Request",
    icon: "❌",
    category: "request",
  },
  AUTHENTICATION_FAILED: {
    title: "Authentication Failed",
    icon: "🔐",
    category: "auth",
  },
  AUTHORIZATION_DENIED: {
    title: "Authorization Denied",
    icon: "🚫",
    category: "auth",
  },
  TOKEN_INVALID: {
    title: "Invalid Token",
    icon: "🎫",
    category: "token",
  },
  SESSION_EXPIRED: {
    title: "Session Expired",
    icon: "⏰",
    category: "session",
  },
  SERVER_ERROR: {
    title: "Server Error",
    icon: "⚠️",
    category: "server",
  },
  SECURITY_VIOLATION: {
    title: "Security Violation",
    icon: "🛡️",
    category: "security",
  },
}
