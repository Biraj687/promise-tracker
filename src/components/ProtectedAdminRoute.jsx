import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Lock } from 'lucide-react';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAdmin, error } = useAuth();

  // 🔒 STRICT: Show loader during auth check
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // 🔒 STRICT: No user = immediate redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 STRICT: User exists but NOT admin = DENY ACCESS COMPLETELY
  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-700 mb-8">
            {error ? error : 'You do not have permission to access this area.'}
          </p>
          <p className="text-sm text-red-600 mb-6">
            {user?.email && `Logged in as: ${user.email}`}
          </p>
          
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  // ✅ All checks passed - user is authenticated admin
  return children;
};

export default ProtectedAdminRoute;
