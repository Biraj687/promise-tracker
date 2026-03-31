import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;
    
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing authentication...');
        await checkSession();
        if (isMounted) setIsInitialized(true);
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted) setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth state changes (for token refresh, logout from other tabs, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('🔄 Auth state changed:', event);

      try {
        if (event === 'SIGNED_OUT') {
          // User signed out
          console.log('👋 User signed out');
          setUser(null);
          setError(null);
          return;
        }

        if (event === 'TOKEN_REFRESHED') {
          // Token was refreshed, no need to re-fetch profile
          console.log('🔄 Token refreshed');
          return;
        }

        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          // User signed in or session changed, validate profile
          console.log('👤 Validating profile for event:', event);
          await fetchAndValidateAdminProfile(session.user);
        } else if (!session?.user) {
          // No session
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

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [isInitialized]);

  // Fetch profile and STRICTLY validate admin role
  const fetchAndValidateAdminProfile = async (authUser) => {
    try {
      setError(null);
      console.log('🔐 Starting admin validation for user:', authUser.id);
      
      // ⏱️ Create timeout wrapper
      const queryWithTimeout = async () => {
        return new Promise(async (resolve, reject) => {
          const timeout = setTimeout(() => {
            console.error('❌ Profile query timeout after 6 seconds');
            reject(new Error('Profile query timeout - Supabase took too long to respond'));
          }, 6000);

          try {
            console.log('📡 Fetching profile from Supabase...');
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, email, role')
              .eq('id', authUser.id)
              .maybeSingle();

            clearTimeout(timeout);

            if (profileError) {
              console.error('❌ Profile query error:', profileError);
              throw new Error(`Profile fetch failed: ${profileError.message}`);
            }

            console.log('✅ Profile fetched:', profile);
            resolve(profile);
          } catch (err) {
            clearTimeout(timeout);
            reject(err);
          }
        });
      };

      const profile = await queryWithTimeout();

      // ✅ STRICT: ONLY admin role allowed
      if (!profile) {
        throw new Error('No profile found. Access denied.');
      }

      console.log('📋 User role:', profile.role);

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
      console.log('✅ Admin user validated:', adminUser.email);
      setUser(adminUser);
      setError(null);
      return { success: true, user: adminUser };
    } catch (err) {
      console.error('❌ Admin validation failed:', err);
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
      setError(null);
      console.log('🔍 Checking session...');
      
      // Set a timeout to prevent hanging
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );

      const { data: { session }, error: sessionError } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]);

      if (sessionError) {
        throw new Error(`Session check failed: ${sessionError.message}`);
      }

      if (session?.user) {
        console.log('👤 Session found, validating admin role...');
        await fetchAndValidateAdminProfile(session.user);
      } else {
        console.log('❌ No session found');
        setUser(null);
        setError(null);
      }
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
      console.log('🔑 Attempting login for:', email);

      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return { success: false, error: 'Email and password are required' };
      }

      console.log('📝 Calling Supabase signInWithPassword...');
      
      // Set timeout for login request
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password
      });
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout - request took too long')), 10000)
      );

      const { data, error: signInError } = await Promise.race([
        loginPromise,
        timeoutPromise
      ]);

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        const errorMsg = signInError.message || 'Login failed';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }

      if (!data?.user) {
        console.error('❌ No user returned from signInWithPassword');
        setError('Login failed: No user data returned');
        setLoading(false);
        return { success: false, error: 'Login failed' };
      }

      console.log('✅ Sign in successful, validating admin role...');
      // Validate admin role and get result
      const result = await fetchAndValidateAdminProfile(data.user);
      
      // Always ensure loading is false after profile check
      setLoading(false);
      
      return result;
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      setUser(null);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('👋 Logging out...');
      
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw new Error(`Logout failed: ${signOutError.message}`);
      }

      setUser(null);
      setError(null);
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      // Still clear user on logout error (security first)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
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
