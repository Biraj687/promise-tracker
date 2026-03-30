# Admin Panel Quick Start Guide

## 🚀 Quick Access

**Admin Dashboard URL**: `http://localhost:5173/admin`

### Default Credentials
```
Username: admin@gov.np
Password: admin123
```

---

## 📌 Key Routes

| Route | Purpose | What You Can Do |
|-------|---------|-----------------|
| `/admin` | Dashboard | View overall statistics & recent activity |
| `/admin/categories` | Manage Categories | Create, edit, delete categories |
| `/admin/promises` | Manage Promises | Create, edit, delete promises |
| `/admin/users` | Manage Users | Manage admin access |

---

## 💡 Common Tasks

### Adding a New Category

1. Go to **Manage Categories** (sidebar)
2. Click **Add Category** button
3. Fill in:
   - **Name**: Category title (e.g., "Healthcare")
   - **Icon**: Choose from 12 icons
   - **Color**: Choose from 12 colors
4. See preview on the right
5. Click **Add Category**
✅ Category appears in promise dropdown immediately

### Adding a New Promise

1. Go to **Manage Promises** (sidebar)
2. Click **Add Promise** button
3. Fill in:
   - **Title**: Promise name (required)
   - **Description**: Detailed description (required)
   - **Category**: Select from dropdown
   - **Status**: Pending, In Progress, or Completed
   - **Progress**: 0-100%
4. **Option**: Need a new category? Click **New** next to category dropdown
5. Click **Add Promise**
✅ Promise appears in table, dashboard updates

### Updating a Promise

1. In **Manage Promises** table, find the promise
2. Click **✎** (edit icon) in the Actions column
3. Make changes
4. Click **Update Promise**
✅ Changes reflected across dashboard

### Deleting a Promise

1. In **Manage Promises** table, find the promise
2. Click **🗑** (delete icon) in the Actions column
3. Confirm deletion
✅ Promise removed from system

### Changing Promise Status

1. In **Manage Promises** table, find promise
2. Click status dropdown (Pending/In Progress/Completed)
3. Select new status
✅ Updates immediately, dashboard stats recalculate

### Updating Promise Progress

1. In **Manage Promises** table, find promise
2. Enter new percentage (0-100) in Progress field
✅ Updates immediately

---

## 📊 Dashboard Metrics

| Metric | Shows |
|--------|-------|
| **Total Promises** | How many promises exist |
| **Completed** | How many are finished |
| **In Progress** | How many are being worked on |
| **Pending** | How many haven't started |
| **Total Categories** | How many categories exist |
| **Completion %** | Overall progress bar |

---

## 🎯 Pro Tips

1. **Inline Category Creation**: While adding a promise, need a new category? Click "New" next to the dropdown
2. **Search Promises**: Use the search bar in Manage Promises to quickly find promises
3. **Category Stats**: Hover over delete icon to see if category has promises
4. **Keyboard**: Use Tab to navigate forms, Enter to submit
5. **Preview**: See how your category looks before saving
6. **Bulk Updates**: Update status and progress directly in the table

---

## ⚠️ Important Rules

- ❌ **Cannot delete category**: If it has promises
- ❌ **Cannot delete promise**: If it's the only one (but you can)
- ✅ **Category names**: Max 100 characters
- ✅ **Promise titles**: Max 200 characters
- ✅ **Descriptions**: Max 500 characters
- ✅ **Progress**: Must be 0-100

---

## 🔍 If Something Goes Wrong

### Category not appearing in dropdown
- **Solution**: Refresh page, then try again

### Cannot delete category
- **Solution**: Delete all promises in that category first

### Promise not updating
- **Solution**: Check backend is running (`npm run dev:backend`)

### Lost unsaved changes
- **Solution**: Forms save when you click submit button

### Dropdown shows old categories
- **Solution**: Clear browser cache or use Incognito mode

---

## 📱 Mobile Support

The admin panel is responsive but works best on:
- Desktop: Full-featured
- Tablet: Good experience
- Mobile: Basic functionality (tables may scroll)

---

## 🔐 Admin Permissions

As an admin, you can:
✅ Create/edit/delete categories  
✅ Create/edit/delete promises  
✅ View all statistics  
✅ Manage other users' roles  

---

## 💾 Data Safety

- ✅ Categories backed up to browser localStorage
- ✅ Promises stored in the database
- ✅ All changes are permanent when saved
- ⚠️ Deleted items cannot be recovered
- ⚠️ No automatic backups (admin responsibility)

---

## 🎨 Category Customization

### Available Icons
Gavel, Globe, TrendingUp, Wheat, Briefcase, HardHat, Zap, GraduationCap, Stethoscope, Mountain, Activity, Users

### Available Colors
Blue, Indigo, Green, Amber, Orange, Slate, Yellow, Cyan, Red, Emerald, Pink, Purple

---

## 📞 Need Help?

- Check browser console for error messages (F12)
- Make sure backend server is running
- Verify you're logged in as admin
- Read [ADMIN_IMPLEMENTATION_GUIDE.md](ADMIN_IMPLEMENTATION_GUIDE.md) for detailed docs

---

## ⏱️ Typical Workflows

### Daily Check-In (2 min)
1. Go to `/admin`
2. Review stats
3. Check recent activities

### Weekly Update (5-10 min)
1. Go to Manage Promises
2. Update statuses and progress
3. Add new promises if needed
4. Review dashboard

### Monthly Maintenance (15-30 min)
1. Review all promises status
2. Update completion percentages
3. Add new categories if needed
4. Export stats for reporting

---

**TL;DR**: Manage categories & promises easily. All changes sync instantly. Categories persist locally, promises on server.

Happy administrating! 🎉
