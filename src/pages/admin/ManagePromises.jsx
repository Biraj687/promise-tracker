import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronDown, X, Upload, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Save, Tags, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManagePromises = () => {
  const { categories, promises, updateCategory, addPromise, updatePromise, deletePromise, uploadImage, operationLoading, uploadedImages, lastUploadedImage, fetchUploadedImages } = useData();
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Show all categories
  const mainTrackers = categories;
  
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
    progress: 0,
    hero_image_url: '',
    point_no: 0,
    responsible_ministry: 'Administrative Office',
    target_date: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [promiseImagePreview, setPromiseImagePreview] = useState(null);
  const [editingPromise, setEditingPromise] = useState(null);
  const [expandedPromise, setExpandedPromise] = useState(null);
  const [promiseSaving, setPromiseSaving] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setMessage(null);  // Clear previous messages
      
      console.log('🔄 Handling hero image upload:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const publicUrl = await uploadImage(file);
      console.log('✅ Upload successful, URL:', publicUrl);
      
      setHeroImagePreview(publicUrl);
      setEditHeroData(prev => ({ ...prev, image_url: publicUrl }));
      setMessage({ type: 'success', text: '✅ Tracker image uploaded successfully!' });
      
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
      setUploading(false);
    }
  };

  const handlePromiseImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      setMessage(null);  // Clear previous messages
      
      console.log('🔄 Handling image upload:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const publicUrl = await uploadImage(file);
      console.log('✅ Upload successful, URL:', publicUrl);
      
      setPromiseImagePreview(publicUrl);
      if (editingPromise) {
        setEditingPromise(prev => ({ ...prev, hero_image_url: publicUrl }));
      } else {
        setNewPromise(prev => ({ ...prev, hero_image_url: publicUrl }));
      }
      setMessage({ type: 'success', text: '✅ Promise image uploaded successfully!' });
      
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
      setUploading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (editingPromise) {
        setEditingPromise(p => ({ ...p, tags: [...(p.tags || []), newTag.trim()] }));
      } else {
        setNewPromise(p => ({ ...p, tags: [...(p.tags || []), newTag.trim()] }));
      }
      setNewTag('');
      e.preventDefault();
    }
  };

  const removeTag = (tagToRemove) => {
    if (editingPromise) {
      setEditingPromise(p => ({ ...p, tags: p.tags.filter(t => t !== tagToRemove) }));
    } else {
      setNewPromise(p => ({ ...p, tags: p.tags.filter(t => t !== tagToRemove) }));
    }
  };

  const handleAddPromise = async () => {
    if (!selectedTracker || !newPromise.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    try {
      setPromiseSaving(true);
      const res = await addPromise({
        ...newPromise,
        categoryId: selectedTracker.id
      });
      setMessage({ type: 'success', text: 'Promise added successfully!' });
      setShowAddPromiseForm(false);
      setTrackerPromises(prev => [...prev, res]);
      setNewPromise({ title: '', description: '', status: 'Pending', progress: 0, hero_image_url: '', point_no: trackerPromises.length + 2, responsible_ministry: 'Administrative Office', target_date: '', tags: [] });
      setPromiseImagePreview(null);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setPromiseSaving(false);
    }
  };

  const handleSavePromiseEdit = async () => {
    if (!editingPromise) return;
    try {
      setPromiseSaving(true);
      await updatePromise(editingPromise.id, editingPromise);
      setMessage({ type: 'success', text: 'Promise updated!' });
      setTrackerPromises(prev => prev.map(p => p.id === editingPromise.id ? editingPromise : p));
      setEditingPromise(null);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setPromiseSaving(false);
    }
  };

  const handleOpenManageModal = (tracker) => {
    setSelectedTracker(tracker);
    setEditHeroData({ name: tracker.name, description: tracker.description || '', image_url: tracker.image_url || '' });
    setHeroImagePreview(tracker.image_url || null);
    const pms = promises.filter(p => (p.categoryId || p.category_id) === tracker.id);
    setTrackerPromises(pms);
    setManageModal(true);
  };

  const handleSaveHeroSection = async () => {
    try {
      setEditingSaving(true);
      await updateCategory(selectedTracker.id, editHeroData);
      setMessage({ type: 'success', text: 'Tracker updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setEditingSaving(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-display">🗳️ Manage Balen-Tracker Content</h1>
          <p className="text-slate-500 font-medium mt-1">Manage categories, promises, and their progress across {mainTrackers.length} divisions.</p>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex items-center gap-3 font-bold ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100"><X size={18} /></button>
        </motion.div>
      )}

      {/* Image Gallery */}
      {uploadedImages && uploadedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem] border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ImageIcon size={24} className="text-blue-500" />
            📸 Uploaded Images Gallery ({uploadedImages.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages.map((image) => (
              <motion.div
                key={image.id}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer"
                title={image.filename || 'Image'}
              >
                <img 
                  src={image.image_url} 
                  alt={image.filename || 'Uploaded image'}
                  className="w-full h-32 object-cover rounded-lg border border-slate-300 group-hover:border-blue-400 transition-colors"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.image_url);
                      setMessage({ type: 'success', text: '✅ Image URL copied!' });
                    }}
                    className="bg-white text-slate-800 px-2 py-1 rounded text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mainTrackers.map((tracker) => {
          const pms = promises.filter(p => (p.categoryId || p.category_id) === tracker.id);
          const completed = pms.filter(p => p.status === 'Completed').length;
          const progress = pms.length > 0 ? Math.round((completed / pms.length) * 100) : 0;

          return (
            <motion.div
              layout key={tracker.id}
              className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-premium transition-all group"
            >
              <div className="h-40 relative">
                {tracker.image_url ? (
                  <img src={tracker.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4">
                   <h3 className="text-white font-black text-xl font-display drop-shadow-md">{tracker.name}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                   <span>Progress</span>
                   <span className={progress === 100 ? 'text-emerald-500' : 'text-primary'}>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between pt-2">
                   <span className="text-xs font-bold text-slate-500">{pms.length} Promises</span>
                   <button
                    onClick={() => handleOpenManageModal(tracker)}
                    className="p-2 bg-slate-50 text-slate-800 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {manageModal && selectedTracker && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[2.5rem]">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 font-display">✏️ Manage Tracker: {selectedTracker.name}</h2>
                  <p className="text-sm font-medium text-slate-500">{trackerPromises.length} Promises in this category</p>
                </div>
                <button onClick={() => setManageModal(false)} className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
                
                {/* Hero Section Edit */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest">Section Branding</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
                          <input 
                            type="text" value={editHeroData.name} 
                            onChange={e => setEditHeroData({...editHeroData, name: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                          <textarea 
                            rows="3" value={editHeroData.description} 
                            onChange={e => setEditHeroData({...editHeroData, description: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                          />
                        </div>
                        <button 
                          onClick={handleSaveHeroSection} disabled={editingSaving}
                          className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                        >
                          {editingSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Save Header Branding
                        </button>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Header Image</label>
                        <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 group">
                           {heroImagePreview ? (
                             <>
                               <img src={heroImagePreview} className="w-full h-full object-cover" alt="" />
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <label className="cursor-pointer bg-white text-slate-800 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                                     <Upload size={16} /> Change
                                     <input type="file" className="hidden" onChange={handleHeroImageUpload} />
                                  </label>
                               </div>
                             </>
                           ) : (
                             <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                <ImageIcon size={40} className="text-slate-300 mb-2" />
                                <span className="text-xs font-bold text-slate-400">Upload Header Image</span>
                                <input type="file" className="hidden" onChange={handleHeroImageUpload} />
                             </label>
                           )}
                           {uploading && (
                             <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <Loader2 size={32} className="animate-spin text-primary" />
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* Promises Management */}
                <section className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xs font-black text-primary uppercase tracking-widest">Promises Registry</h3>
                      <p className="text-sm font-medium text-slate-400 mt-1">Manage individual commitments in this group.</p>
                    </div>
                    {!showAddPromiseForm && (
                      <button 
                        onClick={() => setShowAddPromiseForm(true)}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-primary/20 transition-all"
                      >
                        <Plus size={18} /> New Promise
                      </button>
                    )}
                  </div>

                  {/* Add New Promise Form */}
                  <AnimatePresence>
                    {showAddPromiseForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-primary/5 rounded-[2rem] border border-primary/20 p-8 space-y-6">
                         <div className="flex justify-between items-center">
                           <h4 className="font-bold text-primary flex items-center gap-2"><Plus size={18} /> Create New Commitment</h4>
                           <button onClick={() => setShowAddPromiseForm(false)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <input type="text" placeholder="Promise Title" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" value={newPromise.title} onChange={e => setNewPromise({...newPromise, title: e.target.value})} />
                               <textarea rows="4" placeholder="Full Description" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-medium" value={newPromise.description} onChange={e => setNewPromise({...newPromise, description: e.target.value})} />
                               <div className="flex gap-2 flex-wrap">
                                  {newPromise.tags.map(t => (
                                    <span key={t} className="px-3 py-1 bg-white border border-primary/20 text-primary text-[10px] font-black uppercase rounded-full flex items-center gap-2">
                                       {t} <button onClick={() => removeTag(t)}><X size={10} /></button>
                                    </span>
                                  ))}
                                  <input type="text" placeholder="Add tag + Enter" className="flex-1 min-w-[120px] bg-transparent outline-none text-[10px] font-bold" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={handleAddTag} />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="flex gap-4">
                                  <select className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs" value={newPromise.status} onChange={e => setNewPromise({...newPromise, status: e.target.value})}>
                                     <option value="Pending">Pending</option>
                                     <option value="Planning">Planning</option>
                                     <option value="In Progress">In Progress</option>
                                     <option value="Completed">Completed</option>
                                  </select>
                                  <div className="w-32 px-5 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2">
                                     <span className="text-[10px] font-black text-slate-400">%</span>
                                     <input type="number" className="w-full bg-transparent outline-none font-bold text-xs" value={newPromise.progress} onChange={e => setNewPromise({...newPromise, progress: e.target.value})} />
                                  </div>
                               </div>
                               <input type="text" placeholder="Responsible Ministry" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" value={newPromise.responsible_ministry} onChange={e => setNewPromise({...newPromise, responsible_ministry: e.target.value})} />
                               <div className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl">
                                  <Calendar size={18} className="text-slate-400" />
                                  <input type="date" className="w-full bg-transparent outline-none font-bold" value={newPromise.target_date} onChange={e => setNewPromise({...newPromise, target_date: e.target.value})} />
                               </div>
                               <div className="h-32 bg-white border border-dashed border-primary/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                  {promiseImagePreview ? <img src={promiseImagePreview} className="w-full h-full object-cover" /> : (
                                    <label className="flex flex-col items-center cursor-pointer text-primary/50">
                                       <ImageIcon size={24} /> <span className="text-[10px] font-bold uppercase mt-1">Upload Hero Image</span>
                                       <input type="file" className="hidden" onChange={handlePromiseImageUpload} />
                                    </label>
                                  )}
                               </div>
                            </div>
                         </div>
                         <button onClick={handleAddPromise} disabled={promiseSaving} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-premium flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                            {promiseSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                            Save Promise to Registry
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* List of Existing Promises */}
                  <div className="space-y-4">
                    {trackerPromises.map((promise) => {
                      const isEditing = editingPromise?.id === promise.id;
                      const isExpanded = expandedPromise === promise.id;

                      return (
                        <div key={promise.id} className={`border rounded-[2rem] overflow-hidden transition-all ${isEditing ? 'border-primary ring-4 ring-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                           <div className={`p-6 flex items-center gap-6 ${isEditing ? 'bg-primary/5' : isExpanded ? 'bg-slate-50' : 'bg-white'}`}>
                              <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                 {promise.hero_image_url ? <img src={promise.hero_image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                 {isEditing ? (
                                   <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold" value={editingPromise.title} onChange={e => setEditingPromise({...editingPromise, title: e.target.value})} />
                                 ) : (
                                   <h5 className="font-bold text-slate-800 line-clamp-1">{promise.title}</h5>
                                 )}
                                 <div className="flex items-center gap-3 mt-1.5">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${promise.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{promise.status}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{promise.progress}% Complete</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 {isEditing ? (
                                   <>
                                      <button onClick={handleSavePromiseEdit} className="p-2 bg-primary text-white rounded-lg"><Save size={18} /></button>
                                      <button onClick={() => setEditingPromise(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg"><X size={18} /></button>
                                   </>
                                 ) : (
                                   <>
                                      <button onClick={() => setEditingPromise({...promise})} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"><Edit2 size={18} /></button>
                                      <button onClick={() => setExpandedPromise(isExpanded ? null : promise.id)} className={`p-2 transition-transform ${isExpanded ? 'rotate-180 text-primary' : 'text-slate-400'}`}><ChevronDown size={18} /></button>
                                   </>
                                 )}
                              </div>
                           </div>
                           
                           {/* Expanded Detail / Quick Edit */}
                           <AnimatePresence>
                              {isExpanded && !isEditing && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-slate-50 border-t border-slate-100 p-8 space-y-6">
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ministry</p>
                                            <p className="text-sm font-bold text-slate-800">{promise.responsible_ministry}</p>
                                         </div>
                                         <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description</p>
                                            <p className="text-xs font-medium text-slate-600 leading-relaxed">{promise.description}</p>
                                         </div>
                                      </div>
                                      <div className="space-y-4">
                                         <div className="flex justify-between items-center mb-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rapid Progress Edit</p>
                                            <span className="text-sm font-black text-primary">{promise.progress}%</span>
                                         </div>
                                         <input type="range" className="w-full accent-primary" value={promise.progress} onChange={e => {
                                            const updated = {...promise, progress: Number(e.target.value)};
                                            setTrackerPromises(prev => prev.map(p => p.id === promise.id ? updated : p));
                                            updatePromise(promise.id, { progress: Number(e.target.value) });
                                         }} />
                                         <div className="flex gap-2 pt-2">
                                            {['Pending', 'Planning', 'In Progress', 'Completed'].map(s => (
                                              <button 
                                                key={s} onClick={() => {
                                                  const updated = {...promise, status: s};
                                                  setTrackerPromises(prev => prev.map(p => p.id === promise.id ? updated : p));
                                                  updatePromise(promise.id, { status: s });
                                                }}
                                                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg border transition-all ${promise.status === s ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400'}`}
                                              >
                                                {s}
                                              </button>
                                            ))}
                                         </div>
                                      </div>
                                   </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4 rounded-b-[2.5rem]">
                  <button onClick={() => setManageModal(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50">Close Manager</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePromises;
