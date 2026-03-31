import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Save, AlertCircle, CheckCircle2, Upload, Loader2 } from 'lucide-react';

const ContentManager = () => {
  const { cmsContent, saveCmsContent, uploadImage, operationLoading } = useData();
  const [activeTab, setActiveTab] = useState('hero');
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  const tabs = [
    { id: 'hero', label: '🎯 Hero Section' },
    { id: 'header', label: '📝 Header' },
    { id: 'footer', label: '👣 Footer' },
    { id: 'general', label: '⚙️ General Settings' },
  ];

  // Initialize form with CMS data
  useEffect(() => {
    if (cmsContent) {
      setFormData(cmsContent);
      if (cmsContent.hero_image_url) {
        setHeroImagePreview(cmsContent.hero_image_url);
      }
    }
  }, [cmsContent]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setHeroImagePreview(url);
      setFormData(prev => ({
        ...prev,
        hero_image_url: url
      }));
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      // Map form fields to cms_content table fields
      const updates = {
        hero_title: formData.hero_title || formData.title,
        hero_subtitle: formData.hero_subtitle || formData.subtitle,
        hero_cta_text: formData.hero_cta_text || formData.cta_text,
        hero_image_url: formData.hero_image_url,
        header_logo_text: formData.header_logo_text || formData.logo_text,
        header_nav_links: formData.header_nav_links || formData.nav_links,
        header_description: formData.header_description || formData.description,
        footer_text: formData.footer_text || formData.text,
        footer_copyright: formData.footer_copyright || formData.copyright,
        footer_email: formData.footer_email || formData.email,
        site_name: formData.site_name,
        meta_description: formData.meta_description,
        timezone: formData.timezone || 'Asia/Kathmandu',
        maintenance_mode: formData.maintenance_mode || false
      };

      await saveCmsContent(activeTab, updates);
      setMessage({ type: 'success', text: 'Changes saved to Supabase successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'hero') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={formData.hero_title || formData.title || ''}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="नेपाल"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={formData.hero_subtitle || formData.subtitle || ''}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              placeholder="Hero subtitle..."
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              CTA Button Text
            </label>
            <input
              type="text"
              value={formData.hero_cta_text || formData.cta_text || ''}
              onChange={(e) => handleChange('hero_cta_text', e.target.value)}
              placeholder="सबै ट्रयाकरहरू"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Background Image
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading || operationLoading}
                className="hidden"
                id="hero-image-input"
              />
              <label htmlFor="hero-image-input" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className="text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">
                    Click to upload image to Supabase
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                </div>
              </label>
            </div>

            {(heroImagePreview || formData.hero_image_url) && (
              <div className="mt-4 relative">
                <img
                  src={heroImagePreview || formData.hero_image_url}
                  alt="Hero"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setHeroImagePreview(null);
                    setFormData(prev => ({ ...prev, hero_image_url: null }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'header') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Logo Text
            </label>
            <input
              type="text"
              value={formData.header_logo_text || formData.logo_text || ''}
              onChange={(e) => handleChange('header_logo_text', e.target.value)}
              placeholder="नेपाल ट्रयाकर"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Navigation Links (comma-separated)
            </label>
            <input
              type="text"
              value={formData.header_nav_links || formData.nav_links || ''}
              onChange={(e) => handleChange('header_nav_links', e.target.value)}
              placeholder="Home, About, Contact"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Header Description
            </label>
            <input
              type="text"
              value={formData.header_description || formData.description || ''}
              onChange={(e) => handleChange('header_description', e.target.value)}
              placeholder="Enter header description"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'footer') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Footer Text
            </label>
            <textarea
              value={formData.footer_text || formData.text || ''}
              onChange={(e) => handleChange('footer_text', e.target.value)}
              placeholder="Enter footer text..."
              rows="4"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Copyright Text
            </label>
            <input
              type="text"
              value={formData.footer_copyright || formData.copyright || ''}
              onChange={(e) => handleChange('footer_copyright', e.target.value)}
              placeholder="© 2026 नेपाल सरकार"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.footer_email || formData.email || ''}
              onChange={(e) => handleChange('footer_email', e.target.value)}
              placeholder="contact@example.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'general') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={formData.site_name || ''}
              onChange={(e) => handleChange('site_name', e.target.value)}
              placeholder="नेपाल ट्रयाकर"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              placeholder="SEO description..."
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Timezone
            </label>
            <select
              value={formData.timezone || 'Asia/Kathmandu'}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Asia/Kathmandu">Asia/Kathmandu (Nepal)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.maintenance_mode || false}
                onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                className="rounded"
              />
              Maintenance Mode
            </label>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Content Manager</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your landing page content (saved to Supabase)</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        {renderTabContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save to Supabase
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>✅ Supabase Sync:</strong> All changes are saved directly to your Supabase cms_content table. Images are uploaded to Supabase Storage.
        </p>
      </div>
    </div>
  );
};

export default ContentManager;
