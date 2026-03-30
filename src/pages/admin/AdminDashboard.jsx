import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Activity, Clock, CheckCircle, ListTodo, Loader2, FolderOpen } from 'lucide-react';

const AdminDashboard = () => {
  const { promises, categories, loading } = useData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Calculate stats directly from promises (Supabase data)
    const total = promises.length;
    const completed = promises.filter(p => p.status === 'Completed').length;
    const inProgress = promises.filter(p => p.status === 'In Progress').length;
    const pending = promises.filter(p => p.status === 'Pending').length;
    setStats({
      total,
      completed,
      inProgress,
      pending,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    });
  }, [promises]);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Promises', value: stats.total, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'In Progress', value: stats.inProgress, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
    { title: 'Total Categories', value: categories.length, icon: FolderOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time status of Government Promises and Categories.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Progress Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading text-slate-800">Overall Completion</h2>
          <span className="text-2xl font-bold text-blue-600">{stats.percentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <div className="grid grid-cols-3 mt-4 text-center">
          <div>
            <p className="text-sm text-slate-600">Completed</p>
            <p className="text-lg font-bold text-emerald-600">{stats.completed}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">In Progress</p>
            <p className="text-lg font-bold text-amber-600">{stats.inProgress}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Pending</p>
            <p className="text-lg font-bold text-slate-600">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Promises */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
          <h2 className="text-lg font-bold font-heading text-slate-800 mb-4 border-b border-slate-100 pb-2">Recent Promises</h2>
          <div className="space-y-4">
            {promises.slice(-5).reverse().map(p => (
              <div key={p.id} className="flex items-start">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg mr-3 shrink-0">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{p.title}</p>
                  <p className="text-xs text-slate-500">Updated {p.updatedAt}</p>
                </div>
                <div className="ml-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                    p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    p.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
            {promises.length === 0 && <p className="text-sm text-slate-500">No promises yet.</p>}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
          <h2 className="text-lg font-bold font-heading text-slate-800 mb-4 border-b border-slate-100 pb-2">Categories</h2>
          <div className="space-y-3">
            {categories.slice(0, 5).map(cat => {
              const promiseCount = promises.filter(p => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[1]}`} />
                    <p className="text-sm font-medium text-slate-700 line-clamp-1">{cat.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 ml-2 shrink-0">{promiseCount}</span>
                </div>
              );
            })}
            {categories.length === 0 && <p className="text-sm text-slate-500">No categories yet.</p>}
            {categories.length > 5 && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                +{categories.length - 5} more categories
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
