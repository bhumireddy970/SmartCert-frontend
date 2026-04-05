import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileCheck, Activity, Key, LayoutTemplate, ArrowRight } from 'lucide-react';
const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FileCheck size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">SmartCert<span className="text-indigo-600">.</span></span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">Sign In</Link>
        </motion.div>
      </nav>
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Platform v2.0 Live</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl leading-[1.05]"
        >
          Zero-Friction <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Document Approvals.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed"
        >
          The modern OS for enterprise academic routing. Eliminate paperwork, automate dynamic chains, and sign documents securely with native cryptographic matrices.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 relative"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <Link to="/login" className="relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full font-black text-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group ring-4 ring-slate-900/10 hover:ring-indigo-500/20">
            Enter Platform <ArrowRight size={20} className="transition-transform group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="glass-card p-10 rounded-3xl hover:bg-white hover:shadow-3xl hover:shadow-blue-500/10 transition-colors duration-500 relative overflow-hidden group cursor-pointer border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:-translate-y-1"><LayoutTemplate size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Dynamic Routing</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">No hardcoded maps. Administrators mutate multi-node logic sequences visually natively.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="glass-card p-10 rounded-3xl hover:bg-white hover:shadow-3xl hover:shadow-emerald-500/10 transition-colors duration-500 relative overflow-hidden group cursor-pointer border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:-translate-y-1"><Key size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Identity Vaults</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Strict cryptographic JWT barriers perfectly segment Students from Officers unconditionally.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="glass-card p-10 rounded-3xl hover:bg-white hover:shadow-3xl hover:shadow-purple-500/10 transition-colors duration-500 relative overflow-hidden group cursor-pointer border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:-translate-y-1"><Activity size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">SaaS Analytics</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">View deep micro-stat distributions bounding Workloads and Terminal Approval timers explicitly.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};
export default Landing;
