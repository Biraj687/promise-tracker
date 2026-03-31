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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await fetchCategories();
        await fetchPromises();
        setError(null);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || 'Failed to load data');
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
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('id, name, icon, color, created_at, created_by')
        .order('created_at', { ascending: true })
        .limit(CATEGORIES_PAGE_SIZE);

      if (fetchError) throw new Error(`Failed to fetch categories: ${fetchError.message}`);

      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error("Category fetch failed:", err);
      setError(err.message);
      throw err;
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('categories')
        .insert([
          {
            name: categoryData.name,
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
      console.error("Promise fetch failed:", err);
      setError(err.message);
      throw err;
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
