import React, { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { BellRing } from "lucide-react";
import { Button } from "../Company_Dashboard/ui/button";
import useRealtimeNotifications from "../../hooks/useRealtimeNotifications";

const formatTimestamp = (value) => {
  if (!value) return "Just now";
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return value;
  }
};

export default function AdminNotifications({ isDarkMode }) {
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useRealtimeNotifications({ role: "admin", limit: 100 });

  // Sync dark mode globally
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  const hasNotifications = notifications.length > 0;

  return (
    <main
      className={`p-6 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Live updates for every admin event.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={refetch}>
            Refresh
          </Button>
          {/* 'Mark all read' removed per request */}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          {error.message || "Unable to load notifications."}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <BellRing className="h-6 w-6 animate-pulse" />
          Loading notifications...
        </div>
      ) : hasNotifications ? (
        <div className="flex flex-col gap-4">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
              className={`flex justify-between items-center p-4 rounded-xl border text-left transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              } ${notification.isRead ? "opacity-85" : ""}`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                  )}
                  <h3 className="font-semibold text-base">
                    {notification.title}
                  </h3>
                </div>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {notification.message}
                </p>
                {notification.metadata?.courseTitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.metadata.courseTitle}
                  </p>
                )}
              </div>
              <span
                className={`text-xs ml-4 flex-shrink-0 whitespace-nowrap ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formatTimestamp(notification.createdAt)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <BellRing className="h-8 w-8" />
          <p className="text-base font-semibold">No notifications yet</p>
          <p className="text-sm">
            Activity such as logins, enrollments, testimonials, and badges will appear here instantly.
          </p>
        </div>
      )}
    </main>
  );
}
