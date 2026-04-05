import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FileText, Clock, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };
    fetchAnalytics();
  }, []);
  if (!data) return (
     <div className="h-full flex flex-col items-center justify-center text-gray-400 font-bold animate-pulse p-20 gap-4 mt-20">
        <BarChart3 size={40} className="text-indigo-200" />
        <p className="tracking-widest uppercase text-xs">Compiling Aggregation Arrays...</p>
     </div>
  );
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics Engine</h1>
        <p className="text-gray-500 font-medium mt-1">Real-time macro analytics aggregating platform performance natively.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><FileText size={24} /></div>
           <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Global Requests</p>
             <p className="text-4xl font-black text-gray-900 leading-none mt-1">{data.totalRequests}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Clock size={24} /></div>
           <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Approval Time (Days)</p>
             <p className="text-4xl font-black text-gray-900 leading-none mt-1">{data.averageApprovalDays}</p>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="font-black text-gray-900 mb-8 flex items-center gap-2 text-lg shrink-0">
               <BarChart3 className="text-indigo-600"/> Active Department Workloads
            </h3>
            <div className="flex-1 w-full min-h-0 relative">
               <ResponsiveContainer width="100%" height="100%" className={"absolute inset-0"}>
                 <BarChart data={data.departmentWorkload} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}} tickLine={false} axisLine={false} />
                   <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}} tickLine={false} axisLine={false} allowDecimals={false} />
                   <Tooltip 
                     cursor={{fill: '#F9FAFB'}}
                     contentStyle={{ borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                   />
                   <Bar dataKey="pending" name="Pending Reviews" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={30} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="font-black text-gray-900 mb-8 flex items-center gap-2 text-lg shrink-0">
               <PieChartIcon className="text-emerald-600"/> Document Request Distribution
            </h3>
            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
               <ResponsiveContainer width="100%" height="100%" className={"absolute inset-0"}>
                 <PieChart>
                   <Pie
                     data={data.certDemand}
                     innerRadius={70}
                     outerRadius={100}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {data.certDemand.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                   />
                   <Legend 
                     verticalAlign="bottom" 
                     height={36} 
                     iconType="circle"
                     wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#4B5563', paddingTop: '20px' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
