import { describe, it, expect, beforeAll } from "vitest"
import { shopApi } from "../../../src/api/shop"
import { config } from "dotenv"

beforeAll(() => {
  config()
})

const ordersApi = shopApi.orders

describe("Shop Orders API", () => {
  it("should get an order", async () => {
    const order = await ordersApi.getOrder("FP07800002205")
    console.log(order)
    expect(order).toBeDefined()
  })

  it("should search orders", async () => {
    const orders = await ordersApi.orderSearch({
      query: {
        text_query: {
          fields: ["customer_email"],
          search_phrase: "akbarsha.r@tryzens.com",
        },
      },
      select: "(**)",
      sorts: [
        {
          field: "order_no",
          sort_order: "asc",
        },
      ],
    })
    console.log(orders)
    expect(orders).toBeDefined()
  })
})
