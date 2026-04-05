import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { FileCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  if (!user) return null;
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-4 z-50 mx-4 md:mx-auto max-w-7xl glass-panel rounded-full px-6 py-3 flex justify-between items-center mb-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
           <FileCheck size={18} className="text-white" />
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">SmartCert<span className="text-indigo-600">.</span></span>
      </div>
      <div className="flex items-center gap-6">
        <NotificationBell />
        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
           <div className="flex flex-col text-right hidden md:flex">
             <span className="text-sm font-bold text-slate-900">{user.name}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</span>
           </div>
           <button 
             onClick={handleLogout}
             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
             title="End Session"
           >
             <LogOut size={18} className="group-hover:-translate-y-0.5 transition-transform" />
           </button>
        </div>
      </div>
    </motion.nav>
  );
};
export default Navbar;
