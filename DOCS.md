# Commerce Cloud MCP Server Documentation

## Overview

The **Commerce Cloud MCP Server** is a TypeScript-based implementation of the Model Context Protocol (MCP) that bridges AI applications with Salesforce Commerce Cloud (SFCC). Built on **Cloudflare Workers** with **OAuth 2.0 authentication using Microsoft as the identity provider**, it provides a secure, scalable solution with comprehensive wrapper around SFCC's Open Commerce API (OCAPI), enabling authenticated AI systems to interact with Commerce Cloud data and operations.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI applications to access external data and functionality. This server implements MCP to expose Commerce Cloud capabilities to AI systems, allowing them to:

- Query product catalogs
- Search orders and customers
- Manage custom objects
- Access content libraries

## Architecture Overview

### Deployment Architecture

The server operates as a **Cloudflare Worker** with integrated **OAuth 2.0 authentication** using the following components:

- **OAuth Provider** (`@cloudflare/workers-oauth-provider`) - Microsoft identity provider integration
- **Server-Sent Events (SSE)** - Real-time communication via `/sse` endpoint
- **Streamable HTTPS Transporter** - Standard MCP protocol via `/mcp` endpoint
- **R2 Storage** - Hosts documentation resources and static assets
- **KV Storage** - OAuth token and session management
- **Static Assets** - Custom OAuth approval UI with styling

### Core Components

```
src/
├── index.ts                    # Cloudflare Worker entry point with OAuth
├── api/
│   ├── shop/                   # Public storefront API (no auth)
│   │   ├── products.ts         # Product operations
│   │   ├── orders.ts           # Order operations
│   │   ├── customers.ts        # Customer operations
│   │   ├── baskets.ts          # Shopping basket operations
│   │   ├── categories.ts       # Category operations
│   │   └── content.ts          # Content operations
│   ├── data/                   # Administrative API (OAuth required)
│   │   ├── products.ts         # Product management
│   │   ├── custom-objects.ts   # Custom object CRUD
│   │   ├── categories.ts       # Category management
│   │   ├── jobs.ts             # Job execution
│   │   ├── libraries.ts        # Content libraries
│   │   └── customer-lists.ts   # Customer data
│   └── resources/              # Documentation resources from R2
│       └── index.ts            # R2 resource loader
├── services/
│   ├── ocapi.ts                # HTTP client for OCAPI
│   ├── access-token.ts         # Commerce Cloud OAuth token management
│   └── oauth-handler.ts        # Microsoft OAuth flow handler
└── utils/
    ├── constants.ts            # Application constants
    ├── env.ts                  # Environment configuration
    ├── helpers.ts              # Utility functions
    ├── types.ts                # TypeScript definitions
    ├── workers-oauth-utils.ts  # OAuth utility functions
    └── oauth-errors.ts         # OAuth error handling
```

### OAuth Integration Architecture

The server implements OAuth 2.0 flow using an OAuth Library - `@cloudflare/workers-oauth-provider`:

```typescript
export default new OAuthProvider({
  apiHandlers: {
    "/sse": CommerceCloudMCP.serveSSE("/sse"),
    "/mcp": CommerceCloudMCP.serve("/mcp"),
  },
  defaultHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
})
```

**OAuth Endpoints:**

- `/authorize` - Authorization request handling with approval UI
- `/token` - Authorization Code - Token exchange
- `/callback` - OAuth callback handler

**Authentication Flow:**

1. Client initiates OAuth flow via `/authorize`
2. User sees custom approval page with Commerce Cloud branding
3. Redirect to Microsoft identity provider for authentication
4. Callback to `/callback` with authorization code
5. Token exchange and user info retrieval
6. Session establishment in KV storage
7. Access to protected MCP endpoints (`/sse`, `/mcp`)

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
  server.tool("get-product-by-id", "Retrieve a product by its ID", inputSchema, async (request) => {
    // Implementation
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    }
  })
}
```

## Authentication Architecture

### Dual OAuth Implementation

The server implements **two separate OAuth flows**:

#### 1. Microsoft OAuth 2.0 (MCP Client Authentication)

- **Purpose**: Authenticates MCP clients (AI applications) to access the MCP Server
- **Provider**: Microsoft Azure Active Directory / Entra ID
- **Flow**: Authorization Code
- **Endpoints**: `/authorize`, `/token`, `/callback`
- **Storage**: KV namespace for session management
- **Security**: Enhanced OpenID Connect with nonce validation and CSRF protection

#### 2. Commerce Cloud OAuth 2.0 (SFCC API Access)

- **Purpose**: Server-to-SFCC API authentication for Data API operations
- **Provider**: Salesforce Commerce Cloud
- **Flow**: Client Credentials
- **Management**: Automatic token renewal and caching
- **Scope**: SFCC OCAPI Data API access

## Configuration

### Cloudflare Workers Configuration

The `wrangler.toml` file configures the Cloudflare Worker with OAuth integration:

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

# Static assets for OAuth UI
[assets]
directory = "./public"
binding = "ASSETS"

# KV namespace for OAuth sessions
[[kv_namespaces]]
binding = "OAUTH_KV"
id = "your-kv-namespace-id"
```

### Environment Variables

#### Public Variables (in `wrangler.toml` [vars] section)

```toml
[vars]
# Commerce Cloud Configuration
SFCC_INSTANCE_URL = "https://your-instance.dx.commercecloud.salesforce.com"
SFCC_SITE_ID = "your-site-id"
SFCC_VERSION = "v25_6"
SFCC_BM_USER_ID = "your-business-manager-user-id"
SFCC_CLIENT_ID = "your-sfcc-client-id"

# Microsoft OAuth Configuration
MICROSOFT_CLIENT_ID = "your-azure-app-client-id"
MICROSOFT_TENANT_ID = "your-azure-tenant-id"
```

#### Secret Variables (use `wrangler secret put`)

```bash
# Commerce Cloud secrets
wrangler secret put SFCC_CLIENT_SECRET
wrangler secret put SFCC_BM_USER_SECURITY_TOKEN

# Microsoft OAuth secret
wrangler secret put MICROSOFT_CLIENT_SECRET
```

### Cloudflare Resources Setup

#### 1. KV Namespace for OAuth Sessions

Create a KV namespace for OAuth session management:

```bash
wrangler kv:namespace create "OAUTH_KV"
```

#### 2. R2 Bucket for Resources

Create an R2 bucket for documentation resources:

```bash
wrangler r2 bucket create commerce-cloud-mcp-resources
```

#### 3. Static Assets

The `public/` directory contains OAuth UI assets:

- `styles.css` - Custom OAuth approval page styling
- `tryzens-logo.png` - Company branding for OAuth Approval UI
- Additional static resources served via Assets binding

### Enhanced Security Features

The OAuth implementation includes few security measures:

#### Cryptographic Security

- **Secure Random Generation**: Uses `crypto.getRandomValues()` for nonce and state
- **CSRF Protection**: Enhanced state parameter with timestamp validation
- **Nonce Validation**: Prevents token replay attacks
- **Input Sanitization**: HTML sanitization for all user inputs

#### Session Management

- **KV Storage**: Persistent session storage with TTL
- **Token Validation**: Comprehensive ID token validation
- **State Expiry**: 10-minute expiry for authorization states
- **Error Handling**: Structured error responses with request tracking

## API Endpoints

### OAuth Endpoints

#### `GET /authorize`

- **Purpose**: Initiate OAuth authorization flow
- **Response**: Custom approval page with Tryzens branding
- **Security**: CSRF protection with state validation

#### `POST /authorize`

- **Purpose**: Process authorization approval
- **Response**: Redirect to Microsoft identity provider
- **Security**: State validation and secure redirect

#### `GET|POST /callback`

- **Purpose**: Handle Microsoft OAuth callback
- **Security**: Comprehensive token validation and nonce verification
- **Response**: Session establishment and redirect

#### `POST /token`

- **Purpose**: OAuth token exchange and refresh
- **Security**: Client authentication and token validation

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

- `get-basket-by-id` - Cart details retrieval

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

- `get-content-by-id` - Retrieves content asset by Id
- `update-content-by-id` - Updates content asset

#### Customer Lists

- `get-customer-list-by-id` - Retrieves customer list by Id
- `get-customer-by-customer-number` - Retrieves customer by customer number

## Development

### Build Commands

- `npm run dev` - Start Cloudflare Workers development server with OAuth
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Workers types

### Local Development with OAuth

1. **Start the development server**:

```bash
npm run dev
```

### Project Structure

The codebase follows these key patterns:

1. **Cloudflare Worker Architecture** - Built for serverless edge computing
2. **OAuth Provider Integration** - Comprehensive Microsoft identity provider integration
3. **Durable Objects Integration** - Persistent state management
4. **R2 Storage** - Dynamic resource loading from cloud storage
5. **KV Session Management** - Secure OAuth session handling
6. **Modular API Organization** - Separate modules for Shop and Data APIs
7. **Schema-First Design** - Zod schemas for validation and documentation
8. **Type Safety** - Full TypeScript coverage with Cloudflare Workers types

### Adding New Tools

To add a new MCP tool:

1. Define the tool function in the appropriate API module
2. Create Zod schema for input validation
3. Implement the handler with proper error handling
4. Register the tool in the module's index file
5. Add documentation in the resources directory
6. Upload resource to R2 bucket

## Resources

The server provides contextual documentation through MCP resources loaded from R2 storage:

- Product usage examples
- Order search patterns
- Custom object operations
- Job execution monitoring
- Query syntax guides
- OAuth integration examples

Resources are automatically loaded from the `MCP_RESOURCES` R2 bucket and registered with the MCP server, providing AI systems with comprehensive usage examples and best practices.
