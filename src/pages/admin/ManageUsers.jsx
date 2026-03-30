import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

const ManageUsers = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-800">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-1">Manage admin and user accounts for the Promise Tracker system.</p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">User Management via Supabase</h3>
          <p className="text-blue-800 mb-4">
            This application now uses Supabase for authentication and user management. To manage users, admins, and roles, please use the Supabase Admin Console.
          </p>
          <a
            href="https://app.supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Go to Supabase Console
          </a>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">How to Manage Users</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Add New Users</h4>
            <p className="text-slate-600 text-sm">1. Go to Supabase Console → Authentication → Users<br/>2. Click "Add user" and provide email and password<br/>3. Users will be created with default permissions</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Manage Roles & Permissions</h4>
            <p className="text-slate-600 text-sm">Use Supabase's Row Level Security (RLS) policies to control access to the 'promises' table and other data resources.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Reset User Passwords</h4>
            <p className="text-slate-600 text-sm">In Supabase Console, select a user and use the "Reset password" action to send a recovery email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
