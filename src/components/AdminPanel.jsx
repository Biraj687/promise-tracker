import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Download, Clock, Save } from 'lucide-react';

function AdminPanel({ promises, onUpdatePromise, stats, darkMode }) {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('point_no');
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(promises.map(p => p.category))].sort();
    return ['All', ...cats];
  }, [promises]);

  // Filter and sort promises
  const filteredPromises = useMemo(() => {
    let filtered = promises;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.point_no.toString().includes(searchTerm) ||
        p.ministry_responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'status':
          const statusOrder = { 'Completed': 0, 'In Progress': 1, 'Pending': 2, 'Delayed': 3 };
          return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
        case 'deadline':
          return (a.deadline_days || 0) - (b.deadline_days || 0);
        default:
          return a.point_no - b.point_no;
      }
    });

    return filtered;
  }, [promises, searchTerm, activeCategory, sortBy]);

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Delayed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || colors['Pending'];
  };

  // Get progress bar color
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Controls Header */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          🛡️ Admin Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <StatBox label="Total" value={stats.total} color="blue" />
          <StatBox label="Completed" value={stats.completed} color="green" />
          <StatBox label="In Progress" value={stats.inProgress} color="blue" />
          <StatBox label="Pending" value={stats.pending} color="amber" />
          <StatBox label="Delayed" value={stats.delayed} color="red" />
          <StatBox label="Avg Progress" value={`${stats.averageProgress}%`} color="purple" />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by description, point number, or ministry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <Filter size={16} className="inline mr-1" />
                Category
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="point_no">Point Number</option>
                <option value="progress">Progress (High to Low)</option>
                <option value="status">Status</option>
                <option value="deadline">Deadline (Days)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  {filteredPromises.length} of {promises.length} promises
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promise Cards List */}
      <div className="space-y-3">
        {filteredPromises.map(promise => (
          <AdminPromiseCard
            key={promise.id}
            promise={promise}
            isExpanded={expandedId === promise.id}
            onToggleExpand={() => setExpandedId(expandedId === promise.id ? null : promise.id)}
            onUpdatePromise={onUpdatePromise}
            getStatusColor={getStatusColor}
            getProgressColor={getProgressColor}
            expandedHistoryId={expandedHistoryId}
            onToggleHistory={() => setExpandedHistoryId(expandedHistoryId === promise.id ? null : promise.id)}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Export Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            const dataStr = JSON.stringify(promises, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = 'promises-export.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Download size={20} />
          Export All Data
        </button>
      </div>
    </div>
  );
}

// Admin Promise Card Component
function AdminPromiseCard({
  promise,
  isExpanded,
  onToggleExpand,
  onUpdatePromise,
  getStatusColor,
  getProgressColor,
  expandedHistoryId,
  onToggleHistory,
  darkMode
}) {
  const [localStatus, setLocalStatus] = useState(promise.status);
  const [localProgress, setLocalProgress] = useState(promise.progress || 0);
  const [localNotes, setLocalNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdatePromise(promise.id, {
      status: localStatus,
      progress: localProgress,
      notes: localNotes
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const lastUpdate = promise.update_history?.[0];

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      
      {/* Card Header (Always Visible) */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4">
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Promise #{promise.point_no}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(localStatus)}`}>
                {localStatus}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {promise.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                {promise.category}
              </span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                {promise.ministry_responsible}
              </span>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="text-slate-600 dark:text-slate-400" size={20} />
            ) : (
              <ChevronDown className="text-slate-600 dark:text-slate-400" size={20} />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{localProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getProgressColor(localProgress)} transition-all duration-300 rounded-full`}
              style={{ width: `${localProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Deadline</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">
                {promise.deadline_days} days remaining
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Source Page</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">
                Page {promise.source_page}
              </p>
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Status
            </label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Progress Slider
              </label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{localProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localProgress}
              onChange={(e) => setLocalProgress(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex gap-2 mt-2">
              {[0, 25, 50, 75, 100].map(val => (
                <button
                  key={val}
                  onClick={() => setLocalProgress(val)}
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Update Notes
            </label>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Add notes about this update..."
              rows="2"
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Last Update Info */}
          {lastUpdate && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Last Updated
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-300">
                {new Date(lastUpdate.timestamp).toLocaleString()} by {lastUpdate.changedBy}
              </p>
            </div>
          )}

          {/* Update History */}
          <button
            onClick={onToggleHistory}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <Clock size={16} />
            History ({promise.update_history?.length || 0})
          </button>

          {expandedHistoryId === promise.id && (
            <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-2 max-h-48 overflow-y-auto">
              {promise.update_history?.map((entry, idx) => (
                <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {entry.changedBy} • Status: <span className="font-semibold">{entry.status}</span> • Progress: <span className="font-semibold">{entry.progress}%</span>
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-1">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            <Save size={18} />
            {isSaved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

// Stat Box Component
function StatBox({ label, value, color }) {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  };

  return (
    <div className={`p-3 rounded-lg ${colorMap[color]}`}>
      <p className="text-xs font-semibold opacity-75">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

export default AdminPanel;
