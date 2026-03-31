// ============================================================================
// SECURE API CLIENT WITH RATE LIMITING
// ============================================================================
// This is now using the secureAPI from secureAPI.js
// which includes rate limiting, sanitization, and API versioning

import { secureAPI } from './secureAPI';

// Export the secure API instances
export const apiV1 = secureAPI.v1;
export const apiV2 = secureAPI.v2;

// Default export uses V1 for backwards compatibility
export default secureAPI.v1;
