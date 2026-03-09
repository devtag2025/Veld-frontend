import { useEffect } from "react";
import { Bell, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/stores/notification.store";

const Notifications = () => {
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{notifications.length} total</span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">All caught up!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No new notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">
                      {n.bookingName}
                    </p>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-medium">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(n._id)}
                    className="text-xs cursor-pointer flex-shrink-0"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
