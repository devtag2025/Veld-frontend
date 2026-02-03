import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import PageLoader from "@/components/loaders/PageLoader";
import ComponentLoader from "@/components/loaders/ComponentLoader";


const Header = lazy(() => import("@/components/layout/header/Header"));
const Footer = lazy(() => import("@/components/layout/footer/Footer"));
const DashboardLayout = lazy(() => import("@/components/layout/dashboard/DashboardLayout"));
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/Signup"));
const DashboardOverview = lazy(() => import("@/pages/dashboard/Overview"));

const BookingList = lazy(() => import("@/pages/dashboard/BookingList"));


const LandingLayout = () => {
  return (
    <div className="app">
      <Suspense fallback={<ComponentLoader />}>
        <Header />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

const DashboardLayoutWrapper = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardLayout />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayoutWrapper />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<ComponentLoader />}>
            <DashboardOverview />
          </Suspense>
        ),
      },
      {
        path: "booking",
        element: (
          <Suspense fallback={<ComponentLoader />}>
            <BookingList />
          </Suspense>
        ),
      },
      
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;