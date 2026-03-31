# SECURITY IMPLEMENTATION GUIDE

## Overview
This document outlines the production-ready security refactoring applied to Promise Tracker. All changes implement proper RBAC, RLS, and single-source authentication via Supabase.

---

## PART 1: SUPABASE SETUP (CRITICAL - DO THIS FIRST)

### Step 1: Run SQL Schema Migration

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Left sidebar → SQL Editor
   - Click "New Query"

3. **Execute SUPABASE_SETUP.sql**
   - Copy entire contents from `SUPABASE_SETUP.sql`
   - Paste into SQL Editor
   - Click "RUN" button
   - Wait for completion

**What this creates:**
- `profiles` table (user roles)
- `categories` table (from Supabase, not localStorage)
- Row-Level Security (RLS) policies on `promises`, `profiles`, `categories`
- Auto-trigger to create profile on user signup

### Step 2: Verify RLS is Enabled

Run this query in SQL Editor to verify:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'categories', 'promises')
ORDER BY tablename;
```

**Expected output:**
```
tablename   | rowsecurity
---------   | -----------
categories  | t (TRUE)
profiles    | t (TRUE)
promises    | t (TRUE)
```

All three must show `t` (TRUE).

---

## PART 2: SUPABASE AUTH CONFIGURATION

### Disable Public Signup (if this is admin-only)

1. **Go to Supabase Dashboard → Authentication**
2. **Click "Providers"** → "Email"
3. **Under "Email Auth":**
   - Enable: ✅ "Enable email signup"
   - OR disable and use invite-only: ❌ "Enable email signup"
4. **Click "Save"**

**Option A (Recommended for Admin-Only):**
- Disable signup entirely
- Create admin users manually via **Users** tab in Supabase dashboard
- Admins invite other users via your frontend (if needed)

**Option B (If you allow user roles):**
- Keep signup enabled
- All new signups default to `role: 'user'`
- Admins must manually upgrade users to `role: 'admin'` in `profiles` table

---

## PART 3: SEED ADMIN USER

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to **Authentication → Users**
2. Click **"Create new user"**
3. Enter:
   - Email: `admin@gov.np`
   - Password: (strong password)
   - Mark as admin (checkbox - if available)
4. Click **"Create user"**

### Option 2: Via SQL (After Running SUPABASE_SETUP.sql)

The auto-trigger will create a profile automatically when a user signs up. Just ensure the profile has:

```sql
-- Run this to ensure admin exists
INSERT INTO profiles (id, email, role) 
SELECT id, email, 'admin' 
FROM auth.users 
WHERE email = 'admin@gov.np' 
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';
```

---

## PART 4: CODE CHANGES (Already Applied)

### ✅ AuthContext.jsx
- Now fetches `role` from `profiles` table
- Stores `user.role` in context
- Provides `isAdmin` computed property
- Enhanced error handling with `error` state

### ✅ ProtectedAdminRoute.jsx
- **NOW REQUIRES** `user.role === 'admin'`
- Blocks access for non-admin users with message
- Previously: ANY logged-in user = admin ❌ (FIXED)

### ✅ DataContext.jsx
- **Categories now stored in Supabase**, not localStorage
- Removed localStorage dependency
- Added pagination support (PROMISES_PAGE_SIZE = 100)
- Enhanced error messages

### ✅ Supabase Queries
- **All INSERT/UPDATE/DELETE automatically blocked for non-admins** (via RLS policies)
- Frontend can't bypass → RLS enforces at database level
- All SELECT queries work for authenticated users

### ✅ AdminLayout.jsx
- Displays actual `user.role` in header
- Enhanced logout with error handling
- Shows "Role: admin/user" tag

### ✅ Login.jsx
- Better error messages
- UI disabled during loading
- Validation before submit

---

## PART 5: SECURITY ARCHITECTURE

### Authentication Flow (Backend-Protected)

```
User submits email/password
        ↓
Supabase.auth.signInWithPassword()
        ↓
Supabase validates credentials (backend)
        ↓
Returns JWT token (stored internally by Supabase SDK)
        ↓
Frontend calls supabase.from('profiles').select('role')
        ↓
RLS checks auth.uid() matches && fetches role
        ↓
AuthContext stores user { id, email, role }
        ↓
ProtectedAdminRoute checks isAdmin === true
        ↓
If TRUE → allow admin access
If FALSE → redirect to unauthorized page
```

### Data Access (RLS-Protected)

**Public Users (not logged in):**
- Can READ promises only (public SELECT)
- Cannot INSERT/UPDATE/DELETE

**Authenticated Non-Admins:**
- Can READ promises, categories
- Cannot INSERT/UPDATE/DELETE

**Authenticated Admins:**
- Can SELECT, INSERT, UPDATE, DELETE everything
- Verified by RLS policies checking `profiles.role = 'admin'`

### Row-Level Security Policies (Database Enforced)

All promises INSERT/UPDATE/DELETE operations:
```sql
-- Only allowed if:
auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
)
```

This means:
- Even if frontend sends data, database rejects it if user is not admin
- No way to bypass with API calls or direct SQL
- Frontend can't manipulate admin-only operations

---

## PART 6: FRONTEND DEPLOYMENT

### Before Deploying

1. **Verify `.env` has NO backend URLs**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Confirm backend auth files are DISABLED** (not imported):
   - `server/routes/authRoute.js` - NOT used
   - `server/middleware/authMiddleware.js` - NOT used
   - `server/db/database.js` - NOT used

3. **Test login flow locally:**
   ```bash
   npm run dev:frontend
   # Try login with admin@gov.np
   # Should see "Role: admin" if successful
   ```

4. **Build for production:**
   ```bash
   npm run build
   # Deploy /dist folder to Vercel/Netlify
   ```

---

## PART 7: SECURITY CHECKLIST

- [ ] Supabase SQL schema executed (SUPABASE_SETUP.sql)
- [ ] RLS enabled on all three tables (verified via query)
- [ ] Signup disabled or restricted in Auth settings
- [ ] Admin user created with strong password
- [ ] AuthContext.jsx fetches role from profiles table
- [ ] ProtectedAdminRoute checks `user.role === 'admin'`
- [ ] Categories now stored in Supabase (not localStorage)
- [ ] All Supabase queries include error handling
- [ ] No backend Express API being called from frontend
- [ ] VITE_SUPABASE_ANON_KEY is only public key (not service role)
- [ ] Login page shows error messages
- [ ] Admin can logout successfully
- [ ] Non-admin users blocked from /admin routes

---

## PART 8: TESTING SECURITY

### Test Admin Access
1. Login as `admin@gov.np` (password you set)
2. Should see `/admin` dashboard
3. Should see "Role: admin" in header

### Test Non-Admin Block
1. Create new user via Supabase → Users → Create
2. Email: `user@test.com`
3. Password: any
4. Signup will auto-create profile with `role: 'user'` (via trigger)
5. Login with that user
6. Try visiting `/admin` → should see "Access Denied" message

### Test RLS Data Protection
1. As non-admin, open browser DevTools → Network tab
2. Try to create a promise (if modal appears)
3. Frontend sends INSERT request
4. Supabase RLS blocks it → error response
5. You'll see error message in UI

### Test Categories Persistence
1. Login as admin
2. Create a category
3. Refresh page
4. Category should still appear (stored in database, not lost)

---

## PART 9: TROUBLESHOOTING

### Issue: "Access Denied" when logging in as admin

**Cause:** Profile not created or role not set to 'admin'

**Fix:**
```sql
-- Check if profile exists
SELECT * FROM profiles WHERE email = 'admin@gov.np';

-- If not exists, manually create
INSERT INTO profiles (id, email, role) VALUES 
('{USER_ID}', 'admin@gov.np', 'admin');

-- Find USER_ID from:
SELECT id FROM auth.users WHERE email = 'admin@gov.np';
```

### Issue: Categories empty after login

**Cause:** Categories table not populated

**Fix:**
```sql
-- Verify categories exist
SELECT COUNT(*) FROM categories;

-- If 0, re-run the INSERT part of SUPABASE_SETUP.sql
INSERT INTO categories (name, icon, color) VALUES
  ('साझा प्रतिबद्धता, समन्वय र जनविश्वास', 'Gavel', 'bg-blue-100 text-blue-800'),
  -- ... (all other categories)
```

### Issue: 403 Errors when trying to update promises

**Cause:** RLS blocking non-admin writes

**Expected Behavior:** This is correct! Only admins should write.

**To Fix:**
```sql
-- Verify RLS policies exist
SELECT * FROM pg_policies WHERE tablename = 'promises';

-- Should see policies for SELECT, INSERT, UPDATE, DELETE
```

### Issue: Login always showing "Failed to fetch profile"

**Cause:** Supabase ANON_KEY doesn't have permission to read profiles

**Fix:** Check Supabase RLS policy:
```sql
-- This policy should exist:
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- And this for admins:
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
```

---

## PART 10: PERFORMANCE NOTES

### Pagination
- Promises fetch uses `.range(0, 99)` → limits to 100 records
- For larger datasets, implement "Load More" button in UI
- Update `PROMISES_PAGE_SIZE` in DataContext.jsx if needed

### RLS Performance
- RLS adds ~10-50ms per query (subquery to check role)
- Acceptable for most apps
- Alternative: Use Supabase `auth.jwt()` with custom claims (advanced)

### Caching
- Supabase SDK caches auth session automatically
- Every user action doesn't require re-authentication
- Token refreshes happen transparently

---

## PART 11: FUTURE IMPROVEMENTS

1. **Multi-role System:**
   - Add more roles: 'editor', 'viewer', 'moderator'
   - Update RLS policies to handle multiple roles

2. **Audit Logging:**
   - Log all INSERT/UPDATE/DELETE operations
   - Create `audit_logs` table with before/after values

3. **Two-Factor Authentication:**
   - Enable in Supabase → Authentication → Multi-Factor Auth

4. **Rate Limiting:**
   - Add API rate limiting on Supabase (Enterprise feature)

5. **Backup Strategy:**
   - Enable database backups in Supabase settings
   - Daily snapshots recommended

---

## PART 12: REMOVING DEAD BACKEND CODE

The following files are **NOT USED** and can be deleted or archived:

```
server/routes/authRoute.js         ← NOT USED (Supabase handles auth)
server/middleware/authMiddleware.js ← NOT USED (RLS handles auth)
server/db/database.js               ← NOT USED (Supabase is database)
src/api/axios.js                    ← NOT USED (use Supabase client only)
```

**Recommendation:** Don't delete yet. Comment them out or keep in git history in case rollback needed.

---

## Summary of Changes

| Component | Before | After |
|-----------|--------|-------|
| **Auth** | Email/password | ✅ Supabase Auth |
| **User Roles** | None (all users = admin) | ✅ profiles table with role |
| **Authorization** | Frontend check only | ✅ RLS policies enforce at DB |
| **Categories** | localStorage (lost on clear) | ✅ Supabase table (persistent) |
| **Data Protection** | No row-level security | ✅ RLS for all tables |
| **Admin Block** | No real protection | ✅ Frontend + Database protection |
| **Error Handling** | Minimal | ✅ Comprehensive error states |

---

**Production-Ready:** ✅ This system is now suitable for production deployment.

**Key Principle:** Security is enforced at the database level (RLS), not just frontend. Frontend can lie or be hacked, but Supabase database policies cannot be bypassed.
