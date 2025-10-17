# Amazon SP-API Client with Joi Validation

A TypeScript client for Amazon Selling Partner API's Search Listings Items endpoint with comprehensive input validation using Joi.

## Features

- ✅ **Comprehensive Input Validation**: Uses Joi for robust parameter validation
- ✅ **TypeScript Support**: Full TypeScript definitions and type safety
- ✅ **Error Handling**: Detailed error messages and proper error types
- ✅ **Mutual Exclusivity**: Validates mutually exclusive parameters
- ✅ **Conditional Requirements**: Validates conditional parameter dependencies
- ✅ **ISO Date Validation**: Proper ISO 8601 date format validation
- ✅ **Range Validation**: Validates numeric ranges and array sizes
- ✅ **URL Validation**: Validates API endpoint URLs

## Installation

```bash
npm install joi axios
npm install --save-dev @types/joi @types/node typescript
```

## Usage

### Basic Usage

```typescript
import { AmazonSpApiClient } from './dist/amazon-sp-api-client.js';

// Create client with validation
const client = new AmazonSpApiClient({
  baseUrl: 'https://sellingpartnerapi-na.amazon.com',
  timeout: 30000,
  headers: {
    'x-amz-access-token': 'your-access-token',
    'Authorization': 'AWS4-HMAC-SHA256 your-auth-header'
  }
});

// Search for listings with validation
try {
  const results = await client.searchListingsItems({
    sellerId: 'A1B2C3D4E5F6G7',
    marketplaceIds: ['ATVPDKIKX0DER'],
    identifiers: ['B08N5WRWNW', 'B08N5WRXYZ'],
    identifiersType: 'ASIN',
    includedData: ['summaries', 'attributes'],
    pageSize: 10
  });
  
  console.log(`Found ${results.numberOfResults} items`);
} catch (error) {
  console.error('Validation or API error:', error.message);
}
```

## Validation Features

### Configuration Validation

The client constructor validates:

- **baseUrl**: Must be a valid HTTP/HTTPS URL
- **timeout**: Must be between 1000ms and 300000ms (5 minutes)
- **headers**: Must be an object with string keys and values

```typescript
// ✅ Valid configuration
const client = new AmazonSpApiClient({
  baseUrl: 'https://sellingpartnerapi-na.amazon.com',
  timeout: 30000,
  headers: { 'x-amz-access-token': 'token' }
});

// ❌ Invalid configuration - will throw validation error
const client = new AmazonSpApiClient({
  baseUrl: 'not-a-url',  // Invalid URL
  timeout: 500           // Too small
});
```

### Query Parameter Validation

#### Required Parameters
- **sellerId**: Must be a non-empty string
- **marketplaceIds**: Must be an array with exactly 1 marketplace ID

#### Optional Parameters with Validation
- **identifiers**: Maximum 20 items
- **identifiersType**: Must be one of: SKU, ASIN, EAN, FNSKU, GTIN, ISBN, JAN, MINSAN, UPC
- **pageSize**: Must be between 1 and 20
- **includedData**: Must contain valid data types
- **sortBy**: Must be one of: sku, createdDate, lastUpdatedDate
- **sortOrder**: Must be ASC or DESC
- **Date fields**: Must be valid ISO 8601 format

#### Conditional Requirements
- **identifiersType** is required when **identifiers** is provided

#### Mutual Exclusivity
Only one of these can be used at a time:
- **identifiers** (with identifiersType)
- **variationParentSku**
- **packageHierarchySku**

### Validation Examples

```typescript
// ✅ Valid parameters
await client.searchListingsItems({
  sellerId: 'A1B2C3D4E5F6G7',
  marketplaceIds: ['ATVPDKIKX0DER'],
  identifiers: ['B08N5WRWNW'],
  identifiersType: 'ASIN',
  pageSize: 10,
  sortOrder: 'DESC'
});

// ❌ Missing required field
await client.searchListingsItems({
  marketplaceIds: ['ATVPDKIKX0DER']
  // Missing sellerId - will throw validation error
});

// ❌ Mutual exclusivity violation
await client.searchListingsItems({
  sellerId: 'A1B2C3D4E5F6G7',
  marketplaceIds: ['ATVPDKIKX0DER'],
  identifiers: ['B08N5WRWNW'],        // ❌ Cannot use with variationParentSku
  identifiersType: 'ASIN',
  variationParentSku: 'PARENT-SKU'    // ❌ Conflicts with identifiers
});

// ❌ Missing conditional requirement
await client.searchListingsItems({
  sellerId: 'A1B2C3D4E5F6G7',
  marketplaceIds: ['ATVPDKIKX0DER'],
  identifiers: ['B08N5WRWNW']
  // Missing identifiersType - required when identifiers is provided
});

// ❌ Invalid values
await client.searchListingsItems({
  sellerId: 'A1B2C3D4E5F6G7',
  marketplaceIds: ['ATVPDKIKX0DER'],
  pageSize: 25,                       // ❌ Must be between 1-20
  sortOrder: 'INVALID',               // ❌ Must be ASC or DESC
  identifiersType: 'INVALID_TYPE'     // ❌ Must be valid identifier type
});
```

## Error Handling

The client provides detailed error messages for validation failures:

```typescript
try {
  await client.searchListingsItems({
    sellerId: '',  // Empty string
    marketplaceIds: []  // Empty array
  });
} catch (error) {
  console.log(error.message);
  // "Validation failed: sellerId is required and cannot be empty, marketplaceIds must contain at least one marketplace ID"
}
```

## Validation Schema Details

### Configuration Schema
```typescript
{
  baseUrl: string (required, valid HTTP/HTTPS URL)
  timeout: number (optional, 1000-300000ms)
  headers: object (optional, string keys/values)
}
```

### Query Parameters Schema
```typescript
{
  // Required
  sellerId: string (required, non-empty)
  marketplaceIds: string[] (required, exactly 1 item)
  
  // Optional
  issueLocale: string (optional)
  includedData: IncludedDataType[] (optional, valid types only)
  identifiers: string[] (optional, max 20 items)
  identifiersType: IdentifierType (optional, valid types only)
  variationParentSku: string (optional, non-empty)
  packageHierarchySku: string (optional, non-empty)
  createdAfter: string (optional, ISO 8601 date)
  createdBefore: string (optional, ISO 8601 date)
  lastUpdatedAfter: string (optional, ISO 8601 date)
  lastUpdatedBefore: string (optional, ISO 8601 date)
  withIssueSeverity: IssueSeverity[] (optional, valid severities only)
  withStatus: ListingStatus[] (optional, valid statuses only)
  withoutStatus: ListingStatus[] (optional, valid statuses only)
  sortBy: SortBy (optional, valid fields only)
  sortOrder: SortOrder (optional, ASC or DESC)
  pageSize: number (optional, 1-20)
  pageToken: string (optional)
}
```

## Building and Testing

```bash
# Build the TypeScript code
npm run build

# Generate TSDoc documentation
npm run docs

# Serve documentation with live reload during development
npm run docs:serve
```

## Documentation

This project includes comprehensive TSDoc documentation generated with TypeDoc. The documentation includes:

- **API Reference**: Complete documentation of all classes, interfaces, types, and functions
- **Type Definitions**: Detailed type information with examples and constraints
- **Validation Rules**: Documentation of all Joi validation schemas and rules
- **Usage Examples**: Code examples for common use cases
- **Error Handling**: Documentation of error types and handling strategies

### Viewing Documentation

After running `npm run docs`, open `docs/index.html` in your browser to view the complete API documentation.

The documentation is organized into the following sections:
- **Classes**: `AmazonSpApiClient` and `SpApiClientError`
- **Interfaces**: All interface definitions with detailed property descriptions
- **Types**: Type aliases with usage examples and validation rules
- **Functions**: Factory functions and utilities

### Documentation Features

- **Search Functionality**: Full-text search across all documentation
- **Type Navigation**: Easy navigation between related types and interfaces
- **Code Examples**: Comprehensive examples for all major features
- **Validation Documentation**: Detailed validation rules and error messages
- **Cross-References**: Linked references between related components

## Benefits of Joi Validation

1. **Early Error Detection**: Catches invalid parameters before making API calls
2. **Clear Error Messages**: Provides specific, actionable error messages
3. **Type Safety**: Works seamlessly with TypeScript types
4. **Complex Validation**: Handles conditional requirements and mutual exclusivity
5. **Maintainable**: Centralized validation logic that's easy to update
6. **Performance**: Validates locally before expensive API calls

## API Reference

See the TypeScript definitions in the source code for complete API documentation, including all interfaces, types, and method signatures.
