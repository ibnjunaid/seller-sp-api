/**
 * Amazon SP-API Client - Backward Compatibility Module
 * 
 * This module maintains backward compatibility by re-exporting all components
 * from the new modular structure. This ensures existing code continues to work
 * while benefiting from the improved organization.
 * 
 * Consider importing from specific modules or the main index for better tree-shaking
 * @example
 * ```typescript
 * // Legacy import (still works)
 * import { AmazonSpApiClient } from './amazon-sp-api-client';
 * 
 * // Recommended new imports
 * import { AmazonSpApiClient } from './index';
 * // or
 * import { AmazonSpApiClient } from './client';
 * ```
 * 
 * @packageDocumentation
 */

// Re-export everything from the main index for backward compatibility
export * from './index.js';

// Also provide a default export for convenience
export { AmazonSpApiClient as default } from './client.js';
