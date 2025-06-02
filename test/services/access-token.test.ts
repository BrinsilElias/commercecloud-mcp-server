import { describe, it, expect, beforeAll } from "vitest"
import { createOAuthToken } from "../../src/services/access-token"
import { config } from "dotenv"

beforeAll(() => {
  config()
})

describe("Access Token Generation", () => {
  it("should create an OAuth token successfully", async () => {
    const token = await createOAuthToken("client_credentials")
    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
    expect(token.length).toBeGreaterThan(0)
  })
})
