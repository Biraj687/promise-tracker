import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, LogOut, FolderOpen, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState(null);

  const handleLogout = async () => {
    try {
      setLogoutError(null);
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setLogoutError('Logout failed. Please try again.');
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Content Manager', icon: FileText, path: '/admin/content' },
    { name: 'Manage Promises', icon: CheckSquare, path: '/admin/promises' },
    { name: 'Manage News', icon: FileText, path: '/admin/news' },
    { name: 'Manage Users', icon: Users, path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold font-heading text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Nepal Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
            Dashboard
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-600 font-medium">{user?.username}</p>
              <p className="text-xs text-slate-400">Role: <span className="font-semibold text-slate-600">{user?.role}</span></p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Error Messages */}
        {(authError || logoutError) && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">{authError || logoutError}</p>
            </div>
          </div>
        )}

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
