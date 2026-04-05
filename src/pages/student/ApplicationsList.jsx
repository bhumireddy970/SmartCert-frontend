import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Eye, FileText } from 'lucide-react';
const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/api/student/applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApps();
  }, []);
  const getStatusBadge = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <Link to="/student/apply" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
          <FileText size={18} /> New Application
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="bg-gray-50 rounded-full p-6 mb-4">
              <FileText size={48} className="text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-800">No applications found</p>
            <p className="text-sm mt-2 text-gray-500">You haven't applied for any certificates yet. Start an application now!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-5">Certificate Type</th>
                  <th className="px-6 py-5">Applied Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-5 text-gray-900 font-bold">
                      {app.certificateType?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-5 text-gray-600 text-sm font-medium">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        to={`/student/applications/${app._id}`} 
                        className="inline-flex items-center justify-center p-2.5 text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-xl transition-colors ring-1 ring-blue-100"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ApplicationsList;
