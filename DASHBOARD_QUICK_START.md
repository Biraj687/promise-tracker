# 🚀 Dashboard Quick Start Guide

**Date:** April 1, 2026  
**Status:** ✅ READY TO USE  
**Access:** http://localhost:5173/admin (after login)

---

## ⚡ 5-Minute Quick Start

### Step 1: Login to Admin
```
URL: http://localhost:5173/login
Username: admin@gov.np (or your admin account)
Password: (your password)
```

### Step 2: Access the Dashboard
```
After login:
URL redirects to: http://localhost:5173/admin
You'll see: HomepageDashboard with 3 main sections
```

### Step 3: Manage Featured Trackers
```
1. Click tab: 🔹 Featured Trackers
2. Click button: "Add New Tracker"
3. Fill form:
   ✍️ Tracker Name: काठमाडौंको नयाँ योजना
   ✍️ Display Order: 1
   ✍️ Description: Brief description here
   ✍️ Image URL: https://example.com/image.jpg
4. Click: "Create Tracker"
5. ✅ Appears on homepage instantly!
```

### Step 4: Manage Promises
```
1. Click tab: 📋 Tracker Details & Promises
2. Click tracker card: Select one
3. View all promises automatically loaded
4. Click "Add Promise" to create new one
```

### Step 5: Create Breaking News
```
1. Click tab: 🔴 Breaking News
2. Click: "Add Breaking News"
3. Fill form:
   ✍️ Title: Important update announcement
   ✍️ Category: Select tracker
   ✍️ Description: Full content
   ✍️ Check: Mark as Breaking Alert
4. Click: "Post Breaking News"
5. ✅ Appears immediately!
```

---

## 🎯 Dashboard Tabs Explained

### 🔹 Featured Trackers Tab
**Purpose:** Manage the 3 cards shown in "प्रमुख ट्रयाकरहरू" section

**What you can do:**
- CREATE new tracker cards
- EDIT existing card info (name, image, description)
- DELETE trackers you don't need
- VIEW live statistics (Total, Completed, In Progress)
- REORDER cards with display order field
- UPLOAD hero images with preview

**Homepage Impact:**
Changes here directly update the homepage cards instantly!

---

### 📋 Tracker Details & Promises Tab
**Purpose:** Manage individual tracker's categories and promises

**What you can do:**
- SELECT any tracker to view details
- VIEW all promises in that tracker
- SEE promise status and progress bars
- ADD new promises
- FILTER promises by status
- VIEW category breakdown

**Homepage Impact:**
Promise updates appear instantly on all related pages!

---

### 🔴 Breaking News Tab
**Purpose:** Create urgent alerts and news items

**What you can do:**
- CREATE breaking news items
- ASSIGN to specific trackers
- MARK as urgent (breaking alert)
- VIEW all news items
- DELETE or modify news

**Homepage Impact:**
Breaking news appears prominently in dashboard alerts!

---

## 📊 Dashboard Layout Visual

```
┌──────────────────────────────────────────────────┐
│  नेपाल ट्रयाकर. Admin    Dashboard Management   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Hero Section Management  [Edit Hero Content 🔵] │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 🔹 Featured Trackers | 📋 Details | 🔴 News   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                                                  │
│  ACTIVE TAB CONTENT                              │
│  (Trackers, Details, or News Management)         │
│                                                  │
│  [Add Button] [Form/List/Actions]                │
│                                                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  नेपाल ट्रयाकर. • Footer                  © 2026  │
└──────────────────────────────────────────────────┘
```

---

## 🎨 Tab 1: Featured Trackers

### Visual Layout
```
🔹 Featured Trackers
├─ Header with title
├─ [Add New Tracker] button
├─ Add/Edit Form (when active)
│  ├─ Tracker Name input
│  ├─ Display Order input
│  ├─ Description textarea
│  └─ Image URL input + preview
│
└─ Tracker Cards Grid (3 columns)
   ├─ Card 1: काठमाडौंको...
   │  ├─ Hero image (h-40)
   │  ├─ Title & description
   │  ├─ Stats: कुल|पूरा|प्रगति
   │  └─ [Edit] [Delete]
   ├─ Card 2
   └─ Card 3
```

### Example Form
```
┌─ Create New Tracker ─────────────────────┐
│                                          │
│ Tracker Name: [काठमाडौंको नयाँ योजना ] │
│ Display Order: [1]                       │
│ Description: [Brief description...]      │
│ Hero Image URL: [https://example.com...] │
│                                          │
│       Image Preview (if URL valid) ◻️    │
│                                          │
│ [Cancel]  [✓ Create Tracker]             │
└──────────────────────────────────────────┘
```

---

## 🎨 Tab 2: Tracker Details & Promises

### Visual Layout
```
📋 Tracker Details & Promises
├─ Header with info
├─ Tracker Selection (3 cards)
│  ├─ Card 1 (selectable)
│  ├─ Card 2 (selectable)
│  └─ Card 3 (selectable)
│
└─ When selected, shows:
   ├─ Selected Tracker Header
   ├─ [Add Promise] button
   └─ Promises List (scrollable)
      ├─ Promise 1
      │  ├─ Title & description
      │  ├─ Status badge (Completed/In Progress/Pending)
      │  └─ Progress bar
      ├─ Promise 2
      └─ Promise 3
```

---

## 🎨 Tab 3: Breaking News

### Visual Layout
```
🔴 Breaking News
├─ Header
├─ [Add Breaking News] button (red)
├─ News Form (red themed)
│  ├─ News Title input
│  ├─ Category selector
│  ├─ Description textarea
│  ├─ ☐ Mark as Breaking Alert
│  └─ [Cancel] [✓ Post Breaking News]
│
└─ Recent Breaking News List
   ├─ Pulsing red dot 🔴
   ├─ News item 1
   ├─ News item 2
   └─ (Add more as you create)
```

---

## 🔄 Data Flow Visualization

```
Your Actions in Dashboard
         ↓
    DashboardComponent
         ↓
   Supabase Update
         ↓
    Database Changes
         ↓
   DataContext Syncs
         ↓
   Homepage Rerenders
         ↓
    ✅ Changes Live!
```

### Example: Edit Tracker
```
You click [Edit Tracker]
         ↓
Form opens with current data
         ↓
You modify fields
         ↓
Click [Update Tracker]
         ↓
supabase.from('categories').update({...}).eq('id', xxx)
         ↓
Database updated
         ↓
DataContext fetches new data
         ↓
PromiseOverview re-renders
         ↓
Homepage card updated instantly ✅
```

---

## 📝 Common Tasks

### Create a New Featured Tracker
**Time:** 2-3 minutes

1. Go to 🔹 Featured Trackers tab
2. Click "Add New Tracker"
3. Enter:
   - **Name:** काठमाडौंको नयाँ योजना (Nepali name)
   - **Order:** 1 (for first position), 2, 3...
   - **Description:** What this tracker is about
   - **Image:** URL to image (or use placeholder)
4. Click "Create Tracker"
5. New card appears on homepage! 

**That's it!** No need to refresh or restart anything.

---

### Edit an Existing Tracker
**Time:** 1-2 minutes

1. Go to 🔹 Featured Trackers tab
2. Find the tracker card
3. Click "Edit" button
4. Modify any field
5. Click "Update Tracker"
6. Changes appear instantly!

**You can edit:**
- Name (Nepali title)
- Image URL
- Description
- Display order

---

### Add a Promise to a Tracker
**Time:** 2-3 minutes

1. Go to 📋 Tracker Details & Promises tab
2. Click on a tracker card to select it
3. Click "Add Promise" button
4. Fill promise details:
   - Title
   - Description
   - Status (Pending/In Progress/Completed)
   - Progress (if applicable)
5. Click "Create Promise"
6. Promise appears in the tracker!

**Homepage updates:**
- Tracker statistics automatically recalculate
- Total count increases
- Promise appears when viewing that tracker

---

### Create a Breaking News Alert
**Time:** 1-2 minutes

1. Go to 🔴 Breaking News tab
2. Click "Add Breaking News"
3. Enter:
   - **Title:** Short headline
   - **Category:** Select which tracker
   - **Description:** Full content
   - **Check:** Mark as Breaking Alert (if urgent)
4. Click "Post Breaking News"
5. Alert appears immediately!

**The red pulsing indicator shows it's urgent**

---

## ⚙️ Settings & Options

### Display Order
Controls which card appears first (0, 1, 2...)
- `0` = First position (leftmost)
- `1` = Second position  
- `2` = Third position
- Higher numbers appear at end

### Status Options
For promises:
- **Pending** (Gray)  - Not started
- **In Progress** (Amber) - Currently working
- **Completed** (Green) - Finished

### Breaking News Alert
Checkbox to mark news as urgent
- ✅ Checked = Red color, pulsing indicator, priority display
- ⬜ Unchecked = Normal news item

---

## 🆘 Troubleshooting

### Dashboard Not Loading
**Problem:** Blank page or error when accessing /admin

**Solutions:**
1. Make sure you're logged in (check /login page)
2. Check browser console for errors (F12)
3. Verify Supabase connection in .env
4. Try refreshing the page

### Changes Not Appearing
**Problem:** I edited but homepage didn't update

**Solutions:**
1. Refresh the homepage (Ctrl+R)
2. Wait a few seconds (data syncs automatically)
3. Check browser console for errors
4. Verify your changes in Supabase dashboard

### Image Not Showing
**Problem:** Image URL was entered but no preview

**Solutions:**
1. Check the URL is correct and accessible
2. Try a different image URL (test URL: `https://via.placeholder.com/400x200`)
3. Verify CORS settings on image server
4. Use relative paths or different domain

### Can't Save Changes
**Problem:** Save button not working or shows error

**Solutions:**
1. Fill all required fields (name, description, image)
2. Check Supabase is connected (look for network errors)
3. Try updating a different field first
4. Refresh page and try again

---

## 🔑 Key Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate between form fields |
| `Escape` | Close forms / modals |
| `Ctrl+S` | Save (in most browsers auto-saves) |
| `F12` | Open Developer Console (for debugging) |
| `Ctrl+R` | Refresh page |

---

## 📱 Mobile/Responsive Behavior

**On Mobile (< 768px):**
- Tabs stack vertically
- Cards show 1 per row
- Forms expand full width
- All functionality works the same

**On Tablet (768px - 1024px):**
- Tabs horizontal
- Cards show 2 per row
- Forms side-by-side
- Easy to manage

**On Desktop (> 1024px):**
- Tabs horizontal
- Cards show 3 per row  
- Forms with sidebars
- Optimal experience

---

## ✅ Before You Start

Make sure you have:
- ✅ Admin account created
- ✅ Logged in successfully
- ✅ Supabase database configured
- ✅ Categories table with data
- ✅ Promises table linked
- ✅ News updates table ready

**If not, run the SUPABASE_SETUP.sql file first!**

---

## 🎓 Next Steps

1. **Try creating** a test tracker
2. **View** on the homepage (it appears instantly)
3. **Edit** the tracker to see live updates
4. **Add promises** to the tracker
5. **Create** breaking news
6. **Explore** all three tabs to get comfortable

**That's it!** You're now ready to manage the homepage content!

---

## 📞 Need Help?

Check these resources:
1. **HOMEPAGE_DASHBOARD_GUIDE.md** - Detailed feature guide
2. **Browser Console (F12)** - Error messages
3. **Supabase Dashboard** - Check database directly
4. **Database tables** - Verify structure

---

**Dashboard Ready! 🎉**  
Start managing your homepage content now!
