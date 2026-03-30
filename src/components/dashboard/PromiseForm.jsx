import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

const PromiseForm = ({ isOpen, onClose, editingPromise }) => {
  const { categories, addPromise, updatePromise } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 1,
    status: 'Pending',
    progress: 0,
    tags: ['नीति', 'राष्ट्रिय']
  });

  useEffect(() => {
    if (editingPromise) {
      setFormData(editingPromise);
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: 1,
        status: 'Pending',
        progress: 0,
        tags: ['नीति', 'राष्ट्रिय']
      });
    }
  }, [editingPromise, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPromise) {
      updatePromise(editingPromise.id, formData);
    } else {
      addPromise(formData);
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
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col border border-outline-variant"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-outline-variant flex items-center justify-between bg-surface">
                <div>
                   <h2 className="font-headline text-2xl font-black text-primary">
                     {editingPromise ? 'प्रतिबद्धता परिमार्जन' : 'नयाँ प्रतिबद्धता थप्नुहोस्'}
                   </h2>
                   <p className="text-on-surface-variant text-sm font-medium mt-1">विवरणहरू ध्यानपूर्वक भर्नुहोस्</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl text-on-surface-variant transition-all hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest px-1">योजनाको शीर्षक *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full h-14 bg-surface border border-outline-variant rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                      placeholder="काठमाडौं महानगर..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest px-1">विस्तृत विवरण *</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full bg-surface border border-outline-variant rounded-2xl p-6 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium resize-none"
                      placeholder="यस योजनाको मुख्य उद्देश्य र लक्ष्यहरू..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary uppercase tracking-widest px-1">विधा छनोट *</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                        className="w-full h-14 bg-surface border border-outline-variant rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm appearance-none"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary uppercase tracking-widest px-1">वर्तमान अवस्था *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full h-14 bg-surface border border-outline-variant rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm appearance-none"
                      >
                        <option value="Pending">प्रतिक्षामा</option>
                        <option value="In Progress">कार्यान्वयनमा</option>
                        <option value="Completed">सम्पन्न</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-xs font-black text-primary uppercase tracking-widest">प्रगति प्रतिशत</label>
                      <span className="text-lg font-black text-primary">{formData.progress}%</span>
                    </div>
                    <div className="relative h-2 bg-surface-container rounded-full group cursor-pointer">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div 
                        className="absolute h-full bg-primary rounded-full" 
                        style={{ width: `${formData.progress}%` }}
                      >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 h-14 bg-primary text-white rounded-2xl font-black shadow-lg hover:shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingPromise ? 'विवरण सुरक्षित गर्नुहोस्' : 'नयाँ प्रोमिस थप्नुहोस्'}
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

export default PromiseForm;

