/**
 * Type definitions for Amazon SP-API Client
 * 
 * This module contains all TypeScript type definitions used throughout the
 * Amazon SP-API client implementation.
 * 
 * @group Types
 */

/**
 * Represents the marketplace identifiers for Amazon SP-API
 * 
 * @example
 * ```typescript
 * const marketplaceId: MarketplaceId = 'ATVPDKIKX0DER'; // US marketplace
 * ```
 */
export type MarketplaceId = string;

/**
 * Supported identifier types for searching listings
 * 
 * @example
 * ```typescript
 * const identifierType: IdentifierType = 'ASIN';
 * const identifiers = ['B08N5WRWNW', 'B08N5WRXYZ'];
 * ```
 */
export type IdentifierType = 'SKU' | 'ASIN' | 'EAN' | 'FNSKU' | 'GTIN' | 'ISBN' | 'JAN' | 'MINSAN' | 'UPC';

/**
 * Supported condition types for listings
 * 
 * @remarks
 * These condition types represent the physical condition of items in Amazon listings.
 * Different condition types may have different pricing and availability.
 */
export type ConditionType = 
  | 'new_new' 
  | 'new_open_box' 
  | 'new_oem' 
  | 'refurbished_refurbished' 
  | 'used_like_new' 
  | 'used_very_good' 
  | 'used_good' 
  | 'used_acceptable' 
  | 'collectible_like_new' 
  | 'collectible_very_good' 
  | 'collectible_good' 
  | 'collectible_acceptable' 
  | 'club_club';

/**
 * Supported included data types for the response
 * 
 * @remarks
 * Controls which data sections are included in the API response.
 * Including only necessary data types can improve performance and reduce response size.
 * 
 * @example
 * ```typescript
 * const includedData: IncludedDataType[] = ['summaries', 'attributes', 'offers'];
 * ```
 */
export type IncludedDataType = 
  | 'summaries' 
  | 'attributes' 
  | 'issues' 
  | 'offers' 
  | 'fulfillmentAvailability' 
  | 'procurement' 
  | 'relationships' 
  | 'productTypes';

/**
 * Sort order options for search results
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Sort by field options for search results
 * 
 * @remarks
 * Determines the field used for sorting search results.
 * Default sorting is by `lastUpdatedDate` in descending order.
 */
export type SortBy = 'sku' | 'createdDate' | 'lastUpdatedDate';

/**
 * Issue severity levels for listing validation
 * 
 * @remarks
 * - `ERROR`: Critical issues that prevent listing from being active
 * - `WARNING`: Issues that may affect listing performance
 * - `INFO`: Informational messages about listing optimization
 */
export type IssueSeverity = 'ERROR' | 'WARNING' | 'INFO';

/**
 * Listing status types indicating availability
 * 
 * @remarks
 * - `BUYABLE`: Item is available for purchase
 * - `DISCOVERABLE`: Item is visible in search but may not be purchasable
 */
export type ListingStatus = 'BUYABLE' | 'DISCOVERABLE';

/**
 * Offer types for different customer segments
 * 
 * @remarks
 * - `B2C`: Business to Consumer offers
 * - `B2B`: Business to Business offers
 */
export type OfferType = 'B2C' | 'B2B';

/**
 * Query parameters for the Search Listings Items API
 * 
 * @group Interfaces
 * @remarks
 * This interface defines all possible parameters for searching Amazon listings.
 * It includes comprehensive validation rules and mutual exclusivity constraints.
 * 
 * @example
 * ```typescript
 * // Search by ASIN identifiers
 * const params: SearchListingsItemsQueryParams = {
 *   sellerId: 'A1B2C3D4E5F6G7',
 *   marketplaceIds: ['ATVPDKIKX0DER'],
 *   identifiers: ['B08N5WRWNW', 'B08N5WRXYZ'],
 *   identifiersType: 'ASIN',
 *   includedData: ['summaries', 'attributes'],
 *   pageSize: 10
 * };
 * 
 * // Search by variation parent SKU
 * const variationParams: SearchListingsItemsQueryParams = {
 *   sellerId: 'A1B2C3D4E5F6G7',
 *   marketplaceIds: ['ATVPDKIKX0DER'],
 *   variationParentSku: 'PARENT-SKU-123',
 *   includedData: ['summaries', 'relationships']
 * };
 * ```
 */
export interface SearchListingsItemsQueryParams {
  /** Required: A selling partner identifier, such as a merchant account or vendor code */
  sellerId: string;
  
  /** Required: The marketplace identifier (max 1 marketplace) */
  marketplaceIds: MarketplaceId[];
  
  /** Optional: A locale that is used to localize issues */
  issueLocale?: string;
  
  /** Optional: Include specific data in response (defaults to summaries) */
  includedData?: IncludedDataType[];
  
  /** Optional: List of identifiers to search for (max 20) */
  identifiers?: string[];
  
  /** Optional: The identifier type (required when identifiers is provided) */
  identifiersType?: IdentifierType;
  
  /** Optional: Filters results to include listing items that are variation children of the specified SKU */
  variationParentSku?: string;
  
  /** Optional: Filter results to include listing items that contain or are contained by the specified SKU */
  packageHierarchySku?: string;
  
  /** Optional: Filter listing items created at or after this time (ISO 8601) */
  createdAfter?: string;
  
  /** Optional: Filter listing items created at or before this time (ISO 8601) */
  createdBefore?: string;
  
  /** Optional: Filter listing items last updated at or after this time (ISO 8601) */
  lastUpdatedAfter?: string;
  
  /** Optional: Filter listing items last updated at or before this time (ISO 8601) */
  lastUpdatedBefore?: string;
  
  /** Optional: Filter results to include only listing items that have issues that match specified severity levels */
  withIssueSeverity?: IssueSeverity[];
  
  /** Optional: Filter results to include only listing items that have the specified status */
  withStatus?: ListingStatus[];
  
  /** Optional: Filter results to include only listing items that don't contain the specified statuses */
  withoutStatus?: ListingStatus[];
  
  /** Optional: Sort field (defaults to lastUpdatedDate) */
  sortBy?: SortBy;
  
  /** Optional: Sort order (defaults to DESC) */
  sortOrder?: SortOrder;
  
  /** Optional: Page size for pagination (1-20, default 10) */
  pageSize?: number;
  
  /** Optional: Page token for pagination */
  pageToken?: string;
}

/**
 * Money amount representation
 * 
 * @group Interfaces
 */
export interface Money {
  /** Currency code (e.g., USD, EUR) */
  currencyCode: string;
  
  /** Amount value as string */
  amount: string;
}

/**
 * Points information (Japan only)
 * 
 * @group Interfaces
 */
export interface Points {
  /** Number of points */
  pointsNumber?: number;
  
  /** Monetary value of points */
  pointsMonetaryValue?: Money;
}

/**
 * Audience information for offers
 * 
 * @group Interfaces
 */
export interface Audience {
  /** Audience type */
  audienceType?: string;
}

/**
 * Image information
 * 
 * @group Interfaces
 */
export interface ItemImage {
  /** Image URL */
  link?: string;
  
  /** Image height in pixels */
  height?: number;
  
  /** Image width in pixels */
  width?: number;
}

/**
 * Item summary information
 * 
 * @group Interfaces
 */
export interface ItemSummary {
  /** Marketplace identifier */
  marketplaceId: string;
  
  /** Amazon Standard Identification Number */
  asin?: string;
  
  /** The Amazon product type */
  productType: string;
  
  /** Item condition */
  conditionType?: ConditionType;
  
  /** Statuses that apply to the listing item */
  status: ListingStatus[];
  
  /** Fulfillment network stock keeping unit */
  fnSku?: string;
  
  /** Item name or title */
  itemName?: string;
  
  /** Date the listing item was created (ISO 8601) */
  createdDate: string;
  
  /** Date the listing item was last updated (ISO 8601) */
  lastUpdatedDate: string;
  
  /** Main image for the listing item */
  mainImage?: ItemImage;
}

/**
 * Enforcement action information
 * 
 * @group Interfaces
 */
export interface EnforcementAction {
  /** Action type */
  action?: string;
}

/**
 * Exemption information
 * 
 * @group Interfaces
 */
export interface Exemption {
  /** Exemption status */
  status?: string;
  
  /** Expiry date for exemption (ISO 8601) */
  expiryDate?: string;
}

/**
 * Enforcement information
 * 
 * @group Interfaces
 */
export interface Enforcements {
  /** List of enforcement actions */
  actions?: EnforcementAction[];
  
  /** Exemption details */
  exemption?: Exemption;
}

/**
 * Issue information for a listing item
 * 
 * @group Interfaces
 */
export interface ListingIssue {
  /** Issue code */
  code: string;
  
  /** Issue message */
  message: string;
  
  /** Issue severity */
  severity: IssueSeverity;
  
  /** Attribute names related to the issue */
  attributeNames?: string[];
  
  /** List of issue categories */
  categories: string[];
  
  /** Enforcement information */
  enforcements?: Enforcements;
}

/**
 * Offer information
 * 
 * @group Interfaces
 */
export interface Offer {
  /** Marketplace identifier */
  marketplaceId: string;
  
  /** Type of offer */
  offerType: OfferType;
  
  /** Price information */
  price: Money;
  
  /** Points information (Japan only) */
  points?: Points;
  
  /** Audience information */
  audience?: Audience;
}

/**
 * Fulfillment availability information
 * 
 * @group Interfaces
 */
export interface FulfillmentAvailability {
  /** Fulfillment channel code */
  fulfillmentChannelCode: string;
  
  /** Quantity available */
  quantity?: number;
}

/**
 * Relationship information
 * 
 * @group Interfaces
 */
export interface Relationship {
  /** Child SKUs */
  childSkus?: string[];
  
  /** Parent SKUs */
  parentSkus?: string[];
  
  /** Variation theme */
  variationTheme?: Record<string, any>;
  
  /** Relationship type */
  type: 'VARIATION' | 'PACKAGE_HIERARCHY';
}

/**
 * Marketplace relationships
 * 
 * @group Interfaces
 */
export interface MarketplaceRelationships {
  /** Marketplace identifier */
  marketplaceId: string;
  
  /** Relationships for the listing item */
  relationships: Relationship[];
}

/**
 * Product type information
 * 
 * @group Interfaces
 */
export interface ProductType {
  /** Marketplace identifier */
  marketplaceId: string;
  
  /** Product type name */
  productType: string;
}

/**
 * Represents a single listing item in the response
 * 
 * @group Interfaces
 */
export interface ListingItem {
  /** Seller-specific Stock Keeping Unit */
  sku: string;
  
  /** Summary information */
  summaries?: ItemSummary[];
  
  /** Item attributes (dynamic structure) */
  attributes?: Record<string, any>;
  
  /** Issues associated with the listing */
  issues?: ListingIssue[];
  
  /** Current offers */
  offers?: Offer[];
  
  /** Fulfillment availability */
  fulfillmentAvailability?: FulfillmentAvailability[];
  
  /** Procurement information */
  procurement?: Record<string, any>;
  
  /** Relationship details */
  relationships?: MarketplaceRelationships[];
  
  /** Product types */
  productTypes?: ProductType[];
}

/**
 * Pagination information for the response
 * 
 * @group Interfaces
 */
export interface Pagination {
  /** Token for the next page of results */
  nextToken?: string;
  
  /** Token for the previous page of results */
  previousToken?: string;
}

/**
 * Complete response structure from the Search Listings Items API
 * 
 * @group Interfaces
 */
export interface SearchListingsItemsResponse {
  /** Total number of results found (up to 1000 max) */
  numberOfResults: number;
  
  /** Pagination information */
  pagination?: Pagination;
  
  /** Array of listing items found */
  items: ListingItem[];
}

/**
 * Error response structure from Amazon SP-API
 * 
 * @group Interfaces
 */
export interface SpApiError {
  /** Error code */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional error details */
  details?: string | undefined;
}

/**
 * Complete error response structure
 * 
 * @group Interfaces
 */
export interface SpApiErrorResponse {
  /** Array of errors */
  errors: SpApiError[];
}

/**
 * Configuration options for the SP-API client
 * 
 * @group Interfaces
 */
export interface SpApiClientConfig {
  /** Base URL for the SP-API endpoint */
  baseUrl: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Additional headers to include in requests */
  headers?: Record<string, string>;
}
