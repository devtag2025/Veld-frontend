import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/stores/notification.store";
import {
  BarChart3,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { unreadCount, notifications, markAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    { to: "/dashboard/leads", icon: Users, label: "Leads" },
    { to: "/dashboard/booking", icon: BarChart3, label: "Bookings" },
    { to: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 border-r-2 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex items-center justify-between px-20 pt-8 pb-6">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <span className="text-3xl text-black font-bold">Velda</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg relative left-12 bottom-5 cursor-pointer hover:rotate-180 transition-transform"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 flex-col p-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.label === "Notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-white/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:ml-64">
        <header
          className={`sticky top-0 z-30 w-full transition-all duration-300 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
              : "bg-background shadow-none"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-accent border border-tertiary rounded-full transition-colors active:bg-gray-800 cursor-pointer"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              >
                <Menu className="w-5 h-5" />
              </button>

              {user && (
                <span className="hidden md:block text-sm text-muted-foreground">
                  Welcome, <span className="font-semibold text-foreground">{user.name}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Notifications Bell */}
              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer border border-gray-300 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b font-semibold text-sm flex items-center justify-between">
                      <span>Notifications ({unreadCount})</span>
                      <button
                        className="text-xs text-primary hover:underline cursor-pointer"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/dashboard/notifications");
                        }}
                      >
                        View All
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No new notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className="p-3 border-b hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => {
                            markAsRead(n._id);
                          }}
                        >
                          <div className="text-sm font-medium">
                            {n.bookingName}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {n.message}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                    {user?.name || "Admin"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/dashboard/settings");
                        }}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default DashboardHeader;
