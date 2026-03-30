# Government Accountability Tracker - Dual-View System

## Overview

This is an enhanced **Government Accountability Tracker** with a dual-view system featuring:
- **Public Grid**: Read-only view for citizens/public users
- **Admin Dashboard**: Full edit capabilities with advanced controls
- **State Management**: Real-time synchronization between views
- **Update History**: Track all changes with timestamps
- **Glassmorphism Design**: Modern semi-transparent UI with blur effects

## File Structure

```
src/
├── App_v2.jsx                 # Main app with state management & routing
├── components/
│   ├── AdminPanel.jsx        # Admin dashboard with edit controls
│   └── PublicGrid.jsx        # Public-facing view
└── data/
    └── promises.json         # 100 promises with update_history
```

## Installation & Setup

### 1. Replace Your App Component

Replace your current `App.jsx` with `App_v2.jsx`:

```bash
# Backup existing App.jsx
mv src/App.jsx src/App_backup.jsx

# Copy new version
cp src/App_v2.jsx src/App.jsx
```

Or update `main.jsx` to import from `App_v2.jsx`.

### 2. Create New Components

Copy `AdminPanel.jsx` and `PublicGrid.jsx` to `src/components/`:

```bash
touch src/components/AdminPanel.jsx
touch src/components/PublicGrid.jsx
```

### 3. Update Data Schema

Your existing `promises.json` will be automatically enhanced with `update_history` field:

```json
{
  "id": 1,
  "point_no": 1,
  "category": "Administrative Reform",
  "description": "Promise description...",
  "deadline_days": 365,
  "status": "In Progress",
  "ministry_responsible": "Ministry Name",
  "source_page": 1,
  "progress": 45,
  "update_history": [
    {
      "timestamp": "2026-03-30T10:30:00Z",
      "status": "In Progress",
      "progress": 45,
      "changedBy": "Admin User",
      "notes": "Update notes"
    }
  ]
}
```

## Features

### Public View (PublicGrid.jsx)

**Display Features:**
- Read-only promise cards with status badges
- Real-time progress bars (color-coded: Green/Blue/Amber/Red)
- Search across description, point number, ministry
- Filter by category (11 groups)
- Filter by status (Completed, In Progress, Pending, Delayed)
- Sort by point number, progress, deadline, category
- Grid/List view toggle
- Summary stats: Total, Completed, In Progress, Pending, Delayed, Average Progress

**Visual Elements:**
- Glassmorphic cards with semi-transparent backgrounds
- Status color coding (Green=Completed, Blue=In Progress, Amber=Pending, Red=Delayed)
- Progress indicator with percentage display
- Last updated timestamp
- Ministry responsible label
- Days remaining countdown

### Admin Dashboard (AdminPanel.jsx)

**Edit Controls:**
- **Status Dropdown**: Change promise status (Pending, In Progress, Completed, Delayed)
- **Progress Slider**: Adjust progress from 0-100% with quick-select buttons (0, 25, 50, 75, 100%)
- **Update Notes**: Add context for administrative changes
- **Save Button**: Persists changes and logs to console

**Administrative Features:**
- Category grouping and filtering
- Multi-field search (description, point number, ministry)
- Sort options (point number, progress, status, deadline)
- Expandable promise cards showing full details
- Update history viewer showing all past changes with:
  - Timestamp
  - Changed status/progress
  - User who made change
  - Associated notes

**Stats Display:**
- Total promises
- Completed count
- In Progress count
- Pending count
- Delayed count
- Average progress percentage

**Data Export:**
- Export all promises as JSON file
- Full update history included

### State Management (App_v2.jsx)

**State Variables:**
```javascript
const [isAdminMode, setIsAdminMode] = useState(false);
const [adminAuthenticated, setAdminAuthenticated] = useState(false);
const [promises, setPromises] = useState([]);
const [darkMode, setDarkMode] = useState(false);
```

**Key Functions:**
- `updatePromise(promiseId, updates)` - Updates promise and logs change
- `calculateStats()` - Computes statistics from current promise state
- `handleAdminLogin(password)` - Authenticates admin access
- `handleAdminLogout()` - Clears admin session

**Admin Authentication:**
- Demo Password: `admin2024`
- Protected by modal dialog
- Persisted in localStorage
- Session-based logout

## Usage Guide

### Accessing the Application

```bash
npm run dev
```

Navigate to: `http://localhost:5173`

### Public View Usage

1. **Search**: Type in search box to filter by description, point number, or ministry
2. **Filter**: Click "Filters" button to open category/status filters
3. **Sort**: Select sort option (Point Number, Progress, Deadline, Category)
4. **View Mode**: Toggle between Grid and List views
5. **View Details**: Cards show status badge, progress bar, ministry, and deadline

### Admin Dashboard Access

1. Click "Admin Access" button in header
2. Enter password: `admin2024`
3. Click "Login" to authenticate

### Admin Dashboard Usage

1. **View Promise**: Click chevron icon to expand promise card
2. **Edit Status**: Select from dropdown (Pending, In Progress, Completed, Delayed)
3. **Update Progress**: Use slider (0-100%) or click quick-select buttons
4. **Add Notes**: Optional notes in textarea
5. **Save Changes**: Click "Save Changes" button
6. **View History**: Click "History" button to see all past updates
7. **Export Data**: Click "Export All Data" button to download JSON

### Dark Mode

- Toggle with moon/sun icon in header
- Persisted in localStorage
- Applied to all components (`.dark:` Tailwind classes)

## API Integration Points

### Ready for Backend Integration

The `updatePromise()` function in `App_v2.jsx` is primed for API calls:

```javascript
const updatePromise = (promiseId, updates) => {
  // TODO: Replace with API call
  // POST /api/promises/{promiseId}/update
  // {
  //   status: updates.status,
  //   progress: updates.progress,
  //   notes: updates.notes,
  //   timestamp: new Date().toISOString(),
  //   changedBy: getCurrentUser()
  // }

  // Current: Updates local state
  setPromises(prevPromises => /* ... */);
};
```

### Suggested Endpoints

```
GET /api/promises                    # Fetch all promises
GET /api/promises/{id}               # Fetch single promise
POST /api/promises/{id}/update       # Update promise
POST /api/promises/{id}/history      # Get update history
POST /api/auth/admin/login           # Authenticate admin
GET /api/auth/admin/verify           # Verify session
POST /api/exports                    # Export data
```

## Customization

### Change Admin Password

**File:** `src/App_v2.jsx`

```javascript
if (password === 'admin2024') {  // <- Change this
  setAdminAuthenticated(true);
}
```

### Add More Categories

**File:** `src/data/promises.json`

Add promises with new `category` values. Categories auto-detected from data.

### Modify Color Scheme

**File:** `src/components/AdminPanel.jsx` (line ~290)

```javascript
const getStatusColor = (status) => {
  const colors = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900',  // Edit here
    // ... more colors
  };
};
```

### Adjust Grid Columns

**File:** `src/components/PublicGrid.jsx` (line ~180)

```javascript
// Change responsive grid columns
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
// To:
grid-cols-1 md:grid-cols-3 lg:grid-cols-4
```

## Data Schema

### Promise Object Structure

```typescript
{
  id: number;                    // Unique identifier (1-100)
  point_no: number;              // Display number
  category: string;              // Government sector
  description: string;           // Promise details
  deadline_days: number;         // Days until deadline
  status: "Pending" | "In Progress" | "Completed" | "Delayed";
  ministry_responsible: string;  // Responsible ministry
  source_page: number;           // Reference page
  progress: number;              // 0-100 percentage
  update_history: UpdateEntry[];
}
```

### UpdateEntry Structure

```typescript
{
  timestamp: string;    // ISO 8601 date string
  status: string;       // Status at time of update
  progress: number;     // Progress at time of update
  changedBy: string;    // User who made change
  notes: string;        // Optional notes
}
```

## Performance Considerations

### Optimization Techniques

1. **useMemo**: Filters/sorting computed only when dependencies change
2. **useCallback**: Toggle handlers memoized to prevent unnecessary re-renders
3. **Virtual Scrolling**: Consider for 100+ promises (use `react-window`)
4. **Lazy Loading**: Load history on click, not automatically

### Bundle Size

- **Core Bundle**: ~470 KB (gzipped: ~139 KB)
- **CSS**: ~79.5 KB (gzipped: ~11.9 KB)
- **Total**: ~550 KB (gzipped: ~151 KB)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Troubleshooting

### Admin Password Not Working

- Check exact string: `admin2024`
- Case-sensitive password matching
- Clear localStorage if stuck: `localStorage.clear()`

### Changes Not Appearing

- Check browser console (Ctrl+Shift+I → Console)
- Updates logged to console with `Promise #X Updated:`
- Verify React DevTools to see state updates

### Dark Mode Not Working

- Check if `dark` class applied to root `<div>`
- Verify Tailwind CSS `darkMode: 'class'` in `tailwind.config.js`
- Clear browser cache if styles not updating

### Filters Not Working

- Ensure category/status values match exactly
- Check `promises.json` for typos in category names
- Verify Set operations in filter logic

## File Sizes

| File | Size | Purpose |
|------|------|---------|
| App_v2.jsx | ~12 KB | Main app & authentication |
| AdminPanel.jsx | ~22 KB | Admin dashboard & controls |
| PublicGrid.jsx | ~18 KB | Public viewing & filtering |
| promises.json | ~30.5 KB | 100 promises with history |
| **Total** | **~82.5 KB** | **Production ready** |

## Version History

- **v2.0** (2026-03-30): Dual-view system with admin controls, update history, glassmorphism design
- **v1.0** (2026-03-29): Initial promise tracker with basic grid

## Next Steps

1. **Backend Integration**: Replace localStorage with API calls
2. **User Authentication**: Add user login for admin roles
3. **Email Notifications**: Alert stakeholders on promise updates
4. **Analytics Dashboard**: Track promise completion trends
5. **Document Upload**: Attach supporting documents to promises
6. **Comment System**: Allow public comments on promises
7. **Multi-language**: Support for different languages

## Support & Resources

- React Hooks Documentation: https://react.dev/reference/react
- Tailwind CSS: https://tailwindcss.com
- Lucide React Icons: https://lucide.dev
- Vite Documentation: https://vitejs.dev

---

**Built with React 19 + Tailwind CSS 4.2 + Lucide React 1.7**
