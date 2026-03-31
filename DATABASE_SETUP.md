# Database Setup Guide 🗄️

The error "column categories.icon does not exist" means your Supabase database doesn't have the proper schema set up.

## CRITICAL: Run Database Setup SQL 🚨

Your Supabase project is missing tables. You MUST run the SQL setup in your Supabase dashboard.

### Step 1: Go to Supabase SQL Editor

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **Promise Tracker** (or your project name)
3. Click **Editor** → **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Copy SQL Setup Code

Open this file in VS Code:
**`SUPABASE_SETUP.sql`**

Copy **ALL** the SQL code from that file.

### Step 3: Paste into Supabase

1. In Supabase SQL Editor, **paste all the SQL code**
2. Click **Run** button (blue button at bottom right)
3. **Wait for it to complete** (should say "Success" or show execution time)

### Step 4: Verify Tables Were Created

Run this verification query in SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**You should see 3 tables:**
- categories ✅
- promises ✅  
- profiles ✅

If you see 0 rows, the SQL didn't run properly. Try again.

---

## Admin-Only Setup (Required) 🔐

After creating tables, you MUST apply admin-only policies to lock down the database.

### Step 5: Apply Admin-Only Policies

1. In Supabase SQL Editor, click **New Query**
2. Open this file: **`SUPABASE_ADMIN_ONLY_POLICIES.sql`**
3. Copy **ALL** the SQL code
4. Paste into SQL Editor
5. Click **Run**

This creates strict RLS policies that:
- ✅ Only admins can read/write data
- ✅ Blocks all public access
- ✅ Disables new user signups

---

## Create First Admin User 👤

After tables and policies exist, create your admin user.

### Step 6: Create Admin Profile in Database

1. In Supabase, go to **Authentication** → **Users**
2. Find your user: `goldenmud@gmail.com`
3. **Copy the User ID** (long string like `326b4f02-d68f-4405-a75a-6e7caeb22925`)
4. In SQL Editor, create **New Query**
5. Run this command (replace USER_ID):

```sql
INSERT INTO profiles (id, email, role)
VALUES ('USER_ID_HERE', 'goldenmud@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

**Example with real ID:**
```sql
INSERT INTO profiles (id, email, role)
VALUES ('326b4f02-d68f-4405-a75a-6e7caeb22925', 'goldenmud@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Press **Run**

### Step 7: Verify Admin User Created

Run this query:

```sql
SELECT id, email, role FROM profiles;
```

**You should see:**
```
id                                   | email               | role
-------------------------------------|---------------------|------
326b4f02-d68f... (your user id)     | goldenmud@gmail.com | admin
```

If nothing shows, the insert failed. Try the query again with correct User ID.

---

## Now Try Login 🔑

1. **Refresh your browser** (Ctrl+R)
2. Try logging in with:
   - Email: `goldenmud@gmail.com`
   - Password: (your Supabase password)
3. **Watch the browser console** (F12 → Console)
4. You should see: ✅ Admin user validated

If still having issues, check [LOGIN_DIAGNOSTIC.md](LOGIN_DIAGNOSTIC.md) for more troubleshooting.

---

## Summary of What We're Doing 📋

| Step | Action | File |
|------|--------|------|
| 1-4 | Create database tables | `SUPABASE_SETUP.sql` |
| 5 | Apply security policies | `SUPABASE_ADMIN_ONLY_POLICIES.sql` |
| 6-7 | Create admin user profile | SQL query in dashboard |
| 8 | Test login | Browser console |

---

## Troubleshooting 🆘

### Error: "Failed to load resource: status 400"
**Cause:** Table doesn't exist or SQL wasn't run
**Fix:** Go back to Step 1-4, make sure SQL runs successfully

### Error: "column categories.icon does not exist"
**Cause:** Tables exist but don't have all columns (incomplete SQL)
**Fix:** Delete the broken table and re-run complete SUPABASE_SETUP.sql:
```sql
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS promises CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
-- Then run SUPABASE_SETUP.sql again
```

### Error: "Access denied. You do not have admin privileges"
**Cause:** Profile exists but role is not 'admin'
**Fix:** Run this in SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'goldenmud@gmail.com';
```

### Still stuck?
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try logging in
4. Share the error messages here

---

## Next Steps After Login ✅

Once you successfully log in:
1. Admin Dashboard should open
2. You can create categories
3. You can create promises
4. You can upload images
5. Everything is stored in Supabase ✅

