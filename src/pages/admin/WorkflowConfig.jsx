import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Route, Plus, Trash2, Edit3, ArrowRight } from 'lucide-react';
const WorkflowConfig = () => {
  const [certs, setCerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ _id: null, name: '', description: '', requiredDocuments: [''], workflow: [''] });
  const fetchCerts = async () => {
    try {
      const res = await api.get('/api/admin/certificates');
      setCerts(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchCerts(); }, []);
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/api/admin/certificates/${formData._id}`, formData);
      } else {
         await api.post('/api/admin/certificates', formData);
      }
      setIsModalOpen(false);
      fetchCerts();
    } catch (err) { alert(err.response?.data?.message || 'Transaction failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Workflow Matrix globally? This may disrupt pending operations!')) return;
    try {
      await api.delete(`/api/admin/certificates/${id}`);
      fetchCerts();
    } catch(err) { alert('Deletion failed'); }
  }
  const handleArrayChange = (field, idx, value) => {
    const updated = [...formData[field]];
    updated[idx] = value;
    setFormData({ ...formData, [field]: updated });
  };
  const handleArrayAdd = (field) => setFormData({ ...formData, [field]: [...formData[field], ''] });
  const handleArrayRemove = (field, idx) => {
    const updated = [...formData[field]];
    updated.splice(idx, 1);
    setFormData({ ...formData, [field]: updated });
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6">
       <div className="flex justify-between items-end mb-8">
         <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Workflow Logic Structures</h1>
           <p className="text-gray-500 font-medium mt-1">Configure automated routing sequences mapping roles iteratively.</p>
         </div>
         <button onClick={() => { setFormData({ _id: null, name: '', description: '', requiredDocuments: [''], workflow: [''] }); setIsModalOpen(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-all focus:ring-4 focus:ring-indigo-100 outline-none">
            <Plus size={18} /> New Routing Matrix
         </button>
       </div>
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {certs.map(cert => (
             <div key={cert._id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => { setFormData(cert); setIsModalOpen(true); }} className="p-2 bg-gray-50 text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold"><Edit3 size={16} /></button>
                   <button onClick={() => handleDelete(cert._id)} className="p-2 bg-gray-50 text-red-500 hover:bg-red-50 rounded-lg font-bold"><Trash2 size={16} /></button>
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{cert.name}</h3>
                <p className="text-sm font-medium text-gray-500 mt-2 mb-6 h-10 line-clamp-2">{cert.description}</p>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Linear Routing Vector</h4>
                   <div className="flex flex-wrap items-center gap-2">
                     {cert.workflow.map((node, i) => (
                        <React.Fragment key={i}>
                          <span className="px-3 py-1.5 bg-white border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-lg shadow-sm">{node}</span>
                          {i < cert.workflow.length - 1 && <ArrowRight size={14} className="text-gray-300" />}
                        </React.Fragment>
                     ))}
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Required Documents Matrix</h4>
                   <ul className="flex flex-wrap gap-2">
                     {cert.requiredDocuments.map((doc, i) => (
                       <li key={i} className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold rounded-lg">{doc}</li>
                     ))}
                   </ul>
                </div>
             </div>
          ))}
       </div>
       {isModalOpen && (
         <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                <Route className="text-indigo-600"/> {formData._id ? 'Mutate Workflow Array' : 'Build Workflow Array'}
              </h3>
              <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Workflow Title</label>
                   <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description Metadata</label>
                   <textarea required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold min-h-[80px] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest">Routing Array Constraints</label>
                      <button type="button" onClick={() => handleArrayAdd('workflow')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded shadow-sm">+ Append Target Role</button>
                    </div>
                    <div className="space-y-3">
                      {formData.workflow.map((w, i) => (
                        <div key={i} className="flex gap-3 items-center">
                           <span className="w-6 h-6 shrink-0 bg-indigo-100 text-indigo-700 text-xs font-black rounded flex items-center justify-center">{i+1}</span>
                           <input required type="text" placeholder="e.g. Finance" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={w} onChange={e => handleArrayChange('workflow', i, e.target.value)} />
                           {formData.workflow.length > 1 && (
                             <button type="button" onClick={() => handleArrayRemove('workflow', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                           )}
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-[10px] font-black text-yellow-600 uppercase tracking-widest">Required Documents Array</label>
                      <button type="button" onClick={() => handleArrayAdd('requiredDocuments')} className="text-xs font-bold text-yellow-700 hover:text-yellow-900 bg-yellow-100 border border-yellow-200 px-3 py-1 rounded shadow-sm">+ Require Payload</button>
                    </div>
                    <div className="space-y-3">
                      {formData.requiredDocuments.map((d, i) => (
                        <div key={i} className="flex gap-3 items-center">
                           <span className="w-6 h-6 shrink-0 bg-yellow-100 text-yellow-700 text-xs font-black rounded flex items-center justify-center">{i+1}</span>
                           <input required type="text" placeholder="e.g. Identity Proof" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={d} onChange={e => handleArrayChange('requiredDocuments', i, e.target.value)} />
                           {formData.requiredDocuments.length > 1 && (
                             <button type="button" onClick={() => handleArrayRemove('requiredDocuments', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                           )}
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="pt-6 flex gap-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-colors outline-none focus:ring-4 focus:ring-gray-100">Cancel</button>
                   <button type="submit" className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-sm transition-all focus:ring-4 focus:ring-indigo-200 outline-none">Mutate System Map</button>
                 </div>
              </form>
            </div>
         </div>
       )}
    </div>
  );
};
export default WorkflowConfig;
