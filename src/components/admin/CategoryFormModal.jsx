import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

const categoryIcons = [
  'Gavel', 'Globe', 'TrendingUp', 'Wheat', 'Briefcase', 'HardHat',
  'Zap', 'GraduationCap', 'Stethoscope', 'Mountain', 'Activity', 'Users'
];

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

const CategoryFormModal = ({ isOpen, onClose, editingCategory }) => {
  const { addCategory, updateCategory } = useData();
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Gavel',
    color: "bg-blue-100 text-[#2552f5]"
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        icon: editingCategory.icon || 'Gavel',
        color: editingCategory.color || "bg-blue-100 text-[#2552f5]"
      });
    } else {
      setFormData({
        name: '',
        icon: 'Gavel',
        color: "bg-blue-100 text-[#2552f5]"
      });
    }
    setError(null);
  }, [editingCategory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        updateCategory(editingCategory.id, formData);
      } else {
        addCategory(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category');
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
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

                {/* Category Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    placeholder="e.g., Digital Governance"
                    maxLength={100}
                  />
                  <p className="text-xs text-slate-500">{formData.name.length}/100</p>
                </div>

                {/* Icon Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {categoryIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 rounded-lg transition-all border-2 ${
                          formData.icon === icon
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        title={icon}
                      >
                        <span className="text-sm font-medium text-slate-600">{icon[0]}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Selected: {formData.icon}</p>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: option.value })}
                        className={`p-3 rounded-lg transition-all border-2 ${option.value} ${
                          formData.color === option.value
                            ? 'border-slate-900 scale-105'
                            : 'border-slate-300'
                        }`}
                        title={option.label}
                      >
                        <span className="text-xs font-semibold">{option.label[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-2">Preview:</p>
                  <div className={`p-4 rounded-lg ${formData.color}`}>
                    <p className="font-semibold text-sm">{formData.name || 'Category Name'}</p>
                    <p className="text-xs opacity-75 mt-1">Icon: {formData.icon}</p>
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
                      {editingCategory ? 'Update' : 'Add'} Category
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

export default CategoryFormModal;
