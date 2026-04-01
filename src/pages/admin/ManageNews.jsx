import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Save, ExternalLink, Globe, Layout } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageNews = () => {
  const { newsUpdates, categories, promises, addNewsUpdate, updateNewsUpdate, deleteNewsUpdate, uploadImage, operationLoading } = useData();
  const [message, setMessage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source_name: '',
    source_url: '',
    news_type: 'update',
    category_id: '',
    promise_id: '',
    image_url: '',
    is_published: true
  });

  const [editingId, setEditingId] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setImagePreview(url);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      setMessage({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingId) {
        await updateNewsUpdate(editingId, formData);
        setMessage({ type: 'success', text: 'Update modified successfully!' });
      } else {
        await addNewsUpdate(formData);
        setMessage({ type: 'success', text: 'New update published!' });
      }
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', source_name: '', source_url: '', news_type: 'update', category_id: '', promise_id: '', image_url: '', is_published: true });
      setImagePreview(null);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    }
  };

  const handleEdit = (update) => {
    setFormData({
      title: update.title,
      description: update.description || '',
      source_name: update.source_name || '',
      source_url: update.source_url || '',
      news_type: update.news_type || 'update',
      category_id: update.category_id || '',
      promise_id: update.promise_id || '',
      image_url: update.image_url || '',
      is_published: update.is_published ?? true
    });
    setImagePreview(update.image_url);
    setEditingId(update.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this update?')) return;
    try {
      await deleteNewsUpdate(id);
      setMessage({ type: 'success', text: 'Update deleted!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${err.message}` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-display">🗞️ News & Progress Timeline</h1>
          <p className="text-slate-500 font-medium mt-1">Manage progress updates and news items for the homepage timeline.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Update
        </button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl border flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto opacity-50"><X size={18} /></button>
        </motion.div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Update' : 'Publish Progress Update'}</h2>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-50 rounded-full"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Headline</label>
                     <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Detail Content</label>
                     <textarea rows="5" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.news_type} onChange={e => setFormData({...formData, news_type: e.target.value})}>
                          <option value="update">Progress Update</option>
                          <option value="news">News Article</option>
                          <option value="milestone">Milestone</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <input type="checkbox" id="pub" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-5 h-5 accent-emerald-500" />
                        <label htmlFor="pub" className="text-xs font-black uppercase tracking-widest text-slate-600">Published</label>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Link Category</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                          <option value="">General / None</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Link Promise</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.promise_id} onChange={e => setFormData({...formData, promise_id: e.target.value})}>
                          <option value="">None</option>
                          {promises.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                      </div>
                   </div>
                   <div className="relative h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                             <Upload className="text-white" />
                             <input type="file" className="hidden" onChange={handleImageUpload} />
                          </label>
                        </>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer text-slate-400">
                           <ImageIcon size={32} />
                           <span className="text-[10px] font-black mt-2">Upload Image (Unsplash recommended)</span>
                           <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                      {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Source Name (e.g. OnlineKhabar)" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold" value={formData.source_name} onChange={e => setFormData({...formData, source_name: e.target.value})} />
                      <input type="url" placeholder="Source URL" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold" value={formData.source_url} onChange={e => setFormData({...formData, source_url: e.target.value})} />
                   </div>
                   <button type="submit" disabled={operationLoading} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-premium flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                      {operationLoading ? <Loader2 className="animate-spin" /> : <Save />}
                      {editingId ? 'Save Changes' : 'Publish to Homepage'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {newsUpdates.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
             <Globe size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500 font-bold">No updates published yet.</p>
          </div>
        ) : (
          newsUpdates.map(update => (
            <motion.div layout key={update.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-6 hover:shadow-premium transition-all group">
              <div className="w-32 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                 {update.image_url ? <img src={update.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Layout size={24} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${update.news_type === 'update' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{update.news_type}</span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(update.created_at).toLocaleDateString()}</span>
                 </div>
                 <h4 className="font-bold text-slate-800 line-clamp-1 mb-1">{update.title}</h4>
                 <p className="text-xs text-slate-500 line-clamp-2">{update.description}</p>
                 <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => handleEdit(update)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(update.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    {update.source_url && <a href={update.source_url} target="_blank" className="p-2 text-slate-400 hover:text-blue-500"><ExternalLink size={16} /></a>}
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageNews;
