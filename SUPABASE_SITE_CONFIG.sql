-- SITE CONFIGURATION TABLE
-- This table stores all frontend configuration that can be managed from the admin dashboard
-- Including logo, names, footer, hero sections, and all UI text

CREATE TABLE IF NOT EXISTS site_config (
  id BIGINT PRIMARY KEY DEFAULT 1,
  -- Site-wide
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
  
  -- Featured Trackers Section
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
  
  -- Stats Section
  stats_title TEXT DEFAULT 'समग्र प्रगति समीक्षा',
  stats_description TEXT DEFAULT 'काठमाडौंको दिगो विकास र सुशासनका लागि गरिएका प्रतिबद्धताहरूको वास्तविक अवस्था।',
  stats_progress_label TEXT DEFAULT 'कुल सम्पन्नता दर',
  stats_tracker_label TEXT DEFAULT 'प्रगति ट्रयाकर',
  
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
  
  -- Updated timestamp
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENABLE RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY "Allow authenticated users to read config" ON site_config
  FOR SELECT
  USING (auth.role() = 'authenticated' OR true);

-- Create policy for admin users to update
CREATE POLICY "Allow admin users to update config" ON site_config
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM public.admin_users)))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM public.admin_users)));

-- Insert default row
INSERT INTO site_config (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
