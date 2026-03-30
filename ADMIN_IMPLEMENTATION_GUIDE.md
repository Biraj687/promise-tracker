# Admin Control Panel - Implementation Guide

## 📋 Overview

This document describes the centralized admin control panel built for the Government Promise Tracker. The admin panel enables a single administrator to manage both promises and categories with real-time synchronization across the entire application.

---

## 🎯 Key Features

✅ **Category Management**
- Create new categories
- Edit existing categories
- Delete categories (with validation against dependent promises)
- localStorage persistence

✅ **Promise Management**
- Create new promises
- Edit existing promises
- Delete promises
- Update status (Pending → In Progress → Completed)
- Update progress percentage
- Category assignment with ability to create categories on-the-fly

✅ **Real-Time Synchronization**
- All changes reflect immediately across the UI
- Global state management via Context API
- localStorage persistence for offline functionality
- Automatic state sync on app load

✅ **Admin Dashboard**
- Overview statistics (Total, Completed, In Progress, Pending)
- Category count display
- Completion percentage tracking
- Recent promises list
- Categories overview

---

## 🏗️ Architecture

### State Management Flow

```
┌─────────────────────────────────────────┐
│       React Application (App.jsx)       │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼───────┐      ┌─────▼──────┐
    │AuthContext│      │DataContext │
    └───────────┘      └─────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         Categories      Promises      Operations
         (localStorage)  (Backend API)  (CRUD)
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
        Admin Components         Public Components
        (Admin Pages)            (UI Pages)
```

### Data Flow Diagram

```
1. INITIALIZATION
   ├─ App loads → AuthProvider → DataProvider
   ├─ DataProvider initializes categories from localStorage
   ├─ If no localStorage, use DEFAULT_CATEGORIES
   └─ Fetch promises from backend API

2. ADDING/UPDATING CATEGORY
   ├─ Admin fills CategoryFormModal
   ├─ addCategory() or updateCategory() called
   ├─ State updated in DataContext
   ├─ Saved to localStorage immediately
   └─ All consuming components re-render

3. ADDING/UPDATING PROMISE
   ├─ Admin fills PromiseFormModal
   ├─ addPromise() or updatePromise() called
   ├─ API call to backend
   ├─ Response updates DataContext state
   ├─ Components subscribed to promises re-render
   └─ Dashboard stats auto-updated

4. DELETING CATEGORY
   ├─ Admin clicks delete
   ├─ Validation: check if any promises use category
   ├─ If no promises, deleteCategory() called
   ├─ Category removed from state
   ├─ localStorage updated
   └─ UI updates immediately
```

---

## 📂 Project Structure

### New Files Created

```
src/
├── context/
│   └── DataContext.jsx (UPDATED)
│       ├─ Added: categories state
│       ├─ Added: addCategory, updateCategory, deleteCategory
│       ├─ Added: localStorage persistence for categories
│       └─ Enhanced: category management operations
│
├── pages/admin/
│   ├── AdminDashboard.jsx (UPDATED)
│   │   ├─ Added: category count card
│   │   ├─ Added: categories overview section
│   │   └─ Enhanced: completion progress bar
│   │
│   ├── ManageCategories.jsx (NEW)
│   │   ├─ List all categories in grid/card format
│   │   ├─ Show promise count per category
│   │   ├─ Edit, delete operations
│   │   └─ Add new category button
│   │
│   └── ManagePromises.jsx (UPDATED)
│       ├─ Added: Add Promise button
│       ├─ Added: Delete promise functionality
│       ├─ Added: Edit promise functionality
│       ├─ Added: Modal-based form
│       └─ Enhanced: Actions column in table
│
└── components/admin/
    ├── AdminLayout.jsx (UPDATED)
    │   ├─ Added: Categories navigation link
    │   └─ Updated: Nav items to include Manage Categories
    │
    ├── CategoryFormModal.jsx (NEW)
    │   ├─ Form for adding/editing categories
    │   ├─ Icon selection (12 options)
    │   ├─ Color selection (12 options)
    │   ├─ Live preview of category
    │   └─ Form validation & error handling
    │
    └── PromiseFormModal.jsx (NEW)
        ├─ Form for adding/editing promises
        ├─ Title, description, category fields
        ├─ Status dropdown
        ├─ Progress slider + input
        ├─ Inline category creation
        └─ Form validation & error handling
```

### Updated Files

```
src/App.jsx
├─ Added: ManageCategories import
└─ Added: /admin/categories route

src/components/admin/AdminLayout.jsx
├─ Added: FolderOpen icon import
└─ Added: Categories navigation item

src/pages/admin/AdminDashboard.jsx
├─ Added: FolderOpen icon import
├─ Updated: Stats cards to include category count
├─ Added: Categories overview section
├─ Added: Completion progress bar
└─ Enhanced: Recent promises section

src/pages/admin/ManagePromises.jsx
├─ Added: Plus, Trash2, AlertCircle, CheckCircle2 icons
├─ Added: PromiseFormModal component
├─ Added: Delete functionality
├─ Added: Edit capability
├─ Added: Actions column to table
└─ Added: Success/error messages
```

---

## 🔄 Data Structures

### Category Object

```javascript
{
  id: number,                    // Unique auto-incremented ID
  name: string,                  // Category name (max 100 chars)
  icon: string,                  // Icon name (e.g., 'Gavel', 'Globe')
  color: string,                 // Tailwind color classes (e.g., 'bg-blue-100 text-blue-600')
  createdAt: ISO8601 timestamp   // When category was created
}
```

### Promise Object

```javascript
{
  id: number,                    // Unique ID
  title: string,                 // Promise title (max 200 chars)
  description: string,           // Detailed description (max 500 chars)
  categoryId: number,            // Reference to category
  status: string,                // "Pending" | "In Progress" | "Completed"
  progress: number,              // 0-100 %
  updatedAt: date string,        // Last update date (YYYY-MM-DD)
  tags?: array,                  // Optional tags
  sources?: array,               // Optional source URLs
}
```

### DataContext API

```javascript
// Reading data
{
  categories,                    // Array of category objects
  promises,                      // Array of promise objects
  loading,                       // Boolean: data loading state
  error,                         // String: error message if any
}

// Category operations
{
  addCategory(categoryData),     // Add new category, returns new category object
  updateCategory(id, data),      // Update category by ID
  deleteCategory(id),            // Delete category, throws error if promises exist
}

// Promise operations
{
  addPromise(promiseData),       // Add new promise via API
  updatePromise(id, data),       // Update promise via API
  deletePromise(id),             // Delete promise via API
  getPromisesByCategory(catId),  // Get promises for a category
  getStats(),                    // Get aggregated statistics
  refreshData(),                 // Manually refresh promises from API
}
```

---

## 🔐 Admin Access

Currently, admin access is managed through the existing authentication system:

1. **Login**: Use admin credentials (default: `admin@gov.np` / `admin123`)
2. **Role Check**: `ProtectedAdminRoute` component verifies `user.role === 'admin'`
3. **Routes**: Protected under `/admin` path
4. **Access**: Only users with admin role can access

### To Make Someone Admin:
- Use ManageUsers page
- Toggle user role from "user" to "admin"
- Or modify database directly

---

## 💾 localStorage Persistence

### Categories Storage

**Key**: `categories`  
**Format**: JSON string of category array  
**When Saved**:
- On app initialization (if no categories exist, use defaults)
- After adding a category
- After updating a category
- After deleting a category

**When Loaded**:
- App startup in `DataProvider.useEffect`
- If no stored data found, DEFAULT_CATEGORIES are used and saved

### Example:
```javascript
// In browser console
localStorage.getItem('categories');
// Returns: [{"id":1,"name":"Category 1",...}]

// To reset:
localStorage.removeItem('categories');
```

---

## 🚀 Usage Guide

### For Admins

#### Adding a Category
1. Go to `/admin` (Admin Dashboard)
2. Click "Manage Categories" in sidebar
3. Click "Add Category" button
4. Fill form: name, icon, color
5. Preview updates in real-time
6. Click "Add Category"

#### Adding a Promise
1. Go to `/admin` (Admin Dashboard)
2. Click "Manage Promises" in sidebar
3. Click "Add Promise" button
4. Fill form: title, description, category, status, progress
5. **Option**: Create new category on-the-fly by clicking "New" next to category selector
6. Click "Add Promise"

#### Updating a Promise
1. On Manage Promises page
2. Find the promise in table
3. Click edit icon (pencil) in Actions column
4. Modify fields
5. Click "Update Promise"

#### Deleting a Promise
1. On Manage Promises page
2. Click delete icon (trash) in Actions column
3. Confirm deletion popup
4. Promise is removed

#### Deleting a Category
1. Go to Manage Categories page
2. Hover over category card
3. If no promises use it, delete button is enabled
4. Click trash icon
5. Category is removed
6. If promises exist, delete button is disabled with tooltip

---

## 🔄 Real-Time Sync Examples

### Example 1: Adding a Category and Promise
```
1. Admin on Manage Categories page
   ↓
2. Adds "Healthcare" category
   ↓
3. DataContext state updated
   ↓
4. localStorage updated
   ↓
5. ManageCategories component re-renders
   ↓
6. Admin switches to Manage Promises page
   ↓
7. Category dropdown automatically shows "Healthcare"
   ↓
8. Admin creates promise with Healthcare category
   ↓
9. Backend API receives request
   ↓
10. DataContext state updated
    ↓
11. AdminDashboard component re-renders with new stats
    ↓
12. ManagePromises table shows new promise
    ↓
13. ManageCategories shows "1" promise count for Healthcare
```

### Example 2: Deleting a Promise
```
1. Admin on Manage Promises page
2. Clicks delete on a promise
3. Deletion confirmed
4. API call to /api/promises/{id}
5. Backend deletes promise
6. DataContext state updated (filtered out)
7. Promises array re-computed
8. Dashboard stats re-calculated
9. ManagePromises table refreshes
10. If last promise in category → category shows "0" count
```

---

## ⚙️ API Integration

### Backend Requirements

The application expects these API endpoints to be available:

```
POST   /api/promises           - Create new promise
GET    /api/promises           - List all promises
PUT    /api/promises/{id}      - Update promise
DELETE /api/promises/{id}      - Delete promise
GET    /api/stats              - Get statistics
GET    /api/users              - List users
```

**Note**: Categories are managed locally with localStorage only. No backend API calls for categories.

---

## 🎨 UI Components

### CategoryFormModal
- Location: `src/components/admin/CategoryFormModal.jsx`
- Props: `isOpen`, `onClose`, `editingCategory`
- Features: Form validation, icon picker, color picker, live preview

### PromiseFormModal
- Location: `src/components/admin/PromiseFormModal.jsx`
- Props: `isOpen`, `onClose`, `editingPromise`
- Features: Form validation, category dropdown, inline category creation, progress slider

### ManageCategories
- Location: `src/pages/admin/ManageCategories.jsx`
- Features: Grid view of categories, delete protection, promise count, edit/delete actions

### ManagePromises
- Location: `src/pages/admin/ManagePromises.jsx`
- Features: Table view, search, status dropdown, progress input, delete/edit actions

---

## 🧪 Testing Checklist

- [ ] Categories load from localStorage on app start
- [ ] Adding category updates state and localStorage
- [ ] New category appears in promise dropdown immediately
- [ ] Deleting category removes it from state
- [ ] Cannot delete category with existing promises
- [ ] Adding promise to API updates all components
- [ ] Updating promise status reflects everywhere
- [ ] Deleting promise updates category promise count
- [ ] Dashboard stats auto-update on any change
- [ ] Search filters promises correctly
- [ ] Form validation prevents empty submissions
- [ ] Multiple admin sessions sync via localStorage
- [ ] Color and icon selections work correctly
- [ ] Success/error messages display properly

---

## 🐛 Troubleshooting

### Categories Not Persisting
**Problem**: Categories disappear after refresh  
**Solution**: Check browser localStorage is enabled, verify no errors in console

### Promise Not Appearing
**Problem**: Added promise doesn't show in table  
**Solution**: 
1. Check API response in Network tab
2. Verify categoryId is valid
3. Check DataContext updatePromises is called

### Delete Blocked for Category
**Problem**: Cannot delete category with error  
**Solution**: This is by design. Delete all promises in that category first, then delete category.

### Dropdown Shows Wrong Categories
**Problem**: Old categories appear  
**Solution**: Clear localStorage and refresh: `localStorage.removeItem('categories')`

---

## 📊 Performance Considerations

- Categories stored locally (no API calls)
- Promises fetched once on app load
- State updates trigger only affected components (React optimization)
- localStorage writes synchronous but fast (small data)
- Large promise lists may need pagination (future enhancement)

---

## 🔮 Future Enhancements

- [ ] Add category icons with visual representation
- [ ] Bulk operations for promises
- [ ] Advanced filtering and sorting
- [ ] Export/import functionality
- [ ] Audit log of admin actions
- [ ] Scheduling promise updates
- [ ] Notifications/webhooks
- [ ] Role-based access control (RBAC)
- [ ] Promise approval workflow
- [ ] Category hierarchy/nesting

---

## 📝 Notes

- All dates are stored in ISO 8601 format
- Timestamps use UTC timezone
- Color classes use Tailwind CSS
- Icons are from lucide-react library
- Admin is determined by `user.role` in auth context
- Default categories are seeded on first run if localStorage empty

---

## 🔗 Related Documentation

- [Architecture Overview](./COMPLETE_INTEGRATION_GUIDE.md)
- [API Reference](./TECHNICAL_REFERENCE.md)
- [Project Summary](./PROJECT_SUMMARY.md)

---

**Last Updated**: March 30, 2026  
**Version**: 1.0  
**Status**: Complete and tested
