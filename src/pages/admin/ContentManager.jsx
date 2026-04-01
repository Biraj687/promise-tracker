import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useData } from '../../context/DataContext';
import { Save, AlertCircle, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';

const ContentManager = () => {
  const { config, updateConfigSection } = useConfig();
  const { uploadImage } = useData();
  const [activeTab, setActiveTab] = useState('hero');
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  const tabs = [
    { id: 'hero', label: '🎯 Homepage Hero Section' },
    { id: 'footer', label: '👣 Footer' },
  ];

  // Initialize form with config data
  useEffect(() => {
    if (config) {
      if (activeTab === 'hero') {
        setFormData({
          title1: config.balenHero?.title1 || '',
          title2: config.balenHero?.title2 || '',
          title3: config.balenHero?.title3 || '',
          description: config.balenHero?.description || '',
          badge: config.balenHero?.badge || '',
          startButton: config.balenHero?.startButton || '',
          howItWorksButton: config.balenHero?.howItWorksButton || '',
          heroImageUrl: config.balenHero?.heroImageUrl || '',
        });
        setHeroImagePreview(config.balenHero?.heroImageUrl);
      } else if (activeTab === 'footer') {
        setFormData({
          title: config.footer?.title || '',
          description: config.footer?.description || '',
          copyright: config.footer?.copyright || '',
        });
      }
    }
  }, [config, activeTab]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage(null);

      console.log('🔄 Handling hero image upload:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Upload to Supabase Storage - uploadImage returns URL directly
      const publicUrl = await uploadImage(file);
      
      console.log('✅ Upload successful, URL:', publicUrl);
      
      setHeroImagePreview(publicUrl);
      setFormData(prev => ({
        ...prev,
        heroImageUrl: publicUrl
      }));
      setMessage({
        type: 'success',
        text: '✅ Hero image uploaded successfully!'
      });
      
      // Clear input to allow re-upload of same file
      e.target.value = '';
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage({
        type: 'error',
        text: `❌ Upload failed: ${err.message}. Check browser console for details.`
      });
      
      // Clear input on error too
      e.target.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      if (activeTab === 'hero') {
        await updateConfigSection('balenHero', {
          title1: formData.title1,
          title2: formData.title2,
          title3: formData.title3,
          description: formData.description,
          badge: formData.badge,
          startButton: formData.startButton,
          howItWorksButton: formData.howItWorksButton,
          heroImageUrl: formData.heroImageUrl,
        });
        setMessage({
          type: 'success',
          text: '✅ Hero section updated! Changes visible on homepage NOW.'
        });
      } else if (activeTab === 'footer') {
        await updateConfigSection('footer', {
          title: formData.title,
          description: formData.description,
          copyright: formData.copyright,
        });
        setMessage({
          type: 'success',
          text: '✅ Footer updated! Changes visible on homepage NOW.'
        });
      }

      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: `Failed to save: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const renderHeroTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          🖼️ Hero Background Image (shown on homepage)
        </label>
        
        <div className="flex gap-6">
          {/* Image Preview */}
          <div className="w-48 h-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
            {heroImagePreview ? (
              <img src={heroImagePreview} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <ImageIcon size={24} />
                <span className="text-xs mt-1">No image</span>
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div className="flex-1">
            <label className="block w-full p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition text-center">
              <div className="flex flex-col items-center gap-2">
                <Upload size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Click to upload hero image</span>
                <span className="text-xs text-blue-700">JPG, PNG (max 5MB)</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
            {uploadingImage && <p className="text-xs text-slate-500 mt-2">Uploading...</p>}
            {formData.heroImageUrl && <p className="text-xs text-slate-500 mt-2">✅ Image set</p>}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Badge (small top text)
        </label>
        <input
          type="text"
          value={formData.badge}
          onChange={(e) => handleChange('badge', e.target.value)}
          placeholder="नागरिक ट्रयाकर : काठमाडौं महानगर"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-3">📝 HERO TITLE (3 lines on homepage)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <input
              type="text"
              value={formData.title1}
              onChange={(e) => handleChange('title1', e.target.value)}
              placeholder="Line 1"
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.title2}
              onChange={(e) => handleChange('title2', e.target.value)}
              placeholder="Line 2"
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.title3}
              onChange={(e) => handleChange('title3', e.target.value)}
              placeholder="Line 3"
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Subtitle Description (shown under title)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Main description text..."
          rows="3"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Start Button Text
          </label>
          <input
            type="text"
            value={formData.startButton}
            onChange={(e) => handleChange('startButton', e.target.value)}
            placeholder="सुरु गरौं"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            "How It Works" Button Text
          </label>
          <input
            type="text"
            value={formData.howItWorksButton}
            onChange={(e) => handleChange('howItWorksButton', e.target.value)}
            placeholder="कार्यप्रणाली"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderFooterTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Footer Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="नेपाल ट्रयाकर"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Footer Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Footer description..."
          rows="3"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Copyright Text
        </label>
        <input
          type="text"
          value={formData.copyright}
          onChange={(e) => handleChange('copyright', e.target.value)}
          placeholder="© २०२६ नेपाल सरकार। सबै अधिकार सुरक्षित।"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">📋 Content Manager</h1>
        <p className="text-slate-500 text-sm mt-1">
          ⚡ Control your ACTUAL homepage content. All changes sync to the frontend immediately!
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
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
        {activeTab === 'hero' && renderHeroTab()}
        {activeTab === 'footer' && renderFooterTab()}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading || uploadingImage}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
        >
          {loading ? <AlertCircle size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? 'Saving...' : 'Save & Sync to Frontend'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium">
          ✅ <strong>LIVE SYNC:</strong> When you save, your changes immediately appear on the homepage!
        </p>
        <p className="text-xs text-blue-800 mt-2">
          Hero image uploads to Supabase Storage. All data saves to database + frontend.
        </p>
      </div>
    </div>
  );
};

export default ContentManager;
