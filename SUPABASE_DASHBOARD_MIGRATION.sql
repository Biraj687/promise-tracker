-- ============================================================================
-- SUPABASE DASHBOARD MIGRATION - Run this in SQL Editor
-- ============================================================================
-- This adds missing fields for dashboard functionality

-- ============================================================================
-- 1. ALTER CATEGORIES TABLE - Add missing fields
-- ============================================================================

ALTER TABLE categories ADD COLUMN description TEXT;
ALTER TABLE categories ADD COLUMN image_url TEXT;
ALTER TABLE categories ADD COLUMN parent_id BIGINT REFERENCES categories(id) ON DELETE CASCADE;
ALTER TABLE categories ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index for parent_id for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- ============================================================================
-- 2. CREATE CMS_CONTENT TABLE - For landing page management
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_content (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_cta_text TEXT,
  hero_image_url TEXT,
  header_logo_text TEXT,
  header_nav_links TEXT,
  header_description TEXT,
  footer_text TEXT,
  footer_copyright TEXT,
  footer_email TEXT,
  footer_contact TEXT,
  site_name TEXT,
  meta_description TEXT,
  timezone TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on cms_content table
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read cms_content
CREATE POLICY "Public cms_content is viewable"
  ON cms_content FOR SELECT
  USING (true);

-- Policy: Only admins can update cms_content
CREATE POLICY "Only admins can update cms_content"
  ON cms_content FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can insert cms_content
CREATE POLICY "Only admins can insert cms_content"
  ON cms_content FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Insert default cms_content record
INSERT INTO cms_content (section_key, hero_title, hero_subtitle, site_name)
VALUES ('landing_page', 'नेपाल', 'नेपालका जननिर्वाचित प्रतिनिधि र सरकारी निकायहरूले गरेका सार्वजनिक प्रतिबद्धताहरूको वास्तविक समय अनुगमन कम्र।', 'नेपाल ट्रयाकर')
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================================
-- 3. ALTER PROMISES TABLE - Ensure proper foreign key relationship
-- ============================================================================

-- Make sure categoryId field exists and is properly typed
-- Note: If this fails, it means the column already exists (which is OK)
ALTER TABLE promises ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_promises_category_id ON promises(category_id);

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check)
-- ============================================================================

-- Check categories table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories';

-- Check cms_content table exists
-- SELECT COUNT(*) FROM cms_content;

-- List all trackers (top-level categories with no parent)
-- SELECT id, name, description, image_url FROM categories WHERE parent_id IS NULL ORDER BY display_order;

-- List all categories for a specific tracker
-- SELECT id, name, description, image_url FROM categories WHERE parent_id = 1 ORDER BY display_order;
