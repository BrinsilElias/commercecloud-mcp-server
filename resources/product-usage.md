# Product API Documentation

## Endpoint

**PATCH** `https://{host}/s/-/dw/data/v25_6/products/{id}`
**PUT** `https://{host}/s/-/dw/data/v25_6/products/{id}`

Update/Create a product using the provided information.

### Fields That Can Be Updated

- `name`
- `page_description`
- `long_description`
- `page_title`
- `page_keywords`
- `brand`
- `ean`
- `upc`
- `manufacture_sku`
- `manufacture_name`
- `searchable`
- `unit`
- `online_flag`
- `default_variant_id`
- `valid_to`
- `valid_from`
- `tax_class_id`
- `localized_tax_class_id`

## Faults

| Status | Fault                          | Description                                                  |
| ------ | ------------------------------ | ------------------------------------------------------------ |
| 400    | IdConflictException            | ID in the URL does not match the ID in the product document. |
| 400    | ProductDefaultVariantException | Problem in setting default variant for a product.            |
| 404    | ProductNotFoundException       | Product to be updated not found.                             |

## Request Example (cURL)

```bash
curl "https://{host}/s/-/dw/data/v25_6/products/{id}" \
  -X PATCH \
  -H "content-type: application/json" \
  -d '{
    "ats": 500,
    "brand": "Brand",
    "ean": "EAN",
    "id": "my-product",
    "in_stock": true,
    "link": "https://example.com/s/-/dw/data/{version}/products/my-product",
    "long_description": {
      "default": "default": {
        markup: string,
        source: string
      }
    },
    "manufacturer_name": "Manufacturer",
    "manufacturer_sku": "Manufacturer ID",
    "name": {
      "default": "My Product"
    },
    "online": true,
    "online_flag": {
      "default": true
    },
    "owning_catalog_id": "my-catalog",
    "owning_catalog_name": {
      "default": "My Catalog"
    },
    "page_description": {
      "default": "Page description"
    },
    "page_keywords": {
      "default": "Page Keyword"
    },
    "page_title": {
      "default": "Page title"
    },
    "price": 100,
    "price_currency": "USD",
    "price_per_unit": 100,
    "searchable": {
      "default": true
    },
    "short_description": {
      "default": {
        markup: string,
        source: string
      }
    },
    "type": {
      "bundle": true,
      "bundled": true,
      "part_of_product_set": true
    },
    "unit": "bnd",
    "unit_measure": "each",
    "unit_quantity": 1,
    "upc": "UPC"
  }'
```

## Parameters

### Path Parameter

- `id` (string, required)

  - Product ID to be updated.
  - Min length: 1, Max length: 100

## Object Field Descriptions

### Basic Fields

- `ats` (double): Available To Sell inventory value.
- `brand` (string): Brand of the product.
- `ean` (string): European Article Number.
- `id` (string): SKU of the product.
- `in_stock` (boolean): Product stock status.
- `link` (string): URL to the product.
- `manufacturer_name` (string): Manufacturer name.
- `manufacturer_sku` (string): Manufacturer SKU.
- `name` (object): Localized name.
- `online` (boolean): Online availability.
- `online_flag` (object): Site-specific online status.
- `owning_catalog_id` (string): Catalog owning the product.
- `owning_catalog_name` (object): Localized catalog name.
- `page_description`, `page_keywords`, `page_title` (object): Localized SEO content.
- `price`, `price_per_unit` (double): Price and price per unit.
- `price_currency` (string): Currency code.
- `searchable` (object): Site-specific searchable flag.
- `short_description`, `long_description` (object): Localized descriptions.
- `unit` (string): Sales unit.
- `unit_measure` (string): Unit of measure.
- `unit_quantity` (double): Unit quantity.
- `upc` (string): Universal Product Code.
- `default_variant_id` (string): ID of default variant.
- `tax_class_id` (string): Tax class ID.
- `localized_tax_class_id` (object): Localized tax class.
- `valid_from`, `valid_to` (object): Product validity times.
- `type` (object): Product type with booleans for `bundle`, `bundled`, `part_of_product_set`.

### Complex/Array Fields

- `assigned_categories`, `primary_categories` (array): Assigned categories.
- `primary_category_id` (string): ID of primary category.
- `bundled_products`, `product_bundles`, `product_sets`, `set_products` (array): Grouping relationships.
- `classification_category` (object): Classification info.
- `image` (object): Product image.
- `image_groups` (array): Image groups.
- `master` (object): Variation master.
- `product_options` (array): Options for option-type products.
- `variants` (array): Variants of the product (for master/variation_group).
- `variation_attributes` (array): Assigned variation attributes.
- `variation_groups` (array): Variation groups (for master).
- `variation_values` (object): Selected variation values (for variant/variation_group).

### Example Response

```json
{
  "ats": 500,
  "brand": "Brand",
  "ean": "EAN",
  "id": "my-product",
  "in_stock": true,
  "link": "https://example.com/s/-/dw/data/{version}/products/my-product",
  "long_description": {
    "default": "Long Description"
  },
  "manufacturer_name": "Manufacturer",
  "manufacturer_sku": "Manufacturer ID",
  "name": {
    "default": "My Product"
  },
  "online": true,
  "online_flag": {
    "default": true
  },
  "owning_catalog_id": "my-catalog",
  "owning_catalog_name": {
    "default": "My Catalog"
  },
  "page_description": {
    "default": "Page description"
  },
  "page_keywords": {
    "default": "Page Keyword"
  },
  "page_title": {
    "default": "Page title"
  },
  "price": 100,
  "price_currency": "USD",
  "price_per_unit": 100,
  "searchable": {
    "default": true
  },
  "short_description": {
    "default": "Short Description"
  },
  "type": {
    "bundle": true,
    "bundled": true,
    "part_of_product_set": true
  },
  "unit": "bnd",
  "unit_measure": "each",
  "unit_quantity": 1,
  "upc": "UPC"
}
```

---

> **Note**: This file is structured to help AIs understand endpoint behavior and field definitions in a structured markdown format for server-to-AI resource loading.
