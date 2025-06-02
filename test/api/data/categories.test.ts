import { describe, it, expect, beforeAll } from "vitest"
import { config } from "dotenv"
import { dataApi } from "../../../src/api/data"

beforeAll(() => {
  config()
})

describe("Data API - Categories", () => {
  it("should search for categories", async () => {
    const categories = await dataApi.categories.categorySearch({
      query: {
        text_query: {
          fields: ["description"],
          search_phrase: "mens suits",
        },
      },
      select: "(**)",
      sorts: [
        {
          field: "id",
          sort_order: "asc",
        },
      ],
    })
    console.log(categories)
    expect(categories).toBeDefined()
  })
})
