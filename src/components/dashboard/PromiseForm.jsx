import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const PromiseForm = ({ isOpen, onClose, editingPromise, onRefresh }) => {
  const { categories, addPromise, updatePromise, uploadImage, operationLoading } = useData();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    status: 'pending',
    progress: 0,
    image_url: '',
    point_no: ''
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingPromise) {
      setFormData({
        title: editingPromise.title || '',
        description: editingPromise.description || '',
        category_id: editingPromise.category_id || '',
        status: editingPromise.status || 'pending',
        progress: editingPromise.progress || 0,
        image_url: editingPromise.image_url || '',
        point_no: editingPromise.point_no || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category_id: '',
        status: 'pending',
        progress: 0,
        image_url: '',
        point_no: ''
      });
    }
    setErrors({});
    setImageFile(null);
  }, [editingPromise, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'शीर्षक आवश्यक है';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'विवरण आवश्यक है';
    }
    if (!formData.category_id) {
      newErrors.category_id = 'विधा छनोट गर्नुहोस्';
    }
    if (!formData.point_no && !editingPromise) {
      newErrors.point_no = 'प्रतिबद्धता क्रमांक आवश्यक है';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    try {
      setUploading(true);
      const imageUrl = await uploadImage(imageFile);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast.success('Image uploaded successfully');
      setImageFile(null);
    } catch (err) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('कृपया सभी आवश्यक क्षेत्र भरें');
      return;
    }

    try {
      setSubmitting(true);
      
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id,
        status: formData.status,
        progress: formData.progress,
        image_url: formData.image_url,
        point_no: formData.point_no
      };

      if (editingPromise) {
        await updatePromise(editingPromise.id, dataToSubmit);
        toast.success('प्रतिबद्धता सफलतापूर्वक अपडेट्ड');
      } else {
        await addPromise(dataToSubmit);
        toast.success('प्रतिबद्धता सफलतापूर्वक जोड़ा गया');
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingPromise ? 'प्रतिबद्धता संपादित करें' : 'नई प्रतिबद्धता जोड़ें'}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">सभी आवश्यक जानकारी भरें</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                {/* Point Number */}
                {!editingPromise && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-900">प्रतिबद्धता क्रमांक *</label>
                    <input
                      type="number"
                      value={formData.point_no}
                      onChange={(e) => setFormData({ ...formData, point_no: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.point_no ? 'border-red-500 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="1-100"
                    />
                    {errors.point_no && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={16} /> {errors.point_no}</p>}
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">शीर्षक *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="प्रतिबद्धता का शीर्षक..."
                  />
                  {errors.title && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={16} /> {errors.title}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">विवरण *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="विस्तृत विवरण..."
                  />
                  {errors.description && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={16} /> {errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">छवि (वैकल्पिक)</label>
                  <div className="flex gap-3">
                    <label className="flex-1 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <div className="flex items-center gap-2">
                        <Upload size={18} className="text-slate-600" />
                        <span className="text-sm text-slate-600">छवि चुनें</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploading}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
                      >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {uploading ? 'अपलोड हो रहा है...' : 'अपलोड'}
                      </button>
                    )}
                  </div>
                  {imageFile && <p className="text-sm text-slate-600">Selected: {imageFile.name}</p>}
                  {formData.image_url && <p className="text-sm text-green-600">✓ Image uploaded</p>}
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-900">विधा *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category_id ? 'border-red-500 bg-red-50' : 'border-slate-200'
                      }`}
                    >
                      <option value="">विधा चुनें</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-900">स्थिति</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">प्रतिक्षामा</option>
                      <option value="in_progress">कार्यान्वयनमा</option>
                      <option value="completed">सम्पन्न</option>
                    </select>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-900">प्रगति</label>
                    <span className="text-xl font-bold text-blue-600">{formData.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-full cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || operationLoading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {submitting ? 'सहेजा जा रहा है...' : editingPromise ? 'अपडेट करें' : 'जोड़ें'}
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

export default PromiseForm;

