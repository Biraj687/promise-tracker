# 📰 NEWS PUBLISHING WORKFLOW - COMPLETE DOCUMENTATION

**For:** Technical Review & Senior Management  
**Date:** April 1, 2026  
**System:** Promise Tracker - News Management

---

## 🎯 WORKFLOW OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NEWS PUBLISHING WORKFLOW                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ADMIN ACTION                DATABASE STATE           PUBLIC VIEW   │
│                                                                     │
│  1. Create News        → is_published: false    →  NOT visible     │
│     (Title, Content)     status: DRAFT                              │
│                          published_date: null                       │
│                                                                     │
│  2. Edit & Review      → is_published: false    →  NOT visible     │
│     (Update details)     status: DRAFT                              │
│                          still in draft state                       │
│                                                                     │
│  3. Click "Publish"    → is_published: true     →  ✅ VISIBLE      │
│     (Make public)        status: LIVE                               │
│                          published_date: TODAY                      │
│                                                                     │
│  4. Unpublish          → is_published: false    →  NOT visible     │
│     (Hide from public)    status: DRAFT                              │
│                          published_date: null                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 DETAILED WORKFLOW STEPS

### STEP 1: Admin Creates News Item (DRAFT)

**User Action:**
```
1. Go to Admin Dashboard
2. Click "🗞️ News & Progress Timeline"
3. Click "📝 New Update" button
```

**Form Fields Admin Fills:**
```
┌─────────────────────────────────────┐
│ 🗞️ PUBLISH PROGRESS UPDATE          │
├─────────────────────────────────────┤
│                                     │
│ Headline*                           │
│ [________________]                  │
│                                     │
│ Detail Content                      │
│ [________________________]           │
│ [________________________]           │
│                                     │
│ Type: ▼ [Progress Update]           │
│                                     │
│ 📷 Upload Image                     │
│ [Upload Area]                       │
│                                     │
│ Link Category: ▼ [General]          │
│ Link Promise: ▼ [None]              │
│                                     │
│ Source Name: [OnlineKhabar]         │
│ Source URL: [https://...]           │
│                                     │
│ ☐ Published                         │
│ ✅ [Publish to Homepage] Button     │
│                                     │
└─────────────────────────────────────┘
```

**Data Sent to Database:**
```javascript
{
  title: "नयाँ बिद्युत नीति घोषणा",
  description: "नयाँ विद्युत क्षेत्रको विकास...",
  image_url: "https://supabase.../photo.jpg",
  source_name: "OnlineKhabar",
  source_url: "https://onlinekhabar.com/...",
  news_type: "update",
  category_id: 1,
  promise_id: null,
  is_published: false,                    // ✅ DRAFT (unchecked)
  published_date: null,                   // ✅ No date = not published
  created_at: "2026-04-01T10:30:00Z",
  updated_at: null
}
```

**Database Result:**
```sql
INSERT INTO news_updates (...) VALUES (...)

Result:
- id: 42
- is_published: false
- published_date: NULL
- status: DRAFT
```

**Admin Panel Display:**
```
📝 DRAFT Badge (Amber)
├─ Title: नयाँ बिद्युत नीति घोषणा
├─ Created: Apr 1, 2026
├─ Status: Draft
├─ Actions: [✏️ Edit] [🗑️ Delete]
└─ ⚠️ NOT visible on public homepage
```

**Public Homepage Display:**
```
❌ NOT SHOWN
(News only appears if is_published = true)
```

---

### STEP 2: Admin Reviews & Edits (STILL DRAFT)

**User Action:**
```
1. In admin panel, see draft item
2. Click pencil icon (Edit button)
3. Form opens with current data
4. Make changes if needed
5. "Published" checkbox STILL unchecked
6. Click "Save Changes"
```

**Data Flow:**
```
Old State:
is_published: false
published_date: null

Admin changes title + description
but does NOT check "Published"

New State (after update):
is_published: false          ✅ Still draft
published_date: null        ✅ Still no date
updated_at: NOW             ✅ Update timestamp recorded
```

**Admin Panel Display:**
```
📝 DRAFT Badge (Amber) - Still shows as draft
├─ Title: नयाँ बिद्युत नीति घोषणा (UPDATED)
├─ Created: Apr 1, 2026
├─ Updated: Apr 1, 2026, 10:45 AM
├─ Status: Draft
└─ ⚠️ Still NOT visible on public homepage
```

**Public Homepage Display:**
```
❌ Still NOT SHOWN
(News only appears if is_published = true)
```

---

### STEP 3: Admin Publishes News (GOES LIVE)

**User Action:**
```
1. From admin panel, click Edit on draft
2. Form opens
3. CHECK the "Published" checkbox
4. Click "Save Changes" button
```

**Checkbox Change:**
```
BEFORE:  ☐ Published
         published_date: null

AFTER:   ☑️ Published
         published_date: "2026-04-01"
```

**Data Sent to Database:**
```javascript
updateNewsUpdate(42, {
  // ... all fields including:
  is_published: true,                     // ✅ NOW TRUE
  published_date: "2026-04-01",          // ✅ Set to today
  updated_at: "2026-04-01T10:47:00Z"     // ✅ Update time
})
```

**Database Update Query:**
```sql
UPDATE news_updates 
SET 
  is_published = true,
  published_date = '2026-04-01',
  updated_at = NOW()
WHERE id = 42;
```

**Admin Panel Display:**
```
✅ LIVE Badge (Green) - Now published!
├─ Title: नयाँ बिद्युत नीति घोषणा
├─ Created: Apr 1, 2026
├─ Published: Apr 1, 2026
├─ Status: Live
├─ Actions: [✏️ Edit] [🗑️ Delete]
└─ ✅ NOW visible on public homepage
```

**Public Homepage Display (fetchPublishedNews Query)**
```
✅ NOW SHOWN!

Query runs:
SELECT * FROM news_updates 
WHERE is_published = true 
ORDER BY created_at DESC;

Result: News item appears on homepage

Display:
┌─────────────────────────────┐
│  नयाँ बिद्युत नीति घोषणा     │
│  [Image here]               │
│  नयाँ विद्युत क्षेत्रको...   │
│  Published: Apr 1, 2026     │
└─────────────────────────────┘
```

---

### STEP 4: Admin Unpublishes News (GOES TO DRAFT)

**User Action:**
```
1. In admin panel, click Edit on published news
2. Form opens (shows "Published" checked)
3. UNCHECK the "Published" checkbox
4. Click "Save Changes"
```

**Checkbox Change:**
```
BEFORE:  ☑️ Published
         published_date: "2026-04-01"

AFTER:   ☐ Published
         published_date: null
```

**Data Sent to Database:**
```javascript
updateNewsUpdate(42, {
  // ... all fields including:
  is_published: false,                    // ✅ Back to false
  published_date: null,                   // ✅ Clear date (back to draft)
  updated_at: "2026-04-01T11:00:00Z"     // ✅ Update timestamp
})
```

**Admin Panel Display:**
```
📝 DRAFT Badge (Amber) - Back to draft
├─ Title: नयाँ बिद्युत नीति घोषणा
├─ Created: Apr 1, 2026
├─ Published: Apr 1, 2026 → Apr 1, 2026 (unpublished)
├─ Status: Draft
└─ ⚠️ Removed from public homepage
```

**Public Homepage Display**
```
❌ NO LONGER SHOWN
The news.js query filters out unpublished items

Query still runs:
SELECT * FROM news_updates 
WHERE is_published = true 
ORDER BY created_at DESC;

Result: Article NO LONGER in results
```

---

## 🔄 DATABASE STATE TRANSITIONS

```
Academic Transition Diagram:

┌─────────────────┐
│   NOT EXISTS    │
│   (0 records)   │
└────────┬────────┘
         │ Admin clicks "New Update"
         │
         ▼
┌─────────────────────────────┐
│  DRAFT STATE (New Item)      │
│  is_published: false         │
│  published_date: null        │
│  Status in DB: Created       │
└────┬────────────────────┬────┘
     │                    │
     │ Admin edits/       │ Admin publishes
     │ still draft        │ (checks Published)
     │                    │
     ▼                    ▼
┌──────────────┐  ┌────────────────────┐
│ DRAFT EDIT   │  │  PUBLISHED STATE   │
│ Same state   │  │  is_published: true│
│ Updated_at   │  │  published_date: OK│
│ changes      │  │  Status in DB: Live│
└──────────────┘  └────┬────────────────┘
                       │
                       │ Admin unpublishes
                       │ (unchecks Published)
                       │
                       ▼
                ┌────────────────────┐
                │  BACK TO DRAFT     │
                │  is_published: false
                │  published_date: null
                │  Removed from public
                └────────────────────┘
```

---

## 📱 ADMIN PANEL VIEWS

### View 1: All News Items (Filter = null)
```
Filter Buttons:
[📋 All (5)] [✅ Published (3)] [📝 Drafts (2)]

Display:

1. ✅ LIVE | "नयाँ योजना शुरु"
   ├─ update badge | Apr 1
   ├─ Regular text content
   └─ [✏️ Edit] [🗑️ Delete]

2. 📝 DRAFT | "अनौपचारिक प्रस्ताव"
   ├─ news badge | Apr 1
   ├─ Still editing this one
   └─ [✏️ Edit] [🗑️ Delete]

3. ✅ LIVE | "प्रगति रिपोर्ट"
   ├─ milestone badge | Mar 31
   ├─ Already published
   └─ [✏️ Edit] [🗑️ Delete]

... and 2 more ...
```

### View 2: Published Only (Filter = true)
```
Filter Buttons:
[📋 All (5)] [✅ Published (3)] [📝 Drafts (2)]

Display:

1. ✅ LIVE | "नयाँ योजना शुरु"
   ├─ update badge | Apr 1
   └─ [✏️ Edit] [🗑️ Delete]

2. ✅ LIVE | "प्रगति रिपोर्ट"
   ├─ milestone badge | Mar 31
   └─ [✏️ Edit] [🗑️ Delete]

3. ✅ LIVE | "बजेट वृद्धि"
   ├─ update badge | Mar 30
   └─ [✏️ Edit] [🗑️ Delete]

(Drafts hidden)
```

### View 3: Drafts Only (Filter = false)
```
Filter Buttons:
[📋 All (5)] [✅ Published (3)] [📝 Drafts (2)]

Display:

1. 📝 DRAFT | "अनौपचारिक प्रस्ताव"
   ├─ news badge | Apr 1
   └─ [✏️ Edit] [🗑️ Delete]

2. 📝 DRAFT | "नयाँ विचार (अभी डिफ्ट)"
   ├─ update badge | Mar 31
   └─ [✏️ Edit] [🗑️ Delete]

(Published items hidden)
```

---

## 🌐 PUBLIC HOMEPAGE BEHAVIOR

### Homepage Query:

```javascript
// In src/context/DataContext.jsx
const fetchPublishedNews = async () => {
  const { data } = await supabase
    .from('news_updates')
    .select('*')
    .eq('is_published', true)        // ← Key filter
    .order('created_at', { ascending: false })
    .limit(100);
  return data;
};
```

### What Gets Shown:

```
✅ Shown on Homepage:
├─ All news items where is_published = true
├─ Even if admin is still editing (if published)
├─ Sorted by newest first
└─ Up to 100 latest published items

❌ NOT Shown on Homepage:
├─ Any item where is_published = false
├─ Drafts (even if almost complete)
├─ Unpublished items (even if very important)
└─ Hidden items (admin unpublished them)
```

### Real Examples:

**Scenario 1: News is Published**
```
Database: id=42, is_published=true, title="Policy"
Query: SELECT * WHERE is_published=true
Result: ✅ Appears on homepage
```

**Scenario 2: News is Draft**
```
Database: id=43, is_published=false, title="Draft"
Query: SELECT * WHERE is_published=true
Result: ❌ Does NOT appear on homepage
```

**Scenario 3: Admin Unpublishes**
```
Database: id=42, is_published=true → false
Query: SELECT * WHERE is_published=true
Result: ❌ Now hidden from homepage (even though admin hasn't deleted it)
```

---

## 📊 DATA STRUCTURE

### Database Table: news_updates

```sql
CREATE TABLE news_updates (
  id INTEGER PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR,
  source_name VARCHAR,
  source_url VARCHAR,
  news_type VARCHAR DEFAULT 'update',
  
  -- Publishing Fields (THE KEY FIELDS)
  is_published BOOLEAN DEFAULT false,      ← Controls visibility
  published_date DATE,                      ← Tracks when published
  
  -- Relations
  category_id INTEGER FOREIGN KEY,
  promise_id INTEGER FOREIGN KEY,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  
  -- Other
  thumbnail_url VARCHAR
);
```

### Key Fields Explained:

```
is_published:
├─ Type: BOOLEAN (true or false)
├─ Purpose: Controls whether item appears on homepage
├─ Value: false = Draft (hidden)
├─ Value: true = Published (visible)
└─ Set by: Admin checking/unchecking "Published" box

published_date:
├─ Type: DATE (YYYY-MM-DD)
├─ Purpose: Records when item was published
├─ Value: null = Not yet published (draft)
├─ Value: "2026-04-01" = Published on this date
└─ Set by: System when is_published changes to true

created_at:
├─ Type: TIMESTAMP
├─ Purpose: When news item was created
├─ Never changes after creation
└─ Tracks history of item

updated_at:
├─ Type: TIMESTAMP
├─ Purpose: When news item was last edited
├─ Changes every time admin saves
└─ Tracks edit history
```

---

## 🔄 COMPLETE WORKFLOW EXAMPLE

### Real Scenario: Publishing Breaking News

```
10:00 AM - Admin Creates Draft
└─ Title: "नयाँ सड़क परियोजना स्वीकृत"
└─ Content: (Being written)
└─ is_published: false
└─ Action: Clicks "Publish to Homepage"
└─ Result: Saved as DRAFT (unchecked box)
└─ Homepage: ❌ Not shown

10:15 AM - Admin Edits Content
└─ Opens draft
└─ Adds more details and image
└─ is_published: still false
└─ Still unchecked
└─ Action: Clicks "Save Changes"
└─ Result: Draft updated, still draft
└─ Homepage: ❌ Not shown

10:45 AM - Admin Reviews & Ready to Publish
└─ Opens draft
└─ Checks "Published" checkbox
└─ is_published: now true
└─ published_date: "2026-04-01"
└─ Action: Clicks "Save Changes"
└─ Result: Published!
└─ Homepage: ✅ Now visible!

11:00 AM - User Visits Homepage
└─ News query runs: SELECT * WHERE is_published=true
└─ Item is included in results
└─ Homepage shows: "नयाँ सड़क परियोजना स्वीकृत"

12:00 PM - Admin Notices Typo
└─ Opens published news
└─ Fixes typo
└─ Leave "Published" checked
└─ is_published: still true
└─ Action: Clicks "Save Changes"
└─ Result: Published version updated
└─ Homepage: ✅ Still shown (with fix)

02:00 PM - Admin Decides to Hide for Review
└─ Opens published news
└─ Unchecks "Published" checkbox
└─ is_published: now false
└─ published_date: set to null
└─ Action: Clicks "Save Changes"
└─ Result: Returned to draft
└─ Homepage: ❌ No longer shown (but not deleted)

03:00 PM - User Visits Homepage
└─ News query runs: SELECT * WHERE is_published=true
└─ Item is NOT included (because is_published=false)
└─ News no longer visible on homepage
```

---

## 🔍 KEY LOGIC POINTS

### How Admin Fetch Works:
```javascript
// Shows ALL news (published + drafts)
// Admin can see everything they created
const fetchAllNewsUpdates = async () => {
  const { data } = await supabase
    .from('news_updates')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Result: ALL items regardless of is_published value
  return data;  // Could have 100 items
};
```

### How Public Fetch Works:
```javascript
// Shows ONLY published news
// Homepage users only see live content
const fetchPublishedNews = async () => {
  const { data } = await supabase
    .from('news_updates')
    .select('*')
    .eq('is_published', true)  // ← FILTER
    .order('created_at', { ascending: false });
  
  // Result: Only items where is_published=true
  return data;  // Could have 50 items if 50 are published
};
```

### The Crucial Difference:
```
Admin Panel:
  fetchAllNewsUpdates()
  Shows: All 100 news items (50 published + 50 drafts)
  Can edit: Any item
  
Public Homepage:
  fetchPublishedNews()
  Shows: Only 50 published items
  Can edit: None (read-only)
```

---

## ✅ WORKFLOW CHECKLIST

When creating & publishing news, follow this checklist:

```
☐ Step 1: Create
  └─ Fill form: Title, Description
  └─ Upload image if needed
  └─ Select category/promise
  └─ Add source name/URL (optional)
  └─ Leave "Published" UNCHECKED
  └─ Click "Publish to Homepage" (saves as draft)
  └─ Result: Item in admin panel as DRAFT

☐ Step 2: Review (multiple times if needed)
  └─ Click Edit button
  └─ Make changes
  └─ Leave "Published" UNCHECKED
  └─ Click "Save Changes"
  └─ Result: Item still DRAFT, no homepage visibility

☐ Step 3: Publish
  └─ Click Edit button
  └─ Review all content one final time
  └─ CHECK "Published" checkbox
  └─ Click "Save Changes"
  └─ Result: Item now LIVE, visible on homepage

☐ Step 4: Monitor (optional)
  └─ Can visit homepage and see news
  └─ Users can now read the news
  └─ Traffic analytics start counting

☐ Step 5: Hide If Needed
  └─ Click Edit button
  └─ UNCHECK "Published" checkbox
  └─ Click "Save Changes"
  └─ Result: Item back to DRAFT, removed from homepage
  └─ Note: Item still exists, just hidden
```

---

## 🎓 SUMMARY

| Step | Admin Panel Shows | Homepage Shows | Database State |
|------|-----------------|---|--|
| 1. Created | 📝 DRAFT | ❌ | is_published: false |
| 2. Editing | 📝 DRAFT | ❌ | is_published: false |
| 3. Publish | ✅ LIVE | ✅ | is_published: true |
| 4. Unpublish | 📝 DRAFT | ❌ | is_published: false |
| 5. Delete | ❌ Gone | ❌ | Record deleted |

---

## 💡 IMPORTANT CONCEPTS

### Draft vs Published:
```
DRAFT:
├─ Admin can see in panel
├─ Can be edited freely
├─ NOT visible to public
├─ published_date is null
└─ is_published = false

PUBLISHED:
├─ Admin can see in panel
├─ Can still be edited
├─ ✅ VISIBLE to public
├─ published_date is set
└─ is_published = true
```

### Visibility Control:
```
Admin sees: ALL news (via fetchAllNewsUpdates)
Public sees: ONLY published news (via fetchPublishedNews)

This is controlled by ONE field: is_published
```

### Editing After Publishing:
```
Published news CAN be edited:
✅ Fix typos after publishing
✅ Add more details
✅ Change image if needed
✅ Update source information

When you save edits:
├─ If "Published" is checked → stays published
├─ If "Published" is unchecked → becomes draft
```

---

## 🚀 WORKFLOW IN ACTION

```
Timeline of events:

2026-04-01 10:00 AM
├─ Admin creates draft news
├─ Saved to database with is_published=false
└─ Appears in admin panel as 📝 DRAFT

2026-04-01 10:15 AM
├─ Admin edits draft
├─ Updates description and image
├─ Still is_published=false
└─ Still shows as 📝 DRAFT in panel

2026-04-01 10:45 AM
├─ Admin publishes by checking box
├─ is_published changes to true
├─ published_date set to "2026-04-01"
├─ Appears in admin panel as ✅ LIVE
└─ Now appears on public homepage!

2026-04-01 2:00 PM
├─ Public users see news on homepage
├─ Gets views and engagement
└─ Shows up in news feed

2026-04-01 8:00 PM
├─ Admin decides to hide it for updates
├─ Unchecks "Published" checkbox
├─ is_published changes to false
├─ published_date set to null
├─ Appears in admin panel as 📝 DRAFT
└─ Disappears from public homepage
```

---

**Document Version:** 1.0  
**Status:** ✅ Complete Workflow Documentation  
**Audience:** Technical Team + Senior Management
