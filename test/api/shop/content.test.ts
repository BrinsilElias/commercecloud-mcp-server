import { describe, it, expect, beforeAll } from "vitest"
import { shopApi } from "../../../src/api/shop"
import { config } from "dotenv"

beforeAll(() => {
  config()
})

const contentApi = shopApi.content

describe("Shop Content API", () => {
  it("should get multiple contents by id", async () => {
    const contents = await contentApi.getContents([
      "404-banner",
      "404-callout",
      "404-service",
    ])
    console.log(contents)
    expect(contents).toBeDefined()
  })

  it("should search contents", async () => {
    const contents = await contentApi.contentSearch({
      q: "page",
    })
    console.log(contents)
    expect(contents).toBeDefined()
  })
})
