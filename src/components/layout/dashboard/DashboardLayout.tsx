import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/stores/notification.store";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = () => {
  const { isAuthenticated, initAuth } = useAuthStore();
  const fetchNotifications = useNotificationStore(
    (s) => s.fetchNotifications,
  );

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

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
