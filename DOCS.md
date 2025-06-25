# Commerce Cloud MCP Server Documentation

## Overview

The **Commerce Cloud MCP Server** is a TypeScript-based implementation of the Model Context Protocol (MCP) that bridges AI applications with Salesforce Commerce Cloud (SFCC). Built on **Cloudflare Workers**, it provides a scalable, serverless solution with global edge distribution for accessing SFCC's Open Commerce API (OCAPI).

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI applications to access external data and functionality. This server implements MCP to expose Commerce Cloud capabilities to AI systems, allowing them to:

- Query product catalogs
- Search orders and customers
- Manage custom objects
- Execute administrative tasks
- Access content libraries

## Architecture Overview

### Deployment Architecture

The server operates as a **Cloudflare Worker** with the following components:

- **Durable Objects** (`CommerceCloudMCP` class) - Manages MCP agent state and lifecycle
- **Server-Sent Events (SSE)** - Real-time communication via `/sse` endpoint
- **Streamable HTTPS Transporter** - Standard MCP protocol via `/mcp` endpoint
- **R2 Storage** - Hosts documentation resources and static assets

### Core Components

```
src/
├── index.ts                     # Cloudflare Worker entry point & routing
├── api/
│   ├── shop/                    # Public storefront API (no auth)
│   │   ├── products.ts          # Product operations
│   │   ├── orders.ts            # Order operations
│   │   ├── customers.ts         # Customer operations
│   │   ├── baskets.ts           # Shopping basket operations
│   │   ├── categories.ts        # Category operations
│   │   └── content.ts           # Content operations
│   ├── data/                    # Administrative API (OAuth required)
│   │   ├── products.ts          # Product management
│   │   ├── custom-objects.ts    # Custom object CRUD
│   │   ├── categories.ts        # Category management
│   │   ├── jobs.ts              # Job execution
│   │   ├── libraries.ts         # Content libraries
│   │   └── customer-lists.ts    # Customer data
│   └── resources/               # Documentation resources from R2
│       └── index.ts             # R2 resource loader
├── services/
│   ├── ocapi.ts                 # HTTP client for OCAPI
│   └── access-token.ts          # OAuth token management
└── utils/
    ├── constants.ts             # Application constants
    ├── env.ts                   # Environment configuration
    ├── helpers.ts               # Utility functions
    └── types.ts                 # TypeScript definitions
```

### Cloudflare Worker Architecture

The main entry point (`src/index.ts`) implements a **CommerceCloudMCP** class that extends **McpAgent** from the `agents` package:

```typescript
export class CommerceCloudMCP extends McpAgent<Env> {
  // MCP Server instance
  server = new McpServer(...)

  async init() {
    // Register Shop and Data API tools
    registerShopApiTools(this.server)
    registerDataApiTools(this.server)

    // Load resources from R2 bucket
    if (this.env.MCP_RESOURCES) {
      await registerServerResources(this.server, this.env.MCP_RESOURCES)
    }
  }
}
```

The worker handles routing for:

- `/sse` - Server-Sent Events endpoint
- `/mcp` - Streamabile HTTPS MCP endpoint

### Two-Tier API Design

The server implements a two-tier architecture:

1. **Shop API** (`src/api/shop/`)

   - Public-facing operations
   - No authentication required
   - Customer storefront functionality
   - Product browsing, order tracking, content access

2. **Data API** (`src/api/data/`)
   - Administrative operations
   - OAuth authentication required
   - Backend management functionality
   - Product updates, custom objects, job execution

### MCP Tool Registration Pattern

Each API module follows a consistent pattern for registering MCP tools:

```typescript
export const getProductById = (server: McpServer) => {
  server.tool(
    "get-product-by-id",
    "Retrieve a product by its ID",
    inputSchema,
    async (request) => {
      // Implementation
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      }
    },
  )
}
```

## Configuration

### Cloudflare Workers Configuration

The `wrangler.toml` file configures the Cloudflare Worker:

```toml
name = "commerce-cloud-mcp-server"
main = "src/index.ts"
compatibility_date = "2025-06-08"
compatibility_flags = ["nodejs_compat"]

[observability]
enabled = true

# Durable Objects for MCP agent state
[[durable_objects.bindings]]
name = "MCP_OBJECT"
class_name = "CommerceCloudMCP"

# R2 bucket for documentation resources
[[r2_buckets]]
binding = "MCP_RESOURCES"
bucket_name = "commerce-cloud-mcp-resources"
```

### Environment Variables

#### Public Variables (in `wrangler.toml` [vars] section)

```toml
[vars]
SFCC_INSTANCE_URL = "https://your-instance.dx.commercecloud.salesforce.com"
SFCC_SITE_ID = "your-site-id"
SFCC_VERSION = "v25_6"
SFCC_BM_USER_ID = "your-business-manager-user-id"
SFCC_CLIENT_ID = "your-client-id"
```

#### Secret Variables (use `wrangler secret put`)

```bash
wrangler secret put SFCC_CLIENT_SECRET
wrangler secret put SFCC_BM_USER_SECURITY_TOKEN
```

### Cloudflare Resources Setup

#### 1. R2 Bucket for Resources

Create an R2 bucket for documentation resources:

```bash
wrangler r2 bucket create commerce-cloud-mcp-resources
```

Upload resource files to the `resources/` prefix in the bucket:

```bash
wrangler r2 object put commerce-cloud-mcp-resources/resources/product-usage.md --file=src/api/resources/product-usage.md
```

#### 2. Durable Objects

Durable Objects are automatically created based on the `wrangler.toml` configuration. They provide:

- Persistent state management for MCP agents
- Automatic scaling and distribution
- Session continuity across requests

### Authentication Setup

The server uses OAuth 2.0 client credentials flow for Data API access. Ensure your Commerce Cloud instance is configured with:

1. OCAPI client credentials
2. Proper permissions for Shop and Data APIs
3. Business Manager user with appropriate roles

## API Documentation

### Endpoints

The Cloudflare Worker exposes two main endpoints:

#### `/sse` - Server-Sent Events

- Real-time bidirectional communication
- Persistent connection for streaming responses
- Ideal for interactive AI applications

#### `/mcp` - HTTP API

- Standard MCP protocol over HTTP
- Request/response pattern
- Compatible with most MCP clients

### Shop API Tools

#### Products

- `get-product-by-id` - Retrieve single product details
- `get-products-by-ids` - Batch product retrieval

#### Orders

- `order-search` - Search orders with filters
- `get-order-by-id` - Retrieve specific order details

#### Customers

- `get-customer-by-id` - Customer profile information
- `get-customer-basket-by-id` - Customer's shopping basket

#### Categories

- `get-category-by-id` - Category details
- `get-categories-by-ids` - Batch category retrieval

#### Content

- `get-contents-by-ids` - Content asset retrieval
- `content-search` - Search content library

#### Baskets

- `get-basket-by-id` - Cart details retreival

### Data API Tools

#### Products

- `product-search` - Advanced product search with filters
- `update-product-by-id` - Modify product attributes

#### Custom Objects

- `custom-object-search` - Search custom objects
- `get-custom-object-by-id` - Retrieve custom object
- `create-custom-object` - Create new custom object
- `update-custom-object` - Modify custom object
- `delete-custom-object` - Remove custom object

#### Categories

- `category-search` - Category search with hierarchy

#### Jobs

- `job-execution-search` - Monitor job executions

#### Libraries

- `get-content-by-id` - Retreives content asset by Id
- `update-content-by-id` - Updates content asset

#### Customer Lists

- `get-customer-list-by-id` - Retreives customer list by Id
- `get-customer-by-customer-number` - Retreives customer by customer number

## Usage Examples

### Basic Product Query

```json
{
  "method": "tools/call",
  "params": {
    "name": "get-product-by-id",
    "arguments": {
      "productId": "12345",
      "expand": ["images", "prices", "variations"]
    }
  }
}
```

### Order Search

```json
{
  "method": "tools/call",
  "params": {
    "name": "order-search",
    "arguments": {
      "query": {
        "term_query": {
          "fields": ["order_no"],
          "operator": "is",
          "values": ["00001234"]
        }
      }
    }
  }
}
```

## Development

### Build Commands

- `npm run dev` - Start Cloudflare Workers development server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Workers types

### Local Development

1. Start the development server:

```bash
npm run dev
```

2. The server will be available at `http://localhost:8787`

3. Test endpoints:
   - SSE: `http://localhost:8787/sse`
   - HTTP: `http://localhost:8787/mcp`

### Project Structure

The codebase follows these key patterns:

1. **Cloudflare Worker Architecture** - Built for serverless edge computing
2. **Durable Objects Integration** - Persistent state management
3. **R2 Storage** - Dynamic resource loading from cloud storage
4. **Modular API Organization** - Separate modules for Shop and Data APIs
5. **Schema-First Design** - Zod schemas for validation and documentation
6. **Type Safety** - Full TypeScript coverage with Cloudflare Workers types

### Adding New Tools

To add a new MCP tool:

1. Define the tool function in the appropriate API module
2. Create Zod schema for input validation
3. Implement the handler with proper error handling
4. Register the tool in the module's index file
5. Add documentation in the resources directory
6. Upload resource to R2 bucket

## Resources

The server dynamically loads documentation from R2 storage, providing contextual help through MCP resources:

- Product usage examples
- Order search patterns
- Custom object operations
- Job execution monitoring
- Query syntax guides

Resources are automatically loaded from the `MCP_RESOURCES` R2 bucket and registered with the MCP server.
