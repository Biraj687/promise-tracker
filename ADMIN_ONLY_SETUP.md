# Admin-Only System Setup Guide

## 🎯 Complete Setup Instructions for Strict Admin-Only Promise Tracker

This guide walks through setting up the Promise Tracker as a **STRICT ADMIN-ONLY** system with zero public access, zero non-admin accounts, and multi-layer security enforcement at authentication, frontend, and database levels.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier sufficient)
- Git (optional, for version control)
- Basic command line familiarity

---

## 🚀 STEP 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Enter:
   - **Project Name:** `promise-tracker-admin`
   - **Database Password:** Generate strong password (save this!)
   - **Region:** Choose closest to you (e.g., `us-east-1`)
5. Click "Create new project" (wait 2-3 minutes for setup)

### 1.2 Get Credentials

Once project is ready:

1. Go to Settings → API
2. Copy and save:
   - **Project URL:** `https://xxxxx.supabase.co` (SUPABASE_URL)
   - **anon key:** `eyJ...` (SUPABASE_ANON_KEY)
3. Click "New API Gateway Token" if using custom auth (optional for basic setup)

### 1.3 Create Environment File

In project root, create `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**⚠️ Important:** Add `.env.local` to `.gitignore` (don't commit secrets!)

---

## 🗄️ STEP 2: Database Schema & Security

### 2.1 Create Initial Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy contents of [`SUPABASE_SETUP.sql`](SUPABASE_SETUP.sql)
4. Paste into SQL editor
5. Click "Run" (should execute with no errors)

**This creates:**
- ✅ `profiles` table (username, role, created_at)
- ✅ `categories` table (name, icon, color, RLS)
- ✅ `promises` table (description, status, category, RLS)
- ✅ Auto-signup trigger (creates profile on new auth user)

### 2.2 Apply Admin-Only Policies

1. In Supabase SQL Editor, click "New Query"
2. Copy contents of [`SUPABASE_ADMIN_ONLY_POLICIES.sql`](SUPABASE_ADMIN_ONLY_POLICIES.sql)
3. Paste into SQL editor
4. Click "Run" (should execute with no errors)

**This modifies:**
- ✅ Drops permissive "public read" policies (security hardening)
- ✅ Creates strict admin-only policies: `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')`
- ✅ Applies to: `profiles`, `promises`, `categories` tables (SELECT, INSERT, UPDATE, DELETE)
- ✅ Disables auto-signup trigger

⚠️ **After this step:**
- Only users with `role = 'admin'` can read/write
- Non-admin users will get RLS permission denied errors
- New signups will NOT auto-create profiles

### 2.3 Create First Admin User

**Option A: Supabase Dashboard (Easiest)**

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter:
   - **Email:** `admin@example.com`
   - **Password:** Generate strong password (save this!)
4. Click "Add user"
5. Go to **Database** → **profiles** table
6. Find the row with new user ID
7. Click "Edit" → set `role = 'admin'` → Save

**Option B: SQL (Advanced)**

```sql
-- Create auth user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@example.com', crypt('your-strong-password', gen_salt('bf')), now());

-- Get the user ID you just created
SELECT id FROM auth.users WHERE email = 'admin@example.com';

-- Create profile with admin role (replace USER_ID with actual ID)
INSERT INTO profiles (id, email, role)
VALUES ('USER_ID', 'admin@example.com', 'admin');
```

---

## 💻 STEP 3: Frontend Application Setup

### 3.1 Install Dependencies

```bash
cd c:\promise-tracker
npm install
```

### 3.2 Update Supabase Client Configuration

File: `src/supabaseClient.js` should look like:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3.3 Verify AuthContext (Already Updated for Admin-Only)

File: `src/context/AuthContext.jsx` should have:

- ✅ `fetchAndValidateAdminProfile()` function
- ✅ Explicit check: `if (profile.role !== 'admin') throw error`
- ✅ Auto-logout: `await supabase.auth.signOut()` if not admin
- ✅ Computed property: `isAuthenticated: user !== null && isAdmin`

If not present, update manually or reinstall from repository.

### 3.4 Verify ProtectedAdminRoute (Already Updated for Strict Blocking)

File: `src/components/ProtectedAdminRoute.jsx` should have:

- ✅ No `useLocation` import (removed)
- ✅ Immediate redirect for `!user`
- ✅ Aggressive denial screen for `!isAdmin`
- ✅ No loading state shows accessing user data
- ✅ Error from `useAuth()` displayed to user

---

## 🧪 STEP 4: Local Testing

### 4.1 Start Development Server

```bash
cd c:\promise-tracker
npm run dev
```

Output should show:
```
Local: http://127.0.0.1:5173/
VITE v4.x.x ready in xxx ms
```

### 4.2 Test Admin Login (Should Work)

1. Navigate to `http://127.0.0.1:5173/login`
2. Enter admin credentials:
   - **Email:** `admin@example.com`
   - **Password:** The password you set
3. Expected:
   - ✅ Login succeeds
   - ✅ Redirected to `/admin` dashboard
   - ✅ Can see categories and promises
   - ✅ Can add/edit/delete items

### 4.3 Test Non-Admin Access (Should Fail)

Create a test non-admin user:

1. In Supabase dashboard, create new auth user (e.g., `user@example.com`)
2. Do NOT set role to admin (leave it `null` or `'user'`)
3. Try to login with this account
4. Expected:
   - ✅ Login succeeds (auth system accepts it)
   - ✅ AuthContext detects non-admin role
   - ✅ Auto-logout triggers immediately
   - ✅ Redirected to login with error message
   - ✅ Cannot access admin panel

### 4.4 Test Direct URL Access (Should Fail)

1. Login with admin account
2. Navigate to `/admin`
3. ✅ Should see admin dashboard (works)
4. Logout or open private browser window
5. Try to access `/admin` directly
6. ✅ Should get "Verifying admin access..." → redirect to `/login`

---

## 🔐 STEP 5: Security Verification

### 5.1 Verify RLS Policies in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Check each table:

**profiles table:**
- ✅ SELECT policy: `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')`
- ✅ UPDATE policy: `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')`
- ✅ No `USING (true)` or public policies

**promises table:**
- ✅ SELECT, INSERT, UPDATE, DELETE all require admin role
- ✅ No public policies

**categories table:**
- ✅ SELECT, INSERT, UPDATE, DELETE all require admin role
- ✅ No public policies

### 5.2 Run SQL Verification Query

In Supabase SQL Editor:

```sql
-- Check RLS is enabled
SELECT table_name, row_security_enabled
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'promises', 'categories')
ORDER BY table_name;
```

Expected output:
```
table_name  | row_security_enabled
------------|--------------------
categories  | true
profiles    | true
promises    | true
```

### 5.3 Check No Public Policies

```sql
-- This should return NO rows (meaning no public access)
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('profiles', 'promises', 'categories')
AND policyname LIKE '%public%'
OR policyname LIKE '%read%';
```

If ANY rows returned → **ALERT**: You have public access policies! Delete them immediately.

---

## 🚀 STEP 6: Production Deployment

### 6.1 Build Frontend

```bash
npm run build
```

Output should show:
```
✓ built in xxx ms
dist/
├── index.html
├── assets/
│   ├── app.xxx.js
│   ├── app.xxx.css
│   └── ...
└── ...
```

### 6.2 Deploy to Production

**Option A: Vercel (Easiest)**

1. Push code to GitHub (recommended)
2. Go to [https://vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select GitHub repo
5. Add environment variables:
   - `VITE_SUPABASE_URL=https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJ...`
6. Click "Deploy"
7. Note the production URL

**Option B: Self-Hosted**

1. Upload `dist/` folder to your server
2. Set environment variables on server
3. Configure web server (nginx/Apache) to serve files
4. Enable HTTPS (required for Supabase Auth)

### 6.3 Post-Deployment Smoke Test

1. Navigate to production URL
2. Test admin login → works
3. Test non-admin access → blocked
4. Test `/admin` route → protected
5. Test adding new promise → works
6. Check browser console for errors

---

## 🗑️ STEP 7: Cleanup (Optional)

### Remove Unused Backend Files

These files are no longer needed:

```bash
# Express routes (replaced by Supabase)
rm server/routes/authRoute.js
rm server/middleware/authMiddleware.js
rm server/db/database.js

# HTTP client (replaced by Supabase SDK)
rm src/api/axios.js

# Static data (replaced by dynamic Supabase queries)
rm server/data/promisesList.js

# Optional: entire Express server (if not needed)
rm -rf server/
```

After cleanup, verify application still works:
```bash
npm run dev
```

---

## 📊 Architecture Verification Checklist

- [ ] Supabase project created with PostgreSQL database
- [ ] Environment variables set in `.env.local` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] `SUPABASE_SETUP.sql` executed (tables created)
- [ ] `SUPABASE_ADMIN_ONLY_POLICIES.sql` executed (RLS enforced)
- [ ] First admin user created with `role = 'admin'`
- [ ] AuthContext verifies admin role (or auto-logout)
- [ ] ProtectedAdminRoute blocks non-admin
- [ ] Admin login works locally
- [ ] Non-admin blocked locally
- [ ] RLS policies verified in Supabase
- [ ] Application built successfully (`npm run build`)
- [ ] Application deployed to production
- [ ] Production smoke test passed

---

## 🐛 Troubleshooting

### Login Fails (Wrong Credentials)
- ✅ Verify email/password match what you set in Supabase
- ✅ Check for typos in environment variables
- ✅ Verify `.env.local` is loaded (restart dev server)

### Admin Login Works But Auto-Logout
- ✅ Check user profile has `role = 'admin'` in Supabase
- ✅ Run: `SELECT id, email, role FROM profiles;` to verify
- ✅ Update role to `'admin'` if it's `null` or `'user'`

### Can't Access `/admin` (Always Redirects)
- ✅ Make sure you're logged in as admin
- ✅ Check browser console for errors
- ✅ Verify AuthContext is receiving `isAdmin = true`
- ✅ Restart dev server and try again

### RLS Errors (Permission Denied)
- ✅ Verify `SUPABASE_ADMIN_ONLY_POLICIES.sql` was executed
- ✅ Check policies exist: `SELECT * FROM pg_policies`
- ✅ Verify no `USING (true)` policies remain
- ✅ Verify user has `role = 'admin'` in profiles table

### Environment Variables Not Loading
- ✅ File should be `.env.local` (not `.env` or other names)
- ✅ Variables should start with `VITE_` (Vite requirement)
- ✅ Restart dev server after creating `.env.local`
- ✅ Verify file is in project root, not in `src/`

---

## 🔗 Related Files

- [`SUPABASE_SETUP.sql`](SUPABASE_SETUP.sql) - Initial database schema
- [`SUPABASE_ADMIN_ONLY_POLICIES.sql`](SUPABASE_ADMIN_ONLY_POLICIES.sql) - Admin-only RLS policies
- [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx) - Admin-only authentication
- [`src/components/ProtectedAdminRoute.jsx`](src/components/ProtectedAdminRoute.jsx) - Route protection
- [`ADMIN_ONLY_CLEANUP.md`](ADMIN_ONLY_CLEANUP.md) - File cleanup guide
- [`TECHNICAL_REFERENCE.md`](TECHNICAL_REFERENCE.md) - Detailed architecture reference

---

## 💡 Next Steps

After successful setup:

1. **Customize Admin UI** - Update `AdminPanel.jsx` with your branding
2. **Add More Admins** - Follow Step 2.3 to create additional admin accounts
3. **Configure Supabase Auth** - Set up email confirmation, password reset, etc.
4. **Set Up Backups** - Enable Supabase automated backups
5. **Monitor Logs** - Set up error logging via Supabase Functions or external service
6. **Scale Database** - As data grows, consider upgrade to Supabase Pro tier

---

**System is now ready for production use as a strict admin-only Promise Tracker!** ✅

