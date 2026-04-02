-- ============================================================================
-- SITE CONFIGURATION TABLE - Complete Setup
-- ============================================================================
-- Run this SQL in Supabase SQL Editor to create/update site_config table
-- This includes all frontend configuration fields for the Promise Tracker

-- CREATE TABLE IF NOT EXISTS site_config (
CREATE TABLE IF NOT EXISTS site_config (
  id BIGSERIAL PRIMARY KEY,
  
  -- Site General
  site_name TEXT DEFAULT 'नेपाल ट्रयाकर',
  site_tagline TEXT DEFAULT 'सरकारी प्रतिबद्धताको पारदर्शी अनुगमन',
  site_logo_url TEXT,
  
  -- Navigation
  nav_home_label TEXT DEFAULT 'नयाँ',
  nav_balen_label TEXT DEFAULT 'बालेन साह',
  nav_search_placeholder TEXT DEFAULT 'खोज्नुहोस्...',
  
  -- Hero Section (Home)
  hero_badge TEXT DEFAULT 'प्रमाणित डेटा • पारदर्शी शासन',
  hero_main_title TEXT DEFAULT 'नेपाल',
  hero_main_title_accent TEXT DEFAULT 'ट्रयाकर।',
  hero_description TEXT DEFAULT 'नेपालका जननिर्वाचित प्रतिनिधि र सरकारी निकायहरूले गरेका सार्वजनिक प्रतिबद्धताहरूको वास्तविक समय अनुगमन केन्द्र।',
  hero_cta_button TEXT DEFAULT 'सबै ट्रयाकरहरू',
  hero_active_users TEXT DEFAULT '१२,०००+ सक्रिय नागरिक',
  
  -- Featured Trackers
  featured_trackers_title TEXT DEFAULT 'प्रमुख ट्रयाकरहरू',
  featured_trackers_description TEXT DEFAULT 'अहिले सक्रिय रूपमा अनुगमन भइरहेका प्रमुख सार्वजनिक योजना र व्यक्तित्वहरू।',
  
  -- Balen Hero
  balen_hero_badge TEXT DEFAULT 'नागरिक ट्रयाकर : काठमाडौं महानगर',
  balen_hero_title1 TEXT DEFAULT 'काठमाडौंको',
  balen_hero_title2 TEXT DEFAULT 'नयाँ युगको',
  balen_hero_title3 TEXT DEFAULT 'प्रतिबद्धता।',
  balen_hero_description TEXT DEFAULT 'सरकारी जवाफदेहिताको लागि एक क्रान्तिकारी दृष्टिकोण। राष्ट्रिय विकास योजना, डिजिटल सेवा विस्तार, र सामाजिक कल्याणका क्षेत्रमा हरेक प्रतिबद्धताको वास्तविक समय अनुगमन।',
  balen_hero_start_button TEXT DEFAULT 'सुरु गरौं',
  balen_hero_how_button TEXT DEFAULT 'कार्यप्रणाली',
  balen_hero_image_url TEXT,
  
  -- Category Grid (Balen Tracker)
  category_badge_text TEXT DEFAULT 'योजना वर्गीकरण',
  category_title TEXT DEFAULT 'विषगत क्षेत्रहरू',
  category_description TEXT DEFAULT '१००-बुँदे नागरिक प्रतिवद्धतालाई १२ मुख्य विधामा विभाजन गरी गहन अनुगमन गरिएको छ।',
  
  -- Stats Section
  stats_title TEXT DEFAULT 'समग्र प्रगति समीक्षा',
  stats_description TEXT DEFAULT 'काठमाडौंको दिगो विकास र सुशासनका लागि गरिएका प्रतिबद्धताहरूको वास्तविक अवस्था।',
  stats_progress_label TEXT DEFAULT 'कुल सम्पन्नता दर',
  stats_tracker_label TEXT DEFAULT 'प्रगति ट्रयाकर',
  stats_total_label TEXT DEFAULT 'कुल',
  stats_commitment_text TEXT DEFAULT 'प्रतिबद्धताहरू',
  stats_completed_label TEXT DEFAULT 'सम्पन्न',
  stats_implementation_label TEXT DEFAULT 'कार्यान्वयनमा',
  stats_planning_label TEXT DEFAULT 'प्रतिक्षामा',
  
  -- Footer
  footer_title TEXT DEFAULT 'नेपाल ट्रयाकर',
  footer_description TEXT DEFAULT 'शासनमा पारदर्शिता र जवाफदेहिताका लागि समर्पित। वास्तविक समय डेटा र प्रमाणित प्रगतिका माध्यमबाट नागरिकहरूलाई सशक्त बनाउँदै।',
  footer_resources_title TEXT DEFAULT 'स्रोतहरू',
  footer_official_portal TEXT DEFAULT 'आधिकारिक पोर्टल',
  footer_data_sources TEXT DEFAULT 'डेटा स्रोतहरू',
  footer_privacy_policy TEXT DEFAULT 'गोपनीयता नीति',
  footer_trackers_title TEXT DEFAULT 'ट्रयाकरहरू',
  footer_new_commitments TEXT DEFAULT 'नयाँ प्रतिशृङ्खला',
  footer_balen_tracker TEXT DEFAULT 'बालेन साह ट्रयाकर',
  footer_admin_panel TEXT DEFAULT 'व्यवस्थापन प्यानल',
  footer_copyright TEXT DEFAULT '© २०२६ नेपाल सरकार। सबै अधिकार सुरक्षित। पारदर्शिताको लागि प्रगति।',
  footer_verified_data TEXT DEFAULT 'सत्यता परीक्षण गरिएको',
  footer_transparent_governance TEXT DEFAULT 'पारदर्शी शासन',
  footer_logo_url TEXT,
  
  -- Promises Overview
  promises_overview_title TEXT DEFAULT 'उपलब्ध ट्रयाकरहरू',
  promises_overview_description TEXT DEFAULT 'विभिन्न सरकारी निकायहरू र नेताहरूको प्रतिबद्धता अनुगमन प्ल्याटफर्महरू',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read site_config
CREATE POLICY "Public site_config is viewable"
  ON site_config FOR SELECT
  USING (true);

-- Policy: Only admins can update site_config
CREATE POLICY "Only admins can update site_config"
  ON site_config FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can insert site_config
CREATE POLICY "Only admins can insert site_config"
  ON site_config FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Insert default config (if id=1 doesn't exist)
INSERT INTO site_config (id) 
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION - Confirm table was created
-- ============================================================================
-- SELECT COUNT(*) as config_records FROM site_config;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'site_config' ORDER BY column_name;
