import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

const ContentManager = () => {
  const { config, updateConfigSection, resetConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState(null);
  const [edits, setEdits] = useState({});

  const tabs = [
    { id: 'general', label: 'Site Settings', icon: '⚙️' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
    { id: 'hero', label: 'Hero Section', icon: '🎯' },
    { id: 'balenHero', label: 'Balen Hero', icon: '🏛️' },
    { id: 'stats', label: 'Stats Section', icon: '📊' },
    { id: 'promises', label: 'Promises Section', icon: '📋' },
    { id: 'footer', label: 'Footer', icon: '👣' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
  ];

  const handleChange = (section, field, value) => {
    setEdits(prev => ({
      ...prev,
      [`${section}.${field}`]: value,
    }));
  };

  const handleSaveSection = (section) => {
    const sectionEdits = {};
    Object.entries(edits).forEach(([key, value]) => {
      if (key.startsWith(`${section}.`)) {
        const field = key.replace(`${section}.`, '');
        sectionEdits[field] = value;
      }
    });

    if (Object.keys(sectionEdits).length > 0) {
      const result = updateConfigSection(section, sectionEdits);
      if (result.success) {
        setMessage({ type: 'success', text: `${section} saved successfully!` });
        setEdits(prev => {
          const newEdits = { ...prev };
          Object.keys(sectionEdits).forEach(key => {
            delete newEdits[`${section}.${key}`];
          });
          return newEdits;
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure? This will reset all content to defaults.')) {
      const result = resetConfig();
      if (result.success) {
        setMessage({ type: 'success', text: 'Configuration reset to defaults!' });
        setEdits({});
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const renderTabContent = () => {
    const section = activeTab;
    const data = config[section];

    if (!data || typeof data !== 'object') return null;

    return (
      <div className="space-y-6">
        {section === 'categories' ? (
          // Special handling for categories array
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Edit Categories</h3>
            {data.map((category, index) => (
              <div key={category.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category {category.id}
                </label>
                <input
                  type="text"
                  value={edits[`${section}.${index}.name`] || category.name}
                  onChange={(e) => handleChange(section, `${index}.name`, e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Category name"
                />
              </div>
            ))}
          </div>
        ) : (
          // Regular object fields
          Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {typeof value === 'string' && value.length > 100 ? (
                <textarea
                  value={edits[`${section}.${key}`] || value}
                  onChange={(e) => handleChange(section, key, e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={`Enter ${key}`}
                />
              ) : (
                <input
                  type="text"
                  value={edits[`${section}.${key}`] || value}
                  onChange={(e) => handleChange(section, key, e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${key}`}
                />
              )}
            </div>
          ))
        )}
        <button
          onClick={() => handleSaveSection(section)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          Save {section}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Content Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Edit all text and content displayed across the site</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      {/* Message Display */}
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

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-2 rounded-lg overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        {renderTabContent()}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Changes are saved immediately to browser storage. All components will update in real-time.
        </p>
      </div>
    </div>
  );
};

export default ContentManager;
