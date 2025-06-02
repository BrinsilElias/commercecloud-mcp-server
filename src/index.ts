import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { createServerResources } from "./utils/helpers"
import { version } from "../package.json"

import { shopApi } from "./api/shop"
import { dataApi } from "./api/data"
import * as shopApiSchema from "./api/shop/schema"
import * as dataApiSchema from "./api/data/schema"

// Create an MCP server
const server = new McpServer(
  {
    name: "commercecloud-mcp-server",
    version,
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
)

server.tool(
  "category-search",
  "Searches for categories using the SFCC OCAI - Data API " +
    "This requires the search query to be provided as an input " +
    "Additional options can be provided to filter the search results",
  dataApiSchema.searchSchema.shape,
  async (args) => {
    const categories = await dataApi.categories.categorySearch(args)
    return {
      content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
    }
  },
)

server.tool(
  "get-product-by-id",
  "Fetches a product by its id using the SFCC OCAI - Shop API " +
    "This requires the product id to be provided as an input " +
    "Additional options can be provided to expand the product data",
  shopApiSchema.getProductByIdSchema.shape,
  async ({ id, options }) => {
    const product = await shopApi.products.getProduct(id, options)
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
    }
  },
)

server.tool(
  "get-products-by-ids",
  "Fetches multiple products by their ids using the SFCC OCAI - Shop API " +
    "This requires the product ids to be provided as an input " +
    "Additional options can be provided to expand the product data" +
    "Always use this tool when fetching mutiple products instead of using multiple get-product-by-id tool",
  shopApiSchema.getProductsByIdsSchema.shape,
  async ({ ids, options }) => {
    const products = await shopApi.products.getProducts(ids, options)
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
    }
  },
)

server.tool(
  "product-search",
  "Searches for products using the SFCC OCAI - Data API " +
    "This requires the search query to be provided as an input " +
    "Additional options can be provided to filter the search results",
  dataApiSchema.searchSchema.shape,
  async (args) => {
    const products = await dataApi.products.productSearch(args)
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
    }
  },
)

server.tool(
  "update-product-by-id",
  "Updates a product by its id using the SFCC OCAI - Data API " +
    "This requires the product id to be provided as an input " +
    "The product to update needs to be provided as an input",
  dataApiSchema.updateProductByIdSchema.shape,
  async ({ id, product }) => {
    const updatedProduct = await dataApi.products.updateProduct(id, product)
    return {
      content: [
        { type: "text", text: JSON.stringify(updatedProduct, null, 2) },
      ],
    }
  },
)

server.tool(
  "get-order-by-id",
  "Fetches an order by its id using the SFCC OCAI - Shop API " +
    "This requires the order id to be provided as an input ",
  shopApiSchema.getOrderByIdSchema.shape,
  async ({ id }) => {
    const order = await shopApi.orders.getOrder(id)
    return {
      content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
    }
  },
)

server.tool(
  "order-search",
  "Searches for orders using the SFCC OCAI - Shop API " +
    "This requires the search query to be provided as an input " +
    "Additional options need to be provided to filter the search results " +
    "Use order-search-usage resource to use the queries filed in the options",
  shopApiSchema.searchSchema.shape,
  async (args) => {
    const orders = await shopApi.orders.orderSearch(args)
    return {
      content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
    }
  },
)

server.tool(
  "get-custom-object",
  "Fetches a custom object by its type and key using the SFCC OCAI - Data API " +
    "This requires the object type and key to be provided as an input",
  dataApiSchema.getOrDeleteCustomObjectSchema.shape,
  async ({ object_type, objectKey }) => {
    const customObject = await dataApi.customObjects.getCustomObject(
      object_type,
      objectKey,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(customObject, null, 2) }],
    }
  },
)

server.tool(
  "update-custom-object",
  "Updates a custom object by its type and key using the SFCC OCAI - Data API " +
    "This requires the object type and key to be provided as an input " +
    "The object to update needs to be provided as an input",
  dataApiSchema.createOrUpdateCustomObjectSchema.shape,
  async ({ object_type, objectKey, object }) => {
    const updatedCustomObject = await dataApi.customObjects.updateCustomObject(
      object_type,
      objectKey,
      object,
    )
    return {
      content: [
        { type: "text", text: JSON.stringify(updatedCustomObject, null, 2) },
      ],
    }
  },
)

server.tool(
  "create-custom-object",
  "Creates a custom object by its type and key using the SFCC OCAI - Data API " +
    "This requires the object type and key to be provided as an input " +
    "The object to create needs to be provided as an input",
  dataApiSchema.createOrUpdateCustomObjectSchema.shape,
  async ({ object_type, objectKey, object }) => {
    const createdCustomObject = await dataApi.customObjects.createCustomObject(
      object_type,
      objectKey,
      object,
    )
    return {
      content: [
        { type: "text", text: JSON.stringify(createdCustomObject, null, 2) },
      ],
    }
  },
)

server.tool(
  "custom-object-search",
  "Searches for custom objects using the SFCC OCAI - Data API " +
    "This requires the object type and search query to be provided as an input " +
    "Additional options can be provided to filter the search results",
  dataApiSchema.customObjectSearchSchema.shape,
  async ({ object_type, options }) => {
    const customObjects = await dataApi.customObjects.customObjectSearch(
      object_type,
      options,
    )
    return {
      content: [{ type: "text", text: JSON.stringify(customObjects, null, 2) }],
    }
  },
)

server.tool(
  "get-content-by-id",
  "Fetches a content by its id using the SFCC OCAI - Data API " +
    "This requires the content id to be provided as an input ",
  dataApiSchema.getContentByIdSchema.shape,
  async ({ id, libraryId }) => {
    const content = await dataApi.libraries.getContent(libraryId, id)
    return {
      content: [{ type: "text", text: JSON.stringify(content, null, 2) }],
    }
  },
)

server.tool(
  "get-contents-by-ids",
  "Fetches multiple contents by their ids using the SFCC OCAI - Shop API " +
    "This requires the content ids to be provided as an input ",
  shopApiSchema.getContentsByIdsSchema.shape,
  async ({ ids }) => {
    const contents = await shopApi.content.getContents(ids)
    return {
      content: [{ type: "text", text: JSON.stringify(contents, null, 2) }],
    }
  },
)

server.tool(
  "content-search",
  "Searches for contents using the SFCC OCAI - Shop API " +
    "This requires the search query to be provided as an input " +
    "Additional options need to be provided to filter the search results",
  shopApiSchema.contentSearchSchema.shape,
  async (args) => {
    const contents = await shopApi.content.contentSearch(args)
    return {
      content: [{ type: "text", text: JSON.stringify(contents, null, 2) }],
    }
  },
)

server.tool(
  "update-content-by-id",
  "Updates a content by its id using the SFCC OCAI - Data API " +
    "This requires the content id and library id to be provided as an input " +
    "The content to update needs to be provided as an input",
  dataApiSchema.updateContentByIdSchema.shape,
  async ({ id, libraryId, content }) => {
    const updatedContent = await dataApi.libraries.updateContent(
      libraryId,
      id,
      content,
    )
    return {
      content: [
        { type: "text", text: JSON.stringify(updatedContent, null, 2) },
      ],
    }
  },
)

// Start the server
async function startServer() {
  const transport = new StdioServerTransport()

  // Create server resources from markdown files
  await createServerResources(server)
  await server.connect(transport)
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
