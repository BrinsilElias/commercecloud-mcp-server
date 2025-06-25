import {
  getCustomerById,
  getCustomerBasketById,
  getCustomerOrderById,
} from "./shop"
import { getCustomerListById, getCustomerByCustomerNumber } from "./data"
import { OcapiClient } from "@commercecloud/common"
import { env } from "../utils/env"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  getCustomerById(server, ocapi)
  getCustomerBasketById(server, ocapi)
  getCustomerOrderById(server, ocapi)
  getCustomerListById(server, ocapi)
  getCustomerByCustomerNumber(server, ocapi)
}
