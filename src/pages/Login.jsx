import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { FileCheck, Activity, Key, ChevronRight } from 'lucide-react';
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email.trim()) return setError('Email address is strictly required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Please enter a valid format for your work email.');
    if (!formData.password) return setError('Cryptographic Key (Password) is required.');
    if (formData.password.length < 6) return setError('Key must be at least 6 characters in length.');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === 'Student') navigate('/student');
      else if (role === 'Admin') navigate('/admin');
      else navigate('/officer');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication structurally failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
       <motion.div 
         initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
         className="absolute top-8 left-8 flex items-center gap-2"
       >
          <Link to="/" className="w-8 h-8 hover:-translate-y-0.5 transition-transform bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
             <FileCheck size={18} className="text-white" />
          </Link>
          <span className="text-xl font-black tracking-tight text-slate-900">SmartCert<span className="text-indigo-600">.</span></span>
       </motion.div>
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }} 
         animate={{ opacity: 1, scale: 1 }} 
         transition={{ duration: 0.4, ease: "easeOut" }}
         className="w-full max-w-[400px] z-10"
       >
         <div className="glass-panel p-10 rounded-[2rem]">
            <div className="text-center mb-10">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                  <Key size={24} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Platform</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Identity Verification</p>
            </div>
            {error && (
              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100 flex items-center justify-center gap-2">
                 <Activity size={16}/> {error}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
                <input
                  type="email" 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                  placeholder="name@university.edu"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Cryptographic Key</label>
                <input
                  type="password" 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-4 mt-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all group disabled:opacity-50 outline-none focus:ring-4 focus:ring-indigo-100"
              >
                {loading ? 'Verifying Identity...' : 'Initialize Session'}
                {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
         </div>
         <p className="text-center text-xs font-bold text-slate-400 mt-8">
            Secured by SmartCert Zero-Trust Matrix.
         </p>
       </motion.div>
    </div>
  );
};
export default Login;
