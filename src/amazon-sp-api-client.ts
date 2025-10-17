/**
 * Amazon SP-API Client - Main Entry Point
 * 
 * This module serves as the main entry point for the Amazon SP-API client library.
 * It exports all the necessary components from the separate modules for easy importing.
 * 
 * @example
 * ```typescript
 * // Import the main client class
 * import { AmazonSpApiClient } from './amazon-sp-api-client';
 * 
 * // Import specific types if needed
 * import { SearchListingsItemsQueryParams, MarketplaceId } from './amazon-sp-api-client';
 * 
 * // Import validation functions if needed
 * import { validateSearchParams, validateClientConfig } from './amazon-sp-api-client';
 * 
 * // Import error classes if needed
 * import { SpApiClientError } from './amazon-sp-api-client';
 * ```
 * 
 * @packageDocumentation
 */

// Export the main client class
export { AmazonSpApiClient } from './client.js';

// Export all types and interfaces
export type {
  // Core configuration types
  SpApiClientConfig,
  
  // API parameter types
  SearchListingsItemsQueryParams,
  
  // API response types
  SearchListingsItemsResponse,
  ListingItem,
  ItemSummary,
  ItemImage,
  Pagination,
  
  // Error types
  SpApiError,
  SpApiErrorResponse,
  
  // Enum types
  MarketplaceId,
  IdentifierType,
  ConditionType,
  IncludedDataType,
  SortOrder,
  SortBy,
  IssueSeverity,
  ListingStatus,
  OfferType,
  
  // Additional interface types
  Money,
  Points,
  Audience,
  ListingIssue,
  Offer,
  FulfillmentAvailability,
  Relationship,
  MarketplaceRelationships,
  ProductType,
  EnforcementAction,
  Exemption,
  Enforcements
} from './types.js';

// Export validation functions
export {
  validateSearchParams,
  validateClientConfig,
  validateSearchParamsOrThrow,
  validateClientConfigOrThrow
} from './validators.js';

// Export error classes and utilities
export {
  SpApiClientError,
  getHttpErrorMessage,
  createSpApiErrorFromAxiosError
} from './errors.js';

// Also provide a default export for convenience
export { AmazonSpApiClient as default } from './client.js';
