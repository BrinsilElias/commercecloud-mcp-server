import { describe, it, expect, beforeAll } from "vitest"
import { config } from "dotenv"
import { dataApi } from "../../../src/api/data"

beforeAll(() => {
  config()
})

const customObjectsApi = dataApi.customObjects

describe("Data API - Custom Objects", () => {
  it("should get a custom object", async () => {
    const customObject = await customObjectsApi.getCustomObject(
      "BackInStockNotification",
      "22962004M-brinsilelias01@gmail.com",
    )
    console.log(customObject)
    expect(customObject).toBeDefined()
  })

  it("should search for a custom object", async () => {
    const customObjects = await customObjectsApi.customObjectSearch(
      "BackInStockNotification",
      {
        query: {
          text_query: {
            fields: ["object_type"],
            search_phrase: "BackInStockNotification",
          },
        },
        select: "(**)",
      },
    )
    console.log(customObjects)
    expect(customObjects).toBeDefined()
  })
})
