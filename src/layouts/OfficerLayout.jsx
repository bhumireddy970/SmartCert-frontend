import React, { useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LayoutDashboard, LogOut, Briefcase } from "lucide-react";
import NotificationBell from "../components/NotificationBell";
const OfficerLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const navItems = [
    {
      label: "Dashboard",
      path: "/officer",
      icon: <LayoutDashboard size={20} />,
    },
  ];
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-indigo-800">
          <Briefcase className="mr-3 text-indigo-300" />
          <span className="text-xl font-bold tracking-tight">
            Officer Portal
          </span>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/officer" &&
                location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-200 hover:bg-indigo-800/50"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-red-300 hover:bg-red-900/50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            SmartCert Review System
          </h2>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900">
                {user?.name}
              </span>
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default OfficerLayout;
