import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from 'react-hot-toast';
import { UserPlus, Trash2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    department: "",
    studentId: "",
    mobileNumber: "",
    employeeId: "",
    phoneNumber: "",
  });
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this identity?",
      )
    )
      return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length < 3) return toast.error('Full Name must be at least 3 characters long.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error('Please enter a valid Email Address.');
    if (!formData.password || formData.password.length < 6) return toast.error('Initial Password must be at least 6 characters.');
    if (!formData.role) return toast.error('Role Authority is required.');
    if (!formData.department) return toast.error('Department assignment is required.');
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.role === "Student") {
        if (!formData.studentId.trim()) return toast.error('Student ID is strictly required.');
        if (!phoneRegex.test(formData.mobileNumber)) return toast.error('Provide a valid mobile number (min 10 digits).');
    } else {
        if (!formData.employeeId.trim()) return toast.error('Employee ID is strictly required.');
        if (!phoneRegex.test(formData.phoneNumber)) return toast.error('Provide a valid phone number (min 10 digits).');
    }
    try {
      await api.post("/api/admin/users", formData);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };
  const roles = [
    "Student",
    "Finance",
    "Library",
    "Hostel",
    "HOD",
    "Exam",
    "Director",
    "Placement",
    "Dean",
    "Administrative Officer",
    "Admin",
  ];
  const departments = ["CSE", "ECE", "EEE", "ME", "CE", "CHE", "MME", "Administration"];
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Identity Matrix
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage platform identities securely across access tiers.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              email: "",
              password: "",
              role: "Student",
              department: "",
              studentId: "",
              mobileNumber: "",
              employeeId: "",
              phoneNumber: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-all focus:ring-4 focus:ring-indigo-100 outline-none"
        >
          <UserPlus size={18} /> Generate Identity
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="p-5">User Designation</th>
              <th className="p-5">Role Authority</th>
              <th className="p-5">Department</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
            {users.map((u, index) => (
              <motion.tr
                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                key={u._id}
                className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors group cursor-default"
              >
                <td className="p-5">
                  <p className="font-bold text-gray-900 leading-tight">
                    {u.name}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                </td>
                <td className="p-5">
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${u.role === "Admin" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : u.role === "Student" ? "bg-gray-50 text-gray-600 border-gray-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-5 text-sm font-bold text-gray-600">
                  {u.department || "—"}
                </td>
                <td className="p-5 text-right">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(u._id)}
                    className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 outline-none"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-8 text-gray-400 font-bold"
                >
                  No identities found in matrix.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-gray-100 my-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
              <ShieldAlert className="text-indigo-600" /> Generate Identity
            </h3>
            <form
              onSubmit={handleCreate}
              className="space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Initial Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Role Authority
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Department
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {formData.role === "Student" && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Student ID
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g., ST12345"
                      value={formData.studentId}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Mobile Number
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g., +91-9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
              {formData.role !== "Student" && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Employee ID
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g., EMP12345"
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({ ...formData, employeeId: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g., +91-9876543210"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-colors outline-none focus:ring-4 focus:ring-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-sm transition-all focus:ring-4 focus:ring-indigo-200 outline-none"
                >
                  Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;
