import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ConfigContext = createContext();

// Default content configuration
const DEFAULT_CONFIG = {
  // Site-wide
  siteName: "नेपाल ट्रयाकर",
  siteTagline: "सरकारी प्रतिबद्धताको पारदर्शी अनुगमन",

  // Navigation
  nav: {
    homeLabel: "नयाँ",
    balenLabel: "बालेन साह",
    searchPlaceholder: "खोज्नुहोस्...",
  },

  // Hero Section (Home)
  hero: {
    badge: "प्रमाणित डेटा • पारदर्शी शासन",
    mainTitle: "नेपाल",
    mainTitleAccent: "ट्रयाकर।",
    description: "नेपालका जननिर्वाचित प्रतिनिधि र सरकारी निकायहरूले गरेका सार्वजनिक प्रतिबद्धताहरूको वास्तविक समय अनुगमन केन्द्र।",
    ctaButton: "सबै ट्रयाकरहरू",
    activeUsers: "१२,०००+ सक्रिय नागरिक",
  },

  // Balen Hero
  balenHero: {
    badge: "नागरिक ट्रयाकर : काठमाडौं महानगर",
    title1: "काठमाडौंको",
    title2: "नयाँ युगको",
    title3: "प्रतिबद्धता।",
    description: "सरकारी जवाफदेहिताको लागि एक क्रान्तिकारी दृष्टिकोण। राष्ट्रिय विकास योजना, डिजिटल सेवा विस्तार, र सामाजिक कल्याणका क्षेत्रमा हरेक प्रतिबद्धताको वास्तविक समय अनुगमन।",
    startButton: "सुरु गरौं",
    howItWorksButton: "कार्यप्रणाली",
    promiseCount: "१००+",
    promiseLabel: "प्रतिबद्धताहरू",
    completedCount: "३०+",
    completedLabel: "योजना पूरा",
    heroImageUrl: null,
  },

  // Stats Section
  stats: {
    title: "समग्र प्रगति समीक्षा",
    description: "काठमाडौंको दिगो विकास र सुशासनका लागि गरिएका प्रतिबद्धताहरूको वास्तविक अवस्था।",
    progressLabel: "कुल सम्पन्नता दर",
    trackerLabel: "प्रगति ट्रयाकर",
    totalLabel: "कुल",
    commitmentText: "प्रतिबद्धताहरू",
    completedLabel: "सम्पन्न",
    implementationLabel: "कार्यान्वयनमा",
    planningLabel: "प्रतिक्षामा",
  },

  // Promises Overview
  promisesOverview: {
    title: "उपलब्ध ट्रयाकरहरू",
    description: "विभिन्न सरकारी निकायहरू र नेताहरूको प्रतिबद्धता अनुगमन प्ल्याटफर्महरू",
  },

  // Footer
  footer: {
    title: "नेपाल ट्रयाकर",
    description: "शासनमा पारदर्शिता र जवाफदेहिताका लागि समर्पित। वास्तविक समय डेटा र प्रमाणित प्रगतिका माध्यमबाट नागरिकहरूलाई सशक्त बनाउँदै।",
    resourcesTitle: "स्रोतहरू",
    officialPortal: "आधिकारिक पोर्टल",
    dataSources: "डेटा स्रोतहरू",
    privacyPolicy: "गोपनीयता नीति",
    trackersTitle: "ट्रयाकरहरू",
    newCommitments: "नयाँ प्रतिशृङ्खला",
    balenTracker: "बालेन साह ट्रयाकर",
    adminPanel: "व्यवस्थापन प्यानल",
    copyright: "© २०२६ नेपाल सरकार। सबै अधिकार सुरक्षित। पारदर्शिताको लागि प्रगति।",
    verifiedData: "सत्यता परीक्षण गरिएको",
    transparentGovernance: "पारदर्शी शासन",
  },

  // Categories (12 default categories)
  categories: [
    { id: 1, name: "साझा प्रतिबद्धता, समन्वय र जनविश्वास" },
    { id: 2, name: "प्रशासनिक सुधार, पुनसंरचना र मितव्ययिता" },
    { id: 3, name: "सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन" },
    { id: 4, name: "डिजिटल शासन र डेटा गोभर्नेन्स र सञ्चार" },
    { id: 5, name: "सुशासन, पारदर्शिता र भ्रष्टाचार नियंत्रण" },
    { id: 6, name: "सार्वजनिक खरीद र परियोजना व्यवस्थापन सुधार" },
    { id: 7, name: "लगानी, उद्योग निजी क्षेत्र प्रवर्द्धन र पर्यटन" },
    { id: 8, name: "उर्जा तथा जलस्रोत" },
    { id: 9, name: "राजस्व सुधार" },
    { id: 10, name: "स्वास्थ्य, शिक्षा र मानव विकास" },
    { id: 11, name: "कृषि, भूमि पूर्वाधार र आधारभूत सेवा" },
    { id: 12, name: "अन्य रणनीतिक र सामाजिक सुरक्षा निर्णयहरू" },
  ],

  // Additional UI text
  ui: {
    noResults: "कोई परिणाम नहीं मिले",
    loading: "लोड हो रहा है...",
    error: "त्रुटि: डेटा लोड नहीं हो सका",
    success: "सफलतापूर्वक सहेजा गया",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    save: "सहेजें",
    cancel: "रद्द करें",
  },
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Load configuration from Supabase CMS on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        
        // Try to load from Supabase cms_content table
        const { data, error } = await supabase
          .from('cms_content')
          .select('*')
          .eq('section_key', 'landing_page')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('⚠️ Supabase cms_content fetch warning:', error.message);
        }

        if (data) {
          // Merge Supabase data with DEFAULT_CONFIG
          const supabaseConfig = mergeSupabaseWithConfig(data);
          setConfig(supabaseConfig);
          console.log('✅ Config loaded from Supabase');
        } else {
          // No data in Supabase, use localStorage or DEFAULT
          const storedConfig = localStorage.getItem('siteConfig');
          if (storedConfig) {
            setConfig(JSON.parse(storedConfig));
            console.log('✅ Config loaded from localStorage');
          } else {
            setConfig(DEFAULT_CONFIG);
            localStorage.setItem('siteConfig', JSON.stringify(DEFAULT_CONFIG));
            console.log('✅ Using DEFAULT_CONFIG');
          }
        }
      } catch (err) {
        console.error('Config load error:', err);
        const storedConfig = localStorage.getItem('siteConfig');
        setConfig(storedConfig ? JSON.parse(storedConfig) : DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Merge Supabase CMS data with DEFAULT_CONFIG
  const mergeSupabaseWithConfig = (cmsData) => {
    return {
      ...DEFAULT_CONFIG,
      siteName: cmsData.site_name || DEFAULT_CONFIG.siteName,
      balenHero: {
        ...DEFAULT_CONFIG.balenHero,
        title1: cmsData.hero_title_part1 || DEFAULT_CONFIG.balenHero.title1,
        title2: cmsData.hero_title_part2 || DEFAULT_CONFIG.balenHero.title2,
        title3: cmsData.hero_title_part3 || DEFAULT_CONFIG.balenHero.title3,
        description: cmsData.hero_description || DEFAULT_CONFIG.balenHero.description,
        heroImageUrl: cmsData.hero_image_url || null,
      },
      footer: {
        ...DEFAULT_CONFIG.footer,
        title: cmsData.footer_title || DEFAULT_CONFIG.footer.title,
        description: cmsData.footer_description || DEFAULT_CONFIG.footer.description,
        copyright: cmsData.footer_copyright || DEFAULT_CONFIG.footer.copyright,
      },
    };
  };

  // Save configuration to both Supabase and localStorage
  const saveConfig = async (newConfig) => {
    try {
      setConfig(newConfig);
      localStorage.setItem('siteConfig', JSON.stringify(newConfig));

      // Try to save to Supabase
      const { data: existing } = await supabase
        .from('cms_content')
        .select('id')
        .eq('section_key', 'landing_page')
        .single();

      const cmsData = {
        section_key: 'landing_page',
        site_name: newConfig.siteName,
        hero_title_part1: newConfig.balenHero?.title1,
        hero_title_part2: newConfig.balenHero?.title2,
        hero_title_part3: newConfig.balenHero?.title3,
        hero_description: newConfig.balenHero?.description,
        hero_image_url: newConfig.balenHero?.heroImageUrl,
        footer_title: newConfig.footer?.title,
        footer_description: newConfig.footer?.description,
        footer_copyright: newConfig.footer?.copyright,
      };

      if (existing?.id) {
        await supabase.from('cms_content').update(cmsData).eq('id', existing.id);
      } else {
        await supabase.from('cms_content').insert([cmsData]);
      }

      return { success: true };
    } catch (err) {
      console.error('Failed to save config:', err);
      return { success: false, error: err.message };
    }
  };

  // Update specific section of config
  const updateConfigSection = async (section, updates) => {
    try {
      const updatedConfig = {
        ...config,
        [section]: {
          ...config[section],
          ...updates,
        },
      };
      return await saveConfig(updatedConfig);
    } catch (err) {
      console.error(`Failed to update ${section}:`, err);
      return { success: false, error: err.message };
    }
  };

  // Reset to default config
  const resetConfig = () => {
    try {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('siteConfig', JSON.stringify(DEFAULT_CONFIG));
      return { success: true };
    } catch (err) {
      console.error('Failed to reset config:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    config,
    loading,
    saveConfig,
    updateConfigSection,
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
