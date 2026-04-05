import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Users, Workflow, Activity } from 'lucide-react';
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 shrink-0 hidden md:block">
          <div className="p-6">
             <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Admin Panel</h2>
             <nav className="space-y-2">
                <NavLink to="/admin" end className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                   <LayoutDashboard size={18} /> Overview
                </NavLink>
                <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                   <Users size={18} /> User Management
                </NavLink>
                <NavLink to="/admin/workflows" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                   <Workflow size={18} /> Workflow Config
                </NavLink>
                <NavLink to="/officer" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-gray-600 hover:bg-gray-50">
                   <Activity size={18} /> System Activity
                </NavLink>
             </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
