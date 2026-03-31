-- ============================================================================
-- PROMISE TRACKER: FIX EXISTING SCHEMA (Add missing columns)
-- ============================================================================
-- Run this if you got "column icon does not exist" error
-- This adds missing columns to existing tables
-- ============================================================================

-- 1. ADD MISSING COLUMNS TO CATEGORIES TABLE
-- ============================================================================

-- Add icon column if it doesn't exist
ALTER TABLE categories ADD COLUMN icon TEXT DEFAULT 'Layers';

-- Add color column if it doesn't exist  
ALTER TABLE categories ADD COLUMN color TEXT DEFAULT 'bg-primary/10 text-primary';

-- Add created_by column if it doesn't exist
ALTER TABLE categories ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add created_at column if it doesn't exist
ALTER TABLE categories ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add updated_at column if it doesn't exist
ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- 2. ENSURE RLS IS ENABLED
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. DROP OLD POLICIES AND CREATE NEW ONES
-- ============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public categories are viewable" ON categories;
DROP POLICY IF EXISTS "Only admins can create categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

-- Create fresh policies
CREATE POLICY "Public categories are viewable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create categories"
  ON categories FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- 4. VERIFY TABLE STRUCTURE
-- ============================================================================

-- Run this to check the table has all columns:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'categories' ORDER BY ordinal_position;

-- Expected columns:
-- id (bigint)
-- name (text)
-- icon (text)
-- color (text)
-- created_by (uuid)
-- created_at (timestamp with time zone)
-- updated_at (timestamp with time zone)
