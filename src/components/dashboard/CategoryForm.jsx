import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const colors = [
  { name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-600' },
  { name: 'Green', bg: 'bg-green-100', text: 'text-green-600' },
  { name: 'Orange', bg: 'bg-amber-100', text: 'text-amber-600' },
  { name: 'Red', bg: 'bg-red-100', text: 'text-red-600' },
  { name: 'Purple', bg: 'bg-purple-100', text: 'text-purple-600' },
  { name: 'Pink', bg: 'bg-pink-100', text: 'text-pink-600' },
  { name: 'Teal', bg: 'bg-teal-100', text: 'text-teal-600' },
  { name: 'Gray', bg: 'bg-gray-100', text: 'text-gray-600' }
];

const CategoryForm = ({ isOpen, onClose, editingCategory, onRefresh }) => {
  const { addCategory, updateCategory } = useData();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-blue-100'
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || '',
        color: editingCategory.color || 'bg-blue-100'
      });
    } else {
      setFormData({
        name: '',
        color: 'bg-blue-100'
      });
    }
    setErrors({});
  }, [editingCategory, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'विधा का नाम आवश्यक है';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('कृपया सभी आवश्यक जानकारी भरें');
      return;
    }

    try {
      setSubmitting(true);
      
      const dataToSubmit = {
        name: formData.name.trim(),
        color: formData.color
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, dataToSubmit);
        toast.success('विधा सफलतापूर्वक अपडेट्ड');
      } else {
        await addCategory(dataToSubmit);
        toast.success('विधा सफलतापूर्वक जोड़ा गया');
      }
      
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto overflow-hidden flex flex-col border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingCategory ? 'विधा संपादित करें' : 'नया विधा जोड़ें'}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">प्रतिबद्धताओं को वर्गीकृत करने के लिए विधा जोड़ें</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">विधा का नाम *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="जैसे: स्वास्थ्य, शिक्षा..."
                  />
                  {errors.name && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={16} /> {errors.name}</p>}
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900">रंग चुनें</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.bg })}
                        className={`h-12 rounded-lg border-2 transition-all font-medium ${
                          formData.color === color.bg
                            ? `${color.bg} ${color.text} border-blue-500 shadow-lg`
                            : `${color.bg} border-transparent hover:border-slate-300`
                        }`}
                        title={color.name}
                      >
                        ●
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {submitting ? 'सहेजा जा रहा है...' : editingCategory ? 'अपडेट करें' : 'जोड़ें'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-bold transition-all"
                  >
                    रद्द करें
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryForm;
