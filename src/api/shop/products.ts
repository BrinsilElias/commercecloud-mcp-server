import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"

export const getProduct = async (
  productId: string,
  options?: Record<string, any>,
) => {
  const queryParams = options ? { ...options } : {}
  const response = await ocapi.get(SHOP_API_TYPE, `/products/${productId}`, {
    queryParams,
  })
  return response
}

export const getProducts = async (
  productIds: string[],
  options?: Record<string, any>,
) => {
  const queryParams = options ? { ...options } : {}
  const response = await ocapi.get(
    SHOP_API_TYPE,
    `/products/(${productIds.join(",")})`,
    {
      queryParams,
    },
  )
  return response
}
