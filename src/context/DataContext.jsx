import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

// Default categories (seed data)
const DEFAULT_CATEGORIES = [
  { id: 1, name: "साझा प्रतिबद्धता, समन्वय र जनविश्वास", icon: "Gavel", color: "bg-blue-100 text-[#2552f5]", createdAt: new Date().toISOString() },
  { id: 2, name: "प्रशासनिक सुधार, पुनसंरचना र मितव्ययिता", icon: "Globe", color: "bg-indigo-100 text-indigo-800", createdAt: new Date().toISOString() },
  { id: 3, name: "सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन", icon: "TrendingUp", color: "bg-green-100 text-green-800", createdAt: new Date().toISOString() },
  { id: 4, name: "डिजिटल शासन र डेटा गोभर्नेन्स र सञ्चार", icon: "Wheat", color: "bg-amber-100 text-amber-800", createdAt: new Date().toISOString() },
  { id: 5, name: "सुशासन, पारदर्शिता र भ्रष्टाचार नियंत्रण", icon: "Briefcase", color: "bg-orange-100 text-orange-800", createdAt: new Date().toISOString() },
  { id: 6, name: "सार्वजनिक खरीद र परियोजना व्यवस्थापन सुधार", icon: "HardHat", color: "bg-slate-100 text-slate-800", createdAt: new Date().toISOString() },
  { id: 7, name: "लगानी, उद्योग निजी क्षेत्र प्रवर्द्धन र पर्यटन", icon: "Zap", color: "bg-yellow-100 text-yellow-800", createdAt: new Date().toISOString() },
  { id: 8, name: "उर्जा तथा जलस्रोत", icon: "GraduationCap", color: "bg-cyan-100 text-cyan-800", createdAt: new Date().toISOString() },
  { id: 9, name: "राजस्व सुधार", icon: "Stethoscope", color: "bg-red-100 text-red-800", createdAt: new Date().toISOString() },
  { id: 10, name: "स्वास्थ्य, शिक्षा र मानव विकास", icon: "Mountain", color: "bg-emerald-100 text-emerald-800", createdAt: new Date().toISOString() },
  { id: 11, name: "कृषि, भूमि पूर्वाधार र आधारभूत सेवा", icon: "Activity", color: "bg-pink-100 text-pink-800", createdAt: new Date().toISOString() },
  { id: 12, name: "अन्य रणनीतिक र सामाजिक सुरक्षा निर्णयहरू", icon: "Users", color: "bg-purple-100 text-purple-800", createdAt: new Date().toISOString() }
];

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize categories from localStorage on mount
  useEffect(() => {
    initializeCategories();
    fetchPromises();
  }, []);

  // Initialize categories from localStorage or use defaults
  const initializeCategories = () => {
    try {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(DEFAULT_CATEGORIES);
        localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
      }
    } catch (err) {
      console.error("Failed to initialize categories:", err);
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
    }
  };

  // Save categories to localStorage
  const saveCategoriesToStorage = (updatedCategories) => {
    try {
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    } catch (err) {
      console.error("Failed to save categories to localStorage:", err);
    }
  };

  // ============ CATEGORY OPERATIONS ============
  
  const addCategory = (categoryData) => {
    try {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: categoryData.name,
        icon: categoryData.icon || 'Layers',
        color: categoryData.color || 'bg-primary/10 text-primary',
        createdAt: new Date().toISOString()
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      saveCategoriesToStorage(updatedCategories);
      return newCategory;
    } catch (err) {
      console.error("Failed to add category:", err);
      throw err;
    }
  };

  const updateCategory = (id, updatedData) => {
    try {
      const updatedCategories = categories.map(c => 
        c.id === id ? { ...c, ...updatedData } : c
      );
      setCategories(updatedCategories);
      saveCategoriesToStorage(updatedCategories);
    } catch (err) {
      console.error("Failed to update category:", err);
      throw err;
    }
  };

  const deleteCategory = (id) => {
    try {
      // Check if any promises use this category
      const promisesInCategory = promises.filter(p => p.categoryId === id);
      if (promisesInCategory.length > 0) {
        throw new Error(`Cannot delete category. ${promisesInCategory.length} promise(s) are still using this category.`);
      }
      
      const updatedCategories = categories.filter(c => c.id !== id);
      setCategories(updatedCategories);
      saveCategoriesToStorage(updatedCategories);
    } catch (err) {
      console.error("Failed to delete category:", err);
      throw err;
    }
  };

  // ============ PROMISE OPERATIONS ============

  const fetchPromises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promises')
        .select('*')
        .order('point_no', { ascending: true });
      
      if (error) throw error;
      
      setPromises(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch promises:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // Promise operations (connected to Supabase)
  const addPromise = async (promiseData) => {
    try {
      const { data, error } = await supabase
        .from('promises')
        .insert([promiseData])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPromises(prev => [...prev, data[0]]);
        return data[0];
      }
    } catch (err) {
      console.error("Failed to add:", err);
      throw err;
    }
  };

  const updatePromise = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from('promises')
        .update(updatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      setPromises(prev => 
        prev.map(p => p.id === id ? { ...p, ...updatedData, updatedAt: new Date().toISOString().split('T')[0] } : p)
      );
    } catch (err) {
      console.error("Failed to update:", err);
      throw err;
    }
  };

  const deletePromise = async (id) => {
    try {
      const { error } = await supabase
        .from('promises')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPromises(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      throw err;
    }
  };

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

  return (
    <DataContext.Provider value={{
      categories,
      promises,
      loading,
      error,
      // Category operations
      addCategory,
      updateCategory,
      deleteCategory,
      // Promise operations
      addPromise,
      updatePromise,
      deletePromise,
      getPromisesByCategory,
      getStats,
      refreshData: fetchPromises
    }}>
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
