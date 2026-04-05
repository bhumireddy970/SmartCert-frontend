import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import api from "../api/axios";
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };
  useEffect(() => {
    fetchNotifications();
    pollIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 5000);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };
  const markAllAsRead = async () => {
    try {
      await api.put("/api/notifications/mark-all/read");
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 rounded-xl mr-4"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 font-medium">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification._id);
                  }}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${notification.isRead ? "bg-white opacity-60" : "bg-indigo-50/30 hover:bg-indigo-100/50"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        notification.type === "error"
                          ? "text-red-700"
                          : notification.type === "success"
                            ? "text-green-700"
                            : "text-indigo-900"
                      }`}
                    >
                      {notification.title}
                      {!notification.isRead && (
                        <span className="inline-block ml-2 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      )}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationBell;
