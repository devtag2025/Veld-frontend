import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  UserCog,
  Users,
  X,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const DashboardHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    { to: "/dashboard/booking", icon: BarChart3, label: "Bookings" },
    { to: "/dashboard/leads", icon: Users, label: "Leads" },
    { to: "/dashboard/service", icon: UserCog, label: "Services" },
    { to: "/dashboard/contracts", icon: FileText, label: "Contracts" },
    { to: "/dashboard/invoices", icon: FileText, label: "Invoices" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            </NavLink>
          ))}

          <button
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              console.log("Logout clicked");
            }}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
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
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer border border-gray-300 hover:bg-primary hover:text-primary-foreground"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer border border-gray-300 hover:bg-primary hover:text-primary-foreground"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default DashboardHeader;
