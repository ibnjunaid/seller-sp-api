/**
 * Error classes and utilities for Amazon SP-API Client
 * 
 * This module contains custom error classes and error handling utilities
 * used throughout the Amazon SP-API client implementation.
 * 
 * @group Errors
 */

import type { SpApiError } from './types.js';

/**
 * Custom error class for SP-API related errors
 * 
 * @group Classes
 * @remarks
 * This error class provides structured error information from Amazon SP-API responses,
 * including HTTP status codes, detailed error messages, request IDs, and rate limit information.
 * 
 * @example
 * ```typescript
 * import { SpApiClientError } from './errors.js';
 * 
 * try {
 *   // API call that fails
 *   throw new SpApiClientError(400, [
 *     {
 *       code: 'InvalidInput',
 *       message: 'The sellerId parameter is required',
 *       details: 'sellerId cannot be null or empty'
 *     }
 *   ], 'req-12345', '10');
 * } catch (error) {
 *   if (error instanceof SpApiClientError) {
 *     console.log('Status:', error.statusCode);
 *     console.log('Errors:', error.errors);
 *     console.log('Request ID:', error.requestId);
 *     console.log('Rate Limit:', error.rateLimit);
 *   }
 * }
 * ```
 */
export class SpApiClientError extends Error {
  /**
   * HTTP status code from the API response
   */
  public readonly statusCode: number;
  
  /**
   * Array of detailed error information from the API
   */
  public readonly errors: SpApiError[];
  
  /**
   * Amazon request ID for tracking and support purposes
   */
  public readonly requestId?: string | undefined;
  
  /**
   * Rate limit information from the API response headers
   */
  public readonly rateLimit?: string | undefined;

  /**
   * Creates a new SpApiClientError instance
   * 
   * @param statusCode - HTTP status code from the response
   * @param errors - Array of detailed error information
   * @param requestId - Optional Amazon request ID
   * @param rateLimit - Optional rate limit information
   * @param message - Optional custom error message
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(
   *   403,
   *   [{ code: 'Unauthorized', message: 'Access denied', details: 'Invalid token' }],
   *   'req-67890',
   *   '5'
   * );
   * ```
   */
  constructor(
    statusCode: number, 
    errors: SpApiError[], 
    requestId?: string, 
    rateLimit?: string, 
    message?: string
  ) {
    super(message || `SP-API Error: ${statusCode}`);
    this.name = 'SpApiClientError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.requestId = requestId;
    this.rateLimit = rateLimit;
  }

  /**
   * Returns a formatted string representation of the error
   * 
   * @returns Formatted error string with status code and error details
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(400, [
   *   { code: 'InvalidInput', message: 'Invalid parameter' }
   * ]);
   * console.log(error.toString());
   * // Output: "SpApiClientError: SP-API Error: 400 - InvalidInput: Invalid parameter"
   * ```
   */
  public toString(): string {
    const errorMessages = this.errors.map(e => `${e.code}: ${e.message}`).join(', ');
    return `${this.name}: ${this.message} - ${errorMessages}`;
  }

  /**
   * Returns a JSON representation of the error
   * 
   * @returns Object containing all error properties
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(500, [
   *   { code: 'InternalError', message: 'Server error' }
   * ], 'req-123');
   * 
   * console.log(JSON.stringify(error.toJSON(), null, 2));
   * // Output:
   * // {
   * //   "name": "SpApiClientError",
   * //   "message": "SP-API Error: 500",
   * //   "statusCode": 500,
   * //   "errors": [{ "code": "InternalError", "message": "Server error" }],
   * //   "requestId": "req-123"
   * // }
   * ```
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      requestId: this.requestId,
      rateLimit: this.rateLimit
    };
  }

  /**
   * Checks if the error is a client error (4xx status code)
   * 
   * @returns True if status code is between 400-499
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(404, []);
   * console.log(error.isClientError()); // true
   * 
   * const serverError = new SpApiClientError(500, []);
   * console.log(serverError.isClientError()); // false
   * ```
   */
  public isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Checks if the error is a server error (5xx status code)
   * 
   * @returns True if status code is between 500-599
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(500, []);
   * console.log(error.isServerError()); // true
   * 
   * const clientError = new SpApiClientError(400, []);
   * console.log(clientError.isServerError()); // false
   * ```
   */
  public isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Checks if the error is a rate limit error (429 status code)
   * 
   * @returns True if status code is 429
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(429, []);
   * console.log(error.isRateLimitError()); // true
   * ```
   */
  public isRateLimitError(): boolean {
    return this.statusCode === 429;
  }

  /**
   * Checks if the error is an authentication error (401 or 403 status code)
   * 
   * @returns True if status code is 401 or 403
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(401, []);
   * console.log(error.isAuthError()); // true
   * 
   * const forbiddenError = new SpApiClientError(403, []);
   * console.log(forbiddenError.isAuthError()); // true
   * ```
   */
  public isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  /**
   * Gets the first error from the errors array
   * 
   * @returns First SpApiError or undefined if no errors
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(400, [
   *   { code: 'InvalidInput', message: 'First error' },
   *   { code: 'MissingParam', message: 'Second error' }
   * ]);
   * 
   * const firstError = error.getFirstError();
   * console.log(firstError?.code); // "InvalidInput"
   * ```
   */
  public getFirstError(): SpApiError | undefined {
    return this.errors.length > 0 ? this.errors[0] : undefined;
  }

  /**
   * Gets all error codes from the errors array
   * 
   * @returns Array of error codes
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(400, [
   *   { code: 'InvalidInput', message: 'First error' },
   *   { code: 'MissingParam', message: 'Second error' }
   * ]);
   * 
   * const codes = error.getErrorCodes();
   * console.log(codes); // ["InvalidInput", "MissingParam"]
   * ```
   */
  public getErrorCodes(): string[] {
    return this.errors.map(error => error.code);
  }

  /**
   * Checks if the error contains a specific error code
   * 
   * @param code - Error code to check for
   * @returns True if the error code is found
   * 
   * @example
   * ```typescript
   * const error = new SpApiClientError(400, [
   *   { code: 'InvalidInput', message: 'Invalid parameter' }
   * ]);
   * 
   * console.log(error.hasErrorCode('InvalidInput')); // true
   * console.log(error.hasErrorCode('NotFound')); // false
   * ```
   */
  public hasErrorCode(code: string): boolean {
    return this.errors.some(error => error.code === code);
  }
}

/**
 * Gets a human-readable error message for common HTTP status codes
 * 
 * @param statusCode - The HTTP status code
 * @returns Human-readable error message
 * 
 * @example
 * ```typescript
 * import { getHttpErrorMessage } from './errors.js';
 * 
 * console.log(getHttpErrorMessage(400)); // "Request has missing or invalid parameters..."
 * console.log(getHttpErrorMessage(404)); // "The resource specified does not exist"
 * console.log(getHttpErrorMessage(999)); // "HTTP 999 error"
 * ```
 */
export function getHttpErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Request has missing or invalid parameters and cannot be parsed';
    case 401:
      return 'The request is unauthorized. Check your authentication credentials';
    case 403:
      return 'Access to the resource is forbidden. Possible reasons include Access Denied, Unauthorized, Expired Token, or Invalid Signature';
    case 404:
      return 'The resource specified does not exist';
    case 413:
      return 'The request size exceeded the maximum accepted size';
    case 415:
      return 'The request payload is in an unsupported format';
    case 429:
      return 'The frequency of requests was greater than allowed';
    case 500:
      return 'An unexpected condition occurred that prevented the server from fulfilling the request';
    case 502:
      return 'Bad gateway - the server received an invalid response from an upstream server';
    case 503:
      return 'Temporary overloading or maintenance of the server';
    case 504:
      return 'Gateway timeout - the server did not receive a timely response from an upstream server';
    default:
      return `HTTP ${statusCode} error`;
  }
}

/**
 * Creates a SpApiClientError from an Axios error
 * 
 * @param error - The Axios error object
 * @returns SpApiClientError instance
 * 
 * @example
 * ```typescript
 * import axios from 'axios';
 * import { createSpApiErrorFromAxiosError } from './errors.js';
 * 
 * try {
 *   await axios.get('https://api.example.com/invalid');
 * } catch (axiosError) {
 *   const spApiError = createSpApiErrorFromAxiosError(axiosError);
 *   console.log(spApiError.statusCode);
 *   console.log(spApiError.errors);
 * }
 * ```
 */
export function createSpApiErrorFromAxiosError(error: any): SpApiClientError {
  if (error.response) {
    const statusCode = error.response.status;
    const responseData = error.response.data as any;
    const requestId = error.response.headers['x-amzn-requestid'] as string;
    const rateLimit = error.response.headers['x-amzn-ratelimit-limit'] as string;

    // Try to extract SP-API error format
    let errors: SpApiError[] = [];
    if (responseData && responseData.errors && Array.isArray(responseData.errors)) {
      errors = responseData.errors;
    } else {
      // Fallback error format
      errors = [{
        code: `HTTP_${statusCode}`,
        message: getHttpErrorMessage(statusCode) || error.message || `HTTP ${statusCode} error`,
        details: responseData ? JSON.stringify(responseData) : undefined,
      }];
    }

    return new SpApiClientError(statusCode, errors, requestId, rateLimit);
  } else if (error.request) {
    // Network error
    return new SpApiClientError(0, [{
      code: 'NETWORK_ERROR',
      message: 'Network error occurred while making the request',
      details: error.message,
    }]);
  } else {
    // Request setup error
    return new SpApiClientError(0, [{
      code: 'REQUEST_SETUP_ERROR',
      message: 'Error setting up the request',
      details: error.message,
    }]);
  }
}
