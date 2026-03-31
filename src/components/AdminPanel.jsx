import React, { useState, useMemo, useRef } from 'react';
import { 
  ChevronDown, ChevronUp, Search, Filter, Download, Clock, Save, 
  Layers, Megaphone, CheckCircle, Plus, Trash2, Image as ImageIcon,
  Edit2, ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';

function AdminPanel({ promises, onUpdatePromise, stats, darkMode }) {
  const { 
    categories, addCategory, updateCategory, 
    news, addNews, updateNews, deleteNews,
    uploadImage, operationLoading 
  } = useData();
  
  const [activeTab, setActiveTab] = useState('promises');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('point_no');
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Filter and sort promises
  const filteredPromises = useMemo(() => {
    let filtered = promises;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.point_no.toString().includes(searchTerm) ||
        (p.ministry_responsible || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      // Find category ID by name
      const cat = categories.find(c => c.name === activeCategory);
      if (cat) {
        filtered = filtered.filter(p => p.category_id === cat.id);
      }
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'status':
          const statusOrder = { 'Completed': 0, 'In Progress': 1, 'Pending': 2, 'Delayed': 3 };
          return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
        case 'deadline':
          return (a.deadline_days || 0) - (b.deadline_days || 0);
        default:
          return a.point_no - b.point_no;
      }
    });

    return sorted;
  }, [promises, searchTerm, activeCategory, sortBy, categories]);

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Delayed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || colors['Pending'];
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 mb-2">
        <TabButton 
          active={activeTab === 'promises'} 
          onClick={() => setActiveTab('promises')}
          icon={<CheckCircle size={18} />}
          label="Promises"
        />
        <TabButton 
          active={activeTab === 'categories'} 
          onClick={() => setActiveTab('categories')}
          icon={<Layers size={18} />}
          label="Categories"
        />
        <TabButton 
          active={activeTab === 'news'} 
          onClick={() => setActiveTab('news')}
          icon={<Megaphone size={18} />}
          label="News & Updates"
        />
      </div>

      {activeTab === 'promises' && (
        <>
          {/* Admin Controls Header */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              🛡️ Promise Management
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
              <StatBox label="Total" value={stats.total} color="blue" />
              <StatBox label="Completed" value={stats.completed} color="green" />
              <StatBox label="In Progress" value={stats.inProgress} color="blue" />
              <StatBox label="Pending" value={stats.pending} color="amber" />
              <StatBox label="Delayed" value={stats.delayed} color="red" />
              <StatBox label="Avg Progress" value={`${stats.percentage}%`} color="purple" />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by description, point number, or ministry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Category
                  </label>
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="point_no">Point Number</option>
                    <option value="progress">Progress (High to Low)</option>
                    <option value="status">Status</option>
                    <option value="deadline">Deadline (Days)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg text-center">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                      {filteredPromises.length} of {promises.length} promises
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPromises.map(promise => (
              <AdminPromiseCard
                key={promise.id}
                promise={promise}
                isExpanded={expandedId === promise.id}
                onToggleExpand={() => setExpandedId(expandedId === promise.id ? null : promise.id)}
                onUpdatePromise={onUpdatePromise}
                getStatusColor={getStatusColor}
                getProgressColor={getProgressColor}
                expandedHistoryId={expandedHistoryId}
                onToggleHistory={() => setExpandedHistoryId(expandedHistoryId === promise.id ? null : promise.id)}
                categoryName={categories.find(c => c.id === promise.category_id)?.name || 'Unknown'}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <CategoryManager 
          categories={categories} 
          onUpdate={updateCategory} 
          onAdd={addCategory}
          onUpload={uploadImage}
          loading={operationLoading}
        />
      )}

      {activeTab === 'news' && (
        <NewsManager 
          news={news} 
          categories={categories}
          promises={promises}
          onAdd={addNews}
          onUpdate={updateNews}
          onDelete={deleteNews}
          onUpload={uploadImage}
          loading={operationLoading}
        />
      )}
    </div>
  );
}

// Support Components
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CategoryManager({ categories, onUpdate, onAdd, onUpload, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', icon: '', color: '', image_url: '' });
  const fileInputRef = useRef(null);

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, icon: cat.icon, color: cat.color, image_url: cat.image_url || '' });
  };

  const handleSave = async (id) => {
    await onUpdate(id, editForm);
    setEditingId(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await onUpload(file);
      setEditForm(prev => ({ ...prev, image_url: url }));
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="text-blue-500" /> Category Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl relative group">
            {editingId === cat.id ? (
              <div className="space-y-3">
                <input 
                  className="w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
                <input 
                  className="w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs"
                  placeholder="Lucide Icon Name"
                  value={editForm.icon}
                  onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded ${editForm.image_url ? '' : 'bg-slate-200'} overflow-hidden`}>
                    {editForm.image_url && <img src={editForm.image_url} alt="cat" className="w-full h-full object-cover" />}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    Change Image
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSave(cat.id)} className="flex-1 bg-green-500 text-white rounded py-1 text-sm font-bold">Save</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-300 text-slate-700 rounded py-1 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={20} /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{cat.name}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <CheckCircle size={10} /> 0 Promises
                      </p>
                    </div>
                  </div>
                  <button onClick={() => startEdit(cat)} className="p-1 hover:bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={14} className="text-slate-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsManager({ news, categories, promises, onAdd, onUpdate, onDelete, onUpload, loading }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', source_url: '', category_id: '', promise_id: '' });
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ ...form, published_at: new Date().toISOString() });
    setShowAddForm(false);
    setForm({ title: '', description: '', image_url: '', source_url: '', category_id: '', promise_id: '' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await onUpload(file);
      setForm(prev => ({ ...prev, image_url: url }));
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="text-purple-500" /> News & Progress Updates
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          {showAddForm ? 'Close' : <><Plus size={18} /> Add Update</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Title</label>
              <input required className="w-full px-3 py-2 rounded border" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Description</label>
              <textarea className="w-full px-3 py-2 rounded border h-20" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Source URL</label>
              <input className="w-full px-3 py-2 rounded border" value={form.source_url} onChange={e => setForm({ ...form, source_url: e.target.value })} />
            </div>
          </div>
          <div className="space-y-4">
             <div>
              <label className="block text-xs font-bold mb-1">Category (Optional)</label>
              <select className="w-full px-3 py-2 rounded border" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Image Thumbnail</label>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-white border rounded overflow-hidden flex items-center justify-center">
                  {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
                </div>
                <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg">Upload Image</button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white rounded-xl py-3 font-bold mt-4">
              {loading ? 'Publishing...' : 'Publish Update'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {news.length === 0 ? (
          <div className="text-center py-10 text-slate-500 italic">No news updates yet.</div>
        ) : (
          news.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image_url || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(item.published_at).toLocaleDateString()}
                  </span>
                  {item.source_url && (
                    <a href={item.source_url} target="_blank" className="text-[10px] text-blue-500 flex items-center gap-1 hover:underline">
                      <ExternalLink size={10} /> Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Stats Components
function StatBox({ label, value, color }) {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  };

  return (
    <div className={`p-3 rounded-lg ${colorMap[color]}`}>
      <p className="text-xs font-semibold opacity-75">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function AdminPromiseCard({
  promise,
  isExpanded,
  onToggleExpand,
  onUpdatePromise,
  getStatusColor,
  getProgressColor,
  expandedHistoryId,
  onToggleHistory,
  categoryName
}) {
  const [localStatus, setLocalStatus] = useState(promise.status);
  const [localProgress, setLocalProgress] = useState(promise.progress || 0);
  const [localNotes, setLocalNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    await onUpdatePromise(promise.id, {
      status: localStatus,
      progress: localProgress,
      // Logic for update_history would go here
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Promise #{promise.point_no}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(localStatus)}`}>
                {localStatus}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{promise.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">{categoryName}</span>
              {promise.ministry_responsible && (
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                  {promise.ministry_responsible}
                </span>
              )}
            </div>
          </div>
          <button onClick={onToggleExpand} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Overall Progress</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{localProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className={`h-full ${getProgressColor(localProgress)} transition-all duration-300`} style={{ width: `${localProgress}%` }} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2">Status</label>
              <select value={localStatus} onChange={(e) => setLocalStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2">Progress Slider</label>
              <input type="range" min="0" max="100" value={localProgress} onChange={(e) => setLocalProgress(parseInt(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
          </div>
          <button onClick={handleSave} className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            <Save size={18} /> {isSaved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
