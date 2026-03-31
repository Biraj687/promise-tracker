# DEPLOYMENT CHECKLIST - QUICK REFERENCE

## Pre-Deployment (Complete These First)

### Phase 1: Supabase Database Setup (30 min)
- [ ] **CRITICAL:** Run `SUPABASE_SETUP.sql` in Supabase SQL Editor
  ```
  1. Go to Dashboard → SQL Editor
  2. Click "New Query"
  3. Copy entire SUPABASE_SETUP.sql file
  4. Paste and click "RUN"
  5. Wait for "Query executed successfully"
  ```

- [ ] Verify RLS enabled:
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables 
  WHERE tablename IN ('profiles', 'categories', 'promises');
  -- All should show TRUE
  ```

### Phase 2: Create Admin User (5 min)
- [ ] Go to Supabase Dashboard → Authentication → Users
- [ ] Click "Create new user"
- [ ] Email: `admin@gov.np`
- [ ] Password: (set strong password)
- [ ] Click "Create user"

### Phase 3: Configure Auth (5 min)
- [ ] Go to Authentication → Providers → Email
- [ ] Uncheck "Enable email signup" (if admin-only system)
- [ ] Click "Save"

---

## Deployment (After Prerequisites Done)

### Deploy to Vercel
```bash
# 1. Build
npm run build

# 2. Deploy
vercel deploy --prod
```

### Deploy to Netlify
```bash
# 1. Build
npm run build

# 2. Deploy
netlify deploy --prod --dir=dist
```

---

## Post-Deployment Verification (15 min)

### Test 1: Admin Login
```
✅ Go to production URL
✅ Click "Admin Login"
✅ Enter admin@gov.np and password
✅ Should redirect to /admin dashboard
✅ Should show "Role: admin" in header
```

### Test 2: Non-Admin Block
```
✅ Create test user in Supabase (email: test@example.com)
✅ Login with test user
✅ Try visiting /admin directly
✅ Should see "Access Denied" message
```

### Test 3: Admin CRUD
```
✅ As admin, create a category
✅ As admin, edit a promise
✅ Refresh page - changes should persist
```

### Test 4: RLS Protection
```
✅ As non-admin, check browser console for errors
✅ Try creating a promise (403 error expected)
✅ Database RLS should block it
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Login shows "Session check failed" | RLS policy missing → re-run SQL |
| Admin sees "Access Denied" | Profile not created → run SQL INSERT |
| Categories are empty | Not populated → run categories INSERT from SQL |
| 403 errors for admins creating data | RLS policies wrong → check policies exist |

---

## Rollback (If Needed)

### Quick Rollback
```bash
git revert HEAD
git push origin main
# Frontend reverts to previous version
```

### Database Rollback
1. Supabase Dashboard → Settings → Database
2. Click "Restore"
3. Select snapshot before migration
4. Click "Restore"

---

## Security Verification

**Before going live, verify:**

- [ ] SUPABASE_SETUP.sql executed successfully
- [ ] RLS enabled on all three tables
- [ ] Admin user created
- [ ] Signup disabled (if admin-only)
- [ ] AuthContext fetches role (check code)
- [ ] ProtectedAdminRoute checks role (check code)
- [ ] No backend auth files imported
- [ ] VITE_SUPABASE_ANON_KEY is set (not service_role_key)
- [ ] Login page shows errors properly
- [ ] Logout works correctly

---

## Key Files to Check

```
✅ SUPABASE_SETUP.sql           (Run this - CRITICAL)
✅ src/context/AuthContext.jsx  (Fetches role)
✅ src/components/ProtectedAdminRoute.jsx (Checks role)
✅ src/context/DataContext.jsx  (Supabase categories)
✅ SECURITY_IMPLEMENTATION_GUIDE.md (Full instructions)
✅ MIGRATION_GUIDE.md           (Step-by-step)
```

---

## Environment Variables Required

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Where to find:**
- Supabase Dashboard → Settings → API
- Copy Project URL
- Copy Anon (public) key

---

## Support Contacts

- **Supabase Issues:** https://supabase.com/docs
- **Code Issues:** Check SECURITY_IMPLEMENTATION_GUIDE.md
- **Setup Help:** See MIGRATION_GUIDE.md

---

## Post-Deployment Monitoring

### Check These Daily (First Week)
- [ ] No 500 errors in production
- [ ] Users can login successfully
- [ ] Admin dashboard loads
- [ ] Supabase logs show no errors
- [ ] Database performance normal

### Setup Monitoring
1. Supabase Dashboard → Logs
2. Check Postgres logs for errors
3. Check Auth logs for failed logins
4. Set up alerts if needed

---

## Deployment Sign-Off

- [ ] Database migrated (SUPABASE_SETUP.sql)
- [ ] Admin user created
- [ ] Auth configured
- [ ] Frontend deployed
- [ ] All tests passing
- [ ] No 500 errors
- [ ] Admin can login
- [ ] Non-admin blocked
- [ ] Data persists after refresh
- [ ] Production URL verified

**Deployed by:** _______________
**Date:** _______________
**Status:** ✅ Ready for Production

---

## Emergency Contacts

If system goes down:
1. Check Supabase Dashboard status
2. Review error logs in: Supabase → Logs
3. Verify network connectivity
4. Try clearing browser cache
5. Review recent code changes

---

**Version:** 1.0
**Last Updated:** 2026-03-31
**Confidence Level:** High ✅
