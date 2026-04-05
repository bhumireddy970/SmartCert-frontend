import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Filter, Users, LayoutList, Search, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
const OfficerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/api/officer/applications');
        setApplications(res.data);
      } catch (err) { console.error('Failed to fetch officer queue'); }
    };
    fetchApps();
  }, []);
  const types = ['All', ...new Set(applications.map(a => a.certificateType?.name).filter(Boolean))];
  const filteredApps = applications.filter(app => {
    const matchName = app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'All' || app.certificateType?.name === filterType;
    return matchName && matchType;
  });
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Workload Queue</h1>
          <p className="text-slate-500 font-medium">Verify documents implicitly bound to <span className="text-indigo-600 font-bold">{user.role}</span> authority.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
           <Activity size={18} className="text-emerald-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pending</span>
           <span className="text-lg font-black text-slate-900 ml-2">{applications.length}</span>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Search targets inherently..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            className="w-full md:w-64 pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                <th className="px-6 py-5 rounded-tl-[2rem]">Student Identity</th>
                <th className="px-6 py-5">Workflow Matrix</th>
                <th className="px-6 py-5">Initialization</th>
                <th className="px-6 py-5">Current Target</th>
                <th className="px-6 py-5 text-right rounded-tr-[2rem]">Access Vector</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-400 font-bold uppercase tracking-widest text-xs">Queue Is Empty</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0"><Users size={14}/></div>
                         <div>
                            <p className="font-bold text-slate-900 leading-tight">{app.student?.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{app.student?.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                         <LayoutList size={14} className="text-indigo-400" />
                         <span className="font-bold text-slate-700 text-sm">{app.certificateType?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-bold text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                        app.status.includes('Completed') || app.status.includes('Ready') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        app.status.includes('Reject') || app.status.includes('Information Requested') ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <Link to={`/officer/applications/${app._id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-indigo-100 group/btn">
                          Review <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default OfficerDashboard;
