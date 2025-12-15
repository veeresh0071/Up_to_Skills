// Importing React and required hooks
import React, { useState, useEffect } from "react";
// Axios for API requests
import axios from "axios";
// Icons from lucide-react
import { Bell, X, Check, AlertCircle } from "lucide-react";

//  Notifications Panel Component
//  - isDarkMode: Enables dark theme styling
//  - isOpen: Controls visibility of notification panel
//  - onClose: Function to close the panel
const NotificationsPanel = ({ isDarkMode, isOpen, onClose }) => {
  // Component State
  const [notifications, setNotifications] = useState([]); // Stores all notifications
  const [unreadCount, setUnreadCount] = useState(0); // Stores total unread notifications
  const [loading, setLoading] = useState(true); // Shows loading spinner when fetching
  const [error, setError] = useState(null); // Stores any fetch errors

  // 🔄 Fetch notifications every time panel is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // 📦 Load notifications + unread count
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // / Get user info from localStorage
      const userJson = localStorage.getItem("user");
      // If user record missing
      if (!userJson) {
        setError("User information not found");
        setLoading(false);
        return;
      }

      let mentorId;
      try {
        const user = JSON.parse(userJson);
        mentorId = user?.id;
      } catch (parseErr) {
        console.error("Error parsing user:", parseErr);
        setError("User information is invalid");
        return;
      }

      if (!mentorId) {
        setError("User information not found");
        return;
      }

      const token = localStorage.getItem("token");
      const axiosConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      const normalize = (notif) => {
        if (!notif) return notif;
        return {
          ...notif,
          // Backend returns camelCase (isRead/createdAt). UI expects snake_case.
          is_read: typeof notif.is_read === "boolean" ? notif.is_read : Boolean(notif.isRead),
          created_at: notif.created_at || notif.createdAt,
        };
      };

      // 👉 API: Fetch all notifications
      const response = await axios.get(
        `http://localhost:5000/api/notifications?role=mentor&recipientId=${mentorId}`,
        axiosConfig
      );

      // 👉 API: Fetch unread count
      const countResponse = await axios.get(
        `http://localhost:5000/api/notifications/count?role=mentor&recipientId=${mentorId}`,
        axiosConfig
      );

      // If notifications successfully fetched, update state
      if (response.data.success) {
        const list = Array.isArray(response.data.data) ? response.data.data : [];
        setNotifications(list.map(normalize));
      }
      // If unread count successfully fetched, update count
      if (countResponse.data.success) {
        setUnreadCount(countResponse.data.data.total);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // ☑️ Mark one notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        undefined,
        axiosConfig
      );

      // Update UI
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // ☑️ Mark ALL notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;

      let userId;
      try {
        const user = JSON.parse(userJson);
        userId = user?.id;
      } catch {
        return;
      }
      if (!userId) return;

      const token = localStorage.getItem("token");
      const axiosConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      // Backend expects body: { role, recipientId }
      await axios.patch(
        "http://localhost:5000/api/notifications/read-all",
        { role: "mentor", recipientId: userId },
        axiosConfig
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // ❌ Delete one notification
  const handleDelete = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`,
        axiosConfig
      );

      // Update UI + Reduce unread count if needed
      setNotifications((prev) => {
        const deletedNotif = prev.find((n) => n.id === notificationId);
        if (deletedNotif && !deletedNotif.is_read) {
          setUnreadCount((u) => Math.max(0, u - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };
  // UI RENDERING SECTION
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 🔘 Background overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* 📌 Slide-in notification panel */}
      <div
        className={`absolute right-0 top-0 h-full w-96 shadow-lg transition-transform duration-300 flex flex-col ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Notifications</h2>

            {/* 🔴 Unread badge */}
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 border-b">
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-500 hover:text-blue-600 font-semibold"
            >
              Mark all as read
            </button>
          </div>
        )}
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading state */}
          {loading ? (
            // Spinner
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            // Error message
            <div className="p-4">
              <div
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-red-900/20 border border-red-700"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            // No notifications
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 opacity-30 mb-3" />
              <p className="text-center text-sm">No notifications yet</p>
            </div>
          ) : (
            // Notification cards
            <div className="p-3 space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notif.is_read
                      ? isDarkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                      : isDarkMode
                      ? "bg-blue-900/20 border-blue-700"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  {/* Title + Delete */}
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm flex-1">
                      {notif.title}
                    </h4>
                    {/* Delete notification */}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className={`p-0.5 rounded transition-colors flex-shrink-0 ${
                        isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Message */}
                  <p
                    className={`text-xs mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {notif.message}
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs mb-2 text-gray-500">
                    {new Date(notif.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Mark as read button */}
                  <div className="flex gap-2">
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 px-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Export component
export default NotificationsPanel;
