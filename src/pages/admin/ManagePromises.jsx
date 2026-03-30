import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Loader2, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import PromiseFormModal from '../../components/admin/PromiseFormModal';

const ManagePromises = () => {
  const { promises, categories, loading, updatePromise, deletePromise } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromise, setEditingPromise] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredPromises = promises.filter(p => 
    (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (p.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating({ id, field: 'status' });
      await updatePromise(id, { status: newStatus });
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleProgressChange = async (id, newProgress) => {
    try {
      setUpdating({ id, field: 'progress' });
      await updatePromise(id, { progress: Number(newProgress) });
    } catch (err) {
      alert("Failed to update progress");
    } finally {
      setUpdating(null);
    }
  };

  const handleAddPromise = () => {
    setEditingPromise(null);
    setIsModalOpen(true);
  };

  const handleEditPromise = (promise) => {
    setEditingPromise(promise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromise(null);
    setSuccess(null);
  };

  const handleDeletePromise = async (promiseId) => {
    if (!window.confirm('Are you sure you want to delete this promise?')) return;
    
    try {
      setDeleting(promiseId);
      setDeleteError(null);
      await deletePromise(promiseId);
      setSuccess('Promise deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete promise');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">Manage Promises</h1>
          <p className="text-slate-500 text-sm">Create, update, and manage government promises.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64"
              placeholder="Search promises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddPromise}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Promise
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {deleteError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{deleteError}</p>
        </div>
      )}

      {/* Promises Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-sm text-slate-700">ID</th>
                <th className="py-4 px-6 font-semibold text-sm text-slate-700">Title</th>
                <th className="py-4 px-6 font-semibold text-sm text-slate-700">Category</th>
                <th className="py-4 px-6 font-semibold text-sm text-slate-700 w-40">Status</th>
                <th className="py-4 px-6 font-semibold text-sm text-slate-700 w-32">Progress</th>
                <th className="py-4 px-6 font-semibold text-sm text-slate-700 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromises.map((promise) => {
                const category = categories.find(c => c.id === promise.categoryId);
                const isUpdatingStatus = updating?.id === promise.id && updating?.field === 'status';
                const isUpdatingProgress = updating?.id === promise.id && updating?.field === 'progress';
                const isDeleting = deleting === promise.id;

                return (
                  <tr key={promise.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-500">#{promise.id}</td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">{promise.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">{promise.description}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 line-clamp-1 truncate max-w-[150px]">
                      {category ? category.name : `Category ${promise.categoryId}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <select
                          value={promise.status}
                          onChange={(e) => handleStatusChange(promise.id, e.target.value)}
                          disabled={isUpdatingStatus}
                          className={`text-sm rounded-lg px-3 py-1.5 border appearance-none pr-8 focus:ring-2 disabled:opacity-50 ${
                            promise.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/50' :
                            promise.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/50' :
                            'bg-slate-50 text-slate-700 border-slate-200 focus:ring-slate-500/50'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        {isUpdatingStatus && <Loader2 className="w-3 h-3 animate-spin absolute right-2 top-2.5 text-slate-500" />}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={promise.progress}
                          onChange={(e) => handleProgressChange(promise.id, e.target.value)}
                          disabled={isUpdatingProgress}
                          className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/50 disabled:bg-slate-100"
                        />
                        <span className="text-sm text-slate-500">%</span>
                        {isUpdatingProgress && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditPromise(promise)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
                          title="Edit promise"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeletePromise(promise.id)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-600 hover:text-red-600 disabled:opacity-50"
                          title="Delete promise"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPromises.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No promises found. {searchTerm ? 'Try a different search.' : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promise Form Modal */}
      <PromiseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingPromise={editingPromise}
      />
    </div>
  );
};

export default ManagePromises;
