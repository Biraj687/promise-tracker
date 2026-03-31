# MIGRATION GUIDE: From Insecure to Production-Ready

## Executive Summary

This guide helps you migrate from the insecure architecture to the new production-ready system. **All user-facing improvements are applied automatically—no frontend code changes required for basic functionality.**

---

## Timeline: 2-3 hours for complete setup

---

## PHASE 1: Database Preparation (30 minutes)

### 1.1 - Run SQL Migration

**File:** `SUPABASE_SETUP.sql`

Steps:
1. Log in to https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy entire `SUPABASE_SETUP.sql` file
5. Paste and click **RUN**
6. Wait for "Query executed successfully"

**What happens:**
- ✅ `profiles` table created
- ✅ `categories` table created
- ✅ RLS policies created
- ✅ Default categories inserted
- ✅ Auto-trigger for user signup

**Expected duration:** 10-15 seconds

### 1.2 - Verify RLS

Run in SQL Editor:
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('profiles', 'categories', 'promises')
ORDER BY tablename;
```

**Expected result:** All three show `TRUE` for `rowsecurity`

---

## PHASE 2: Auth Configuration (15 minutes)

### 2.1 - Disable Public Signup (If Admin-Only)

1. Go to **Authentication** → **Providers** → **Email**
2. Uncheck **"Enable email signup"**
3. Click **"Save"**

**Result:** Only admin can add new users manually

### 2.2 - Create Admin User

Option A (GUI - Easiest):
1. Go to **Authentication** → **Users**
2. Click **"Create new user"**
3. Email: `admin@gov.np`
4. Password: (set a strong one)
5. Click **"Create user"**

Option B (SQL):
```sql
-- Get the user ID first
SELECT id FROM auth.users WHERE email = 'admin@gov.np';

-- Then set admin role
INSERT INTO profiles (id, email, role) 
VALUES ('{USER_ID}', 'admin@gov.np', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## PHASE 3: Code Deployment (1-2 hours)

### 3.1 - Pull Latest Code Changes

All frontend files are already updated with:
- ✅ Updated `AuthContext.jsx` (role fetching)
- ✅ Fixed `ProtectedAdminRoute.jsx` (role checking)
- ✅ Refactored `DataContext.jsx` (Supabase categories)
- ✅ Improved `Login.jsx` (error handling)
- ✅ Enhanced `AdminLayout.jsx` (role display)

**No manual code changes needed.** If you're using git:

```bash
git pull origin main
npm install
```

### 3.2 - Environment Variables

Verify `.env` or Vercel settings have:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

**Where to find:**
1. Supabase Dashboard → Settings → API
2. Copy Project URL
3. Copy Anon (public) key - NOT service_role key

### 3.3 - Test Locally

```bash
npm run dev
```

1. Go to http://localhost:5173/login
2. Enter admin@gov.np and password
3. Should redirect to /admin
4. Should see "Role: admin" in header
5. Try accessing admin features

### 3.4 - Deploy to Production

**Via Vercel (Recommended):**
```bash
npm run build
vercel deploy --prod
```

**Via Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## PHASE 4: Post-Deployment Verification (15 minutes)

### 4.1 - Test Admin Loop

1. Go to production URL
2. Click "Admin Login"
3. Enter admin@gov.np credentials
4. Should load admin dashboard

### 4.2 - Test Non-Admin Block

1. Create test user: `user@test.com`
2. Login with test user
3. Try accessing `/admin` directly in URL
4. Should see "Access Denied" page

### 4.3 - Test Data Operations

As admin:
1. Try creating a category → should work
2. Try updating a promise → should work
3. Try deleting a category with promises → should get error message

As non-admin:
1. Try creating a category → backend RLS blocks it (403)

---

## PHASE 5: Clean Up (Optional)

### 5.1 - Remove Unused Backend Files

These are no longer needed:

```bash
# Can be deleted or archived:
rm server/routes/authRoute.js
rm server/middleware/authMiddleware.js
rm server/db/database.js

# If you want to keep for reference:
git mv server/routes/authRoute.js server/DEPRECATED/authRoute.js
git mv server/middleware/authMiddleware.js server/DEPRECATED/authMiddleware.js
git mv server/db/database.js server/DEPRECATED/database.js
```

### 5.2 - Update .gitignore

Ensure you're NOT version-controlling:
```
.env
.env.local
*.db
```

---

## ROLLBACK PLAN (If Something Goes Wrong)

### To Rollback Authentication

If users can't login:

1. **Stop deployment** - disable the frontend
2. **Check Supabase SQL** - Run this to verify profiles table:
   ```sql
   SELECT * FROM profiles LIMIT 5;
   ```
3. **Check auth session** - Run this:
   ```sql
   SELECT * FROM auth.users WHERE email = 'admin@gov.np';
   ```
4. **Restore previous version** from git:
   ```bash
   git revert HEAD
   git push origin main
   ```

### To Rollback Database

If SQL migration failed:

1. **Go to Supabase** → **Settings** → **Database** → **Restore**
2. Select snapshot before migration
3. Click "Restore"
4. Re-run SUPABASE_SETUP.sql

---

## COMMON ISSUES & FIXES

### Issue: Login fails with "Session check failed"

**Cause:** RLS policy not created correctly

**Fix:**
```sql
-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- If missing, re-run SUPABASE_SETUP.sql
```

### Issue: "Access Denied" for admin

**Cause:** Admin profile not created

**Fix:**
```sql
-- Find user ID
SELECT id FROM auth.users WHERE email = 'admin@gov.np';

-- Create profile with admin role
INSERT INTO profiles (id, email, role) 
VALUES ('{ID}', 'admin@gov.np', 'admin');
```

### Issue: Categories empty

**Cause:** Table not populated

**Fix:**
```sql
SELECT COUNT(*) FROM categories;

-- If 0, run INSERT statements from SUPABASE_SETUP.sql
```

### Issue: Frontend still shows login after clicking "Log In"

**Cause:** Authentication working but profile fetch failing

**Fix:**
```sql
-- Check RLS policy for profile reading
SELECT * FROM pg_policies 
WHERE tablename = 'profiles' AND policyname LIKE '%view%';

-- Should have policies for both self-access and admin-access
```

---

## VERIFICATION CHECKLIST

Before declaring migration complete:

- [ ] SQL schema executed without errors
- [ ] RLS policies enabled (verified via query)
- [ ] Admin user created
- [ ] Frontend env variables set correctly
- [ ] Admin can login successfully
- [ ] Admin can see dashboard
- [ ] Admin can CRUD categories/promises
- [ ] Non-admin blocked from /admin
- [ ] No 500 errors in browser console
- [ ] Categories persist after page refresh
- [ ] Logout works correctly
- [ ] Production deployment successful

---

## PERFORMANCE IMPROVEMENTS

| Metric | Before | After |
|--------|--------|-------|
| **Auth Check** | 100ms | ✅ 50-100ms (with role fetch) |
| **Category Load** | localStorage instant (app-specific) | ✅ 50-200ms (consistent across devices) |
| **Security Check** | Frontend only (bypassed) | ✅ Browser + Database double-check |
| **Data Consistency** | Lost on device clear | ✅ Always available from database |

---

## NEXT STEPS (Post-Migration)

### Immediate (Week 1)
- [ ] Monitor error logs in Supabase
- [ ] Confirm all admin functions working
- [ ] Test with different roles

### Short-term (Month 1)
- [ ] Add audit logging table
- [ ] Implement 2FA if needed
- [ ] Set up daily database backups

### Long-term (Ongoing)
- [ ] Review and update RLS policies quarterly
- [ ] Monitor performance metrics
- [ ] Plan for new features (notifications, integrations)

---

## Support

### If You're Stuck

1. Check `SECURITY_IMPLEMENTATION_GUIDE.md` for detailed setup
2. Review error messages in browser DevTools → Console
3. Check Supabase logs: Dashboard → Logs → Postgres
4. Refer to [Supabase Docs](https://supabase.com/docs)

### File Structure Reference

```
promise-tracker/
├── SUPABASE_SETUP.sql                 ← Run this in SQL Editor
├── SECURITY_IMPLEMENTATION_GUIDE.md   ← Full setup guide
├── MIGRATION_GUIDE.md                 ← You are here
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx            ← ✅ Updated (role fetching)
│   │   └── DataContext.jsx            ← ✅ Updated (Supabase categories)
│   ├── pages/
│   │   └── Login.jsx                  ← ✅ Updated (better errors)
│   └── components/
│       ├── ProtectedAdminRoute.jsx    ← ✅ Updated (role checking)
│       └── admin/
│           └── AdminLayout.jsx        ← ✅ Updated (role display)
└── server/
    ├── routes/authRoute.js            ← ❌ DEPRECATED (not used)
    ├── middleware/authMiddleware.js   ← ❌ DEPRECATED (not used)
    └── db/database.js                 ← ❌ DEPRECATED (not used)
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-31
**Status:** Production-Ready
