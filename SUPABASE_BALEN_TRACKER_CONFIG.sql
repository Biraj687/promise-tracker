-- ============================================================================
-- BALEN TRACKER CONFIGURATION - Add manageable fields to site_config
-- ============================================================================
-- Run this SQL in Supabase SQL Editor to add Balen Tracker management fields

-- Add Category Grid fields
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS category_badge_text TEXT DEFAULT 'योजना वर्गीकरण';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS category_title TEXT DEFAULT 'विषगत क्षेत्रहरू';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS category_description TEXT DEFAULT '१००-बुँदे नागरिक प्रतिवद्धतालाई १२ मुख्य विधामा विभाजन गरी गहन अनुगमन गरिएको छ।';

-- Add Stats labels fields
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS stats_total_label TEXT DEFAULT 'कुल';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS stats_commitment_text TEXT DEFAULT 'प्रतिबद्धताहरू';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS stats_completed_label TEXT DEFAULT 'सम्पन्न';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS stats_implementation_label TEXT DEFAULT 'कार्यान्वयनमा';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS stats_planning_label TEXT DEFAULT 'प्रतिक्षामा';

-- ============================================================================
-- VERIFICATION - Check if columns were added
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'site_config' AND column_name LIKE 'category_%' OR column_name LIKE 'stats_%'
-- ORDER BY column_name;
