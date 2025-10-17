/**
 * Amazon SP-API Client implementation
 * 
 * This module contains the main client class for interacting with the
 * Amazon Selling Partner API's Search for Listings Items endpoint.
 * 
 * @group Classes
 */

import axios, { type AxiosResponse, AxiosError } from 'axios';
import type { 
  SearchListingsItemsQueryParams, 
  SearchListingsItemsResponse, 
  SpApiClientConfig 
} from './types.js';
import { validateClientConfigOrThrow, validateSearchParamsOrThrow } from './validators.js';
import { createSpApiErrorFromAxiosError } from './errors.js';

/**
 * Amazon SP-API Client for Search Listings Items operations
 * 
 * @group Classes
 * @remarks
 * This client provides a comprehensive interface to the Amazon SP-API's
 * Search for Listings Items endpoint
 * 
 * @example
 * ```typescript
 * import { AmazonSpApiClient } from './client.js';
 * 
 * const client = new AmazonSpApiClient({
 *   baseUrl: 'https://sellingpartnerapi-na.amazon.com',
 *   timeout: 30000,
 *   headers: {
 *     'x-amz-access-token': 'your-access-token',
 *     'Authorization': 'AWS4-HMAC-SHA256 your-auth-header'
 *   }
 * });
 * 
 * // Search for listings
 * const results = await client.searchListingsItems({
 *   sellerId: 'A1B2C3D4E5F6G7',
 *   marketplaceIds: ['ATVPDKIKX0DER'],
 *   identifiers: ['B08N5WRWNW'],
 *   identifiersType: 'ASIN',
 *   includedData: ['summaries', 'attributes']
 * });
 * ```
 */
export class AmazonSpApiClient {
  /**
   * Base URL for the SP-API endpoint
   */
  private readonly baseUrl: string;
  
  /**
   * Request timeout in milliseconds
   */
  private readonly timeout: number;
  
  /**
   * Default headers to include in all requests
   */
  private readonly defaultHeaders: Record<string, string>;

  /**
   * Creates a new instance of the Amazon SP-API client
   * 
   * @param config - Configuration options for the client
   * @throws {Error} When configuration is invalid
   * 
   * @example
   * ```typescript
   * const client = new AmazonSpApiClient({
   *   baseUrl: 'https://sellingpartnerapi-na.amazon.com',
   *   timeout: 30000,
   *   headers: {
   *     'x-amz-access-token': 'your-access-token',
   *     'Authorization': 'AWS4-HMAC-SHA256 your-auth-header'
   *   }
   * });
   * ```
   */
  constructor(config: SpApiClientConfig) {
    // Validate configuration using Joi
    validateClientConfigOrThrow(config);

    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 30000; // Default 30 seconds
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Builds the query string from the provided parameters
   * 
   * @param params - Query parameters to convert to URL query string
   * @returns The formatted query string
   * 
   * @internal
   */
  private buildQueryString(params: SearchListingsItemsQueryParams): string {
    const queryParams = new URLSearchParams();

    // Add required marketplace IDs
    params.marketplaceIds.forEach(id => queryParams.append('marketplaceIds', id));

    // Add optional parameters if provided
    if (params.issueLocale) {
      queryParams.set('issueLocale', params.issueLocale);
    }

    if (params.includedData?.length) {
      params.includedData.forEach(data => queryParams.append('includedData', data));
    }

    if (params.identifiers?.length) {
      params.identifiers.forEach(id => queryParams.append('identifiers', id));
    }

    if (params.identifiersType) {
      queryParams.set('identifiersType', params.identifiersType);
    }

    if (params.variationParentSku) {
      queryParams.set('variationParentSku', params.variationParentSku);
    }

    if (params.packageHierarchySku) {
      queryParams.set('packageHierarchySku', params.packageHierarchySku);
    }

    if (params.createdAfter) {
      queryParams.set('createdAfter', params.createdAfter);
    }

    if (params.createdBefore) {
      queryParams.set('createdBefore', params.createdBefore);
    }

    if (params.lastUpdatedAfter) {
      queryParams.set('lastUpdatedAfter', params.lastUpdatedAfter);
    }

    if (params.lastUpdatedBefore) {
      queryParams.set('lastUpdatedBefore', params.lastUpdatedBefore);
    }

    if (params.withIssueSeverity?.length) {
      params.withIssueSeverity.forEach(severity => queryParams.append('withIssueSeverity', severity));
    }

    if (params.withStatus?.length) {
      params.withStatus.forEach(status => queryParams.append('withStatus', status));
    }

    if (params.withoutStatus?.length) {
      params.withoutStatus.forEach(status => queryParams.append('withoutStatus', status));
    }

    if (params.sortBy) {
      queryParams.set('sortBy', params.sortBy);
    }

    if (params.sortOrder) {
      queryParams.set('sortOrder', params.sortOrder);
    }

    if (params.pageSize !== undefined) {
      queryParams.set('pageSize', params.pageSize.toString());
    }

    if (params.pageToken) {
      queryParams.set('pageToken', params.pageToken);
    }

    return queryParams.toString();
  }

  /**
   * Searches for listings items using the Amazon SP-API
   * 
   * This method provides a comprehensive interface to the Amazon SP-API's
   * Search for Listings Items endpoint. It handles parameter validation,
   * request building, error handling, and response parsing.
   * 
   * The method supports various search criteria including:
   * - Product identifiers (ASIN, SKU, UPC, EAN, etc.)
   * - Variation parent/child relationships
   * - Package hierarchy relationships
   * - Date-based filtering
   * - Status and issue severity filtering
   * - Sorting and pagination
   * 
   * @param params - Query parameters for the search request
   * @returns Promise resolving to the search results
   * 
   * @throws {Error} When required parameters are missing or invalid
   * @throws {SpApiClientError} When the API returns an error response
   * 
   * @example
   * ```typescript
   * // Search by ASINs
   * const results = await client.searchListingsItems({
   *   sellerId: 'A1B2C3D4E5F6G7',
   *   marketplaceIds: ['ATVPDKIKX0DER'],
   *   identifiers: ['B08N5WRWNW', 'B08N5WRXYZ'],
   *   identifiersType: 'ASIN',
   *   includedData: ['summaries', 'attributes'],
   *   pageSize: 10
   * });
   * 
   * console.log(`Found ${results.numberOfResults} items`);
   * 
   * // Search by variation parent SKU
   * const variationResults = await client.searchListingsItems({
   *   sellerId: 'A1B2C3D4E5F6G7',
   *   marketplaceIds: ['ATVPDKIKX0DER'],
   *   variationParentSku: 'PARENT-SKU-123',
   *   includedData: ['summaries', 'relationships'],
   *   sortBy: 'lastUpdatedDate',
   *   sortOrder: 'DESC'
   * });
   * 
   * // Search with date filtering
   * const recentResults = await client.searchListingsItems({
   *   sellerId: 'A1B2C3D4E5F6G7',
   *   marketplaceIds: ['ATVPDKIKX0DER'],
   *   lastUpdatedAfter: '2023-01-01T00:00:00Z',
   *   withStatus: ['BUYABLE'],
   *   pageSize: 20
   * });
   * ```
   */
  public async searchListingsItems(
    params: SearchListingsItemsQueryParams
  ): Promise<SearchListingsItemsResponse> {
    try {
      // Validate parameters using Joi
      validateSearchParamsOrThrow(params);

      // Build the request URL
      const queryString = this.buildQueryString(params);
      const url = `${this.baseUrl}/listings/2021-08-01/items/${encodeURIComponent(params.sellerId)}?${queryString}`;

      // Make the HTTP request
      const response: AxiosResponse<SearchListingsItemsResponse> = await axios.get(url, {
        headers: this.defaultHeaders,
        timeout: this.timeout,
        validateStatus: (status: number) => status < 400, // Only treat 4xx and 5xx as errors
      });

      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw createSpApiErrorFromAxiosError(error);
      } else {
        // Re-throw non-HTTP errors 
        throw error;
      }
    }
  }

  /**
   * Gets the current configuration of the client
   * 
   * @returns Object containing current client configuration
   * 
   * @example
   * ```typescript
   * const config = client.getConfig();
   * console.log('Base URL:', config.baseUrl);
   * console.log('Timeout:', config.timeout);
   * console.log('Headers:', config.headers);
   * ```
   */
  public getConfig(): { baseUrl: string; timeout: number; headers: Record<string, string> } {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      headers: { ...this.defaultHeaders }
    };
  }

  /**
   * Updates the default headers for all future requests
   * 
   * @param headers - Headers to merge with existing headers
   * 
   * @example
   * ```typescript
   * // Update access token
   * client.updateHeaders({
   *   'x-amz-access-token': 'new-access-token'
   * });
   * 
   * // Add additional headers
   * client.updateHeaders({
   *   'x-custom-header': 'custom-value'
   * });
   * ```
   */
  public updateHeaders(headers: Record<string, string>): void {
    Object.assign(this.defaultHeaders, headers);
  }

  /**
   * Removes specific headers from future requests
   * 
   * @param headerNames - Array of header names to remove
   * 
   * @example
   * ```typescript
   * // Remove specific headers
   * client.removeHeaders(['x-custom-header', 'x-temp-header']);
   * ```
   */
  public removeHeaders(headerNames: string[]): void {
    headerNames.forEach(name => {
      delete this.defaultHeaders[name];
    });
  }

  /**
   * Creates a copy of the client with updated configuration
   * 
   * @param config - Partial configuration to override
   * @returns New AmazonSpApiClient instance with updated configuration
   * 
   * @example
   * ```typescript
   * // Create a client for a different region
   * const euClient = client.withConfig({
   *   baseUrl: 'https://sellingpartnerapi-eu.amazon.com'
   * });
   * 
   * // Create a client with different timeout
   * const fastClient = client.withConfig({
   *   timeout: 10000
   * });
   * ```
   */
  public withConfig(config: Partial<SpApiClientConfig>): AmazonSpApiClient {
    const newConfig: SpApiClientConfig = {
      baseUrl: config.baseUrl || this.baseUrl,
      timeout: config.timeout || this.timeout,
      headers: { ...this.defaultHeaders, ...config.headers }
    };

    return new AmazonSpApiClient(newConfig);
  }
}
