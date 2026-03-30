import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';

const PromiseFormModal = ({ isOpen, onClose, editingPromise }) => {
  const { categories, addPromise, updatePromise, addCategory } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 1,
    status: 'Pending',
    progress: 0
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (editingPromise) {
      setFormData({
        title: editingPromise.title,
        description: editingPromise.description,
        categoryId: editingPromise.categoryId,
        status: editingPromise.status,
        progress: editingPromise.progress
      });
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: categories.length > 0 ? categories[0].id : 1,
        status: 'Pending',
        progress: 0
      });
    }
    setError(null);
    setShowNewCategoryForm(false);
    setNewCategoryName('');
  }, [editingPromise, isOpen, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Promise title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Promise description is required');
      return;
    }

    try {
      setSaving(true);
      if (editingPromise) {
        await updatePromise(editingPromise.id, formData);
      } else {
        await addPromise(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save promise');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSaving(true);
      const newCategory = addCategory({
        name: newCategoryName,
        icon: 'Layers',
        color: 'bg-primary/10 text-primary'
      });
      setFormData({ ...formData, categoryId: newCategory.id });
      setShowNewCategoryForm(false);
      setNewCategoryName('');
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">
                  {editingPromise ? 'Edit Promise' : 'Add New Promise'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Promise Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Promise Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    placeholder="e.g., Improve public healthcare services"
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-500">{formData.title.length}/200</p>
                </div>

                {/* Promise Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none"
                    placeholder="Provide detailed description..."
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500">{formData.description.length}/500</p>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category *</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    >
                      <option value="">-- Select a category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                      className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center gap-1"
                      title="Create new category"
                    >
                      <Plus className="w-4 h-4" />
                      New
                    </button>
                  </div>

                  {/* New Category Form */}
                  {showNewCategoryForm && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                        maxLength={100}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        disabled={saving || !newCategoryName.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryForm(false);
                          setNewCategoryName('');
                        }}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Progress: {formData.progress}%</label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: Math.min(100, Math.max(0, Number(e.target.value))) })}
                      className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-center"
                    />
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingPromise ? 'Update' : 'Add'} Promise
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromiseFormModal;
