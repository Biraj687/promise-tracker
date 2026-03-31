import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { validateFile, createSecureFormData, createImageThumbnail } from '../../api/secureUpload';

const NewsFormModal = ({ isOpen, onClose, editingNews, categories }) => {
  const { addNewsUpdate, updateNewsUpdate, uploadImage } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    source_url: '',
    source_name: '',
    category_id: '',
    news_type: 'update',
    is_published: false
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editingNews) {
      setFormData(editingNews);
    } else {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        thumbnail_url: '',
        source_url: '',
        source_name: '',
        category_id: categories[0]?.id || '',
        news_type: 'update',
        is_published: false
      });
    }
    setPreview(null);
    setError(null);
  }, [editingNews, isOpen, categories]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      // Create secure FormData
      const { formData: secureForm, error: formError } = createSecureFormData(file, 'image', {
        title: formData.title,
        type: 'news'
      });

      if (formError) {
        setError(formError);
        return;
      }

      // Create thumbnail locally
      const thumbnail = await createImageThumbnail(file, 200, 200);

      // Upload main image
      const imageUrl = await uploadImage(file);

      // Set both image and thumbnail
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl,
        thumbnail_url: thumbnail
      }));
      setPreview(imageUrl);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('छवि अपलोड गर्न असफल। कृपया पुनः प्रयास गर्नुहोस्।');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFetchSourceTitle = async () => {
    if (!formData.source_url) {
      setError('स्रोत URL प्रविष्ट गर्नुहोस्');
      return;
    }

    try {
      // Extract domain from URL
      const url = new URL(formData.source_url);
      const domain = url.hostname.replace('www.', '');
      setFormData(prev => ({
        ...prev,
        source_name: domain
      }));
    } catch (err) {
      setError('अमान्य URL फढन्मत्');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('शीर्षक आवश्यक छ');
      return;
    }

    if (!formData.category_id) {
      setError('श्रेणी आवश्यक छ');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingNews) {
        await updateNewsUpdate(editingNews.id, formData);
      } else {
        await addNewsUpdate(formData);
      }

      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-outline-variant px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">
            {editingNews ? 'समाचार सम्पादन गर्नुहोस्' : 'नयाँ समाचार थप्नुहोस्'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">शीर्षक *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="समाचार शीर्षक"
              className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">विवरण</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="विस्तृत विवरण"
              rows="4"
              className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">श्रेणी *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="">श्रेणी चयन गर्नुहोस्</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* News Type */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">समाचार किसिम</label>
            <select
              name="news_type"
              value={formData.news_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="update">अपडेट</option>
              <option value="news">समाचार</option>
              <option value="progress">प्रगति</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">छवि</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none"
                />
              </div>
              {uploadingImage && <Loader2 size={24} className="animate-spin text-primary" />}
            </div>
            {formData.image_url && (
              <div className="mt-3">
                <img src={formData.image_url} alt="Preview" className="w-32 h-24 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Source */}
          <div className="border-t border-outline-variant pt-4">
            <h3 className="text-sm font-bold text-primary mb-3">स्रोत जानकारी (वैकल्पिक)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">स्रोत URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="source_url"
                    value={formData.source_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleFetchSourceTitle}
                    className="px-4 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary-dark transition"
                  >
                    पूरक गर्नुहोस्
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">स्रोत नाम</label>
                <input
                  type="text"
                  name="source_name"
                  value={formData.source_name}
                  onChange={handleChange}
                  placeholder="जस्तै: सेतोपाती, काठमाडौं पोस्ट"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Publish */}
          <div className="flex items-center gap-3 border-t border-outline-variant pt-4">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="is_published" className="text-sm font-bold text-primary cursor-pointer">
              तत्काल प्रकाशित गर्नुहोस्
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-outline-variant pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-outline-variant text-primary rounded-lg font-bold hover:bg-surface-container transition"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  जारी रहेको छ...
                </span>
              ) : (
                editingNews ? 'अपडेट गर्नुहोस्' : 'समाचार थप्नुहोस्'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormModal;
