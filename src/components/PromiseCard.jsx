import React, { useState } from 'react';
import { ChevronDown, Calendar, Building2, FileText } from 'lucide-react';

const statusColors = {
  'Completed': 'bg-green-100 text-green-800 border-green-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'Pending': 'bg-amber-100 text-amber-800 border-amber-300',
  'Overdue': 'bg-red-100 text-red-800 border-red-300',
};

const statusBgDark = {
  'Completed': 'dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  'In Progress': 'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
  'Pending': 'dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700',
  'Overdue': 'dark:bg-red-900 dark:text-red-200 dark:border-red-700',
};

export default function PromiseCard({ promise, isAdmin, onStatusChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(promise.status);
  
  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Overdue'];
  
  const isOverdue = promise.deadline_days < 30 && promise.status !== 'Completed';
  const progressPercent = Math.min(((100 - promise.deadline_days) / 100) * 100, 100);
  
  const handleStatusChange = (newStatus) => {
    setLocalStatus(newStatus);
    setIsDropdownOpen(false);
    if (onStatusChange) {
      onStatusChange(promise.id, newStatus);
    }
  };

  const displayStatus = localStatus;

  return (
    <div className={`group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl dark:shadow-slate-900/50 overflow-hidden ${isOverdue ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}>
      {/* Header with Point Number and Badge */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-5 py-3 flex justify-between items-start border-b border-slate-200 dark:border-slate-600">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Point #{promise.point_no.toString().padStart(3, '0')}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {promise.ministry_responsible}
          </p>
        </div>
        
        {/* Status Badge/Dropdown */}
        <div className="relative">
          {isAdmin ? (
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${statusColors[displayStatus]} ${statusBgDark[displayStatus]} cursor-pointer hover:shadow-md`}
            >
              <span>{displayStatus}</span>
              <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[displayStatus]} ${statusBgDark[displayStatus]}`}>
              {displayStatus}
            </div>
          )}
          
          {/* Admin Dropdown Menu */}
          {isAdmin && isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                    status === displayStatus
                      ? 'bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category Tag */}
        <div className="inline-flex">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-700">
            {promise.category}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">
            {promise.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Deadline */}
          <div className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <Calendar size={16} className="text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">Deadline</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {promise.deadline_days} days
              </p>
            </div>
          </div>

          {/* Ministry */}
          <div className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <Building2 size={16} className="text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">Ministry</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                {promise.ministry_responsible.split(' ').pop()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Progress</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{promise.progress}%</p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                promise.progress === 100
                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                  : promise.progress > 50
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
              style={{ width: `${promise.progress}%` }}
            />
          </div>
        </div>

        {/* Source Page */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <FileText size={14} />
          <span>Page {promise.source_page}</span>
        </div>
      </div>

      {/* Hover Highlight for Admin */}
      {isAdmin && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-blue-500 pointer-events-none rounded-xl transition-opacity" />
      )}
    </div>
  );
}
