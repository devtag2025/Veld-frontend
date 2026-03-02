import { useEffect } from "react";
import {
  ArrowUpRight,
  FileText,
  DollarSign,
  Calendar,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking.store";
import { useNotificationStore } from "@/stores/notification.store";

const DashboardOverview = () => {
  const { bookings, fetchBookings } = useBookingStore();
  const { notifications, unreadCount } = useNotificationStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const draftCount = bookings.filter((b) => b.status === "Draft").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings.toString(),
      change: `${draftCount} drafts`,
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Confirmed",
      value: confirmedCount.toString(),
      change: "Active bookings",
      icon: FileText,
      trend: "up",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "Total booking value",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Notifications",
      value: unreadCount.toString(),
      change: "Unread alerts",
      icon: Bell,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
        <Button className="w-full md:w-fit text-xs md:text-sm cursor-pointer">
          <ArrowUpRight className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent notifications
              </p>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div key={n._id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bookings yet
              </p>
            ) : (
              bookings.slice(0, 5).map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.huntDate).toLocaleDateString()} • {b.packageType}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      b.status === "Confirmed"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : b.status === "Signed"
                          ? "text-purple-700 bg-purple-50 border-purple-200"
                          : b.status === "Tentative"
                            ? "text-blue-700 bg-blue-50 border-blue-200"
                            : "text-slate-600 bg-slate-100 border-slate-200"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
