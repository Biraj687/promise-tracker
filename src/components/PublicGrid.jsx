import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid3x3, List, TrendingUp, AlertCircle } from 'lucide-react';

function PublicGrid({ promises, stats, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('point_no');
  const [showFilter, setShowFilter] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    return [...new Set(promises.map(p => p.category))].sort();
  }, [promises]);

  // Filter and sort promises
  const filteredPromises = useMemo(() => {
    let filtered = promises;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.point_no.toString().includes(searchTerm) ||
        p.ministry_responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(p => selectedCategories.has(p.category));
    }

    // Status filter
    if (selectedStatuses.size > 0) {
      filtered = filtered.filter(p => selectedStatuses.has(p.status));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'deadline':
          return (a.deadline_days || 0) - (b.deadline_days || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return a.point_no - b.point_no;
      }
    });

    return filtered;
  }, [promises, searchTerm, selectedCategories, selectedStatuses, sortBy]);

  // Toggle category selection
  const toggleCategory = (category) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setSelectedCategories(newSet);
  };

  // Toggle status selection
  const toggleStatus = (status) => {
    const newSet = new Set(selectedStatuses);
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    setSelectedStatuses(newSet);
  };

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
      
      {/* Header Section */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600 dark:text-blue-400" size={28} />
          Public Promise Tracker
        </h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Total" value={stats.total} bgColor="bg-blue-50 dark:bg-blue-900/30" textColor="text-blue-700 dark:text-blue-300" />
          <StatCard label="Completed" value={stats.completed} bgColor="bg-green-50 dark:bg-green-900/30" textColor="text-green-700 dark:text-green-300" />
          <StatCard label="In Progress" value={stats.inProgress} bgColor="bg-blue-100 dark:bg-blue-900/50" textColor="text-blue-800 dark:text-blue-200" />
          <StatCard label="Pending" value={stats.pending} bgColor="bg-amber-50 dark:bg-amber-900/30" textColor="text-amber-700 dark:text-amber-300" />
          <StatCard label="Delayed" value={stats.delayed} bgColor="bg-red-50 dark:bg-red-900/30" textColor="text-red-700 dark:text-red-300" />
          <StatCard label="Avg Progress" value={`${stats.averageProgress}%`} bgColor="bg-purple-50 dark:bg-purple-900/30" textColor="text-purple-700 dark:text-purple-300" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by description, point number, or ministry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          
          {/* View Toggle */}
          <div className="flex gap-2 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400'}`}
              title="Grid View"
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400'}`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="point_no">Sort: Point Number</option>
            <option value="progress">Sort: Progress</option>
            <option value="deadline">Sort: Deadline</option>
            <option value="category">Sort: Category</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              showFilter
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>

          {/* Results Count */}
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {filteredPromises.length}/{promises.length} promises
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg space-y-4">
          
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Filter size={18} />
              Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
            {selectedCategories.size > 0 && (
              <button
                onClick={() => setSelectedCategories(new Set())}
                className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Clear category filters
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Completed', 'In Progress', 'Pending', 'Delayed'].map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has(status)}
                    onChange={() => toggleStatus(status)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </label>
              ))}
            </div>
            {selectedStatuses.size > 0 && (
              <button
                onClick={() => setSelectedStatuses(new Set())}
                className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Clear status filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Promises View */}
      {filteredPromises.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredPromises.map(promise => (
            <PublicPromiseCard
              key={promise.id}
              promise={promise}
              getStatusColor={getStatusColor}
              getProgressColor={getProgressColor}
              isListView={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-slate-400 dark:text-slate-600 mb-4" size={48} />
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
            No promises match your filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategories(new Set());
              setSelectedStatuses(new Set());
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// Public Promise Card Component
function PublicPromiseCard({ promise, getStatusColor, getProgressColor, isListView }) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
      
      {/* Card Content */}
      <div className={isListView ? 'p-4 flex items-start gap-4' : 'p-4 space-y-3'}>
        
        {/* Point Number Badge */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
          #{promise.point_no}
        </div>

        <div className={isListView ? 'flex-1' : ''}>
          
          {/* Header */}
          <div className={isListView ? '' : 'mb-2'}>
            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {promise.description}
            </h3>
          </div>

          {/* Status & Category */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusColor(promise.status)}`}>
              {promise.status}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium">
              {promise.category}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Progress</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{promise.progress || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${getProgressColor(promise.progress || 0)} transition-all duration-300 rounded-full`}
                style={{ width: `${promise.progress || 0}%` }}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className={isListView ? 'flex flex-wrap gap-4 text-xs' : 'space-y-1 text-xs'}>
            <div className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{promise.ministry_responsible}</span>
              <span className="block text-xs">Ministry Responsible</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{promise.deadline_days}</span>
              <span className="block text-xs">Days Remaining</span>
            </div>
          </div>

          {/* Last Update */}
          {promise.update_history && promise.update_history[0] && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
              Last updated: {new Date(promise.update_history[0].timestamp).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, bgColor, textColor }) {
  return (
    <div className={`${bgColor} ${textColor} p-3 rounded-lg`}>
      <p className="text-xs font-semibold opacity-75">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

export default PublicGrid;
