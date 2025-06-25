# Commerce Cloud MCP Server Documentation

## Overview

The **Commerce Cloud MCP Server** is a **pnpm monorepo** containing multiple specialized TypeScript-based implementations of the Model Context Protocol (MCP). Each service is a dedicated **Cloudflare Worker** that bridges AI applications with specific Salesforce Commerce Cloud (SFCC) resources. The architecture provides modular, resource-specific MCP servers that can be deployed independently, enabling fine-grained control and scaling for different Commerce Cloud functionalities.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI applications to access external data and functionality. This monorepo implements MCP servers to expose Commerce Cloud capabilities to AI systems, allowing them to:

- Query product catalogs
- Search orders and customers
- Manage custom objects
- Access content libraries
- Monitor job executions
- Manage categories and baskets

## Monorepo Architecture

### Repository Structure

```
commercecloud-mcp-server/
├── packages/
│   ├── common/                     # Shared utilities and services
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── ocapi.ts        # Unified OCAPI client
│   │   │   │   └── access-token.ts # OAuth token management
│   │   │   └── utils/
│   │   │       ├── types.ts        # Shared TypeScript definitions
│   │   │       ├── constants.ts    # Application constants
│   │   │       └── schema.ts       # Common Zod schemas
│   │   └── package.json
│   │
│   ├── product-service/            # Product management MCP server
│   ├── order-service/              # Order operations MCP server
│   ├── customer-service/           # Customer management MCP server
│   ├── basket-service/             # Shopping basket MCP server
│   ├── category-service/           # Category management MCP server
│   ├── content-service/            # Content operations MCP server
│   ├── custom-objects-service/     # Custom objects MCP server
│   └── jobs-service/               # Job execution MCP server
│
├── package.json                    # Root package with workspace scripts
├── pnpm-workspace.yaml             # pnpm workspace configuration
├── pnpm-lock.yaml                  # Lockfile for dependencies
└── tsconfig.json                   # Root TypeScript configuration
```

### Service Architecture

Each service follows a consistent structure:

```
service-package/
├── src/
│   ├── index.ts                   # Cloudflare Worker entry point
│   ├── api/
│   │   ├── index.ts               # Tool registration
│   │   ├── shop.ts                # Shop API tools (if applicable)
│   │   └── data.ts                # Data API tools (if applicable)
│   └── utils/
│       ├── env.ts                 # Service-specific environment config
│       └── schemas.ts             # Service-specific Zod schemas
├── package.json                   # Service dependencies
├── tsconfig.json                  # Service TypeScript config
└── wrangler.toml                  # Cloudflare Workers config
```

### Deployment Model

- **Independent Services**: Each service is deployed as a separate Cloudflare Worker
- **Resource Specialization**: Services focus on specific Commerce Cloud resources
- **Shared Dependencies**: Common functionality through `@commercecloud/common` package

## Services Overview

### Product Service (`@commercecloud/product-service`)

**Endpoint**: `/mcp`
**Focus**: Product catalog management

**Shop API Tools**:

- `get-product-by-id` - Retrieve single product details
- `get-products-by-ids` - Batch product retrieval

**Data API Tools**:

- `product-search` - Advanced product search with filters
- `update-product-by-id` - Modify product attributes

### Order Service (`@commercecloud/order-service`)

**Endpoint**: `/mcp`
**Focus**: Order operations and tracking

**Shop API Tools**:

- `order-search` - Search orders with filters
- `get-order-by-id` - Retrieve specific order details

### Customer Service (`@commercecloud/customer-service`)

**Endpoint**: `/mcp`
**Focus**: Customer management

**Shop API Tools**:

- `get-customer-by-id` - Customer profile information
- `get-customer-basket-by-id` - Customer's shopping basket

**Data API Tools**:

- `get-customer-list-by-id` - Retrieve customer list by ID
- `get-customer-by-customer-number` - Retrieve customer by customer number

### Basket Service (`@commercecloud/basket-service`)

**Endpoint**: `/mcp`
**Focus**: Shopping basket operations

**Shop API Tools**:

- `get-basket-by-id` - Cart details retrieval
- Basket management operations

### Category Service (`@commercecloud/category-service`)

**Endpoint**: `/mcp`
**Focus**: Category hierarchy management

**Shop API Tools**:

- `get-category-by-id` - Category details
- `get-categories-by-ids` - Batch category retrieval

**Data API Tools**:

- `category-search` - Category search with hierarchy

### Content Service (`@commercecloud/content-service`)

**Endpoint**: `/mcp`
**Focus**: Content asset management

**Shop API Tools**:

- `get-contents-by-ids` - Content asset retrieval
- `content-search` - Search content library

**Data API Tools**:

- `get-content-by-id` - Retrieve content asset by ID
- `update-content-by-id` - Update content asset

### Custom Objects Service (`@commercecloud/custom-objects-service`)

**Endpoint**: `/mcp`
**Focus**: Custom object CRUD operations

**Data API Tools**:

- `custom-object-search` - Search custom objects
- `get-custom-object-by-id` - Retrieve custom object
- `create-custom-object` - Create new custom object
- `update-custom-object` - Modify custom object
- `delete-custom-object` - Remove custom object

### Jobs Service (`@commercecloud/jobs-service`)

**Endpoint**: `/mcp`
**Focus**: Job execution monitoring

**Data API Tools**:

- `job-execution-search` - Monitor job executions

## Common Package (`@commercecloud/common`)

The common package provides shared functionality across all services:

### OcapiClient

Unified HTTP client for Commerce Cloud API access:

```typescript
import { OcapiClient } from "@commercecloud/common"

const ocapi = new OcapiClient(env)

// Shop API request (no auth)
const product = await ocapi.get("shop", "/products/12345")

// Data API request (OAuth required)
const searchResults = await ocapi.post("data", "/product_search", {
  body: {
    query: {
      term_query: { fields: ["id"], operator: "is", values: ["12345"] },
    },
  },
})
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8.0+
- Cloudflare account with Workers plan
- Wrangler CLI installed globally (`npm install -g wrangler`)
- Access to Salesforce Commerce Cloud instance
- Valid OCAPI credentials

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd commercecloud-mcp-server
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the common package:

```bash
pnpm run build
```

### Development Commands

#### Global Commands

```bash
# Build common package
pnpm run build

# Deploy all services
pnpm run deploy

# Generate Cloudflare types for all services
pnpm run cf-typegen
```

#### Service-Specific Development

```bash
# Start individual service development servers
pnpm run dev:product
pnpm run dev:order
pnpm run dev:customer
pnpm run dev:basket
pnpm run dev:category
pnpm run dev:content
pnpm run dev:custom-objects
pnpm run dev:jobs
```

#### Service-Specific Deployment

```bash
# Deploy individual services
pnpm run deploy:product
pnpm run deploy:order
pnpm run deploy:customer
pnpm run deploy:basket
pnpm run deploy:category
pnpm run deploy:content
pnpm run deploy:custom-objects
pnpm run deploy:jobs
```

### Local Development

1. **Start a specific service**:

```bash
pnpm run dev:product
```

2. **Service will be available at**:

   - MCP endpoint: `http://localhost:8787/mcp`

3. **Test with MCP clients**:
   - Configure MCP client to connect to service endpoint
   - Use service-specific tools for testing

### Configuration

Each service requires similar environment configuration with service-specific naming:

#### Environment Variables (per service)

```toml
# wrangler.toml (per service)
[vars]
SFCC_INSTANCE_URL = "https://your-instance.dx.commercecloud.salesforce.com"
SFCC_SITE_ID = "your-site-id"
SFCC_VERSION = "v25_6"
SFCC_BM_USER_ID = "your-business-manager-user-id"
SFCC_CLIENT_ID = "your-sfcc-client-id"
```

## Project Structure Patterns

### Adding New Services

1. **Create new service package**:

```bash
mkdir packages/new-service
cd packages/new-service
```

2. **Initialize package.json**:

```json
{
  "name": "@commercecloud/new-service",
  "dependencies": {
    "@commercecloud/common": "workspace:*",
    "@modelcontextprotocol/sdk": "^1.12.0",
    "agents": "^0.0.95",
    "hono": "^4.7.11"
  }
}
```

3. **Follow service structure pattern**:

- Implement `src/index.ts` with McpAgent
- Create `src/api/index.ts` for tool registration
- Add service-specific tools in `src/api/shop.ts` and/or `src/api/data.ts`
- Configure `wrangler.toml` for Cloudflare Workers

4. **Update root package.json**:

```json
{
  "scripts": {
    "dev:new-service": "pnpm --filter new-service dev",
    "deploy:new-service": "pnpm run --filter new-service deploy"
  }
}
```

### Adding Tools to Existing Services

1. **Implement tool function**:

```typescript
// packages/product-service/src/api/shop.ts
export const newProductTool = (server: McpServer, ocapi: OcapiClient) => {
  server.tool(
    "new-product-tool",
    "Description of new tool",
    inputSchema,
    async (request) => {
      const response = await ocapi.get("shop", "/products/new-endpoint")
      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      }
    },
  )
}
```

2. **Register tool**:

```typescript
// packages/product-service/src/api/index.ts
import { newProductTool } from "./shop"

export const registerTools = (server: McpServer) => {
  const ocapi = new OcapiClient(env)

  // Existing tools...
  newProductTool(server, ocapi)
}
```
