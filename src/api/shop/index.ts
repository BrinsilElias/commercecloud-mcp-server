import { getBasketById } from "./baskets"
import { orderSearch, getOrderById } from "./orders"
import { getContentsByIds, contentSearch } from "./content"
import { getProductById, getProductsByIds } from "./products"
import { getCategoryById, getCategoriesByIds } from "./categories"
import {
  getCustomerById,
  getCustomerBasketById,
  getCustomerOrderById,
} from "./customers"
import { ServerToolDefinition } from "../../utils/types"

export const shopApi: Record<string, ServerToolDefinition> = {
  getProductById,
  getProductsByIds,
  orderSearch,
  getOrderById,
  getContentsByIds,
  contentSearch,
  getCustomerById,
  getCustomerBasketById,
  getCustomerOrderById,
  getBasketById,
  getCategoryById,
  getCategoriesByIds,
}
