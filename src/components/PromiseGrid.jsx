import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Grid3x3, List } from 'lucide-react';
import PromiseCard from './PromiseCard';

export default function PromiseGrid({ promises, isAdmin, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('point_no');
  const [showFilter, setShowFilter] = useState(false);

  // Extract unique categories and statuses
  const categories = useMemo(() => {
    return [...new Set(promises.map(p => p.category))].sort();
  }, [promises]);

  const statuses = ['Completed', 'In Progress', 'Pending', 'Overdue'];

  // Filter and search logic
  const filteredPromises = useMemo(() => {
    return promises.filter(promise => {
      const matchesSearch =
        promise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promise.point_no.toString().includes(searchTerm) ||
        promise.ministry_responsible.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(promise.category);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(promise.status);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [promises, searchTerm, selectedCategories, selectedStatuses]);

  // Sort logic
  const sortedPromises = useMemo(() => {
    const sorted = [...filteredPromises];
    switch (sortBy) {
      case 'point_no':
        return sorted.sort((a, b) => a.point_no - b.point_no);
      case 'deadline':
        return sorted.sort((a, b) => a.deadline_days - b.deadline_days);
      case 'progress':
        return sorted.sort((a, b) => b.progress - a.progress);
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  }, [filteredPromises, sortBy]);

  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleStatus = useCallback((status) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSortBy('point_no');
  }, []);

  const stats = {
    total: promises.length,
    completed: promises.filter(p => p.status === 'Completed').length,
    inProgress: promises.filter(p => p.status === 'In Progress').length,
    pending: promises.filter(p => p.status === 'Pending').length,
    matching: sortedPromises.length,
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">In Progress</p>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.pending}</p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search Bar */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-3 text-slate-400 dark:text-slate-600" size={18} />
            <input
              type="text"
              placeholder="Search promises by description, point number, or ministry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <List size={18} />
            </button>
          </div>

          {/* Filter Toggle Mobile */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="sm:hidden space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="point_no">Point Number</option>
                <option value="deadline">Deadline</option>
                <option value="progress">Progress</option>
                <option value="category">Category</option>
              </select>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Categories</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Statuses */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Status</label>
              <div className="space-y-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {(searchTerm || selectedCategories.length > 0 || selectedStatuses.length > 0) && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Desktop Filter Sidebar */}
        <div className="hidden sm:grid grid-cols-3 gap-4">
          {/* Sort Column */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="point_no">Point Number</option>
              <option value="deadline">Deadline</option>
              <option value="progress">Progress</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Categories Column */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">Categories</label>
            <div className="space-y-2 max-h-40 overflow-y-auto bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-300 dark:border-slate-600">
              {categories.slice(0, 8).map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Column */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">Status</label>
            <div className="space-y-2 bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-300 dark:border-slate-600">
              {statuses.map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategories.length > 0 || selectedStatuses.length > 0) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Active Filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full border border-blue-300 dark:border-blue-700">
                Search: {searchTerm}
              </span>
            )}
            {selectedCategories.map(cat => (
              <span key={cat} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full border border-purple-300 dark:border-purple-700">
                {cat}
              </span>
            ))}
            {selectedStatuses.map(status => (
              <span key={status} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded-full border border-emerald-300 dark:border-emerald-700">
                {status}
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{sortedPromises.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{promises.length}</span> promises
        </div>
      </div>

      {/* Grid/List View */}
      {sortedPromises.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
          {sortedPromises.map(promise => (
            <PromiseCard
              key={promise.id}
              promise={promise}
              isAdmin={isAdmin}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No promises found</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
