import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart3,
  LogOut 
} from "lucide-react";

const DashboardSidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    { to: "/dashboard/booking", icon: BarChart3, label: "BookingList" },
   
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-background md:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
          className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
         
            console.log("Logout clicked");
          }}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;