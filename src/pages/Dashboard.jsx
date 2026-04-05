import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const Dashboard = ({ title }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>
        <p className="text-gray-600 text-lg">Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>! You are logged in as a <span className="font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-700">{user?.role}</span>.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-blue-800 text-xl">Profile Actions</h3>
            <p className="text-sm text-blue-600 mt-2">Manage your account settings here.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-green-800 text-xl">Pending Approvals</h3>
            <p className="text-sm text-green-600 mt-2">View 0 pending requests.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-purple-800 text-xl">Recent Activity</h3>
            <p className="text-sm text-purple-600 mt-2">No recent activity found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
