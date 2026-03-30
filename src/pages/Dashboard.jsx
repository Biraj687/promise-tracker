import React, { useState, useEffect } from 'react';
import { Moon, Sun, Shield, X } from 'lucide-react';
import PromiseGrid from '../components/PromiseGrid';
import promisesData from '../data/promises.json';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });

  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [promises, setPromises] = useState(promisesData);
  const [adminAttempt, setAdminAttempt] = useState('');

  // Correct admin password (in production, verify on backend)
  const ADMIN_PASSWORD = 'admin2024';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleAdminView = () => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
    } else {
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
      setAdminPassword('');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setIsAdminModalOpen(false);
      setAdminPassword('');
      setAdminAttempt('');
    } else {
      setAdminAttempt('Invalid password');
      setTimeout(() => setAdminAttempt(''), 3000);
    }
  };

  const handleStatusChange = (promiseId, newStatus) => {
    setPromises(prevPromises =>
      prevPromises.map(p =>
        p.id === promiseId ? { ...p, status: newStatus } : p
      )
    );
    // In production, send this to your backend API
    console.log(`Promise ${promiseId} status changed to: ${newStatus}`);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  🏛️ Government Promise Tracker
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Monitor and track progress on 100 government development commitments
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title={darkMode ? 'Light Mode' : 'Dark Mode'}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Admin Toggle */}
                <button
                  onClick={toggleAdminView}
                  className={`p-2.5 rounded-lg transition-all font-medium flex items-center gap-2 ${
                    isAdmin
                      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  title="Admin View"
                >
                  <Shield size={20} />
                  <span className="text-sm font-semibold hidden sm:inline">
                    {isAdmin ? 'Admin ON' : 'Admin'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Login Modal */}
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                  Admin Access
                </h2>
                <button
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setAdminPassword('');
                    setAdminAttempt('');
                  }}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Demo password: <code className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">admin2024</code>
                  </p>
                </div>

                {adminAttempt && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{adminAttempt}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setAdminPassword('');
                  }}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Badge */}
          {isAdmin && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-300 dark:border-blue-700 rounded-lg flex items-center gap-3">
              <Shield size={20} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Admin Mode Active
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  You can now edit promise statuses. Changes are temporary and stored in your browser.
                </p>
              </div>
            </div>
          )}

          {/* Promise Grid */}
          <PromiseGrid
            promises={promises}
            isAdmin={isAdmin}
            onStatusChange={handleStatusChange}
          />
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">About</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A comprehensive tracking system for government development commitments with real-time progress monitoring.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Features</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>✓ Real-time search and filtering</li>
                  <li>✓ Multi-category organization</li>
                  <li>✓ Progress tracking</li>
                  <li>✓ Admin control panel</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Version</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  v1.0.0 • Built with React + Tailwind CSS
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>&copy; 2026 Government Promise Tracker. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

