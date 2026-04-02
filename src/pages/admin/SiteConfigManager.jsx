import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';
import { supabase } from '../../supabaseClient';

const SiteConfigManager = () => {
  const { config, saveConfig, loading: configLoading } = useConfig();
  const [formData, setFormData] = useState(config);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(config.site_logo_url);
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(config.footer_logo_url);

  useEffect(() => {
    setFormData(config);
    setLogoPreview(config.site_logo_url);
    setFooterLogoPreview(config.footer_logo_url);
  }, [config]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'logo') {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      } else if (type === 'footer-logo') {
        setFooterLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setFooterLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const uploadImage = async (file, folder) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('config-images')
      .upload(`${folder}/${fileName}`, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('config-images')
      .getPublicUrl(`${folder}/${fileName}`);

    return publicData.publicUrl;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let updatedConfig = { ...formData };

      // Upload logo if changed
      if (logoFile) {
        const logoUrl = await uploadImage(logoFile, 'logos');
        updatedConfig.site_logo_url = logoUrl;
        setLogoFile(null);
      }

      // Upload footer logo if changed
      if (footerLogoFile) {
        const footerLogoUrl = await uploadImage(footerLogoFile, 'logos');
        updatedConfig.footer_logo_url = footerLogoUrl;
        setFooterLogoFile(null);
      }

      // Save all config
      const result = await saveConfig(updatedConfig);
      
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (configLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-primary">Site Configuration</h1>
            <p className="text-on-surface-variant mt-2">Manage all frontend elements from here</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`max-w-7xl mx-auto mt-4 px-6 py-4 rounded-xl flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-700'
            : 'bg-red-500/10 border border-red-500/20 text-red-700'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-outline-variant sticky top-24 z-30 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'general', label: '⚙️ General', icon: 'General Settings' },
              { id: 'navigation', label: '🔗 Navigation', icon: 'Nav Links' },
              { id: 'hero', label: '🎨 Hero Section', icon: 'Home Hero' },
              { id: 'balen', label: '🏛️ Balen Hero', icon: 'Balen Section' },
              { id: 'featured', label: '⭐ Featured', icon: 'Featured' },
              { id: 'stats', label: '📊 Stats', icon: 'Statistics' },
              { id: 'footer', label: '🔗 Footer', icon: 'Footer' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="नेपाल ट्रयाकर"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Site Tagline</label>
              <input
                type="text"
                name="site_tagline"
                value={formData.site_tagline || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="सरकारी प्रतिबद्धताको पारदर्शी अनुगमन"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-4">Site Logo</label>
              <div className="flex gap-6 items-start">
                <div className="flex-1">
                  <label className="block border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 transition-colors">
                    <Upload size={24} className="mx-auto mb-2 text-primary/60" />
                    <span className="text-sm text-on-surface-variant">Click to upload logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                </div>
                {logoPreview && (
                  <div className="w-24 h-24 rounded-xl border border-outline-variant overflow-hidden flex items-center justify-center bg-surface-container">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        {activeTab === 'navigation' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Home Label</label>
              <input
                type="text"
                name="nav_home_label"
                value={formData.nav_home_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Balen Label</label>
              <input
                type="text"
                name="nav_balen_label"
                value={formData.nav_balen_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Search Placeholder</label>
              <input
                type="text"
                name="nav_search_placeholder"
                value={formData.nav_search_placeholder || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Hero Badge</label>
              <input
                type="text"
                name="hero_badge"
                value={formData.hero_badge || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Main Title</label>
              <input
                type="text"
                name="hero_main_title"
                value={formData.hero_main_title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Main Title Accent</label>
              <input
                type="text"
                name="hero_main_title_accent"
                value={formData.hero_main_title_accent || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Description</label>
              <textarea
                name="hero_description"
                value={formData.hero_description || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">CTA Button Text</label>
              <input
                type="text"
                name="hero_cta_button"
                value={formData.hero_cta_button || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Active Users Text</label>
              <input
                type="text"
                name="hero_active_users"
                value={formData.hero_active_users || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        )}

        {/* Balen Hero Section */}
        {activeTab === 'balen' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Badge</label>
              <input
                type="text"
                name="balen_hero_badge"
                value={formData.balen_hero_badge || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Title Line 1</label>
              <input
                type="text"
                name="balen_hero_title1"
                value={formData.balen_hero_title1 || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Title Line 2</label>
              <input
                type="text"
                name="balen_hero_title2"
                value={formData.balen_hero_title2 || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Title Line 3</label>
              <input
                type="text"
                name="balen_hero_title3"
                value={formData.balen_hero_title3 || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Description</label>
              <textarea
                name="balen_hero_description"
                value={formData.balen_hero_description || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Start Button</label>
              <input
                type="text"
                name="balen_hero_start_button"
                value={formData.balen_hero_start_button || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">How It Works Button</label>
              <input
                type="text"
                name="balen_hero_how_button"
                value={formData.balen_hero_how_button || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <hr className="border-outline-variant my-4" />

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Category Grid Badge</label>
              <input
                type="text"
                name="category_badge_text"
                value={formData.category_badge_text || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Category Grid Title</label>
              <input
                type="text"
                name="category_title"
                value={formData.category_title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Category Grid Description</label>
              <textarea
                name="category_description"
                value={formData.category_description || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        )}

        {/* Stats Section */}
        {activeTab === 'stats' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Stats Title</label>
              <input
                type="text"
                name="stats_title"
                value={formData.stats_title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Stats Description</label>
              <textarea
                name="stats_description"
                value={formData.stats_description || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Progress Label</label>
              <input
                type="text"
                name="stats_progress_label"
                value={formData.stats_progress_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Tracker Label</label>
              <input
                type="text"
                name="stats_tracker_label"
                value={formData.stats_tracker_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Total Label</label>
              <input
                type="text"
                name="stats_total_label"
                value={formData.stats_total_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Commitment Text</label>
              <input
                type="text"
                name="stats_commitment_text"
                value={formData.stats_commitment_text || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Completed Label</label>
              <input
                type="text"
                name="stats_completed_label"
                value={formData.stats_completed_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Implementation Label</label>
              <input
                type="text"
                name="stats_implementation_label"
                value={formData.stats_implementation_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Planning Label</label>
              <input
                type="text"
                name="stats_planning_label"
                value={formData.stats_planning_label || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        )}

        {/* Footer Section */}
        {activeTab === 'footer' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Footer Title</label>
              <input
                type="text"
                name="footer_title"
                value={formData.footer_title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Footer Description</label>
              <textarea
                name="footer_description"
                value={formData.footer_description || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-4">Footer Logo</label>
              <div className="flex gap-6 items-start">
                <div className="flex-1">
                  <label className="block border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 transition-colors">
                    <Upload size={24} className="mx-auto mb-2 text-primary/60" />
                    <span className="text-sm text-on-surface-variant">Click to upload footer logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'footer-logo')}
                      className="hidden"
                    />
                  </label>
                </div>
                {footerLogoPreview && (
                  <div className="w-24 h-24 rounded-xl border border-outline-variant overflow-hidden flex items-center justify-center bg-surface-container">
                    <img src={footerLogoPreview} alt="Footer logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Resources Title</label>
              <input
                type="text"
                name="footer_resources_title"
                value={formData.footer_resources_title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Trackers Title</label>
              <input
                type="text"
                name="footer_trackers_title"
                value={formData.footer_trackers_title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Copyright Text</label>
              <textarea
                name="footer_copyright"
                value={formData.footer_copyright || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Verified Data Text</label>
              <input
                type="text"
                name="footer_verified_data"
                value={formData.footer_verified_data || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Transparent Governance Text</label>
              <input
                type="text"
                name="footer_transparent_governance"
                value={formData.footer_transparent_governance || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteConfigManager;
