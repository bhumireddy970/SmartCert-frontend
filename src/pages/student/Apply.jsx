import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
const Apply = () => {
  const [certTypes, setCertTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get('/api/student/certificates');
        setCertTypes(res.data);
      } catch (err) {
        console.error('Failed to load certificate types', err);
      }
    };
    fetchTypes();
  }, []);
  const handleTypeSelect = (e) => {
    const type = certTypes.find(t => t._id === e.target.value);
    setSelectedType(type);
    setFiles({});
  };
  const handleFileChange = (docName, e) => {
    setFiles({ ...files, [docName]: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) return toast.error('Please securely select a target Certificate Type.');
    for (const docName of selectedType.requiredDocuments) {
      if (!files[docName]) {
        return toast.error(`Missing Required Document: Please attach the "${docName}" payload.`);
      }
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('certificateTypeId', selectedType._id);
    selectedType.requiredDocuments.forEach(docName => {
      if (files[docName]) {
        formData.append('documents', files[docName], docName);
      }
    });
    try {
      await api.post('/api/student/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/student/applications');
    } catch (err) {
      console.error('Failed to submit application', err);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <motion.div variants={itemVariants} className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-2xl font-bold text-gray-900">Apply for a Certificate</h2>
        <p className="text-gray-500 mt-1">Select a certificate type and upload the required documents.</p>
      </motion.div>
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <motion.div variants={itemVariants} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <label className="block text-sm font-black text-slate-800 tracking-tight mb-3">Target Certificate Authorization</label>
          <select 
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow bg-white text-gray-800"
            onChange={handleTypeSelect}
            defaultValue=""
          >
            <option value="" disabled>-- Select Certificate Type --</option>
            {certTypes.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          {selectedType && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 text-xs font-medium text-slate-600 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 leading-relaxed shadow-inner">
              <strong className="text-indigo-900 font-bold uppercase tracking-widest text-[10px]">Matrix Protocol:</strong> {selectedType.description}
            </motion.p>
          )}
        </motion.div>
        <AnimatePresence>
        {selectedType && selectedType.requiredDocuments.length > 0 && (
          <motion.div variants={itemVariants} initial="hidden" animate="show" exit={{ opacity: 0, height: 0 }} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 mb-4 tracking-tight">Required Payload Vectors</h3>
            <div className="space-y-4">
              {selectedType.requiredDocuments.map(docName => (
                <div key={docName} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:border-gray-300 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{docName}</p>
                    <p className="text-xs text-gray-500 mt-1">Please upload a clear document image or PDF</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-dashed border-blue-400 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors bg-white font-medium text-sm w-32">
                      <UploadCloud size={18} className="mr-2" />
                      {files[docName] ? 'Change File' : 'Upload'}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(docName, e)} 
                      />
                    </label>
                    {files[docName] && (
                      <div className="mt-2 flex items-center text-xs text-green-600 font-semibold justify-end">
                        <CheckCircle2 size={14} className="mr-1" />
                        Attached
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        <motion.div variants={itemVariants} className="pt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={!selectedType || isSubmitting}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
              !selectedType || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};
export default Apply;
