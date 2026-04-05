import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FileUp, List, Clock, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
const StudentDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [recentApps, setRecentApps] = useState([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/student/applications');
        const apps = res.data;
        const completed = apps.filter(a => a.status === 'Completed' || a.status === 'Ready for Collection').length;
        const pending = apps.length - completed;
        setStats({ total: apps.length, pending, completed });
        setRecentApps(apps.slice(0, 3));
      } catch (err) { console.error('Failed to fetch stats'); }
    };
    fetchDashboardData();
  }, []);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8 px-4 pb-12">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Portal</h1>
        <p className="text-slate-500 font-medium">Initiate and track cryptographic certificate requests securely.</p>
      </motion.div>
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-6 rounded-[2rem] flex items-center gap-5">
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><FileText size={24} /></div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Submissions</p>
             <p className="text-4xl font-black text-slate-900 leading-none mt-1">{stats.total}</p>
           </div>
         </div>
         <div className="glass-card p-6 rounded-[2rem] flex items-center gap-5">
           <div className="p-4 bg-yellow-50 text-yellow-600 rounded-2xl"><Clock size={24} /></div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Processing</p>
             <p className="text-4xl font-black text-slate-900 leading-none mt-1">{stats.pending}</p>
           </div>
         </div>
         <div className="glass-card p-6 rounded-[2rem] flex items-center gap-5">
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={24} /></div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Docs</p>
             <p className="text-4xl font-black text-slate-900 leading-none mt-1">{stats.completed}</p>
           </div>
         </div>
      </motion.div>
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
         <Link to="/student/apply" className="group glass-card p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 hover:border-indigo-200 transition-colors">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><FileUp size={32}/></div>
            <div>
               <h3 className="text-xl font-bold text-slate-900">Initiate Application</h3>
               <p className="text-sm text-slate-500 mt-2 font-medium">Draft a new cryptographic workflow array.</p>
            </div>
         </Link>
         <div className="glass-card p-8 rounded-[2rem] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><List size={20} className="text-indigo-600"/> Recent Activity</h3>
              <Link to="/student/applications" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">View All <ArrowRight size={12}/></Link>
            </div>
            <div className="flex-1 space-y-3">
              {recentApps.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-bold">No recent submissions found.</div>
              ) : (
                recentApps.map(app => (
                  <Link key={app._id} to={`/student/applications/${app._id}`} className="block p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 text-sm">{app.certificateType.name}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${app.status.includes('Pending') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : app.status === 'Completed' || app.status === 'Ready for Collection' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                           {app.status}
                        </span>
                     </div>
                     <span className="text-xs font-bold text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </Link>
                ))
              )}
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
};
export default StudentDashboard;
