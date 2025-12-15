import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../Company_Dashboard/ui/button";
import NotificationDrawer from "./NotificationDrawer";
import useRealtimeNotifications from "../../hooks/useRealtimeNotifications";
import { cn } from "../../lib/utils";

export const deriveRecipientFromStorage = () => {
  if (typeof window === "undefined") return null;
  const potentialKeys = ["user", "admin", "mentor", "company", "student"];
  for (const key of potentialKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed?.id || parsed?._id || parsed?.userId) {
        return String(parsed.id || parsed._id || parsed.userId);
      }
    } catch {
      // ignore parsing errors
    }
  }

  return (
    localStorage.getItem("id") ||
    localStorage.getItem("mentorId") ||
    localStorage.getItem("companyId") ||
    null
  );
};

const NotificationCenter = ({
  role,
  recipientId,
  className,
  buttonVariant = "ghost",
}) => {
  const normalizedRole = (role || "").toLowerCase();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [derivedRecipient, setDerivedRecipient] = useState(() => {
    if (recipientId) return recipientId;
    return deriveRecipientFromStorage();
  });

  useEffect(() => {
    if (recipientId) {
      setDerivedRecipient((prev) => (prev === recipientId ? prev : recipientId));
      return;
    }

    const stored = deriveRecipientFromStorage();
    if (stored) {
      setDerivedRecipient((prev) => (prev === stored ? prev : stored));
    }
  }, [recipientId]);

  const effectiveRecipientId = recipientId || derivedRecipient || null;
  const shouldEnableRealtime = Boolean(normalizedRole) && (normalizedRole === "admin" || Boolean(effectiveRecipientId));

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useRealtimeNotifications({
    role: normalizedRole,
    recipientId: normalizedRole === "admin" ? null : effectiveRecipientId,
    enabled: shouldEnableRealtime,
  });

  useEffect(() => {
    if (!selectedNotification && notifications.length) {
      setSelectedNotification(notifications[0]);
    }
  }, [notifications, selectedNotification]);

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    // selection only; marking is handled by the drawer to avoid double-calls
  };

  const totalNotifications = notifications.length;
  const badgeValue = useMemo(() => {
    const count = typeof unreadCount === "number" ? unreadCount : totalNotifications;
    if (!count) return null;
    return count;
  }, [unreadCount, totalNotifications]);

  if (!normalizedRole) {
    return null;
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
        <Button
          variant={buttonVariant}
          size="icon"
          onClick={() => setIsDrawerOpen(true)}
          className={cn("relative", className)}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {badgeValue && (
            <span className="absolute -top-1 -right-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full border border-white bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm dark:border-slate-950">
              {badgeValue}
            </span>
          )}
        </Button>
      </motion.div>

      <NotificationDrawer
        role={normalizedRole}
        notifications={notifications}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectNotification={handleSelectNotification}
        activeNotification={selectedNotification}
        isLoading={isLoading}
        error={error}
        unreadCount={unreadCount}
        onMarkAllRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onRefetch={() => refetch && refetch()}
      />
    </>
  );
};

export default NotificationCenter;
