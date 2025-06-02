import { describe, it, expect, beforeAll } from "vitest"
import { shopApi } from "../../../src/api/shop"
import { config } from "dotenv"

beforeAll(() => {
  config()
})

const productsApi = shopApi.products

describe("Shop API - Products", () => {
  it("should get a product by its id", async () => {
    const productId = "22962004M"
    const product = await productsApi.getProduct(productId)
    console.log(product)
    expect(product).toBeDefined()
  })

  it("should get a product by its id with expand", async () => {
    const productId = "22962004M"
    const product = await productsApi.getProduct(productId, {
      expand: ["availability", "bundled_products"],
    })
    console.log(product)
    expect(product).toBeDefined()
  })
  it("should get multiple products by id", async () => {
    const products = await productsApi.getProducts([
      "11736753M",
      "82936941M",
      "21736758M",
    ])
    console.log(products)
    expect(products).toBeDefined()
  })
})
