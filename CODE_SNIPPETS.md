# Code Snippets & Implementation Examples

## Quick Integration Examples

### Snippet 1: How to Call updatePromise()

```javascript
// When admin saves changes in AdminPanel.jsx
const handleSave = () => {
  onUpdatePromise(promise.id, {
    status: localStatus,
    progress: localProgress,
    notes: localNotes
  });
};

// This triggers in App_v2.jsx:
// 1. Creates new update history entry
// 2. Logs JSON to console
// 3. Updates promises state
// 4. Triggers re-render
```

### Snippet 2: Accessing Current Stats

```javascript
// In App_v2.jsx
const stats = calculateStats();

// Returns:
{
  total: 100,           // All promises
  completed: 34,        // Status === 'Completed'
  inProgress: 48,       // Status === 'In Progress'
  pending: 16,          // Status === 'Pending'
  delayed: 2,           // Status === 'Delayed'
  averageProgress: 56   // Average of all progress %
}

// Use in components:
<div>Completed: {stats.completed}/{stats.total}</div>
```

### Snippet 3: Search Implementation

**AdminPanel.jsx & PublicGrid.jsx use identical search:**

```javascript
// Searches across three fields
const filtered = promises.filter(p =>
  p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  p.point_no.toString().includes(searchTerm) ||
  p.ministry_responsible.toLowerCase().includes(searchTerm.toLowerCase())
);

// Examples:
// searchTerm: "health" → matches descriptions containing "health"
// searchTerm: "5" → matches point_no 5, 25, 50, etc.
// searchTerm: "ministry of" → matches ministry responsible field
```

### Snippet 4: Category Grouping

```javascript
// Extract unique categories (both views)
const categories = [...new Set(promises.map(p => p.category))].sort();

// Expected 13 categories from 100 promises:
[
  'Administrative Reform',
  'Agriculture',
  'Anti-Corruption',
  'Digital Governance',
  'Education',
  'Employment',
  'Energy',
  'Environment',
  'Health',
  'Infrastructure',
  'Public Services',
  'Social Security',
  'Tourism'
]

// Filter by category:
const filtered = promises.filter(p => p.category === selectedCategory);
```

### Snippet 5: Status Color Mapping

Both views use this pattern:

```javascript
const getStatusColor = (status) => {
  const colors = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'Delayed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return colors[status] || colors['Pending'];
};

// Usage:
<span className={`px-2 py-1 rounded text-xs ${getStatusColor('Completed')}`}>
  Completed
</span>
```

### Snippet 6: Progress Bar Colors

```javascript
const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';  // 80-100%: Green
  if (progress >= 50) return 'bg-blue-500';   // 50-79%: Blue
  if (progress >= 20) return 'bg-amber-500';  // 20-49%: Amber
  return 'bg-red-500';                        // 0-19%: Red
};

// Usage in progress bar:
<div className={`h-full ${getProgressColor(progress)} transition-all`}
     style={{ width: `${progress}%` }} />
```

### Snippet 7: Sorting Promises

```javascript
// AdminPanel.jsx & PublicGrid.jsx filtering logic

const sortPromises = (promises, sortBy) => {
  const sorted = [...promises];
  
  switch (sortBy) {
    case 'point_no':
      return sorted.sort((a, b) => a.point_no - b.point_no);
    
    case 'progress':
      return sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    
    case 'deadline':
      return sorted.sort((a, b) => (a.deadline_days || 0) - (b.deadline_days || 0));
    
    case 'status':
      const statusOrder = { 
        'Completed': 0, 
        'In Progress': 1, 
        'Pending': 2, 
        'Delayed': 3 
      };
      return sorted.sort((a, b) => 
        (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4)
      );
    
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    
    default:
      return sorted;
  }
};
```

### Snippet 8: Dark Mode Toggle

```javascript
// In App_v2.jsx header
<button
  onClick={() => setDarkMode(!darkMode)}
  className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 
             text-slate-600 dark:text-slate-300 
             hover:bg-slate-200 dark:hover:bg-slate-600 
             transition-colors"
>
  {darkMode ? '☀️' : '🌙'}
</button>

// Dark mode is persisted and applied to root div:
<div className={darkMode ? 'dark' : ''}>
  {/* All content inherits dark: classes */}
</div>

// In components, use Tailwind dark mode:
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
  Text that changes with dark mode
</div>
```

### Snippet 9: localStorage Usage

```javascript
// Persist dark mode preference
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem('darkMode') === 'true';
  setDarkMode(saved);
}, []);

useEffect(() => {
  localStorage.setItem('darkMode', darkMode);
}, [darkMode]);

// Persist admin authentication
useEffect(() => {
  const saved = localStorage.getItem('adminAuth') === 'true';
  setAdminAuthenticated(saved);
}, []);

useEffect(() => {
  localStorage.setItem('adminAuth', adminAuthenticated);
}, [adminAuthenticated]);

// To clear all:
// localStorage.clear();
```

### Snippet 10: Export Data as JSON

```javascript
// In AdminPanel.jsx Export button onClick handler
const handleExport = () => {
  // Convert promises to JSON string with formatting
  const dataStr = JSON.stringify(promises, null, 2);
  
  // Create data URI
  const dataUri = 'data:application/json;charset=utf-8,'
                  + encodeURIComponent(dataStr);
  
  // Create download link
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', 'promises-export.json');
  linkElement.click();
};

// Exported file includes full update_history for each promise
```

### Snippet 11: Update History Entry Creation

```javascript
// When promise is updated in App_v2.jsx updatePromise()
const newHistoryEntry = {
  timestamp: new Date().toISOString(),     // e.g., "2026-03-30T10:45:00Z"
  status: updates.status,                   // e.g., "Completed"
  progress: updates.progress,               // e.g., 100
  changedBy: 'Admin User',                  // User who made change
  notes: updates.notes                      // Optional notes
};

// Prepend to existing history
const updatedHistory = [newHistoryEntry, ...promise.update_history];

// Keep last 50 updates (optional optimization)
const limitedHistory = updatedHistory.slice(0, 50);
```

### Snippet 12: Multi-Select Filtering with Sets

```javascript
// In PublicGrid.jsx and AdminPanel.jsx
const [selectedCategories, setSelectedCategories] = useState(new Set());

// Toggle category
const toggleCategory = (category) => {
  const newSet = new Set(selectedCategories);
  if (newSet.has(category)) {
    newSet.delete(category);
  } else {
    newSet.add(category);
  }
  setSelectedCategories(newSet);
};

// Filter using Set
const filtered = selectedCategories.size > 0
  ? promises.filter(p => selectedCategories.has(p.category))
  : promises;

// Clear filters
const clearFilters = () => setSelectedCategories(new Set());
```

---

## API Endpoint Stubs

### Backend Ready States

When transitioning to backend, replace these stubs:

#### Get All Promises
```javascript
// OLD (Current - Local)
const promises = promisesData;

// NEW (Backend)
const [promises, setPromises] = useState([]);
useEffect(() => {
  fetch('/api/promises')
    .then(r => r.json())
    .then(data => setPromises(data))
    .catch(err => console.error(err));
}, []);
```

#### Update Promise Status
```javascript
// OLD (Current - Local)
const updatePromise = (promiseId, updates) => {
  setPromises(prev => 
    prev.map(p => p.id === promiseId ? { ...p, ...updates } : p)
  );
};

// NEW (Backend)
const updatePromise = (promiseId, updates) => {
  fetch(`/api/promises/${promiseId}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  })
  .then(r => r.json())
  .then(updated => {
    setPromises(prev =>
      prev.map(p => p.id === promiseId ? updated : p)
    );
  })
  .catch(err => console.error(err));
};
```

#### Admin Authentication
```javascript
// OLD (Current - Hardcoded)
if (password === 'admin2024') {
  setAdminAuthenticated(true);
}

// NEW (Backend)
const handleAdminLogin = async (password) => {
  const response = await fetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('adminToken', token);
    setAdminAuthenticated(true);
  }
};
```

---

## Component Usage Examples

### Using AdminPanel

```jsx
import AdminPanel from './components/AdminPanel';
import { useState } from 'react';

export default function AdminView() {
  const [promises, setPromises] = useState([...]);
  
  const handleUpdate = (promiseId, updates) => {
    // Handle update logic
    setPromises(prev => 
      prev.map(p => p.id === promiseId ? {...p, ...updates} : p)
    );
  };

  const stats = {
    total: promises.length,
    completed: promises.filter(p => p.status === 'Completed').length,
    inProgress: promises.filter(p => p.status === 'In Progress').length,
    pending: promises.filter(p => p.status === 'Pending').length,
    delayed: promises.filter(p => p.status === 'Delayed').length,
    averageProgress: Math.round(
      promises.reduce((sum, p) => sum + (p.progress || 0), 0) / promises.length
    )
  };

  return (
    <AdminPanel
      promises={promises}
      onUpdatePromise={handleUpdate}
      stats={stats}
      darkMode={false}
    />
  );
}
```

### Using PublicGrid

```jsx
import PublicGrid from './components/PublicGrid';

export default function PublicView() {
  const [promises, setPromises] = useState([...]);
  
  const stats = {
    // Calculate stats same as above
  };

  return (
    <PublicGrid
      promises={promises}
      stats={stats}
      darkMode={false}
    />
  );
}
```

---

## Testing Data Samples

### Sample Promise Object
```json
{
  "id": 5,
  "point_no": 5,
  "category": "Digital Governance",
  "description": "Implement digital ID system for all citizens",
  "deadline_days": 180,
  "status": "In Progress",
  "ministry_responsible": "Ministry of Information Technology",
  "source_page": 2,
  "progress": 65,
  "update_history": [
    {
      "timestamp": "2026-03-30T10:45:00Z",
      "status": "In Progress",
      "progress": 65,
      "changedBy": "Admin User",
      "notes": "Phase 2 implementation underway"
    },
    {
      "timestamp": "2026-03-25T14:20:00Z",
      "status": "In Progress",
      "progress": 40,
      "changedBy": "System",
      "notes": "Phase 1 completed"
    }
  ]
}
```

### Sample Stats Object
```json
{
  "total": 100,
  "completed": 34,
  "inProgress": 48,
  "pending": 16,
  "delayed": 2,
  "averageProgress": 56
}
```

---

## Console Output Reference

When you update a promise in Admin Dashboard, this appears in browser console:

```javascript
// Example: User updates Promise #5
Promise #5 Updated: {
  id: 5,
  point_no: 5,
  category: "Digital Governance",
  description: "Implement digital ID system for all citizens",
  deadline_days: 180,
  status: "Completed",      // ← Changed from "In Progress"
  ministry_responsible: "Ministry of Information Technology",
  source_page: 2,
  progress: 100,            // ← Changed from 65
  update_history: [
    {
      timestamp: "2026-03-30T11:00:00Z",
      status: "Completed",
      progress: 100,
      changedBy: "Admin User",
      notes: "Project fully completed and deployed"
    },
    {
      timestamp: "2026-03-30T10:45:00Z",
      status: "In Progress",
      progress: 65,
      changedBy: "Admin User",
      notes: "Phase 2 implementation underway"
    }
  ]
}
```

Copy this JSON to send to your backend API!

---

## Accessibility Features

```jsx
// Admin Authentication Modal - Screen reader friendly
<div role="dialog" aria-labelledby="admin-title" aria-modal="true">
  <h2 id="admin-title">Admin Access</h2>
  <input 
    type="password"
    aria-label="Admin Password"
    placeholder="Enter password"
  />
</div>

// Expandable Promises - Keyboard navigation
<button
  onClick={onToggleExpand}
  aria-expanded={isExpanded}
  aria-controls={`promise-details-${promiseId}`}
>
  Expand Promise Details
</button>

// Filter Checkboxes - Semantic HTML
<label>
  <input
    type="checkbox"
    checked={isSelected}
    onChange={handleChange}
    aria-describedby="filter-desc"
  />
  <span>Administrative Reform</span>
</label>
```

---

## Performance Tips

### 1. Debounce Search Input (300ms)
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debouncedTerm for filtering instead of searchTerm
```

### 2. Virtualize Long Lists
```javascript
import { FixedSizeList as List } from 'react-window';

<List
  height={600}
  itemCount={filteredPromises.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <PromiseCard promise={filteredPromises[index]} />
    </div>
  )}
</List>
```

### 3. Code Splitting Components
```javascript
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./components/AdminPanel'));
const PublicGrid = lazy(() => import('./components/PublicGrid'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {adminMode ? <AdminPanel {...} /> : <PublicGrid {...} />}
    </Suspense>
  );
}
```

---

**Version:** 2.0  
**Last Updated:** March 30, 2026
