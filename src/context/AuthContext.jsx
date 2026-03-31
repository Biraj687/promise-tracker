import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          // Fetch and validate admin role
          await fetchAndValidateAdminProfile(session.user);
        } else {
          setUser(null);
          setError(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setUser(null);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Fetch profile and STRICTLY validate admin role
  const fetchAndValidateAdminProfile = async (authUser) => {
    try {
      setError(null);
      
      // ⏱️ Add timeout to prevent hanging
      const profilePromise = supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', authUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile query timeout - took too long')), 8000)
      );

      const { data: profile, error: profileError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]);

      if (profileError) {
        throw new Error(`Profile fetch failed: ${profileError.message}`);
      }

      // ✅ STRICT: ONLY admin role allowed
      if (!profile) {
        throw new Error('No profile found. Access denied.');
      }

      if (profile.role !== 'admin') {
        // ✅ BLOCK: Non-admin users cannot access system
        throw new Error(`Access denied. You do not have admin privileges. Role: ${profile.role}`);
      }

      // ✅ Admin user - set user state
      const adminUser = {
        id: authUser.id,
        email: authUser.email,
        username: authUser.email?.split('@')[0] || 'Admin',
        role: 'admin'
      };
      setUser(adminUser);
      setError(null);
      return { success: true, user: adminUser };
    } catch (err) {
      console.error('Admin validation failed:', err);
      // On error, DO NOT set user - keep blocked
      setUser(null);
      setError(err.message || 'Authentication failed');
      
      // Force logout if profile validation fails
      await supabase.auth.signOut();
      return { success: false, error: err.message };
    }
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Session check failed: ${sessionError.message}`);
      }

      if (session?.user) {
        await fetchAndValidateAdminProfile(session.user);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.error('Session check error:', err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        const errorMsg = signInError.message || 'Login failed';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }

      if (!data?.user) {
        setError('Login failed: No user data returned');
        setLoading(false);
        return { success: false, error: 'Login failed' };
      }

      // Validate admin role and get result
      const result = await fetchAndValidateAdminProfile(data.user);
      
      // Always ensure loading is false after profile check
      setLoading(false);
      
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      setUser(null);
      setLoading(false);
      console.error('Login error:', err);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw new Error(`Logout failed: ${signOutError.message}`);
      }

      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      // Still clear user on logout error (security first)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STRICT: Only grant access if user is confirmed admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    // Additional defensive check
    isAuthenticated: user !== null && isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
