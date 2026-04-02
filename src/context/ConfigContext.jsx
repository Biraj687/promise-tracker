import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ConfigContext = createContext();

// Default content configuration (fallback)
const DEFAULT_CONFIG = {
  // Site-wide
  site_name: "नेपाल ट्रयाकर",
  site_tagline: "सरकारी प्रतिबद्धताको पारदर्शी अनुगमन",
  site_logo_url: null,

  // Navigation
  nav_home_label: "नयाँ",
  nav_balen_label: "बालेन साह",
  nav_search_placeholder: "खोज्नुहोस्...",

  // Hero Section (Home)
  hero_badge: "प्रमाणित डेटा • पारदर्शी शासन",
  hero_main_title: "नेपाल",
  hero_main_title_accent: "ट्रयाकर।",
  hero_description: "नेपालका जननिर्वाचित प्रतिनिधि र सरकारी निकायहरूले गरेका सार्वजनिक प्रतिबद्धताहरूको वास्तविक समय अनुगमन केन्द्र।",
  hero_cta_button: "सबै ट्रयाकरहरू",
  hero_active_users: "१२,०००+ सक्रिय नागरिक",

  // Featured Trackers
  featured_trackers_title: "प्रमुख ट्रयाकरहरू",
  featured_trackers_description: "अहिले सक्रिय रूपमा अनुगमन भइरहेका प्रमुख सार्वजनिक योजना र व्यक्तित्वहरू।",

  // Balen Hero
  balen_hero_badge: "नागरिक ट्रयाकर : काठमाडौं महानगर",
  balen_hero_title1: "काठमाडौंको",
  balen_hero_title2: "नयाँ युगको",
  balen_hero_title3: "प्रतिबद्धता।",
  balen_hero_description: "सरकारी जवाफदेहिताको लागि एक क्रान्तिकारी दृष्टिकोण। राष्ट्रिय विकास योजना, डिजिटल सेवा विस्तार, र सामाजिक कल्याणका क्षेत्रमा हरेक प्रतिबद्धताको वास्तविक समय अनुगमन।",
  balen_hero_start_button: "सुरु गरौं",
  balen_hero_how_button: "कार्यप्रणाली",
  balen_hero_image_url: null,

  // Stats Section
  stats_title: "समग्र प्रगति समीक्षा",
  stats_description: "काठमाडौंको दिगो विकास र सुशासनका लागि गरिएका प्रतिबद्धताहरूको वास्तविक अवस्था।",
  stats_progress_label: "कुल सम्पन्नता दर",
  stats_tracker_label: "प्रगति ट्रयाकर",

  // Footer
  footer_title: "नेपाल ट्रयाकर",
  footer_description: "शासनमा पारदर्शिता र जवाफदेहिताका लागि समर्पित। वास्तविक समय डेटा र प्रमाणित प्रगतिका माध्यमबाट नागरिकहरूलाई सशक्त बनाउँदै।",
  footer_resources_title: "स्रोतहरू",
  footer_official_portal: "आधिकारिक पोर्टल",
  footer_data_sources: "डेटा स्रोतहरू",
  footer_privacy_policy: "गोपनीयता नीति",
  footer_trackers_title: "ट्रयाकरहरू",
  footer_new_commitments: "नयाँ प्रतिशृङ्खला",
  footer_balen_tracker: "बालेन साह ट्रयाकर",
  footer_admin_panel: "व्यवस्थापन प्यानल",
  footer_copyright: "© २०२६ नेपाल सरकार। सबै अधिकार सुरक्षित। पारदर्शिताको लागि प्रगति।",
  footer_verified_data: "सत्यता परीक्षण गरिएको",
  footer_transparent_governance: "पारदर्शी शासन",
  footer_logo_url: null,

  // Promises Overview
  promises_overview_title: "उपलब्ध ट्रयाकरहरू",
  promises_overview_description: "विभिन्न सरकारी निकायहरू र नेताहरूको प्रतिबद्धता अनुगमन प्ल्याटफर्महरू",
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Load configuration from Supabase site_config table
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        
        // Fetch from site_config table
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          console.warn('⚠️ Supabase config fetch warning:', error.message);
          setConfig(DEFAULT_CONFIG);
        } else if (data) {
          // Merge Supabase data with defaults
          const mergedConfig = { ...DEFAULT_CONFIG, ...data };
          setConfig(mergedConfig);
          console.log('✅ Config loaded from Supabase site_config');
        } else {
          setConfig(DEFAULT_CONFIG);
        }
      } catch (err) {
        console.error('Config load error:', err);
        setConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Real-time subscription to config changes
    const subscription = supabase
      .channel('site_config_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_config' },
        (payload) => {
          if (payload.new) {
            const mergedConfig = { ...DEFAULT_CONFIG, ...payload.new };
            setConfig(mergedConfig);
            console.log('✅ Config updated in real-time');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Save configuration to Supabase
  const saveConfig = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();

      if (error) {
        console.error('Failed to save config:', error);
        return { success: false, error: error.message };
      }

      const mergedConfig = { ...DEFAULT_CONFIG, ...data };
      setConfig(mergedConfig);
      console.log('✅ Config saved successfully');
      return { success: true };
    } catch (err) {
      console.error('Config save error:', err);
      return { success: false, error: err.message };
    }
  };

  // Reset to default config
  const resetConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .update(DEFAULT_CONFIG)
        .eq('id', 1)
        .select()
        .single();

      if (error) {
        console.error('Failed to reset config:', error);
        return { success: false, error: error.message };
      }

      const mergedConfig = { ...DEFAULT_CONFIG, ...data };
      setConfig(mergedConfig);
      console.log('✅ Config reset to defaults');
      return { success: true };
    } catch (err) {
      console.error('Config reset error:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    config,
    loading,
    saveConfig,
    resetConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

export default ConfigContext;
