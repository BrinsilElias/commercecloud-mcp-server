import { ocapi } from "../../services/ocapi"
import { DATA_API_TYPE } from "../../utils/constants"

export const updateProduct = async (
  productId: string,
  product: Record<string, any>,
) => {
  const body = product ? { ...product } : {}
  const response = await ocapi.patch(DATA_API_TYPE, `/products/${productId}`, {
    body,
  })
  return response
}

export const productSearch = async (options?: Record<string, any>) => {
  const body = options ? { ...options } : {}
  const response = await ocapi.post(DATA_API_TYPE, `/product_search`, {
    body,
  })
  return response
}
