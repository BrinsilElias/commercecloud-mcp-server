import { jobExecutionSearch } from "./jobs"
import { categorySearch } from "./categories"
import { productSearch, updateProductById } from "./products"
import { getContentById, updateContentById } from "./libraries"
import {
  createCustomObject,
  getCustomObject,
  updateCustomObject,
  customObjectSearch,
} from "./custom-objects"
import {
  getCustomerListById,
  getCustomerByCustomerNumber,
} from "./customer-lists"
import { ServerToolDefinition } from "../../utils/types"

export const dataApi: Record<string, ServerToolDefinition> = {
  categorySearch,
  productSearch,
  updateProductById,
  getCustomObject,
  updateCustomObject,
  createCustomObject,
  customObjectSearch,
  getContentById,
  updateContentById,
  getCustomerListById,
  getCustomerByCustomerNumber,
  jobExecutionSearch,
}
