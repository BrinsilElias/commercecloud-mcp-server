import { ocapi } from "../../services/ocapi"
import { SHOP_API_TYPE } from "../../utils/constants"

export const getOrder = async (orderId: string) => {
  const response = await ocapi.get(SHOP_API_TYPE, `/orders/${orderId}`, {
    auth: {
      isAuthRequired: true,
      grantType: "bm_user_grant",
    },
  })
  return response
}

export const orderSearch = async (options: Record<string, any>) => {
  const body = options ? { ...options } : {}
  const response = await ocapi.post(SHOP_API_TYPE, `/order_search`, {
    auth: {
      isAuthRequired: true,
      grantType: "bm_user_grant",
    },
    body,
  })
  return response
}
