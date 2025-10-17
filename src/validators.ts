/**
 * Joi validation schemas for Amazon SP-API Client
 * 
 * This module contains all Joi validation schemas used for input validation
 * throughout the Amazon SP-API client implementation.
 * 
 * @group Validation
 */

import Joi from 'joi';
import type { SearchListingsItemsQueryParams, SpApiClientConfig } from './types.js';

/**
 * Joi validation schema for SearchListingsItemsQueryParams
 * 
 * @remarks
 * This schema validates all query parameters for the Search Listings Items API,
 * including complex business rules such as mutual exclusivity and conditional requirements.
 * 
 * @example
 * ```typescript
 * import { validateSearchParams } from './validators.js';
 * 
 * const params = {
 *   sellerId: 'A1B2C3D4E5F6G7',
 *   marketplaceIds: ['ATVPDKIKX0DER'],
 *   identifiers: ['B08N5WRWNW'],
 *   identifiersType: 'ASIN'
 * };
 * 
 * const { error, value } = validateSearchParams(params);
 * if (error) {
 *   throw new Error(`Validation failed: ${error.details.map(d => d.message).join(', ')}`);
 * }
 * ```
 */
export const searchListingsItemsQueryParamsSchema = Joi.object({
  // Required fields
  sellerId: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'sellerId is required and cannot be empty',
      'any.required': 'sellerId is required'
    }),

  marketplaceIds: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .max(1)
    .required()
    .messages({
      'array.min': 'marketplaceIds must contain at least one marketplace ID',
      'array.max': 'marketplaceIds can contain at most 1 marketplace ID',
      'any.required': 'marketplaceIds is required'
    }),

  // Optional fields
  issueLocale: Joi.string()
    .trim()
    .optional(),

  includedData: Joi.array()
    .items(Joi.string().valid(
      'summaries', 'attributes', 'issues', 'offers',
      'fulfillmentAvailability', 'procurement', 'relationships', 'productTypes'
    ))
    .optional()
    .messages({
      'any.only': 'includedData must contain only valid values: summaries, attributes, issues, offers, fulfillmentAvailability, procurement, relationships, productTypes'
    }),

  identifiers: Joi.array()
    .items(Joi.string().trim().min(1))
    .max(20)
    .optional()
    .messages({
      'array.max': 'identifiers can contain at most 20 items'
    }),

  identifiersType: Joi.string()
    .valid('SKU', 'ASIN', 'EAN', 'FNSKU', 'GTIN', 'ISBN', 'JAN', 'MINSAN', 'UPC')
    .optional()
    .messages({
      'any.only': 'identifiersType must be one of: SKU, ASIN, EAN, FNSKU, GTIN, ISBN, JAN, MINSAN, UPC'
    }),

  variationParentSku: Joi.string()
    .trim()
    .min(1)
    .optional(),

  packageHierarchySku: Joi.string()
    .trim()
    .min(1)
    .optional(),

  createdAfter: Joi.string()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'createdAfter must be a valid ISO 8601 date-time string'
    }),

  createdBefore: Joi.string()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'createdBefore must be a valid ISO 8601 date-time string'
    }),

  lastUpdatedAfter: Joi.string()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'lastUpdatedAfter must be a valid ISO 8601 date-time string'
    }),

  lastUpdatedBefore: Joi.string()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'lastUpdatedBefore must be a valid ISO 8601 date-time string'
    }),

  withIssueSeverity: Joi.array()
    .items(Joi.string().valid('ERROR', 'WARNING', 'INFO'))
    .optional()
    .messages({
      'any.only': 'withIssueSeverity must contain only valid values: ERROR, WARNING, INFO'
    }),

  withStatus: Joi.array()
    .items(Joi.string().valid('BUYABLE', 'DISCOVERABLE'))
    .optional()
    .messages({
      'any.only': 'withStatus must contain only valid values: BUYABLE, DISCOVERABLE'
    }),

  withoutStatus: Joi.array()
    .items(Joi.string().valid('BUYABLE', 'DISCOVERABLE'))
    .optional()
    .messages({
      'any.only': 'withoutStatus must contain only valid values: BUYABLE, DISCOVERABLE'
    }),

  sortBy: Joi.string()
    .valid('sku', 'createdDate', 'lastUpdatedDate')
    .optional()
    .messages({
      'any.only': 'sortBy must be one of: sku, createdDate, lastUpdatedDate'
    }),

  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .optional()
    .messages({
      'any.only': 'sortOrder must be either ASC or DESC'
    }),

  pageSize: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .optional()
    .messages({
      'number.min': 'pageSize must be between 1 and 20',
      'number.max': 'pageSize must be between 1 and 20'
    }),

  pageToken: Joi.string()
    .trim()
    .optional()
})
// Custom validation for mutual exclusivity and conditional requirements
.custom((value, helpers) => {
  // Check if identifiersType is required when identifiers are provided
  if (value.identifiers && value.identifiers.length > 0 && !value.identifiersType) {
    return helpers.error('custom.identifiersTypeRequired');
  }

  // Check mutual exclusivity of identifiers, variationParentSku, and packageHierarchySku
  const exclusiveParams = [
    { name: 'identifiers', hasValue: value.identifiers && value.identifiers.length > 0 },
    { name: 'variationParentSku', hasValue: !!value.variationParentSku },
    { name: 'packageHierarchySku', hasValue: !!value.packageHierarchySku }
  ].filter(p => p.hasValue);

  if (exclusiveParams.length > 1) {
    const paramNames = exclusiveParams.map(p => p.name).join(', ');
    return helpers.error('custom.mutuallyExclusive', { params: paramNames });
  }

  return value;
})
.messages({
  'custom.identifiersTypeRequired': 'identifiersType is required when identifiers are provided',
  'custom.mutuallyExclusive': 'Cannot use multiple exclusive parameters: {{#params}}. Use only one of: identifiers, variationParentSku, or packageHierarchySku'
});

/**
 * Joi validation schema for SpApiClientConfig
 * 
 * @remarks
 * This schema validates the configuration options for the SP-API client,
 * ensuring proper URL format, timeout ranges, and header structure.
 * 
 * @example
 * ```typescript
 * import { validateClientConfig } from './validators.js';
 * 
 * const config = {
 *   baseUrl: 'https://sellingpartnerapi-na.amazon.com',
 *   timeout: 30000,
 *   headers: { 'x-amz-access-token': 'token' }
 * };
 * 
 * const { error, value } = validateClientConfig(config);
 * if (error) {
 *   throw new Error(`Invalid configuration: ${error.details.map(d => d.message).join(', ')}`);
 * }
 * ```
 */
export const spApiClientConfigSchema = Joi.object({
  baseUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'baseUrl must be a valid HTTP or HTTPS URL',
      'any.required': 'baseUrl is required'
    }),

  timeout: Joi.number()
    .integer()
    .min(1000)
    .max(300000)
    .optional()
    .messages({
      'number.min': 'timeout must be at least 1000ms (1 second)',
      'number.max': 'timeout must be at most 300000ms (5 minutes)'
    }),

  headers: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional()
    .messages({
      'object.pattern.match': 'headers must be an object with string keys and string values'
    })
});

/**
 * Validates SearchListingsItemsQueryParams using Joi schema
 * 
 * @param params - Query parameters to validate
 * @returns Joi validation result with error and value
 * 
 * @example
 * ```typescript
 * const { error, value } = validateSearchParams({
 *   sellerId: 'A1B2C3D4E5F6G7',
 *   marketplaceIds: ['ATVPDKIKX0DER']
 * });
 * 
 * if (error) {
 *   console.error('Validation failed:', error.details);
 * } else {
 *   console.log('Valid parameters:', value);
 * }
 * ```
 */
export function validateSearchParams(params: SearchListingsItemsQueryParams) {
  return searchListingsItemsQueryParamsSchema.validate(params);
}

/**
 * Validates SpApiClientConfig using Joi schema
 * 
 * @param config - Client configuration to validate
 * @returns Joi validation result with error and value
 * 
 * @example
 * ```typescript
 * const { error, value } = validateClientConfig({
 *   baseUrl: 'https://sellingpartnerapi-na.amazon.com',
 *   timeout: 30000
 * });
 * 
 * if (error) {
 *   console.error('Configuration invalid:', error.details);
 * } else {
 *   console.log('Valid configuration:', value);
 * }
 * ```
 */
export function validateClientConfig(config: SpApiClientConfig) {
  return spApiClientConfigSchema.validate(config);
}

/**
 * Validates SearchListingsItemsQueryParams and throws an error if invalid
 * 
 * @param params - Query parameters to validate
 * @throws {Error} When validation fails with detailed error message
 * 
 * @example
 * ```typescript
 * try {
 *   validateSearchParamsOrThrow({
 *     sellerId: 'A1B2C3D4E5F6G7',
 *     marketplaceIds: ['ATVPDKIKX0DER']
 *   });
 *   console.log('Parameters are valid');
 * } catch (error) {
 *   console.error('Validation error:', error.message);
 * }
 * ```
 */
export function validateSearchParamsOrThrow(params: SearchListingsItemsQueryParams): void {
  const { error } = validateSearchParams(params);
  if (error) {
    throw new Error(`Validation failed: ${error.details.map(d => d.message).join(', ')}`);
  }
}

/**
 * Validates SpApiClientConfig and throws an error if invalid
 * 
 * @param config - Client configuration to validate
 * @throws {Error} When validation fails with detailed error message
 * 
 * @example
 * ```typescript
 * try {
 *   validateClientConfigOrThrow({
 *     baseUrl: 'https://sellingpartnerapi-na.amazon.com'
 *   });
 *   console.log('Configuration is valid');
 * } catch (error) {
 *   console.error('Configuration error:', error.message);
 * }
 * ```
 */
export function validateClientConfigOrThrow(config: SpApiClientConfig): void {
  const { error } = validateClientConfig(config);
  if (error) {
    throw new Error(`Invalid configuration: ${error.details.map(d => d.message).join(', ')}`);
  }
}
