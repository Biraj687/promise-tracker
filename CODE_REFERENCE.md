# Complete Code Reference - Government Promise Tracker

## Quick Start Code Examples

### 1. Basic Import & Usage in App.jsx

```javascript
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen">
      <Dashboard />
    </div>
  );
}

export default App;
```

---

## Component API Documentation

### PromiseCard Component

**File:** `src/components/PromiseCard.jsx`

```javascript
import PromiseCard from '../components/PromiseCard';

// Usage
<PromiseCard 
  promise={promiseObject}
  isAdmin={false}
  onStatusChange={(id, status) => console.log(id, status)}
/>

// Promise Object Structure
{
  id: 1,
  point_no: 1,
  category: "Administrative Reform",
  description: "Establish transparent merit-based civil service...",
  deadline_days: 180,
  status: "In Progress",
  ministry_responsible: "Ministry of General Administration",
  source_page: 1,
  progress: 65
}
```

**Features:**
- Responsive card layout
- Status dropdown in admin mode
- Progress bar with color coding
- Glassmorphism design
- Dark/Light mode support

**Exports:**
```javascript
export default PromiseCard;
```

---

### PromiseGrid Component

**File:** `src/components/PromiseGrid.jsx`

```javascript
import PromiseGrid from '../components/PromiseGrid';

// Usage
<PromiseGrid 
  promises={promisesArray}
  isAdmin={isAdminMode}
  onStatusChange={handleStatusChange}
/>

// Event Handler
const handleStatusChange = (promiseId, newStatus) => {
  console.log(`Promise ${promiseId} -> ${newStatus}`);
  // Update state or API call
};
```

**Props:**
```javascript
{
  promises: Array<Promise>,     // Array of 100 promises
  isAdmin: Boolean,              // Show admin controls
  onStatusChange: Function       // Callback on status change
}
```

**Internal State:**
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedStatuses, setSelectedStatuses] = useState([]);
const [viewMode, setViewMode] = useState('grid');
const [sortBy, setSortBy] = useState('point_no');
const [showFilter, setShowFilter] = useState(false);
```

**Exports:**
```javascript
export default PromiseGrid;
```

---

### Dashboard Component (Main Page)

**File:** `src/pages/Dashboard.jsx`

```javascript
import Dashboard from './pages/Dashboard';

// Usage - typically as a route
<Route path="/dashboard" element={<Dashboard />} />

// Or standalone
<Dashboard />
```

**Features:**
- Dark/Light mode with localStorage persistence
- Admin authentication with modal
- Password protected admin access
- Integrates PromiseGrid
- Complete layout with header and footer

**Internal State:**
```javascript
const [darkMode, setDarkMode] = useState(
  localStorage.getItem('darkMode') === 'true'
);
const [isAdmin, setIsAdmin] = useState(
  localStorage.getItem('isAdmin') === 'true'
);
const [promises, setPromises] = useState(promisesData);
const [adminPassword, setAdminPassword] = useState('');
const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
```

**Admin Password:** `admin2024` (demo)

**Exports:**
```javascript
export default Dashboard;
```

---

## Data Structure Reference

### promises.json - Complete Sample Entry

```json
{
  "id": 1,
  "point_no": 1,
  "category": "Administrative Reform",
  "description": "Establish a transparent merit-based civil service recruitment system",
  "deadline_days": 180,
  "status": "In Progress",
  "ministry_responsible": "Ministry of General Administration",
  "source_page": 1,
  "progress": 65
}
```

### promises.json - Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | number | Unique identifier | 1-100 |
| point_no | number | Government commitment point | 1-100 |
| category | string | Promise category | "Administrative Reform" |
| description | string | Full description | "Establish a transparent..." |
| deadline_days | number | Days until deadline | 30-1825 |
| status | string | Current status | "In Progress" |
| ministry_responsible | string | Lead ministry | "Ministry of..." |
| source_page | number | Reference page | 1-12 |
| progress | number | Completion percentage | 0-100 |

### All 13 Categories

```javascript
const categories = [
  "Administrative Reform",
  "Digital Governance",
  "Health",
  "Education",
  "Anti-Corruption",
  "Public Services",
  "Infrastructure",
  "Agriculture",
  "Employment",
  "Tourism",
  "Energy",
  "Environment",
  "Social Security"
];
```

### Status Values

```javascript
const statuses = [
  "Pending",         // Not started
  "In Progress",     // Currently being implemented
  "Completed",       // Fully completed
  "Overdue"         // Past deadline but not completed
];
```

---

## Import Examples

### In Dashboard.jsx
```javascript
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Shield, X } from 'lucide-react';
import PromiseGrid from '../components/PromiseGrid';
import promisesData from '../data/promises.json';
```

### In PromiseGrid.jsx
```javascript
import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Grid3x3, List } from 'lucide-react';
import PromiseCard from './PromiseCard';
```

### In PromiseCard.jsx
```javascript
import React, { useState } from 'react';
import { ChevronDown, Calendar, Building2, FileText } from 'lucide-react';
```

---

## Styling Patterns

### Dark Mode Implementation
```javascript
// In component
const [darkMode, setDarkMode] = useState(false);

// Apply class to root
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

// In JSX - use dark: prefix
<div className="bg-white dark:bg-slate-800">
  Content
</div>
```

### Status Color Mapping
```javascript
const statusColors = {
  'Completed': 'bg-green-100 text-green-800 border-green-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'Pending': 'bg-amber-100 text-amber-800 border-amber-300',
  'Overdue': 'bg-red-100 text-red-800 border-red-300',
};

const statusBgDark = {
  'Completed': 'dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  'In Progress': 'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
  'Pending': 'dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700',
  'Overdue': 'dark:bg-red-900 dark:text-red-200 dark:border-red-700',
};

// Usage
<div className={`${statusColors[status]} ${statusBgDark[status]} px-3 py-1`}>
  {status}
</div>
```

### Responsive Grid
```javascript
// Mobile first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  {items.map(item => (
    <Component key={item.id} {...item} />
  ))}
</div>
```

---

## Event Handlers

### Search Handler
```javascript
const [searchTerm, setSearchTerm] = useState('');

const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};

// Usage in JSX
<input
  type="text"
  value={searchTerm}
  onChange={handleSearch}
  placeholder="Search..."
/>
```

### Filter Handler
```javascript
const [selectedCategories, setSelectedCategories] = useState([]);

const handleCategoryToggle = (category) => {
  setSelectedCategories(prev =>
    prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category]
  );
};

// Usage
<input
  type="checkbox"
  checked={selectedCategories.includes(category)}
  onChange={() => handleCategoryToggle(category)}
/>
```

### Admin Login Handler
```javascript
const handleAdminLogin = (e) => {
  e.preventDefault();
  if (adminPassword === 'admin2024') {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
    setIsAdminModalOpen(false);
  } else {
    setAdminAttempt('Invalid password');
    setTimeout(() => setAdminAttempt(''), 3000);
  }
};
```

### Status Change Handler
```javascript
const handleStatusChange = (promiseId, newStatus) => {
  setPromises(prevPromises =>
    prevPromises.map(p =>
      p.id === promiseId ? { ...p, status: newStatus } : p
    )
  );
  console.log(`Promise ${promiseId} changed to ${newStatus}`);
};
```

---

## Hook Usage

### useMemo for Filtering
```javascript
const filteredPromises = useMemo(() => {
  return promises.filter(promise => {
    const matchesSearch = promise.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(promise.category);
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(promise.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
}, [promises, searchTerm, selectedCategories, selectedStatuses]);
```

### useCallback for Event Handlers
```javascript
const toggleCategory = useCallback((category) => {
  setSelectedCategories(prev =>
    prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category]
  );
}, []);
```

### useEffect for Dark Mode
```javascript
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', darkMode);
}, [darkMode]);
```

---

## API Integration Points (Future)

### Update Promise Status
```javascript
const handleStatusChange = async (promiseId, newStatus) => {
  try {
    const response = await fetch(`/api/promises/${promiseId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      setPromises(prev =>
        prev.map(p =>
          p.id === promiseId ? { ...p, status: newStatus } : p
        )
      );
    }
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};
```

### Fetch All Promises
```javascript
useEffect(() => {
  const fetchPromises = async () => {
    try {
      const response = await fetch('/api/promises');
      const data = await response.json();
      setPromises(data);
    } catch (error) {
      console.error('Failed to fetch promises:', error);
    }
  };
  
  fetchPromises();
}, []);
```

### Admin Authentication
```javascript
const handleAdminLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('adminToken', token);
      setIsAdmin(true);
    } else {
      setAdminAttempt('Invalid credentials');
    }
  } catch (error) {
    console.error('Auth failed:', error);
  }
};
```

---

## Performance Tips

### 1. Memoize Heavy Computations
```javascript
const stats = useMemo(() => ({
  total: promises.length,
  completed: promises.filter(p => p.status === 'Completed').length,
  inProgress: promises.filter(p => p.status === 'In Progress').length,
  pending: promises.filter(p => p.status === 'Pending').length,
  percentage: Math.round(
    (promises.filter(p => p.status === 'Completed').length / 
     promises.length) * 100
  )
}), [promises]);
```

### 2. Optimize List Rendering
```javascript
{promises.map(promise => (
  <PromiseCard 
    key={promise.id}  // Always use stable key
    promise={promise}
    // ... other props
  />
))}
```

### 3. Debounce Search
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debouncedSearch instead of searchTerm in filters
```

---

## Accessibility Features

```javascript
// Use ARIA labels
<button
  aria-label="Toggle dark mode"
  title="Dark Mode"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
</button>

// Use semantic HTML
<header role="banner">...</header>
<main role="main">...</main>
<footer role="contentinfo">...</footer>

// Use proper form labels
<label htmlFor="search">Search promises</label>
<input id="search" type="text" />
```

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Bundle Size Analysis

After build:
- HTML: 0.98 kB (gzip: 0.49 kB)
- CSS: 79.51 kB (gzip: 11.90 kB)
- JS: 469.94 kB (gzip: 138.66 kB)
- **Total:** ~590 kB (gzip: ~151 kB)

---

## Troubleshooting

### Components Not Displaying
```javascript
// Check imports
import PromiseCard from '../components/PromiseCard';

// Verify data
console.log(promisesData);

// Check dark mode class
console.log(document.documentElement.classList);
```

### Filters Not Working
```javascript
// Debug search
console.log('Search term:', searchTerm);
console.log('Selected categories:', selectedCategories);
console.log('Filtered count:', filteredPromises.length);

// Check array methods
const test = [1,2,3].filter(x => x > 1); // [2,3]
```

### Admin Mode Issues
```javascript
// Check localStorage
console.log(localStorage.getItem('isAdmin'));

// Check password
console.log('Entered:', adminPassword);
console.log('Expected:', 'admin2024');
console.log('Match:', adminPassword === 'admin2024');
```

---

## Version Information

- **React:** 19.2.4
- **Tailwind CSS:** 4.2.2
- **Lucide React:** 1.7.0
- **Vite:** 8.0.1
- **Node:** 18+
- **npm:** 10+

---

**Last Updated:** March 30, 2026  
**Status:** Production Ready  
**License:** MIT
