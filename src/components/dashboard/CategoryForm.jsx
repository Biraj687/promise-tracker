import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Palette, Layers, Grid3x3 } from 'lucide-react';
import { useData } from '../../context/DataContext';

const colorOptions = [
  { label: 'नीलो', value: "bg-primary/10 text-primary" },
  { label: 'हरियो', value: "bg-accent-emerald/10 text-accent-emerald" },
  { label: 'सुन्तला', value: "bg-accent-amber/10 text-accent-amber" },
  { label: 'गुलाबी', value: "bg-accent-rose/10 text-accent-rose" },
  { label: 'इंडिगो', value: "bg-indigo-50 text-indigo-600" },
  { label: 'बैंगनी', value: "bg-purple-50 text-purple-600" },
  { label: 'थियरी', value: "bg-teal-50 text-teal-600" },
  { label: 'स्लेट', value: "bg-slate-100 text-slate-600" }
];

const CategoryForm = ({ isOpen, onClose, editingCategory }) => {
  const { addCategory, updateCategory } = useData();
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Layers',
    color: "bg-primary/10 text-primary"
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData(editingCategory);
    } else {
      setFormData({
        name: '',
        icon: 'Layers',
        color: "bg-primary/10 text-primary"
      });
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    onClose();
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
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full pointer-events-auto overflow-hidden flex flex-col border border-outline-variant"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-outline-variant flex items-center justify-between bg-surface">
                <div>
                   <h2 className="font-headline text-2xl font-black text-primary">
                     {editingCategory ? 'विधा परिमार्जन' : 'नयाँ विधा थप्नुहोस्'}
                   </h2>
                   <p className="text-on-surface-variant text-sm font-medium mt-1">योजना वर्गीकरणका लागि विधा थप्नुहोस्</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl text-on-surface-variant transition-all hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest px-1">विधाको नाम *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-14 bg-surface border border-outline-variant rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                      placeholder="जस्तै: स्वास्थ्य, शिक्षा..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest px-1">रङ्ग छनोट</label>
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: option.value })}
                          className={`h-12 rounded-xl transition-all border-2 flex items-center justify-center ${
                            formData.color === option.value
                              ? `${option.value} border-primary shadow-md`
                              : `${option.value} border-transparent hover:border-primary/30`
                          }`}
                          title={option.label}
                        >
                          <Palette size={18} className="text-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 h-14 bg-primary text-white rounded-2xl font-black shadow-lg hover:shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingCategory ? 'सुरक्षित गर्नुहोस्' : 'विधा थप्नुहोस्'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-14 bg-surface-container border border-outline-variant text-on-surface-variant px-8 rounded-2xl font-black hover:bg-surface transition-all"
                  >
                    रद्द
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

  