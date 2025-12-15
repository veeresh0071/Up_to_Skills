import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./NotificationPage.css";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import useRealtimeNotifications from "@/hooks/useRealtimeNotifications";
import { deriveRecipientFromStorage } from "@/components/notifications/NotificationCenter";

const NotificationsPage = ({ isDarkMode, toggleDarkMode }) => {
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
    role: "mentor",
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

  const formatType = (type = "") =>
    type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className={`dashboard-container${isDarkMode ? " dark" : ""}`}>
      {isOpen && (
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />
      )}
      <div className={`main-content${isOpen ? "" : " full-width"}`}>
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="pt-24 page-card dark:bg-gray-700 dark:text-white">
          <div className="notifications-wrapper">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="notifications-main-title">🔔 Notifications</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {unreadCount > 0 && (
                  <button
                    className="rounded-md bg-indigo-600 px-3 py-1 font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    onClick={markAllAsRead}
                  >
                    Mark all read ({unreadCount})
                  </button>
                )}
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600"
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
              <div className="flex h-32 items-center justify-center text-sm text-gray-500 dark:text-gray-200">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                You have no notifications yet. New updates will show up here in real time.
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    className={`notification-item ${
                      notification.isRead ? "opacity-70" : ""
                    }`}
                    key={notification.id}
                  >
                    <div className="notification-content">
                      <h3 className="notification-title">{notification.title}</h3>
                      <p className="notification-message">{notification.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                          {formatType(notification.type || "update")}
                        </span>
                        {!notification.isRead && (
                          <button
                            className="rounded-full border border-gray-300 px-2 py-0.5 font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="notification-time">
                      {renderTime(notification.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
