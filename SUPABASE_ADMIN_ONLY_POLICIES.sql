-- ============================================================================
-- ADMIN-ONLY: STRICT SUPABASE RLS POLICIES
-- ============================================================================
-- Run this to convert from multi-user to admin-only system
-- This REMOVES all public access and locks database to admins only
-- ============================================================================

-- ============================================================================
-- PART 1: DROP OLD POLICIES (Public Access Removal)
-- ============================================================================

-- Drop public promises read access
DROP POLICY IF EXISTS "Public promises are viewable" ON promises;

-- Drop public categories read access
DROP POLICY IF EXISTS "Public categories are viewable" ON categories;

-- Drop optional user view policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- ============================================================================
-- PART 2: CREATE STRICT ADMIN-ONLY PROFILES POLICIES
-- ============================================================================

-- Policy: Only admins can view any profile (including their own)
CREATE POLICY "Admin only: view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can update profiles
CREATE POLICY "Admin only: update profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Admins cannot insert new users (prevent signup bypass)
DROP POLICY IF EXISTS "Allow signup" ON profiles;

-- ============================================================================
-- PART 3: CREATE STRICT ADMIN-ONLY PROMISES POLICIES
-- ============================================================================

-- Policy: Only admins can SELECT promises
DROP POLICY IF EXISTS "Only admins can create promises" ON promises;
DROP POLICY IF EXISTS "Only admins can update promises" ON promises;
DROP POLICY IF EXISTS "Only admins can delete promises" ON promises;

CREATE POLICY "Admin only: select promises"
  ON promises FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin only: insert promises"
  ON promises FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin only: update promises"
  ON promises FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin only: delete promises"
  ON promises FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- PART 4: CREATE STRICT ADMIN-ONLY CATEGORIES POLICIES
-- ============================================================================

-- Remove old permissive policies
DROP POLICY IF EXISTS "Public categories are viewable" ON categories;
DROP POLICY IF EXISTS "Only admins can create categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

-- Create strict admin-only policies
CREATE POLICY "Admin only: select categories"
  ON categories FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin only: insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin only: update categories"
  ON categories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin only: delete categories"
  ON categories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- PART 5: VERIFY RLS IS ENABLED
-- ============================================================================

-- Run this to verify:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE tablename IN ('profiles', 'categories', 'promises')
-- ORDER BY tablename;
-- All should return TRUE

-- ============================================================================
-- PART 6: OPTIONAL - RESTRICT PROFILES TABLE (NO SIGNUP)
-- ============================================================================

-- Update profiles table constraint to ensure only 'admin' role exists
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check CHECK (role = 'admin');

-- This ensures future inserts MUST have role = 'admin'
-- Combined with DISABLE trigger below, prevents any user signup

-- ============================================================================
-- PART 7: DISABLE AUTO-SIGNUP TRIGGER (NO NEW USERS)
-- ============================================================================

-- Drop the trigger that auto-creates user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- This prevents new users from being created via signup
-- Only admins can manually create users in Supabase dashboard

-- ============================================================================
-- PART 8: VERIFY ALL POLICIES
-- ============================================================================

-- Run this to see all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('profiles', 'categories', 'promises')
-- ORDER BY tablename, policyname;

-- Expected result:
-- ✅ No "Public" policies
-- ✅ All policies check auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
-- ✅ No USING (true) anywhere
-- ✅ Only 'Admin only' policies exist

-- ============================================================================
-- FINAL SECURITY VERIFICATION
-- ============================================================================

-- To verify strict admin-only:
-- 1. Authenticate as NON-ADMIN user
-- 2. Try: SELECT * FROM promises;
--    Result: 0 rows OR error "new row violates row-level security policy"
-- 3. Try: INSERT INTO promises VALUES (...);
--    Result: Error "new row violates row-level security policy"

-- Only admins should be able to perform any operation

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- What this does:
-- ✅ Removes ALL public read access
-- ✅ Removes ALL user role capabilities  
-- ✅ Locks database to AUTH.UID() IN (admin profiles only)
-- ✅ Prevents signup via profiles constraint
-- ✅ Disables auto-profile creation
-- 
-- What this DOESN'T do:
-- ❌ Does NOT delete user data (preserved by RLS)
-- ❌ Does NOT restrict Supabase Auth login (still works, just locked via RLS)
-- ❌ Does NOT require code changes (RLS enforces at DB level!)
-- 
-- Migration path (if reverting):
-- - Drop admin-only policies
-- - Re-add public policies: USING (true)
-- - Re-enable signup trigger
-- - Drop role constraint (allow both 'admin' and 'user')
