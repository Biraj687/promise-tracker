import React, { useState, useEffect } from 'react';
import { BarChart3, Shield, Eye, Lock } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import PublicGrid from './components/PublicGrid';
import promisesData from './data/promises.json';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [promises, setPromises] = useState([]);
  const [authError, setAuthError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize promises with update history tracking
  useEffect(() => {
    const enhancedPromises = promisesData.map(promise => ({
      ...promise,
      update_history: promise.update_history || [
        {
          timestamp: new Date().toISOString(),
          status: promise.status,
          progress: promise.progress,
          changedBy: 'System',
          notes: 'Initial data load'
        }
      ]
    }));
    setPromises(enhancedPromises);

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Load admin authentication state
    const savedAuth = localStorage.getItem('adminAuth') === 'true';
    setAdminAuthenticated(savedAuth);
    if (savedAuth) {
      setIsAdminMode(true);
    }
  }, []);

  // Update localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Handle admin login
  const handleAdminLogin = (password) => {
    setAuthError('');
    // IMPORTANT: In production, this should be verified on the backend
    // For demo purposes only - use environment variable in production
    const DEMO_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'demo_admin_2024';
    if (password === DEMO_PASSWORD) {
      setAdminAuthenticated(true);
      setIsAdminMode(true);
      localStorage.setItem('adminAuth', 'true');
      setAdminPassword('');
    } else {
      setAuthError('Invalid password. Demo password is configured in environment variables.');
      setTimeout(() => setAuthError(''), 3000);
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setIsAdminMode(false);
    localStorage.setItem('adminAuth', 'false');
    setAdminPassword('');
  };

  // Handle promise updates with history tracking
  const updatePromise = (promiseId, updates) => {
    setPromises(prevPromises =>
      prevPromises.map(promise => {
        if (promise.id === promiseId) {
          const updatedPromise = { ...promise, ...updates };

          // Add to update history
          const newHistory = [
            {
              timestamp: new Date().toISOString(),
              status: updates.status || promise.status,
              progress: updates.progress !== undefined ? updates.progress : promise.progress,
              changedBy: 'Admin User',
              notes: updates.notes || 'Manual update'
            },
            ...promise.update_history
          ];

          // Log the update
          console.log(`Promise #${promise.point_no} Updated:`, {
            ...updatedPromise,
            update_history: newHistory
          });

          return {
            ...updatedPromise,
            update_history: newHistory
          };
        }
        return promise;
      })
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      total: promises.length,
      completed: promises.filter(p => p.status === 'Completed').length,
      inProgress: promises.filter(p => p.status === 'In Progress').length,
      pending: promises.filter(p => p.status === 'Pending').length,
      delayed: promises.filter(p => p.status === 'Delayed').length,
      averageProgress: promises.length > 0
        ? Math.round(promises.reduce((sum, p) => sum + (p.progress || 0), 0) / promises.length)
        : 0
    };
    return stats;
  };

  const stats = calculateStats();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Government Accountability Tracker
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAdminMode ? '🔐 Admin Mode Active' : '👁️ Public View'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Toggle Dark Mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                {/* Admin Toggle */}
                {!adminAuthenticated ? (
                  <button
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <Eye size={18} />
                    Admin Access
                  </button>
                ) : (
                  <button
                    onClick={handleAdminLogout}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-lg"
                  >
                    <Lock size={18} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Admin Authentication Modal */}
          {isAdminMode && !adminAuthenticated && (
            <AdminAuthModal
              onAuthenticate={handleAdminLogin}
              error={authError}
              onCancel={() => setIsAdminMode(false)}
            />
          )}

          {/* View Selection */}
          {adminAuthenticated ? (
            <AdminPanel
              promises={promises}
              onUpdatePromise={updatePromise}
              stats={stats}
              darkMode={darkMode}
            />
          ) : (
            <PublicGrid
              promises={promises}
              stats={stats}
              darkMode={darkMode}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">About</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Real-time tracking of government commitments with accountability and transparency.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Features</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>✓ 100 Government Promises</li>
                  <li>✓ Real-time Status Updates</li>
                  <li>✓ Admin Dashboard</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Info</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  v2.0 • Built with React + Tailwind CSS
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>&copy; 2026 Government Accountability Tracker</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Admin Authentication Modal Component
function AdminAuthModal({ onAuthenticate, error, onCancel }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} />
            <h2 className="text-2xl font-bold">Admin Access</h2>
          </div>
          <p className="text-blue-100">Protected Dashboard</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Demo: <code className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">admin2024</code>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
