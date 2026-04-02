import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Save, X, MoreVertical, Upload, Eye, EyeOff, Loader2, Menu, Home, Tags, FileText, Users, Settings, LayoutDashboard } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const HomepageDashboard = () => {
  const { categories, promises, loading } = useData();
  const [trackers, setTrackers] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [editingTracker, setEditingTracker] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newTracker, setNewTracker] = useState({
    name: '',
    description: '',
    image_url: '',
    color: 'bg-primary',
    display_order: 0
  });
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    category: '',
    type: 'update',
    is_breaking: false
  });
  const [activeTab, setActiveTab] = useState('trackers');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [filteredPromises, setFilteredPromises] = useState([]);
  const [showEditHero, setShowEditHero] = useState(false);
  const [editingTrackerHero, setEditingTrackerHero] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [showAddPromiseForm, setShowAddPromiseForm] = useState(false);
  const [editingPromise, setEditingPromise] = useState(null);
  const [newPromise, setNewPromise] = useState({
    title: '',
    description: '',
    status: 'Pending',
    progress: 0
  });

  // Load data - fetch from DB to avoid dummy data replacement
  const fetchTrackers = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setTrackers(data || []);
    } catch (err) {
      console.error('Error fetching trackers:', err);
      setTrackers([]);
    }
  };

  useEffect(() => {
    fetchTrackers();

    // Real-time subscription to categories changes
    const subscription = supabase
      .channel('categories')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Categories changed:', payload);
          fetchTrackers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Handle category filter
  useEffect(() => {
    if (categoryFilter) {
      setFilteredPromises(promises.filter(p => (p.categoryId || p.category_id) === categoryFilter));
    } else {
      setFilteredPromises([]);
    }
  }, [categoryFilter, promises]);

  // Save tracker
  const saveTracker = async () => {
    try {
      if (editingTracker) {
        const { error } = await supabase
          .from('categories')
          .update(editingTracker)
          .eq('id', editingTracker.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([newTracker]);
        if (error) throw error;
      }
      await fetchTrackers();
      setEditingTracker(null);
      setShowAddForm(false);
      setNewTracker({
        name: '',
        description: '',
        image_url: '',
        color: 'bg-primary',
        display_order: 0
      });
    } catch (err) {
      console.error('Error saving tracker:', err);
    }
  };

  // Delete tracker
  const deleteTracker = async (id) => {
    if (confirm('Are you sure you want to delete this tracker?')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchTrackers();
      } catch (err) {
        console.error('Error deleting tracker:', err);
      }
    }
  };

  // Get category stats
  const getCategoryStats = (categoryId) => {
    const catPromises = promises.filter(p => p.category_id === categoryId);
    return {
      total: catPromises.length,
      completed: catPromises.filter(p => p.status === 'Completed').length,
      inProgress: catPromises.filter(p => p.status === 'In Progress').length,
    };
  };

  // Handle hero image upload
  const handleHeroImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadHeroImage = async () => {
    if (!heroImageFile || !editingTrackerHero) return;

    setUploadingHero(true);
    try {
      const fileName = `${Date.now()}-${heroImageFile.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('tracker-images')
        .upload(`hero/${fileName}`, heroImageFile);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('tracker-images')
        .getPublicUrl(`hero/${fileName}`);

      const imageUrl = publicData.publicUrl;

      // Update tracker with new image
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: imageUrl })
        .eq('id', editingTrackerHero.id);

      if (updateError) throw updateError;

      // Refresh all trackers
      await fetchTrackers();

      setShowEditHero(false);
      setHeroImageFile(null);
      setHeroImagePreview(null);
      setEditingTrackerHero(null);
    } catch (error) {
      console.error('Error uploading hero image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingHero(false);
    }
  };

  // Save promise
  const savePromise = async () => {
    try {
      if (!newPromise.title.trim()) {
        alert('Please enter a promise title');
        return;
      }

      if (!categoryFilter) {
        alert('Please select a category first');
        return;
      }

      // Only send valid columns - NO duplicates!
      const promiseToSave = {
        title: newPromise.title,
        description: newPromise.description,
        status: newPromise.status,
        progress: newPromise.progress,
        category_id: categoryFilter
      };

      console.log('📝 Saving promise:', promiseToSave);

      const { data, error } = await supabase
        .from('promises')
        .insert([promiseToSave])
        .select();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Promise saved successfully:', data);

      // Refresh filtered promises
      if (categoryFilter) {
        const { data: promises } = await supabase
          .from('promises')
          .select('*')
          .eq('category_id', categoryFilter)
          .order('created_at', { ascending: false });
        setFilteredPromises(promises || []);
      }

      setShowAddPromiseForm(false);
      setNewPromise({
        title: '',
        description: '',
        status: 'Pending',
        progress: 0,
        category_id: null
      });

      alert('✅ Promise saved successfully!');
    } catch (err) {
      console.error('Error saving promise:', err);
      alert(`Failed to save promise: ${err.message || 'Unknown error'}`);
    }
  };

  // Update promise
  const updatePromise = async () => {
    try {
      if (!editingPromise?.id) return;
      if (!editingPromise.title.trim()) {
        alert('Please enter a promise title');
        return;
      }

      const promiseToUpdate = {
        title: editingPromise.title,
        description: editingPromise.description,
        status: editingPromise.status,
        progress: editingPromise.progress
      };

      console.log('📝 Updating promise:', promiseToUpdate);

      const { error } = await supabase
        .from('promises')
        .update(promiseToUpdate)
        .eq('id', editingPromise.id);

      if (error) throw error;

      console.log('✅ Promise updated successfully');

      // Refresh filtered promises
      if (categoryFilter) {
        const { data: promises } = await supabase
          .from('promises')
          .select('*')
          .eq('category_id', categoryFilter)
          .order('created_at', { ascending: false });
        setFilteredPromises(promises || []);
      }

      setEditingPromise(null);
      alert('✅ Promise updated successfully!');
    } catch (err) {
      console.error('Error updating promise:', err);
      alert(`Failed to update promise: ${err.message || 'Unknown error'}`);
    }
  };

  // Delete promise
  const deletePromise = async (promiseId, promiseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${promiseTitle}"? This action cannot be undone.`)) {
      try {
        console.log('🗑️ Deleting promise:', promiseId);

        const { error } = await supabase
          .from('promises')
          .delete()
          .eq('id', promiseId);

        if (error) throw error;

        console.log('✅ Promise deleted successfully');

        // Refresh filtered promises
        if (categoryFilter) {
          const { data: promises } = await supabase
            .from('promises')
            .select('*')
            .eq('category_id', categoryFilter)
            .order('created_at', { ascending: false });
          setFilteredPromises(promises || []);
        } else {
          // If no filter, fetch all promises
          const { data: promises } = await supabase
            .from('promises')
            .select('*')
            .order('created_at', { ascending: false });
          setFilteredPromises(promises || []);
        }

        alert('✅ Promise deleted successfully!');
      } catch (err) {
        console.error('Error deleting promise:', err);
        alert(`Failed to delete promise: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER PLACEHOLDER - Usually comes from Navbar component */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-primary">नेपाल ट्रयाकर. Admin</h1>
          <div className="text-sm text-on-surface-variant">Dashboard Management</div>
        </div>
      </header>

      {/* HERO SECTION MANAGEMENT */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-4xl font-black text-primary mb-2 font-headline">Hero Section</h2>
              <p className="text-on-surface-variant">Manage the main homepage hero section title and content</p>
            </div>
            <button 
              onClick={() => setShowEditHero(true)}
              className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:shadow-lg transition-all">
              Edit Hero Content
            </button>
          </div>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <div className="sticky top-16 z-30 bg-white border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('trackers')}
              className={`py-4 font-bold border-b-2 transition-colors ${
                activeTab === 'trackers'
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant border-transparent hover:text-primary'
              }`}
            >
              🔹 Featured Trackers (Thumbnails)
            </button>
            <button
              onClick={() => setActiveTab('tracker-details')}
              className={`py-4 font-bold border-b-2 transition-colors ${
                activeTab === 'tracker-details'
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant border-transparent hover:text-primary'
              }`}
            >
              📋 Tracker Details & Promises
            </button>
            <button
              onClick={() => setActiveTab('breaking-news')}
              className={`py-4 font-bold border-b-2 transition-colors ${
                activeTab === 'breaking-news'
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant border-transparent hover:text-primary'
              }`}
            >
              🔴 Breaking News
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: FEATURED TRACKERS */}
          <AnimatePresence mode="wait">
            {activeTab === 'trackers' && (
              <motion.div key="trackers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Section Title */}
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-black text-primary font-headline mb-2">प्रमुख ट्रयाकरहरू</h3>
                    <p className="text-on-surface-variant">Manage the 3 featured tracker thumbnail cards</p>
                    <p className="text-sm text-on-surface-variant/70 mt-1">These cards appear in the "Featured Trackers" section on the homepage</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setEditingTracker(null);
                      setNewTracker({
                        name: '',
                        description: '',
                        image_url: '',
                        color: 'bg-primary',
                        display_order: 0
                      });
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus size={20} /> Add New Tracker
                  </button>
                </div>

                {/* Add/Edit Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 bg-primary/5 rounded-2xl p-8 border border-primary/20"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-primary">
                          {editingTracker ? 'Edit Tracker' : 'Create New Tracker'}
                        </h4>
                        <button
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingTracker(null);
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-bold text-primary mb-2">Tracker Name (Nepali)</label>
                          <input
                            type="text"
                            placeholder="e.g., काठमाडौंको नयाँ युगको प्रतिबद्धता"
                            className="w-full px-4 py-3 border border-outline-variant rounded-xl font-body focus:ring-2 focus:ring-primary outline-none"
                            value={editingTracker?.name || newTracker.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (editingTracker) {
                                setEditingTracker({ ...editingTracker, name: val });
                              } else {
                                setNewTracker({ ...newTracker, name: val });
                              }
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-primary mb-2">Display Order</label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border border-outline-variant rounded-xl font-body focus:ring-2 focus:ring-primary outline-none"
                            value={editingTracker?.display_order || newTracker.display_order}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              if (editingTracker) {
                                setEditingTracker({ ...editingTracker, display_order: val });
                              } else {
                                setNewTracker({ ...newTracker, display_order: val });
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-primary mb-2">Description</label>
                        <textarea
                          placeholder="Brief description of this tracker..."
                          rows="3"
                          className="w-full px-4 py-3 border border-outline-variant rounded-xl font-body focus:ring-2 focus:ring-primary outline-none"
                          value={editingTracker?.description || newTracker.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editingTracker) {
                              setEditingTracker({ ...editingTracker, description: val });
                            } else {
                              setNewTracker({ ...newTracker, description: val });
                            }
                          }}
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-primary mb-2">Hero Image URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 border border-outline-variant rounded-xl font-body focus:ring-2 focus:ring-primary outline-none"
                          value={editingTracker?.image_url || newTracker.image_url}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editingTracker) {
                              setEditingTracker({ ...editingTracker, image_url: val });
                            } else {
                              setNewTracker({ ...newTracker, image_url: val });
                            }
                          }}
                        />
                        {(editingTracker?.image_url || newTracker.image_url) && (
                          <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-outline-variant">
                            <img
                              src={editingTracker?.image_url || newTracker.image_url}
                              alt="preview"
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error')}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingTracker(null);
                          }}
                          className="px-6 py-2 border border-outline-variant text-primary rounded-xl font-bold hover:bg-surface transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveTracker}
                          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Save size={18} /> {editingTracker ? 'Update' : 'Create'} Tracker
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tracker Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trackers.map((tracker) => {
                    const stats = getCategoryStats(tracker.id);
                    return (
                      <motion.div
                        key={tracker.id}
                        layout
                        className="group bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-sm hover:shadow-premium transition-all"
                      >
                        {/* Header with Image */}
                        <div className="relative h-40 overflow-hidden bg-slate-100 group/image">
                          {tracker.image_url ? (
                            <img
                              src={tracker.image_url}
                              alt={tracker.name}
                              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/400x200?text=No+Image')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                              <Upload size={32} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent" />
                          <button
                            onClick={() => {
                              setEditingTrackerHero(tracker);
                              setShowEditHero(true);
                              setHeroImagePreview(tracker.image_url);
                            }}
                            className="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                            title="Edit Image"
                          >
                            <Upload size={18} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h4 className="font-black text-primary text-lg font-headline mb-2 line-clamp-2">
                            {tracker.name}
                          </h4>
                          <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                            {tracker.description}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="text-center p-2 bg-surface rounded-lg border border-outline-variant/50">
                              <div className="font-black text-primary text-lg">{stats.total}</div>
                              <div className="text-[9px] font-bold text-on-surface-variant/60 uppercase">कुल</div>
                            </div>
                            <div className="text-center p-2 bg-accent-emerald/5 rounded-lg border border-accent-emerald/10">
                              <div className="font-black text-accent-emerald text-lg">{stats.completed}</div>
                              <div className="text-[9px] font-bold text-accent-emerald/60 uppercase">पूरा</div>
                            </div>
                            <div className="text-center p-2 bg-accent-amber/5 rounded-lg border border-accent-amber/10">
                              <div className="font-black text-accent-amber text-lg">{stats.inProgress}</div>
                              <div className="text-[9px] font-bold text-accent-amber/60 uppercase">प्रगति</div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingTracker(tracker);
                                setShowAddForm(true);
                              }}
                              className="flex-1 py-2 bg-primary/10 text-primary rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              <Edit2 size={16} /> Edit
                            </button>
                            <button
                              onClick={() => deleteTracker(tracker.id)}
                              className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 2: TRACKER DETAILS */}
            {activeTab === 'tracker-details' && (
              <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-primary font-headline mb-4">Tracker Details & Promises</h3>
                  <p className="text-on-surface-variant mb-6">
                    Select a tracker to view and manage its categories and promises
                  </p>

                  {/* Tracker Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {trackers.map((tracker) => (
                      <button
                        key={tracker.id}
                        onClick={() => setCategoryFilter(categoryFilter === tracker.id ? null : tracker.id)}
                        className={`p-4 rounded-xl font-bold transition-all text-left ${
                          categoryFilter === tracker.id
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-surface border border-outline-variant hover:border-primary'
                        }`}
                      >
                        <div className="font-headline">{tracker.name}</div>
                        <div className="text-sm opacity-70 mt-1">{getCategoryStats(tracker.id).total} Promises</div>
                      </button>
                    ))}
                  </div>

                  {categoryFilter && (
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-2xl font-black text-primary font-headline mb-2">
                            {trackers.find(t => t.id === categoryFilter)?.name}
                          </h4>
                          <p className="text-on-surface-variant">
                            Manage promises and categories for this tracker
                          </p>
                        </div>
                        <button 
                          onClick={() => setShowAddPromiseForm(!showAddPromiseForm)}
                          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                          <Plus size={18} /> Add Promise
                        </button>
                      </div>

                      {/* Promise Form */}
                      <AnimatePresence>
                        {showAddPromiseForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 bg-primary/5 rounded-2xl p-8 border border-primary/20"
                          >
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-xl font-bold text-primary">Add New Promise</h4>
                              <button
                                onClick={() => setShowAddPromiseForm(false)}
                                className="text-slate-400 hover:text-primary"
                              >
                                <X size={24} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <label className="block text-sm font-bold text-primary mb-2">Promise Title</label>
                                <input
                                  type="text"
                                  placeholder="Enter promise title..."
                                  className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                  value={newPromise.title}
                                  onChange={(e) => setNewPromise({ ...newPromise, title: e.target.value })}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-primary mb-2">Status</label>
                                <select
                                  className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                  value={newPromise.status}
                                  onChange={(e) => setNewPromise({ ...newPromise, status: e.target.value })}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-bold text-primary mb-2">Description</label>
                              <textarea
                                placeholder="Enter promise description..."
                                rows="3"
                                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                value={newPromise.description}
                                onChange={(e) => setNewPromise({ ...newPromise, description: e.target.value })}
                              />
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-bold text-primary mb-2">Progress: {newPromise.progress}%</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full"
                                value={newPromise.progress}
                                onChange={(e) => setNewPromise({ ...newPromise, progress: parseInt(e.target.value) })}
                              />
                            </div>

                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => setShowAddPromiseForm(false)}
                                className="px-6 py-2 border border-outline-variant text-primary rounded-xl font-bold hover:bg-surface transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={savePromise}
                                className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                              >
                                <Save size={18} /> Save Promise
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Edit Promise Form */}
                      <AnimatePresence>
                        {editingPromise && (
                          <motion.div
                            key="edit-promise"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-amber-50 p-6 rounded-xl border-2 border-amber-200 mb-6 mt-4"
                          >
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-lg font-bold text-amber-900">Edit Promise</h4>
                              <button
                                onClick={() => setEditingPromise(null)}
                                className="text-amber-600 hover:text-amber-800"
                              >
                                <X size={24} />
                              </button>
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-bold text-primary mb-2">Title</label>
                              <input
                                type="text"
                                placeholder="Enter promise title..."
                                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                value={editingPromise.title}
                                onChange={(e) => setEditingPromise({ ...editingPromise, title: e.target.value })}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                <label className="block text-sm font-bold text-primary mb-2">Status</label>
                                <select
                                  className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                  value={editingPromise.status}
                                  onChange={(e) => setEditingPromise({ ...editingPromise, status: e.target.value })}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-bold text-primary mb-2">Description</label>
                              <textarea
                                placeholder="Enter promise description..."
                                rows="3"
                                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                value={editingPromise.description}
                                onChange={(e) => setEditingPromise({ ...editingPromise, description: e.target.value })}
                              />
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-bold text-primary mb-2">Progress: {editingPromise.progress}%</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full"
                                value={editingPromise.progress}
                                onChange={(e) => setEditingPromise({ ...editingPromise, progress: parseInt(e.target.value) })}
                              />
                            </div>

                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => setEditingPromise(null)}
                                className="px-6 py-2 border border-outline-variant text-primary rounded-xl font-bold hover:bg-surface transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={updatePromise}
                                className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                              >
                                <Save size={18} /> Update Promise
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Promises List */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredPromises.length > 0 ? (
                          filteredPromises.map((promise) => (
                            <div
                              key={promise.id}
                              className="bg-white p-4 rounded-xl border border-outline-variant hover:border-primary transition-all"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h5 className="font-bold text-slate-800">{promise.title}</h5>
                                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">
                                    {promise.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      promise.status === 'Completed'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : promise.status === 'In Progress'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {promise.status}
                                  </span>
                                  <button
                                    onClick={() => setEditingPromise(promise)}
                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                    title="Edit promise"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => deletePromise(promise.id, promise.title)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete promise"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                              {promise.progress !== undefined && (
                                <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-full rounded-full transition-all"
                                    style={{ width: `${promise.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-on-surface-variant">
                            No promises found for this tracker. Create one to get started!
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: BREAKING NEWS */}
            {activeTab === 'breaking-news' && (
              <motion.div key="breaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-black text-primary font-headline mb-2">Breaking News</h3>
                    <p className="text-on-surface-variant">Create and manage breaking news alerts that appear in the dashboard</p>
                  </div>
                  <button
                    onClick={() => setShowNewsForm(!showNewsForm)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus size={20} /> Add Breaking News
                  </button>
                </div>

                {/* News Form */}
                <AnimatePresence>
                  {showNewsForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 bg-red-50 rounded-2xl p-8 border border-red-200"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-red-700">Create New Breaking News</h4>
                        <button
                          onClick={() => setShowNewsForm(false)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-bold text-red-700 mb-2">News Title</label>
                          <input
                            type="text"
                            placeholder="Breaking news headline..."
                            className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                            value={newNews.title}
                            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-red-700 mb-2">Category</label>
                          <select
                            className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                            value={newNews.category}
                            onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                          >
                            <option value="">Select a tracker...</option>
                            {trackers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-red-700 mb-2">Description</label>
                        <textarea
                          placeholder="Detailed news description..."
                          rows="3"
                          className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                          value={newNews.description}
                          onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newNews.is_breaking}
                            onChange={(e) => setNewNews({ ...newNews, is_breaking: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="font-bold text-red-700">Mark as Breaking Alert</span>
                        </label>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setShowNewsForm(false)}
                          className="px-6 py-2 border border-outline-variant text-primary rounded-xl font-bold hover:bg-surface transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            console.log('Save news:', newNews);
                            setShowNewsForm(false);
                            setNewNews({ title: '', description: '', category: '', type: 'update', is_breaking: false });
                          }}
                          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Save size={18} /> Post Breaking News
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* News List */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-outline-variant">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                      <h4 className="font-bold text-slate-800">Recent Breaking News</h4>
                    </div>
                    <p className="text-sm text-on-surface-variant">Breaking news items will appear here</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* EDIT HERO IMAGE MODAL */}
      <AnimatePresence>
        {showEditHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditHero(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">Upload Hero Section Image</h3>

              {heroImagePreview && (
                <div className="mb-6">
                  <img
                    src={heroImagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageSelect}
                className="w-full mb-6 px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-3">
                <button
                  onClick={uploadHeroImage}
                  disabled={!heroImageFile || uploadingHero}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white px-4 py-3 rounded-xl font-bold transition"
                >
                  {uploadingHero ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => {
                    setShowEditHero(false);
                    setHeroImageFile(null);
                    setHeroImagePreview(null);
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER PLACEHOLDER */}
      <footer className="bg-primary text-white mt-12 border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm">
          <p>नेपाल ट्रयाकर. • Dashboard Admin Panel © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default HomepageDashboard;
