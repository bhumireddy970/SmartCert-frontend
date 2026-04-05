import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Landing from './pages/Landing';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import Apply from './pages/student/Apply';
import ApplicationsList from './pages/student/ApplicationsList';
import ApplicationDetails from './pages/student/ApplicationDetails';
import OfficerLayout from './layouts/OfficerLayout';
import OfficerDashboard from './pages/officer/Dashboard';
import ApplicationReview from './pages/officer/ApplicationReview';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import WorkflowConfig from './pages/admin/WorkflowConfig';
const DashboardPlaceholder = ({ title }) => (
  <div className="p-8 max-w-7xl mx-auto">
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-500">More features coming soon.</p>
    </div>
  </div>
);
const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-10 text-center bg-white rounded-3xl shadow-xl border border-red-100 max-w-md">
      <h2 className="text-red-500 text-5xl font-black mb-4">403</h2>
      <h3 className="text-gray-900 text-2xl font-bold mb-2">Access Denied</h3>
      <p className="text-gray-500 font-medium">You don't have permission to view this page.</p>
    </div>
  </div>
);
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
    <h2 className="text-9xl font-black text-gray-200 mb-4">404</h2>
    <h3 className="text-3xl font-bold text-gray-800 mb-2">Route Not Found</h3>
    <p className="text-gray-500 font-medium mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
    <a href="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
      Back to Home
    </a>
  </div>
);
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '16px 24px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                marginTop: '40vh',
                border: '1px solid rgba(255,255,255,0.1)'
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="apply" element={<Apply />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/:id" element={<ApplicationDetails />} />
            </Route>
            <Route path="/officer" element={
              <ProtectedRoute allowedRoles={['AnyOfficer']}>
                <OfficerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<OfficerDashboard />} />
              <Route path="applications/:id" element={<ApplicationReview />} />
            </Route>
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="workflows" element={<WorkflowConfig />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};
export default App;
