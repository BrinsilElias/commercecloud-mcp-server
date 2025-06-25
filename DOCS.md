# Commerce Cloud MCP Server Documentation

## Overview

The **Commerce Cloud MCP Server** is a TypeScript-based implementation of the Model Context Protocol (MCP) that bridges AI applications with Salesforce Commerce Cloud (SFCC). It provides a comprehensive wrapper around SFCC's Open Commerce API (OCAPI), enabling AI systems to interact with Commerce Cloud data and operations.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI applications to access external data and functionality. This server implements MCP to expose Commerce Cloud capabilities to AI systems, allowing them to:

- Query product catalogs
- Search orders and customers
- Manage custom objects
- Access content libraries

## Architecture Overview

### Core Components

```
src/
├── index.ts                    # MCP server entry point
├── api/
│   ├── shop/                   # Public storefront API (no auth)
│   │   ├── products.ts         # Product operations
│   │   ├── orders.ts           # Order operations
│   │   ├── customers.ts        # Customer operations
│   │   ├── baskets.ts          # Shopping basket operations
│   │   ├── categories.ts       # Category operations
│   │   └── content.ts          # Content operations
│   └── data/                   # Administrative API (OAuth required)
│       ├── products.ts         # Product management
│       ├── custom-objects.ts   # Custom object CRUD
│       ├── categories.ts       # Category management
│       ├── jobs.ts             # Job execution
│       ├── libraries.ts        # Content libraries
│       └── customer-lists.ts   # Customer data
├── services/
│   ├── ocapi.ts                # HTTP client for OCAPI
│   └── access-token.ts         # OAuth token management
└── utils/
    ├── constants.ts            # Application constants
    ├── env.ts                  # Environment configuration
    ├── helpers.ts              # Utility functions
    └── types.ts                # TypeScript definitions
```

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

## Authentication Setup

The server uses OAuth 2.0 client credentials flow for Data API access. Ensure your Commerce Cloud instance is configured with:

1. OCAPI client credentials
2. Proper permissions for Shop and Data APIs
3. Business Manager user with appropriate roles

## API Documentation

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

- `npm run build` - Full TypeScript build with declarations
- `npm run build-fast` - Fast ESM build for development

### Project Structure

The codebase follows these key patterns:

1. **Modular API Organization** - Separate modules for Shop and Data APIs
2. **Schema-First Design** - Zod schemas for validation and documentation
3. **Type Safety** - Full TypeScript coverage with types

### Adding New Tools

To add a new MCP tool:

1. Define the tool function in the appropriate API module
2. Create Zod schema for input validation
3. Implement the handler with proper error handling
4. Register the tool in the module's index file
5. Add documentation in the resources directory

### Testing

Test your tools using MCP-compatible clients or the MCP inspector. [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

## Resources

The server provides contextual documentation through MCP resources:

- Product usage examples
- Order search patterns
- Custom object operations
- Job execution monitoring
- Query syntax guides

These resources are loaded from the `resources/` directory and provide AI systems with usage examples and best practices.
