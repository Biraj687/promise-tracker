# Login Debugging Guide

When you click "Authenticate", it's hanging. Here's how to debug it:

## STEP 1: Check Browser Console Logs 🔍

1. **Open DevTools:** Press `F12` or `Ctrl+Shift+I`
2. **Go to Console tab**
3. **Try logging in**
4. **Look for colored messages:**
   - 🔑 `Attempting login for: goldenmud@gmail.com`
   - 📝 `Calling Supabase signInWithPassword...`
   - ✅ `Sign in successful, validating admin role...`
   - 📡 `Fetching profile from Supabase...`
   - ❌ Any error message starting with `❌`

**Post the console logs here** so I can see what's hanging.

---

## STEP 2: Verify RLS Policies (Likely Cause) 🔐

The profile query is probably blocked by RLS policies.

### In Supabase Dashboard:

1. Go to **Editor** → **SQL Editor**
2. Run this query:

```sql
-- Check RLS permissions for authenticated users
SELECT schemaname, tablename, policyname, permissive, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
```

**You should see policies like:**
- ✅ `Admin only: view all profiles` — This should allow admins to read
- ❌ `Users can view own profile` — This might be missing!

---

## STEP 3: Check If Admin User Exists 👤

1. In Supabase SQL Editor, run:

```sql
-- Check all profiles in database
SELECT id, email, role, created_at FROM profiles;
```

**You should see:**
```
id                                   | email                    | role  | created_at
-------------------------------------|--------------------------|-------|--------
326b4f02-d68f-4405-a75a-6e7caeb22925| goldenmud@gmail.com      | admin | 2024-...
```

**If no rows returned:** ❌ **The profile doesn't exist!**

---

## STEP 4: If Profile Missing - Create It 🆕

If the profile doesn't exist, you must create it manually:

1. Go to **Authentication** → **Users** in Supabase
2. Find the user `goldenmud@gmail.com`
3. **Copy their User ID** (looks like: `326b4f02-d68f-4405-a75a-6e7caeb22925`)
4. Go to **SQL Editor**
5. Run this command (replace USER_ID):

```sql
INSERT INTO profiles (id, email, role)
VALUES ('USER_ID_HERE', 'goldenmud@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

**Example:**
```sql
INSERT INTO profiles (id, email, role)
VALUES ('326b4f02-d68f-4405-a75a-6e7caeb22925', 'goldenmud@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

6. Click **Run**
7. **Then try logging in again**

---

## STEP 5: Verify RLS Policy for Reading Own Profile ✅

The policies might be too strict. We need a policy that lets authenticated users read their own profile.

Run this in SQL Editor:

```sql
-- Check if policy allows self-read
CREATE POLICY IF NOT EXISTS "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

This creates a policy that allows any authenticated user to read their own profile.

---

## STEP 6: Test Login Again 🧪

1. **Refresh the page** (Ctrl+R or Cmd+R)
2. Try entering credentials again
3. **Watch the browser console** for the colored logs
4. See if it goes past `Fetching profile from Supabase...`

---

## Common Issues & Fixes

| Issue | Console Message | Fix |
|-------|-----------------|-----|
| Profile doesn't exist | `No profile found` | Create profile in STEP 4 |
| RLS blocks profile read | `Profile fetch failed: new row violates row-level security policy` | Add policy from STEP 5 |
| User not admin | `Access denied. You do not have admin privileges. Role: user` | Update role to 'admin' in STEP 4 |
| Supabase timeout | `Profile query timeout` | Check Supabase status, then retry |
| Wrong user ID | Login works but access denied | Verify User ID in STEP 3 |

---

## Summary Checklist ✅

Before trying login again, verify:

- [ ] Browser console shows detailed logs (not blank)
- [ ] `SELECT * FROM profiles;` returns at least 1 row with role='admin'
- [ ] RLS policies exist for 'profiles' table
- [ ] Policy exists: `Users can view own profile` (allows auth.uid() = id)
- [ ] Policy exists: `Admin only: view all profiles` (allows admins full read)

Once all checked, **refresh and try login again**. Post the console logs if it still hangs.

