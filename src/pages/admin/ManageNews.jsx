import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, AlertCircle, CheckCircle2, Edit2, Eye, EyeOff } from 'lucide-react';
import NewsFormModal from '../../components/admin/NewsFormModal';

const ManageNews = () => {
  const { newsUpdates, categories, loading, updateNewsUpdate, deleteNewsUpdate } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [success, setSuccess] = useState(null);

  const filteredNews = newsUpdates.filter(n => 
    (n.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (n.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item) => {
    setEditingNews(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('यो समाचार हटाउन चाहनुहुन्छ?')) return;
    
    try {
      setDeleting(id);
      setDeleteError(null);
      await deleteNewsUpdate(id);
      setSuccess('समाचार सफलतापूर्वक हटाइयो');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (news) => {
    try {
      await updateNewsUpdate(news.id, { is_published: !news.is_published });
      setSuccess(`समाचार ${news.is_published ? 'अप्रकाशित' : 'प्रकाशित'} गरिएको छ`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'अज्ञात';
  };

  const getNewsTypeLabel = (type) => {
    const labels = {
      'update': 'अपडेट',
      'news': 'समाचार',
      'progress': 'प्रगति'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">समाचार र अपडेटहरू</h1>
          <p className="text-on-surface-variant mt-2">प्रतिबद्धता ट्रयाकिङको समाचार र अपडेटहरू व्यवस्थापन गर्नुहोस्</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition"
        >
          <Plus size={20} />
          नयाँ समाचार थप्नुहोस्
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}
      
      {deleteError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <AlertCircle size={20} />
          {deleteError}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="समाचार खोज गर्नुहोस्..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-on-surface">शीर्षक</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-on-surface">श्रेणी</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-on-surface">किसिम</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-on-surface">स्रोत</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-on-surface">अवस्था</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-on-surface">कार्य</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant">
                    कुनै समाचार भेटिएन
                  </td>
                </tr>
              ) : (
                filteredNews.map((news) => (
                  <tr key={news.id} className="border-b border-outline-variant hover:bg-surface-container/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {news.thumbnail_url && (
                          <img 
                            src={news.thumbnail_url} 
                            alt={news.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-bold text-primary line-clamp-1">{news.title}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-1">{news.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{getCategoryName(news.category_id)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                        {getNewsTypeLabel(news.news_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {news.source_name ? (
                        <a 
                          href={news.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {news.source_name}
                        </a>
                      ) : (
                        <span className="text-on-surface-variant">कुनै छैन</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(news)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition"
                        style={{
                          backgroundColor: news.is_published ? '#dcfce7' : '#fee2e2',
                          color: news.is_published ? '#22c55e' : '#ef4444'
                        }}
                      >
                        {news.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                        {news.is_published ? 'प्रकाशित' : 'अप्रकाशित'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(news)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
                          disabled={deleting === news.id}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <NewsFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNews(null);
        }}
        editingNews={editingNews}
        categories={categories}
      />
    </div>
  );
};

export default ManageNews;
