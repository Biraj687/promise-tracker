# Security Implementation Guide - Promise Tracker Frontend

## Overview
This document outlines the security implementations and new features added to the Promise Tracker application.

## Security Features Implemented

### 1. API Key Protection
- **Status**: ✅ Implemented
- **Strategy**: 
  - Never expose API keys in frontend code
  - All Supabase credentials use environment variables (VITE_ prefix)
  - Backend-only API keys are stored in server environment only
  - Frontend only has access to public ANON keys (limited by RLS policies)

**Usage**:
```javascript
// Good - Using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Bad - Never do this
const apiKey = 'sk_live_xxxxx'; // This will be exposed to users!
```

### 2. Input Sanitization
- **Status**: ✅ Implemented
- **Location**: `src/api/securityUtils.js`
- **Functions**:
  - `sanitizeInput()` - Sanitizes individual strings, prevents XSS
  - `sanitizeObject()` - Recursively sanitizes objects

**Usage**:
```javascript
import { sanitizeInput, sanitizeObject } from './api/securityUtils';

// Sanitize user input
const userInput = sanitizeInput(req.body.title);

// Sanitize entire data objects
const cleanData = sanitizeObject(userData);
```

**What it protects against**:
- XSS (Cross-Site Scripting) attacks
- HTML injection
- Special character exploitation

### 3. Rate Limiting
- **Status**: ✅ Implemented
- **Location**: `src/api/secureAPI.js`
- **Configuration**:
  - Default: 30 requests per minute
  - Auth endpoints: 5 requests per 5 minutes
  - Upload endpoints: 10 uploads per minute

**How it works**:
```javascript
class RateLimiter {
  constructor(maxRequests = 30, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    // Tracks request timestamps and enforces limits
  }
}
```

**Usage**:
```javascript
import { secureAPI } from './api/secureAPI';

// API calls are automatically rate limited
try {
  const response = await secureAPI.v1.get('/promises');
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log('Wait before retrying:', error.retryAfter);
  }
}

// Check remaining requests
const remaining = secureAPI.getRemainingRequests('default');
```

### 4. API Versioning
- **Status**: ✅ Implemented
- **Location**: `src/api/secureAPI.js`
- **Current Versions**: V1, V2
- **Benefits**:
  - Breaking changes handled gracefully
  - Backwards compatibility maintained
  - Easy deprecation of old endpoints

**Configuration**:
```javascript
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
```

**Usage**:
```javascript
import { secureAPI } from './api/secureAPI';

// Use V1
const v1Response = await secureAPI.v1.get('/promises');

// Use V2
const v2Response = await secureAPI.v2.get('/promises');
```

### 5. Secure File Upload
- **Status**: ✅ Implemented
- **Location**: `src/api/secureUpload.js`
- **Features**:
  - File type validation
  - File size limits (5MB default, 3MB for images)
  - Filename sanitization (prevents path traversal)
  - Unique filename generation
  - Image dimension validation
  - Thumbnail creation

**File Size Limits**:
- Images: 3MB
- Documents: 5MB

**Allowed Types**:
- Images: JPEG, PNG, WebP, GIF
- Documents: PDF

**Usage**:
```javascript
import { 
  validateFile, 
  sanitizeFilename, 
  generateUniqueFilename,
  createSecureFormData,
  validateImageDimensions,
  createImageThumbnail 
} from './api/secureUpload';

// Validate file
const validation = validateFile(file, 'image');
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Create secure FormData
const { formData, error } = createSecureFormData(file, 'image', {
  title: 'My Image',
  description: 'A secure upload'
});

// Validate image dimensions
const dimensions = await validateImageDimensions(file, {
  maxWidth: 2000,
  maxHeight: 2000,
  minWidth: 100,
  minHeight: 100
});

// Create thumbnail
const thumbnail = await createImageThumbnail(file, 200, 200);
```

### Security Best Practices Applied

#### 1. **Never Log Sensitive Data**
```javascript
// Good - Only log safe information
console.log('API Error:', error.response.statusText);

// Bad - Never log this!
console.log('Full response:', error.response); // Contains headers, tokens, etc
```

#### 2. **Use HTTPS in Production**
All API calls should use HTTPS to encrypt data in transit.

#### 3. **Row Level Security (RLS) in Database**
The database has RLS policies configured:
- Users can only see published content
- Only authenticated users can modify content they created

#### 4. **Content Security Policy (CSP) Headers**
Should be configured on the server to prevent unauthorized script execution.

#### 5. **Secure Storage**
- JWT tokens: localStorage (acceptable for SPAs)
- Sensitive operations: Server-side only
- Never store passwords or API keys in frontend

## New Features Implemented

### 1. News/Updates Management
- **Location**: `src/context/DataContext.jsx` (new operations)
- **Database Table**: `news_updates`
- **Features**:
  - Add/Edit/Delete news updates
  - Track update source URLs
  - Manage thumbnail images
  - Publish/Unpublish updates
  - Category association

**Context Functions**:
```javascript
const { 
  newsUpdates,
  addNewsUpdate,
  updateNewsUpdate,
  deleteNewsUpdate,
  fetchNewsUpdates,
  getNewsByCategory,
  getNewsByPromise 
} = useData();
```

### 2. Enhanced Recent Updates Component
- **Location**: `src/components/home/RecentUpdates.jsx`
- **Features**:
  - Display real data from database
  - Show source URLs with external links
  - Display news type badges (Update, News, Progress)
  - Automatic thumbnail extraction
  - Real-time date formatting in Nepali

### 3. API Versioning Support
- All API endpoints support versioning
- Easy migration path for API changes
- Backwards compatibility maintained

## Administration Panel Updates

### News Management Page
Add the following component at `/admin/news` (create as needed):
- Add new news updates
- Edit existing updates
- Delete updates
- Upload thumbnail images
- Preview before publishing
- Set source URLs

---

## Environment Variables Reference

```bash
# Supabase
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# API Endpoints (Versioned)
VITE_API_V1_URL=http://localhost:5000/api/v1
VITE_API_V2_URL=http://localhost:5000/api/v2

# Application Settings
VITE_APP_NAME=Promise Tracker
VITE_APP_URL=http://localhost:5173

# Security Settings
VITE_RATE_LIMIT_REQUESTS=30
VITE_RATE_LIMIT_WINDOW=60000

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

## Testing Security

### Test Rate Limiting
```javascript
// Try making more than 30 requests in 60 seconds
for (let i = 0; i < 35; i++) {
  try {
    await secureAPI.v1.get('/promises');
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.log('Rate limit triggered at request', i);
    }
  }
}
```

### Test Input Sanitization
```javascript
import { sanitizeInput } from './api/securityUtils';

const malicious = '<script>alert("XSS")</script>';
const clean = sanitizeInput(malicious);
// Output: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### Test File Upload
```javascript
import { validateFile } from './api/secureUpload';

const validation = validateFile(largeFile, 'image');
// Will reject files > 3MB for images
```

## Monitoring and Logging

### Secure Logging
- Never log API keys or tokens
- Don't log full request/response bodies that may contain sensitive data
- Log request IDs for tracking (generated in `src/api/secureAPI.js`)

### Error Handling
- Rate limit errors are caught and formatted nicely
- File upload errors are specific and actionable
- Network errors don't expose internal details

---

## Deployment Checklist

- [ ] All API keys are in environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] HTTPS is enabled on all endpoints
- [ ] CSP headers are configured
- [ ] RLS policies are active in database
- [ ] Rate limiting is enabled
- [ ] Input sanitization is active
- [ ] File upload restrictions are enforced
- [ ] Monitoring and logging are configured
- [ ] Tests pass for all security features

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-mode.html)
