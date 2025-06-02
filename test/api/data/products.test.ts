import { describe, it, expect, beforeAll } from "vitest"
import { dataApi } from "../../../src/api/data"
import { config } from "dotenv"

beforeAll(() => {
  config()
})

const productsApi = dataApi.products

describe("Data API - Products", () => {
  it("should search for products", async () => {
    const products = await productsApi.productSearch({
      query: {
        text_query: {
          fields: ["category_id"],
          search_phrase: "mens-clothing-suits",
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
    console.log(products)
    expect(products).toBeDefined()
  })
})
