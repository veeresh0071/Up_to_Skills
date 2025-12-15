import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./NotificationPage.css";

import Header from "../dashboard/Header";
import Sidebar from "../dashboard/Sidebar";
import { useTheme } from "../../../context/ThemeContext";
import useRealtimeNotifications from "@/hooks/useRealtimeNotifications";
import { deriveRecipientFromStorage } from "@/components/Notifications/NotificationCenter";

const NotificationsPage = () => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [recipientId, setRecipientId] = useState(() => deriveRecipientFromStorage());

  useEffect(() => {
    if (!recipientId) {
      setRecipientId(deriveRecipientFromStorage());
    }
  }, [recipientId]);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    markAsRead,
    refetch,
  } = useRealtimeNotifications({
    role: "student",
    recipientId,
    limit: 100,
  });

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const renderTime = (value) => {
    if (!value) return "Just now";
    try {
      return formatDistanceToNow(new Date(value), { addSuffix: true });
    } catch {
      return value;
    }
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "lg:ml-64" : "ml-0"}`}>
        <Header onMenuClick={toggleSidebar} />

        <div className={`pt-24 px-6 py-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              🔔 Notifications
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  className="rounded-md bg-emerald-600 px-3 py-1 font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                  onClick={markAllAsRead}
                >
                  Mark all read ({unreadCount})
                </button>
              )}
              <button
                className={`rounded-md border px-3 py-1 font-semibold transition ${
                  darkMode
                    ? "border-gray-600 text-gray-200 hover:bg-gray-800"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={refetch}
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
              {error.message || "Unable to load notifications."}
            </div>
          )}

          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-500 dark:text-gray-300">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div
              className={`rounded-lg border border-dashed p-8 text-center text-sm ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-gray-300"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              Nothing new yet. We will drop updates here as soon as they arrive.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  className={`p-4 rounded-lg border shadow-sm transition ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } ${notification.isRead ? "opacity-80" : ""}`}
                  key={notification.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <button
                          className="mt-3 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {renderTime(notification.createdAt)}
                    </span>
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

export default NotificationsPage;
