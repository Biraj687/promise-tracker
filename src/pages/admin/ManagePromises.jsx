import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronDown, X, Upload, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManagePromises = () => {
  const { categories, promises, updateCategory, uploadImage, operationLoading } = useData();
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // ONLY show first 3 categories as main trackers
  const mainTrackers = categories.slice(0, 3);
  
  // Modals
  const [manageModal, setManageModal] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState(null);
  
  // Edit hero form
  const [editHeroData, setEditHeroData] = useState({ name: '', description: '', image_url: '' });
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [trackerPromises, setTrackerPromises] = useState([]);
  const [editingSaving, setEditingSaving] = useState(false);

  // ============================================================================
  // IMAGE UPLOAD HANDLER
  // ============================================================================

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setHeroImagePreview(url);
      setEditHeroData(prev => ({ ...prev, image_url: url }));
      setMessage({ type: 'success', text: 'Image uploaded to Supabase!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  // ============================================================================
  // TRACKER MANAGEMENT
  // ============================================================================

  const handleOpenManageModal = (tracker) => {
    setSelectedTracker(tracker);
    setEditHeroData({
      name: tracker.name,
      description: tracker.description || '',
      image_url: tracker.image_url || ''
    });
    setHeroImagePreview(tracker.image_url || null);
    
    // Get promises for this tracker (by categoryId)
    const trackerPms = promises.filter(p => p.categoryId === tracker.id);
    setTrackerPromises(trackerPms);
    
    setManageModal(true);
  };

  const handleSaveHeroSection = async () => {
    if (!selectedTracker || !editHeroData.name.trim()) {
      setMessage({ type: 'error', text: 'Tracker name is required' });
      return;
    }

    try {
      setEditingSaving(true);
      await updateCategory(selectedTracker.id, {
        name: editHeroData.name,
        description: editHeroData.description,
        image_url: editHeroData.image_url
      });
      setMessage({ type: 'success', text: 'Hero section saved to Supabase!' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
    } finally {
      setEditingSaving(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">💰 Manage Promises</h1>
          <p className="text-slate-500 mt-2">Manage the 3 main trackers & their promises (Supabase)</p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{message.text}</span>
        </motion.div>
      )}

      {/* 3 Main Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainTrackers.map((tracker, idx) => {
          const trackerPms = promises.filter(p => p.categoryId === tracker.id);
          const completed = trackerPms.filter(p => p.status === 'Completed').length;
          const inProgress = trackerPms.filter(p => p.status === 'In Progress').length;
          const pending = trackerPms.filter(p => p.status === 'Pending').length;

          return (
            <motion.div
              key={tracker.id}
              layout
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Tracker Image Hero */}
              {tracker.image_url ? (
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={tracker.image_url} 
                    alt={tracker.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <ImageIcon size={48} className="text-slate-300" />
                </div>
              )}

              {/* Tracker Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-800 flex-1">{tracker.name}</h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">#{idx + 1}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{tracker.description}</p>

                {/* Promise Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-xs text-slate-600">Total</p>
                    <p className="font-bold text-blue-600">{trackerPms.length}</p>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-xs text-slate-600">Done</p>
                    <p className="font-bold text-green-600">{completed}</p>
                  </div>
                  <div className="bg-amber-50 rounded p-2">
                    <p className="text-xs text-slate-600">Progress</p>
                    <p className="font-bold text-amber-600">{inProgress}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenManageModal(tracker)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-bold"
                >
                  <Edit2 size={16} />
                  Edit Tracker & Promises
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =================== EDIT TRACKER MODAL ================= */}
      <AnimatePresence>
        {manageModal && selectedTracker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold">✏️ Edit Hero Section</h2>
                  <p className="text-sm text-slate-500">{selectedTracker.name}</p>
                </div>
                <button onClick={() => setManageModal(false)} className="hover:bg-slate-100 p-1 rounded">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Hero Image Preview & Upload */}
                <div>
                  <label className="block text-sm font-bold mb-3">📸 Hero Image (Upload to Supabase)</label>
                  {heroImagePreview ? (
                    <div className="relative mb-4">
                      <img src={heroImagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          setHeroImagePreview(null);
                          setEditHeroData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      <div className="flex flex-col items-center">
                        <ImageIcon size={32} className="text-slate-400 mb-2" />
                        <span className="text-sm text-slate-600">Click to upload hero image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <label className="block text-sm font-bold mb-2">📝 Tracker Title (Hero)</label>
                  <input
                    type="text"
                    value={editHeroData.name}
                    onChange={e => setEditHeroData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., बालेन साह को प्रतिबद्धता"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">📄 Description</label>
                  <textarea
                    value={editHeroData.description}
                    onChange={e => setEditHeroData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What are the main promises/focus areas?"
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none"
                  />
                </div>

                {/* Current Data Summary */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-bold text-sm mb-3">📊 Promises Under This Tracker</h3>
                  {trackerPromises.length === 0 ? (
                    <p className="text-sm text-slate-600">No promises yet for this tracker</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600">
                        ✓ <strong>{trackerPromises.filter(p => p.status === 'Completed').length}</strong> Completed
                      </p>
                      <p className="text-xs text-slate-600">
                        ⏳ <strong>{trackerPromises.filter(p => p.status === 'In Progress').length}</strong> In Progress
                      </p>
                      <p className="text-xs text-slate-600">
                        ⏸️ <strong>{trackerPromises.filter(p => p.status === 'Pending').length}</strong> Pending
                      </p>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setManageModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHeroSection}
                    disabled={editingSaving || uploading || operationLoading}
                    className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 flex items-center justify-center gap-2 font-bold transition"
                  >
                    {editingSaving || uploading || operationLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save to Supabase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePromises;
