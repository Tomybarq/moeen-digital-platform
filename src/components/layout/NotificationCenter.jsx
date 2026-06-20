import { Bell, X, Check, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "@/services/apiService";
import { useAuth } from "@/lib/AuthContext";
import { coreApi } from "@/api/coreClient";
import moment from "moment";

const TYPE_LABELS = {
  case_update: "تحديث حالة",
  task_assigned: "مهمة جديدة",
  message: "رسالة",
  system_alert: "تنبيه نظام",
  import_complete: "اكتمال استيراد",
  status_change: "تغيير حالة",
  role_change: "تغيير صلاحية",
};

const TYPE_ICONS = {
  case_update: "🔄",
  task_assigned: "📋",
  message: "💬",
  system_alert: "⚠️",
  import_complete: "📥",
  status_change: "🔀",
  role_change: "🔐",
};

const PAGE_SIZE = 20;

export default function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);

  const loadNotifications = useCallback(async (append = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const s = append ? skip : 0;
      const result = await fetchNotifications({ skip: s, limit: PAGE_SIZE, sort: "-created_date" });
      const items = result ?? [];
      if (append) {
        setNotifications(prev => [...prev, ...items]);
      } else {
        setNotifications(items);
      }
      setHasMore(items.length === PAGE_SIZE);
      setSkip(s + items.length);
    } finally {
      setLoading(false);
    }
  }, [loading, skip]);

  // Initial load when popover opens
  useEffect(() => {
    if (open) {
      setSkip(0);
      loadNotifications(false);
    }
  }, [open]);

  // Subscribe to new notifications in real time
  useEffect(() => {
    const unsubscribe = coreApi.entities.Notification.subscribe((event) => {
      if (event.type === "create" && event.data?.user_id === user?.id) {
        setNotifications(prev => [event.data, ...prev]);
        setUnreadCount(c => c + 1);
      }
    });
    return unsubscribe;
  }, [user?.id]);

  // Track unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClick = (notification) => {
    if (!notification.is_read) handleMarkRead(notification.id);
    if (notification.link) {
      setOpen(false);
      navigate(notification.link);
    }
  };

  const handleLoadMore = () => {
    loadNotifications(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label="الإشعارات"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-white text-[10px] font-bold px-1 shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">الإشعارات</span>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">({unreadCount} جديدة)</span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 cursor-pointer"
              onClick={handleMarkAllRead}
            >
              <Check className="w-3.5 h-3.5 ml-1" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="max-h-[420px]">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Bell className="w-8 h-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">لا توجد إشعارات حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <AnimatePresence>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={cn(
                        "group relative flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/40",
                        !notification.is_read && "bg-primary/5 border-r-2 border-r-primary"
                      )}
                      onClick={() => handleClick(notification)}
                    >
                      {/* Type icon */}
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {TYPE_ICONS[notification.type] || "🔔"}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm", !notification.is_read && "font-semibold")}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); handleMarkRead(notification.id); }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {notification.message && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-muted-foreground/70">
                            {moment(notification.created_date).fromNow()}
                          </span>
                          <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                            {TYPE_LABELS[notification.type] || notification.type}
                          </span>
                          {notification.link && (
                            <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/50" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Load more */}
          {hasMore && notifications.length > 0 && (
            <div className="px-4 py-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs cursor-pointer"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" />
                ) : (
                  "عرض المزيد"
                )}
              </Button>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}