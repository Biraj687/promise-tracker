/**
 * Security utilities for the Promise Tracker application.
 * Includes input sanitization and rate limiting helpers.
 */

/**
 * Sanitizes a string to prevent basic XSS and injection attacks.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes an object by recursively sanitizing all string values.
 * @param {Object} obj - The object to sanitize.
 * @returns {Object} - The sanitized object.
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  
  return sanitized;
};

/**
 * A simple client-side rate limiter to prevent spam.
 * Stores timestamps in localStorage.
 * @param {string} actionKey - Unique key for the action.
 * @param {number} limit - Number of requests allowed.
 * @param {number} intervalMs - Interval in milliseconds.
 * @returns {boolean} - True if the action is allowed, false otherwise.
 */
export const checkRateLimit = (actionKey, limit = 5, intervalMs = 60000) => {
  const now = Date.now();
  const storageKey = `rate_limit_${actionKey}`;
  const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Filter history to current interval
  const recentActions = history.filter(ts => now - ts < intervalMs);
  
  if (recentActions.length >= limit) {
    return false;
  }
  
  recentActions.push(now);
  localStorage.setItem(storageKey, JSON.stringify(recentActions));
  return true;
};
