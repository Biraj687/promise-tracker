import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronDown, X, Upload, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManagePromises = () => {
  const { categories, promises, updateCategory, addPromise, updatePromise, deletePromise, uploadImage, operationLoading } = useData();
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Show first 4 categories as main trackers
  const mainTrackers = categories.slice(0, 4);
  
  // Modals
  const [manageModal, setManageModal] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState(null);
  
  // Edit hero form
  const [editHeroData, setEditHeroData] = useState({ name: '', description: '', image_url: '' });
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [trackerPromises, setTrackerPromises] = useState([]);
  const [editingSaving, setEditingSaving] = useState(false);
  
  // Promise form
  const [showAddPromiseForm, setShowAddPromiseForm] = useState(false);
  const [newPromise, setNewPromise] = useState({
    title: '',
    description: '',
    status: 'Pending',
    point_no: 0
  });
  const [editingPromise, setEditingPromise] = useState(null);
  const [expandedPromise, setExpandedPromise] = useState(null);
  const [promiseSaving, setPromiseSaving] = useState(false);

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
  // PROMISE MANAGEMENT
  // ============================================================================

  const handleAddPromise = async () => {
    if (!selectedTracker || !newPromise.title.trim()) {
      setMessage({ type: 'error', text: 'Promise title is required' });
      return;
    }

    try {
      setPromiseSaving(true);
      // Auto-generate point_no if not set
      const pointNo = newPromise.point_no || trackerPromises.length + 1;
      
      await addPromise({
        title: newPromise.title,
        description: newPromise.description,
        categoryId: selectedTracker.id,
        status: newPromise.status,
        point_no: pointNo,
        ministry_responsible: 'Administrative Office', // Default
        category: selectedTracker.name
      });
      
      setMessage({ type: 'success', text: 'Promise added to Supabase!' });
      setNewPromise({ title: '', description: '', status: 'Pending', point_no: 0 });
      setShowAddPromiseForm(false);
      
      // Refresh promises list
      const updated = promises.filter(p => p.categoryId === selectedTracker.id);
      setTrackerPromises(updated);
      
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setPromiseSaving(false);
    }
  };

  const handleDeletePromise = async (promiseId) => {
    if (!window.confirm('Delete this promise?')) return;

    try {
      setPromiseSaving(true);
      await deletePromise(promiseId);
      setMessage({ type: 'success', text: 'Promise deleted!' });
      
      // Refresh promises
      const updated = trackerPromises.filter(p => p.id !== promiseId);
      setTrackerPromises(updated);
      
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setPromiseSaving(false);
    }
  };

  const handleUpdatePromiseStatus = async (promiseId, newStatus) => {
    try {
      setPromiseSaving(true);
      await updatePromise(promiseId, { status: newStatus });
      
      // Update local state
      const updated = trackerPromises.map(p =>
        p.id === promiseId ? { ...p, status: newStatus } : p
      );
      setTrackerPromises(updated);
      
      setMessage({ type: 'success', text: `Status updated to ${newStatus}!` });
      setTimeout(() => setMessage(null), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setPromiseSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-slate-800">💰 Manage Promises & Trackers</h1>
          <p className="text-slate-500 mt-2">Manage {mainTrackers.length} trackers, their promises & hero sections (Supabase)</p>
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
              className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold">✏️ Manage Tracker</h2>
                  <p className="text-sm text-slate-500">{selectedTracker.name} • {trackerPromises.length} promises</p>
                </div>
                <button onClick={() => setManageModal(false)} className="hover:bg-slate-100 p-1 rounded">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* HERO SECTION TAB */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold mb-4">🎨 Edit Hero Section</h3>

                  {/* Hero Image Preview & Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-3">📸 Hero Image</label>
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
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold mb-2">📝 Tracker Title</label>
                      <input
                        type="text"
                        value={editHeroData.name}
                        onChange={e => setEditHeroData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">📄 Description</label>
                      <textarea
                        value={editHeroData.description}
                        onChange={e => setEditHeroData(prev => ({ ...prev, description: e.target.value }))}
                        rows="3"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveHeroSection}
                      disabled={editingSaving || uploading || operationLoading}
                      className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
                    >
                      {editingSaving || uploading || operationLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Hero Section
                    </button>
                  </div>
                </div>

                {/* PROMISES MANAGEMENT TAB */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">📋 Manage Promises ({trackerPromises.length})</h3>
                    <button
                      onClick={() => setShowAddPromiseForm(!showAddPromiseForm)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm"
                    >
                      <Plus size={16} />
                      Add Promise
                    </button>
                  </div>

                  {/* Add Promise Form */}
                  {showAddPromiseForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4 space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Promise title (e.g., Build 100 new schools)"
                        value={newPromise.title}
                        onChange={e => setNewPromise(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />

                      <textarea
                        placeholder="Promise description & details"
                        rows="2"
                        value={newPromise.description}
                        onChange={e => setNewPromise(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                      />

                      <select
                        value={newPromise.status}
                        onChange={e => setNewPromise(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAddPromiseForm(false)}
                          className="flex-1 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-100 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddPromise}
                          disabled={promiseSaving || operationLoading}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                        >
                          {promiseSaving || operationLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Add to Supabase
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Promises List */}
                  <div className="space-y-2">
                    {trackerPromises.length === 0 ? (
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg text-center">
                        No promises yet. Click "Add Promise" to create one!
                      </p>
                    ) : (
                      trackerPromises.map(promise => (
                        <motion.div
                          key={promise.id}
                          layout
                          className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition"
                        >
                          <button
                            onClick={() => setExpandedPromise(expandedPromise === promise.id ? null : promise.id)}
                            className="w-full p-3 flex justify-between items-center hover:bg-slate-50 transition"
                          >
                            <div className="text-left flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 truncate">{promise.title}</p>
                              <p className="text-xs text-slate-600">
                                {promise.status === 'Completed' && '✓ Completed'}
                                {promise.status === 'In Progress' && '⏳ In Progress'}
                                {promise.status === 'Planning' && '📋 Planning'}
                                {promise.status === 'Pending' && '⏸️ Pending'}
                              </p>
                            </div>
                            <motion.div
                              animate={{ rotate: expandedPromise === promise.id ? 180 : 0 }}
                            >
                              <ChevronDown size={18} className="text-slate-600" />
                            </motion.div>
                          </button>

                          {/* Promise Details */}
                          {expandedPromise === promise.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-slate-200 bg-slate-50 p-3 space-y-3"
                            >
                              <p className="text-sm text-slate-700">{promise.description}</p>

                              <div className="flex gap-2">
                                <select
                                  value={promise.status}
                                  onChange={e => handleUpdatePromiseStatus(promise.id, e.target.value)}
                                  disabled={promiseSaving}
                                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 font-medium"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Planning">Planning</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>

                                <button
                                  onClick={() => handleDeletePromise(promise.id)}
                                  disabled={promiseSaving}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 font-bold flex items-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-2 sticky bottom-0">
                <button
                  onClick={() => setManageModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-white font-bold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePromises;
