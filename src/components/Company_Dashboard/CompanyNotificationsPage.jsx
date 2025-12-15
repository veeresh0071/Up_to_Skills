// src/pages/CompanyNotificationsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import useRealtimeNotifications from "../../hooks/useRealtimeNotifications";
import { deriveRecipientFromStorage } from "../Notifications/NotificationCenter";
import { Button } from "./ui/button";

const ICON_MAP = {
  application: "👤",
  interview: "📅",
  milestone: "🎯",
  profile: "📝",
  assessment: "📊",
  mentorship: "👥",
  verification: "✅",
  login: "🔐",
};

const CompanyNotificationsPage = ({ isDarkMode: propIsDarkMode } = {}) => {

  // This controls dark mode on the page
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof propIsDarkMode !== "undefined") return propIsDarkMode;

    try {
      if (typeof window !== "undefined") {
        if (document.documentElement.classList.contains("dark")) return true;
        return localStorage.getItem("isDarkMode") === "true";
      }
    } catch (e) {}

    return false;
  });
  const [recipientId, setRecipientId] = useState(() => deriveRecipientFromStorage());

  useEffect(() => {
    // Update when parent gives isDarkMode
    if (typeof propIsDarkMode !== "undefined") {
      setIsDarkMode(propIsDarkMode);
      return;
    }

    // Update dark mode if changed from another tab
    const onStorage = (e) => {
      if (e.key === "isDarkMode") setIsDarkMode(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);

    // Update when HTML class changes
    const obs = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("storage", onStorage);
      obs.disconnect();
    };
  }, [propIsDarkMode]);

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
    role: "company",
    recipientId,
    limit: 100,
  });

  const headingClasses = useMemo(
    () =>
      `text-2xl font-semibold mb-6 flex flex-wrap items-center gap-2 ${
        isDarkMode ? "text-gray-100" : "text-gray-900"
      }`,
    [isDarkMode]
  );

  const cardBaseClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const emptyState = (
    <div
      className={`rounded-xl border ${cardBaseClasses} p-8 text-center text-sm ${
        isDarkMode ? "text-gray-300" : "text-gray-500"
      }`}
    >
      You are all caught up. New notifications will appear here as soon as they arrive.
    </div>
  );

  const renderTime = (value) => {
    if (!value) return "Just now";
    try {
      return formatDistanceToNow(new Date(value), { addSuffix: true });
    } catch {
      return value;
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className={headingClasses}>🔔 Company Notifications</h2>
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read ({unreadCount})
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={refetch} className="text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error.message || "Unable to load notifications."}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex h-40 items-center justify-center text-sm text-gray-500 dark:text-gray-300">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="mt-4">{emptyState}</div>
      ) : (
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 shadow-sm transition hover:shadow-md ${cardBaseClasses} ${
                notification.isRead ? "opacity-80" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {ICON_MAP[notification.type] || "🔔"}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-1 ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } text-sm`}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{renderTime(notification.createdAt)}</span>
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyNotificationsPage;
