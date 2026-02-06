import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="lg:ml-64 min-h-[calc(100vh-4rem)] p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
