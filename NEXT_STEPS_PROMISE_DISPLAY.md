# 📌 IMMEDIATE NEXT STEPS - COMPLETE THE DASHBOARD

## Status: Frontend-Dashboard Connection ✅ Fixed
## Status: Promise Display & Detail Pages ❌ TODO

---

## 🎯 What Needs to Happen Next

### Priority 1: Make ManagePromises Functional for Frontend Display

**Problem:** Promises added in ManagePromises don't show on the homepage

**Solution:**
1. **Update promises table structure** (if needed)
   - Ensure each promise has: `title`, `description`, `hero_image_url`, `status`, `progress`
   - Link Promise to Category (for grouping)

2. **Update CategoryGrid.jsx** to show actual promises
   - Instead of hardcoded categories, fetch 4 main categories/promises
   - Display promise cards with image, title, status
   - Add progress bar showing completion %
   
3. **Make promises clickable to detail page**
   - Click promise card → `/promise/:id` route
   - Show full details including hero image, description, status

### Priority 2: Create Promise Detail Page

**What it should show:**
- Hero image (from promises.hero_image_url)
- Promise title & description
- Current status (Pending / In Progress / Completed)
- Progress bar or percentage
- Timeline of updates (if available)
- **EDIT button** → can edit from admin dashboard

**Route:** `/promise/:id`

**File to create:** `src/pages/PromiseDetail.jsx`

---

## 📋 Implementation Guide

### Step 1: Update ManagePromises Modal to Edit Full Promise Details

**Current State:**
- Shows promise status dropdown
- Can add/update promises

**Needs:**
- **Hero Image Upload** for each promise (like ContentManager has)
- **Title, Description fields** (fully editable)
- **Status dropdown** (Pending, In Progress, Completed)
- **Progress % field** (0-100)

**Code Location:** `src/pages/admin/ManagePromises.jsx`

```jsx
// Add to promise edit form:
<input type="text" value={promiseTitle} /> 
<textarea value={promiseDescription} />
<select value={promiseStatus}>
  <option>Pending</option>
  <option>In Progress</option>
  <option>Completed</option>
</select>
<input type="number" value={promiseProgress} min="0" max="100" />
<button>Upload Promise Hero Image</button>
```

### Step 2: Update CategoryGrid to Show Real Promises

**Current:** Shows 12 hardcoded categories from ConfigContext

**Needed Change:**
```jsx
// Instead of:
config.categories.map(cat => {...})

// Do this:
useData() → promises.filter(p => topLevel) → map promises as cards
```

**Show as Card Grid:**
- Promise hero image
- Promise title  
- Promise description (first 100 chars)
- Status badge (Pending/In Progress/Completed)
- Progress bar (0-100%)
- Link to `/promise/:id`

### Step 3: Create Promise Detail Page

**File:** `src/pages/PromiseDetail.jsx`

**Layout:**
```
[Hero Image - Full width]
[Promise Title - Large]
[Status Badge + Progress Bar]
[Description - Full text]
[Timeline Updates - If available]
[Edit Button - Admin only]
```

**Route in App.jsx:**
```jsx
<Route path="/promise/:id" element={<PromiseDetail />} />
```

### Step 4: Wire Admin Edit Button

**From PromiseDetail:**
- If admin → Show "Edit Promise" button
- Click → Opens ManagePromises modal (in new tab or modal)
- Edit promise → Save
- Return to detail page → Show updated data

---

## 🗂️ Database Schema Reminder

### promises Table Fields:
```sql
- id
- title (TEXT)
- description (TEXT)
- hero_image_url (TEXT) -- Supabase Storage
- status (TEXT) -- Pending, In Progress, Completed
- progress (INTEGER) -- 0-100
- categoryId (BIGINT) -- foreign key to categories
- created_at (timestamp)
- updated_at (timestamp)
```

### If Missing Fields:
```sql
ALTER TABLE promises ADD COLUMN hero_image_url TEXT;
ALTER TABLE promises ADD COLUMN progress INTEGER DEFAULT 0;
-- Update status field to use consistent values
UPDATE promises SET status = 'Pending' WHERE status IS NULL;
```

---

## 🔧 Code Changes Order

### 1️⃣ Update promises table in Supabase
- Add missing columns if needed
- Run migration SQL

### 2️⃣ Update ManagePromises.jsx
- Add image upload
- Add hero_image_url to promise edit form
- Add progress % field

### 3️⃣ Update CategoryGrid.jsx  
- Change from categories to promises
- Show promise cards instead of category cards
- Make them clickable to `/promise/:id`

### 4️⃣ Create PromiseDetail.jsx
- New component for promise details
- Show hero image, full description, progress bar
- Add edit button for admins

### 5️⃣ Update App.jsx routes
- Add Route for `/promise/:id`

### 6️⃣ Test Everything
- Add promise in ManagePromises
- See it show on homepage
- Click it → Go to detail page
- Edit it from detail page → See changes

---

## 📝 Files That Will Change

```
src/
├── pages/
│   ├── PromiseDetail.jsx ← NEW FILE (create)
│   ├── Home.jsx ← Update to use new CategoryGrid
│   ├── admin/
│   │   └── ManagePromises.jsx ← Add image upload, progress field
│   └── NotFound.jsx ← (may need to keep existing categories page as fallback)
├── components/
│   ├── home/
│   │   └── CategoryGrid.jsx ← Change to show promises instead
│   └── PromiseCard.jsx ← May need updates
└── App.jsx ← Add promise detail route
```

---

## ⏱️ Estimated Time
- Update ManagePromises: 30 min
- Update CategoryGrid: 20 min  
- Create PromiseDetail: 30 min
- Testing & fixing: 20 min
- **Total: ~2 hours**

---

## ✅ Success Criteria

### When Done:
1. ✅ Add promise in ManagePromises admin → Appears on home page
2. ✅ Click promise card → Goes to detail page
3. ✅ Detail page shows hero image, description, status, progress
4. ✅ Click Edit on detail page → Edit form opens
5. ✅ Save edits → Appear on detail page immediately
6. ✅ Frontend and admin are fully synced

---

## 🚨 Critical Notes

### Must Remember:
- Upload images to **Supabase Storage**, not localStorage
- Save promise data to **Supabase database**, not frontend state
- ConfigContext can still manage **landing page** (Hero, Footer)
- DataContext should manage **promises** (CRUD operations)
- UseData hook has `uploadImage()` and promise CRUD methods

### Don't:
- ❌ Save promises to localStorage
- ❌ Hardcode promise data in components
- ❌ Make promise images static URLs
- ❌ Forget to make it work for admins only

---

## 🎯 End Goal

**After all changes:**
- Admin dashboard completely controls what users see
- No hardcoded data in components
- Single source of truth: Supabase database
- Frontend and dashboard fully synced in real-time
- Users see actual promises with progress tracking
- Admin can edit everything from one dashboard
