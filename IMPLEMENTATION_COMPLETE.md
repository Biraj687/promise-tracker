# Promise Tracker - Complete Implementation Guide

## 📋 Project Overview

This is a comprehensive implementation of the **Nepal Promise Tracker** - a web application for tracking government commitments and public promises made by elected officials.

### Key Features Implemented:
1. ✅ **Dynamic Promise Management** - Dashboard-controlled promises with real-time updates
2. ✅ **News/Updates System** - Track progress with multimedia updates and source links
3. ✅ **Category Management** - Organize promises into 12+ thematic areas
4. ✅ **Advanced Security** - API key hiding, input sanitization, rate limiting
5. ✅ **Responsive Design** - Beautiful UI with Nepali language support
6. ✅ **Admin Dashboard** - Full CRUD operations for all data

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd promise-tracker

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev

# Start backend (in another terminal)
npm run dev:backend
```

### Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# API Endpoints
VITE_API_V1_URL=http://localhost:5000/api/v1
VITE_API_V2_URL=http://localhost:5000/api/v2

# Application
VITE_APP_NAME=Promise Tracker
VITE_APP_URL=http://localhost:5173
```

---

## 📁 Project Structure

```
promise-tracker/
├── src/
│   ├── api/
│   │   ├── axios.js           # Secure API client
│   │   ├── secureAPI.js       # API versioning + rate limiting
│   │   ├── secureUpload.js    # Secure file upload utilities
│   │   └── securityUtils.js   # Input sanitization
│   ├── components/
│   │   ├── admin/
│   │   │   ├── NewsFormModal.jsx      # News creation/editing
│   │   │   ├── PromiseFormModal.jsx
│   │   │   └── CategoryFormModal.jsx
│   │   └── home/
│   │       ├── Hero.jsx
│   │       ├── RecentUpdates.jsx      # Real-time news display
│   │       ├── CategoryGrid.jsx
│   │       └── StatsBar.jsx
│   ├── context/
│   │   ├── DataContext.jsx    # Enhanced with news management
│   │   ├── AuthContext.jsx
│   │   └── ConfigContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageNews.jsx         # New news management page
│   │   │   ├── ManagePromises.jsx
│   │   │   ├── ManageCategories.jsx
│   │   │   └── ManageUsers.jsx
│   │   ├── BalenTracker.jsx
│   │   ├── Login.jsx
│   │   └── PromiseOverview.jsx
│   └── App.jsx                # Main router
├── server/
│   ├── index.js
│   ├── routes/
│   ├── middleware/
│   └── db/
├── public/
├── PROMISE_DATA_MIGRATION.sql  # Database setup
├── SECURITY_IMPLEMENTATION.md   # Security guide
└── .env                         # Environment variables

```

---

## 🔐 Security Features

### 1. **API Key Protection**
- All keys stored in environment variables
- Backend-only sensitive keys
- Frontend uses public ANON keys with database RLS policies

### 2. **Input Sanitization**
- Automatic XSS prevention
- HTML entity encoding
- Special character escaping

```javascript
import { sanitizeInput } from './api/securityUtils';
const clean = sanitizeInput(userInput);
```

### 3. **Rate Limiting**
- 30 requests/minute (default)
- 5 auth requests/5 minutes
- 10 uploads/minute

### 4. **API Versioning**
- V1 and V2 endpoints
- Easy migration path
- Backwards compatibility

### 5. **Secure File Upload**
- File type validation
- Size limits (3MB images, 5MB documents)
- Filename sanitization
- Automatic thumbnail generation

---

## 📊 Database Schema

### Core Tables:
- `categories` - Promise categories
- `promises` - Individual promises
- `news_updates` - News/progress updates
- `users` - User management
- `auth` - Authentication (Supabase)

### Key Relationships:
```
categories (1) ──→ (N) promises
categories (1) ──→ (N) news_updates
promises (1)   ──→ (N) news_updates
```

### Setting Up Database:
```bash
# Run SQL migration in Supabase
1. Go to SQL Editor in Supabase console
2. Copy entire content of PROMISE_DATA_MIGRATION.sql
3. Run the SQL script
```

---

## 🎯 Features & Usage

### A. Promise Management

#### Create Promise:
```javascript
const { addPromise } = useData();

await addPromise({
  categoryId: 1,
  title: 'Promise Title',
  description: 'Promise Description',
  status: 'Planning', // Planning, In Progress, Completed
  progress: 0,        // 0-100
  targetDate: '2082-12-21',
  responsibleMinistry: 'Ministry Name'
});
```

#### Update Promise:
```javascript
await updatePromise(promiseId, {
  progress: 50,
  status: 'In Progress'
});
```

### B. News Management

#### Create News:
```javascript
const { addNewsUpdate } = useData();

await addNewsUpdate({
  title: 'News Title',
  description: 'News Description',
  image_url: 'https://...',
  source_url: 'https://source.com',
  source_name: 'Source Name',
  category_id: 1,
  news_type: 'progress',     // update, news, progress
  is_published: true
});
```

#### Fetch By Category:
```javascript
const { getNewsByCategory } = useData();
const categoryNews = getNewsByCategory(categoryId);
```

### C. File Upload

#### Upload Image:
```javascript
import { validateFile, createSecureFormData } from './api/secureUpload';

const validation = validateFile(file, 'image');
if (!validation.valid) {
  console.error(validation.error);
  return;
}

const { formData } = createSecureFormData(file, 'image', {
  title: 'Image Title'
});

const imageUrl = await uploadImage(file);
```

#### Validate Dimensions:
```javascript
const dims = await validateImageDimensions(file, {
  maxWidth: 2000,
  maxHeight: 2000
});
```

---

## 🛣️ Routing Guide

### Public Routes:
- `/` - Homepage (PromiseOverview)
- `/balen-tracker` - Main tracker dashboard
- `/tracker` - Promise tracker with filters
- `/category/:id` - Category detail view
- `/login` - User login

### Admin Routes (Protected):
- `/admin` - Dashboard
- `/admin/categories` - Manage categories
- `/admin/promises` - Manage promises
- `/admin/news` - Manage news/updates  ⭐ NEW
- `/admin/users` - Manage users
- `/admin/content` - Content management

---

## 🧪 Testing & Debugging

### Test Rate Limiting:
```javascript
// src/App.jsx
import { secureAPI } from './api/secureAPI';

// Make many requests rapidly
for (let i = 0; i < 35; i++) {
  try {
    await secureAPI.v1.get('/promises');
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.log('Rate limit triggered!');
    }
  }
}
```

### Test Sanitization:
```javascript
import { sanitizeInput } from './api/securityUtils';

const malicious = '<script>alert("XSS")</script>';
const clean = sanitizeInput(malicious);
// Output: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
console.log(clean);
```

### Test File Upload:
```javascript
import { validateFile } from './api/secureUpload';

// Test file size limit
const largeFile = new File(['x'.repeat(10000000)], 'large.jpg', { type: 'image/jpeg' });
const result = validateFile(largeFile, 'image');
// Result: { valid: false, error: "File size exceeds 3MB limit" }
```

---

## 📱 Components Reference

### RecentUpdates Component
```jsx
<RecentUpdates 
  limit={4}           // Number of updates to show
  categoryId={null}   // Filter by category (optional)
/>
```

### CategoryGrid Component
```jsx
<CategoryGrid 
  categories={categories}
  promises={promises}
/>
```

### StatsBar Component
```jsx
<StatsBar 
  stats={{
    total: 100,
    completed: 35,
    implementation: 42,
    planning: 23,
    percentage: 35
  }}
/>
```

---

## 🚨 Troubleshooting

### Issue: API keys exposed in browser
**Solution**: Check that sensitive keys are NOT in `.env` file. Use `.env.local` for secrets.

### Issue: Rate limit errors when testing
**Solution**: Either wait for the rate limit window to pass or modify limits in `src/api/secureAPI.js`

### Issue: File upload fails
**Solution**: Check file size and type. Log the validation error for details.

### Issue: News updates not showing
**Solution**: Ensure `is_published: true` when creating updates.

### Issue: Sanitization breaking content
**Solution**: Use plaintext for storage, sanitization only for display.

---

## 📚 Additional Documentation

- [Security Implementation](./SECURITY_IMPLEMENTATION.md) - Detailed security setup
- [Database Migration](./PROMISE_DATA_MIGRATION.sql) - SQL schema and data
- [Component Guide](./CODE_REFERENCE.md) - Component documentation
- [API Reference](./ADMIN_ONLY_QUICK_REFERENCE.md) - API endpoints

---

## 🔄 Data Flow Diagram

```
User Browser
    ↓
React Component
    ↓
useData() Hook (DataContext)
    ↓
secureAPI (with rate limiting)
    ↓
Supabase
    ↓
Database (with RLS policies)
    ↓
Result
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review security implementation docs
3. Check Supabase logs
4. Review browser console for errors

---

## 📝 License

This project is licensed under the MIT License.

---

## ✅ Implementation Checklist

- [x] Core promise tracking functionality
- [x] Admin dashboard
- [x] News/updates management system
- [x] Security features (rate limiting, sanitization, versioning)
- [x] File upload with validation
- [x] Responsive design
- [x] Database setup
- [x] Documentation
- [ ] Unit tests (TODO)
- [ ] E2E tests (TODO)
- [ ] Performance optimization (TODO)
- [ ] Analytics integration (TODO)

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [OWASP Security](https://owasp.org)

---

**Last Updated**: March 31, 2026
**Version**: 1.0.0
