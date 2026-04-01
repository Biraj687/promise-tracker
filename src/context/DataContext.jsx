import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

// Pagination & config
const PROMISES_PAGE_SIZE = 100;
const CATEGORIES_PAGE_SIZE = 50;
const IMAGES_BUCKET = 'images';

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [promises, setPromises] = useState([]);
  const [newsUpdates, setNewsUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch categories, continue if fails
        try {
          await fetchCategories();
        } catch (err) {
          console.warn("⚠️ Failed to fetch categories:", err.message);
          setCategories([]); // Allow app to continue with empty categories
        }
        
        // Try to fetch promises, continue if fails
        try {
          await fetchPromises();
        } catch (err) {
          console.warn("⚠️ Failed to fetch promises:", err.message);
          setPromises([]); // Allow app to continue with empty promises
        }

        // Try to fetch news updates, continue if fails
        try {
          await fetchNewsUpdates();
        } catch (err) {
          console.warn("⚠️ Failed to fetch news updates:", err.message);
          setNewsUpdates([]); // Allow app to continue with empty news
        }

        // Try to fetch CMS content, continue if fails
        try {
          await fetchCmsContent();
        } catch (err) {
          console.warn("⚠️ Failed to fetch CMS content:", err.message);
          setCmsContent({}); // Allow app to continue with empty CMS
        }
      } catch (err) {
        console.error("Initialization error (non-critical):", err);
        // Don't set error - allow app to continue
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // ============================================================================
  // CATEGORY OPERATIONS - FETCH FROM SUPABASE
  // ============================================================================

  const fetchCategories = async () => {
    try {
      // Try fetching with all columns, fallback to basic columns if some don't exist
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('id, name, description, image_url, parent_id, display_order, color, icon, created_at, created_by')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(CATEGORIES_PAGE_SIZE);

      if (fetchError) throw new Error(`Failed to fetch categories: ${fetchError.message}`);

      // Map data to include defaults if fields missing
      const categoriesWithDefaults = (data || []).map(cat => ({
        ...cat,
        icon: cat.icon || 'Layers',
        description: cat.description || '',
        image_url: cat.image_url || null,
        parent_id: cat.parent_id || null,
        display_order: cat.display_order || 0
      }));

      setCategories(categoriesWithDefaults);
      setError(null);
    } catch (err) {
      console.error("Category fetch failed:", err);
      console.log("⚠️ Continuing with empty categories - Run SQL migration: SUPABASE_DASHBOARD_MIGRATION.sql");
      setCategories([]);
      // Don't throw - allow app to continue
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('categories')
        .insert([
          {
            name: categoryData.name,
            description: categoryData.description || '',
            image_url: categoryData.image_url || null,
            parent_id: categoryData.parent_id || null,
            display_order: categoryData.display_order || 0,
            icon: categoryData.icon || 'Layers',
            color: categoryData.color || 'bg-primary/10 text-primary'
          }
        ])
        .select();

      if (insertError) throw new Error(`Failed to add category: ${insertError.message}`);

      if (data && data.length > 0) {
        setCategories(prev => [...prev, data[0]]);
        return data[0];
      }
      throw new Error('No data returned from insert');
    } catch (err) {
      console.error("Add category failed:", err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      const { error: updateError } = await supabase
        .from('categories')
        .update(updatedData)
        .eq('id', id);

      if (updateError) throw new Error(`Failed to update category: ${updateError.message}`);

      setCategories(prev =>
        prev.map(c => c.id === id ? { ...c, ...updatedData } : c)
      );
    } catch (err) {
      console.error("Update category failed:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      // Check if any promises use this category
      const promisesInCategory = promises.filter(p => p.categoryId === id);
      if (promisesInCategory.length > 0) {
        throw new Error(`Cannot delete category. ${promisesInCategory.length} promise(s) are still using this category.`);
      }

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(`Failed to delete category: ${deleteError.message}`);

      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete category failed:", err);
      throw err;
    }
  };

  // ============================================================================
  // IMAGE UPLOAD & MANAGEMENT
  // ============================================================================

  const uploadImage = async (file) => {
    try {
      if (!file) throw new Error('No file provided');
      
      setOperationLoading(true);
      
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(IMAGES_BUCKET)
        .upload(`public/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(IMAGES_BUCKET)
        .getPublicUrl(`public/${fileName}`);

      setOperationLoading(false);
      return publicUrl;
    } catch (err) {
      console.error("Upload image failed:", err);
      setOperationLoading(false);
      throw err;
    }
  };

  const deleteImage = async (fileName) => {
    try {
      setOperationLoading(true);
      
      const { error: deleteError } = await supabase.storage
        .from(IMAGES_BUCKET)
        .remove([`public/${fileName}`]);

      if (deleteError) throw new Error(`Image delete failed: ${deleteError.message}`);
      
      setOperationLoading(false);
      return true;
    } catch (err) {
      console.error("Delete image failed:", err);
      setOperationLoading(false);
      throw err;
    }
  };

  // ============================================================================
  // PROMISE OPERATIONS - FETCH WITH PAGINATION
  // ============================================================================

  const fetchPromises = async (pageStart = 0) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('promises')
        .select('*', { count: 'exact' })
        .order('point_no', { ascending: true })
        .range(pageStart, pageStart + PROMISES_PAGE_SIZE - 1);

      if (fetchError) throw new Error(`Failed to fetch promises: ${fetchError.message}`);

      setPromises(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.warn("⚠️ Promise fetch warning:", err.message);
      console.log("💡 Database might not be set up. Run: SUPABASE_SETUP.sql in Supabase");
      setPromises([]);
      // Don't throw - allow app to continue
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addPromise = async (promiseData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('promises')
        .insert([promiseData])
        .select();

      if (insertError) throw new Error(`Failed to add promise: ${insertError.message}`);

      if (data && data.length > 0) {
        setPromises(prev => [...prev, data[0]]);
        return data[0];
      }
      throw new Error('No data returned from insert');
    } catch (err) {
      console.error("Add promise failed:", err);
      throw err;
    }
  };

  const updatePromise = async (id, updatedData) => {
    try {
      const { error: updateError } = await supabase
        .from('promises')
        .update(updatedData)
        .eq('id', id);

      if (updateError) throw new Error(`Failed to update promise: ${updateError.message}`);

      setPromises(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, ...updatedData, updatedAt: new Date().toISOString().split('T')[0] }
            : p
        )
      );
    } catch (err) {
      console.error("Update promise failed:", err);
      throw err;
    }
  };

  const deletePromise = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('promises')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(`Failed to delete promise: ${deleteError.message}`);

      setPromises(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Delete promise failed:", err);
      throw err;
    }
  };

  // ============================================================================
  // NEWS UPDATES OPERATIONS - FETCH FROM SUPABASE
  // ============================================================================

  const fetchNewsUpdates = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('news_updates')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw new Error(`Failed to fetch news updates: ${fetchError.message}`);

      setNewsUpdates(data || []);
      setError(null);
    } catch (err) {
      console.error("News updates fetch failed:", err);
      setNewsUpdates([]);
    }
  };

  const addNewsUpdate = async (newsData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('news_updates')
        .insert([
          {
            title: newsData.title,
            description: newsData.description,
            image_url: newsData.image_url,
            source_url: newsData.source_url,
            source_name: newsData.source_name,
            category_id: newsData.category_id,
            promise_id: newsData.promise_id,
            news_type: newsData.news_type || 'update',
            thumbnail_url: newsData.thumbnail_url,
            is_published: newsData.is_published || false
          }
        ])
        .select();

      if (insertError) throw new Error(`Failed to add news update: ${insertError.message}`);

      if (data && data.length > 0) {
        setNewsUpdates(prev => [data[0], ...prev]);
        return data[0];
      }
      throw new Error('No data returned from insert');
    } catch (err) {
      console.error("Add news update failed:", err);
      throw err;
    }
  };

  const updateNewsUpdate = async (id, updatedData) => {
    try {
      const { error: updateError } = await supabase
        .from('news_updates')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw new Error(`Failed to update news update: ${updateError.message}`);

      setNewsUpdates(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, ...updatedData, updated_at: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      console.error("Update news update failed:", err);
      throw err;
    }
  };

  const deleteNewsUpdate = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('news_updates')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(`Failed to delete news update: ${deleteError.message}`);

      setNewsUpdates(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Delete news update failed:", err);
      throw err;
    }
  };

  const getNewsByCategory = (categoryId) => {
    return newsUpdates.filter(n => n.category_id === Number(categoryId));
  };

  const getNewsByPromise = (promiseId) => {
    return newsUpdates.filter(n => n.promise_id === Number(promiseId));
  };

  // ============================================================================
  // CMS CONTENT OPERATIONS - For landing page management
  // ============================================================================

  const [cmsContent, setCmsContent] = useState(null);

  const fetchCmsContent = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cms_content')
        .select('*')
        .eq('section_key', 'landing_page')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn("CMS fetch warning:", fetchError.message);
      }

      setCmsContent(data || {});
      return data;
    } catch (err) {
      console.warn("CMS content fetch failed:", err);
      setCmsContent({});
      return {};
    }
  };

  const saveCmsContent = async (section, updates) => {
    try {
      setOperationLoading(true);

      // First fetch existing content
      const existing = await fetchCmsContent();

      const updatedData = {
        ...existing,
        ...updates,
        section_key: 'landing_page'
      };

      let result;

      if (existing.id) {
        // Update existing
        const { data, error: updateError } = await supabase
          .from('cms_content')
          .update(updatedData)
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) throw new Error(`Failed to update CMS content: ${updateError.message}`);
        result = data;
      } else {
        // Create new
        const { data, error: insertError } = await supabase
          .from('cms_content')
          .insert([updatedData])
          .select()
          .single();

        if (insertError) throw new Error(`Failed to insert CMS content: ${insertError.message}`);
        result = data;
      }

      setCmsContent(result);
      setOperationLoading(false);
      return result;
    } catch (err) {
      console.error("Save CMS content failed:", err);
      setOperationLoading(false);
      throw err;
    }
  };

  // Get trackers (top-level categories with no parent)
  const getTrackers = () => {
    return categories.filter(c => !c.parent_id).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  };

  // Get categories for a specific tracker
  const getCategoriesForTracker = (trackerId) => {
    return categories.filter(c => c.parent_id === trackerId).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getPromisesByCategory = (categoryId) => {
    return promises.filter(p => p.categoryId === Number(categoryId));
  };

  const getStats = () => {
    const total = promises.length;
    const completed = promises.filter(p => p.status === 'Completed').length;
    const inProgress = promises.filter(p => p.status === 'In Progress').length;
    const pending = promises.filter(p => p.status === 'Pending').length;

    return {
      total,
      completed,
      inProgress,
      pending,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const value = {
    categories,
    promises,
    newsUpdates,
    cmsContent,
    loading,
    operationLoading,
    error,
    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    // Image operations
    uploadImage,
    deleteImage,
    // Promise operations
    addPromise,
    updatePromise,
    deletePromise,
    fetchPromises,
    getPromisesByCategory,
    // News operations
    addNewsUpdate,
    updateNewsUpdate,
    deleteNewsUpdate,
    fetchNewsUpdates,
    getNewsByCategory,
    getNewsByPromise,
    // CMS operations
    fetchCmsContent,
    saveCmsContent,
    // Tracker operations
    getTrackers,
    getCategoriesForTracker,
    // Utility
    getStats,
    refreshData: fetchPromises
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
