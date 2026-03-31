import axios from 'axios';
import { sanitizeInput } from './securityUtils';

// ============================================================================
// SECURE API CLIENT WITH RATE LIMITING & API VERSIONING
// ============================================================================

// API Configuration (versioned, no keys exposed)
const API_CONFIG = {
  v1: {
    baseURL: import.meta.env.VITE_API_V1_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
  },
  v2: {
    baseURL: import.meta.env.VITE_API_V2_URL || 'http://localhost:5000/api/v2',
    timeout: 10000,
  }
};

// ============================================================================
// RATE LIMITING - Client-side rate limiter for protection
// ============================================================================
class RateLimiter {
  constructor(maxRequests = 30, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.maxRequests - this.requests.length;
  }
}

// Create rate limiters for different endpoints
const rateLimiters = {
  default: new RateLimiter(30, 60000), // 30 requests per minute
  auth: new RateLimiter(5, 300000), // 5 requests per 5 minutes for auth
  upload: new RateLimiter(10, 60000), // 10 uploads per minute
};

// ============================================================================
// CREATE VERSIONED API INSTANCES
// ============================================================================
const createSecureAPIInstance = (version = 'v1') => {
  const config = API_CONFIG[version];
  
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': version,
      // Never expose keys in headers - use backend only
    }
  });

  // Request interceptor for rate limiting and sanitization
  instance.interceptors.request.use(
    (config) => {
      // Check rate limiting
      const limiter = rateLimiters.default;
      if (!limiter.isAllowed()) {
        const error = new Error('Rate limit exceeded. Please try again later.');
        error.code = 'RATE_LIMIT_EXCEEDED';
        return Promise.reject(error);
      }

      // Sanitize string data in request body
      if (config.data && typeof config.data === 'object') {
        config.data = sanitizeRequestData(config.data);
      }

      // Get token from secure storage (localStorage is acceptable for JWT)
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracking
      config.headers['X-Request-ID'] = generateRequestID();

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        console.warn('⚠️ Rate limit exceeded');
        return Promise.reject({
          message: 'Too many requests. Please wait before trying again.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60
        });
      }

      // Never log sensitive data
      if (error.response) {
        console.error(`API Error [${error.response.status}]:`, error.response.statusText);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create instances for different versions
const apiV1 = createSecureAPIInstance('v1');
const apiV2 = createSecureAPIInstance('v2');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function sanitizeRequestData(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function generateRequestID() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// PUBLIC API EXPORT
// ============================================================================
export const secureAPI = {
  v1: apiV1,
  v2: apiV2,
  
  // Specific rate limiters for endpoints
  checkRateLimit: (type = 'default') => {
    const limiter = rateLimiters[type] || rateLimiters.default;
    return limiter.isAllowed();
  },

  getRemainingRequests: (type = 'default') => {
    const limiter = rateLimiters[type] || rateLimiters.default;
    return limiter.getRemainingRequests();
  }
};

export default secureAPI;
