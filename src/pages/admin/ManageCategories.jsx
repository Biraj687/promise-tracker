import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Trash2, Plus, Edit2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import CategoryFormModal from '../../components/admin/CategoryFormModal';

const categoryIcons = ['Gavel', 'Globe', 'TrendingUp', 'Wheat', 'Briefcase', 'HardHat', 'Zap', 'GraduationCap', 'Stethoscope', 'Mountain', 'Activity', 'Users'];

const colorOptions = [
  { label: 'Blue', value: "bg-blue-100 text-[#2552f5]" },
  { label: 'Indigo', value: "bg-indigo-100 text-indigo-800" },
  { label: 'Green', value: "bg-green-100 text-green-800" },
  { label: 'Amber', value: "bg-amber-100 text-amber-800" },
  { label: 'Orange', value: "bg-orange-100 text-orange-800" },
  { label: 'Slate', value: "bg-slate-100 text-slate-800" },
  { label: 'Yellow', value: "bg-yellow-100 text-yellow-800" },
  { label: 'Cyan', value: "bg-cyan-100 text-cyan-800" },
  { label: 'Red', value: "bg-red-100 text-red-800" },
  { label: 'Emerald', value: "bg-emerald-100 text-emerald-800" },
  { label: 'Pink', value: "bg-pink-100 text-pink-800" },
  { label: 'Purple', value: "bg-purple-100 text-purple-800" }
];

const ManageCategories = () => {
  const { categories, deleteCategory, getPromisesByCategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setDeleting(categoryId);
      setDeleteError(null);
      deleteCategory(categoryId);
      setSuccess(`Category deleted successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const getPromiseCount = (categoryId) => {
    return getPromisesByCategory(categoryId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">Manage Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Create, edit, and delete promise categories.</p>
        </div>
        
        <button
          onClick={handleAddCategory}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const promiseCount = getPromiseCount(category.id);
          const isDeleting = deleting === category.id;

          return (
            <div
              key={category.id}
              className={`bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow ${category.color}`}
            >
              {/* Category Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 line-clamp-2">{category.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">ID: {category.id}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isDeleting || promiseCount > 0}
                    className={`p-2 rounded-lg transition-colors ${
                      promiseCount > 0
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title={promiseCount > 0 ? `Cannot delete: ${promiseCount} promise(s) using this category` : 'Delete category'}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Promise Count */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Promises using this category:</span>
                <span className="text-lg font-bold text-slate-800">{promiseCount}</span>
              </div>

              {/* Created Date */}
              <p className="text-xs text-slate-500 mt-3">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-500 mb-4">No categories found.</p>
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Category
          </button>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default ManageCategories;
