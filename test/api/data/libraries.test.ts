import { describe, it, expect, beforeAll } from "vitest"
import { dataApi } from "../../../src/api/data"
import { config } from "dotenv"

beforeAll(() => {
  config()
})

describe("Data API - Libraries", () => {
  it("should get content by id", async () => {
    const content = await dataApi.libraries.getContent("lib-id", "content-id")
    console.log(content)
    expect(content).toBeDefined()
  })
})
