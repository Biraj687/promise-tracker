import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, LogOut, FolderOpen, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Content Manager', icon: FileText, path: '/admin/content' },
    { name: 'Manage Categories', icon: FolderOpen, path: '/admin/categories' },
    { name: 'Manage Promises', icon: CheckSquare, path: '/admin/promises' },
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
            <span className="text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
