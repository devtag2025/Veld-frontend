import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import PageLoader from "@/components/loaders/PageLoader";
import ComponentLoader from "@/components/loaders/ComponentLoader";

const LandingHeader = lazy(
  () => import("@/components/layout/landingpage/LandingHeader"),
);
const LandingFooter = lazy(
  () => import("@/components/layout/landingpage/LandingFooter"),
);
const DashboardLayout = lazy(
  () => import("@/components/layout/dashboard/DashboardLayout"),
);
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/Signup"));
const DashboardOverview = lazy(() => import("@/pages/dashboard/Overview"));
const Bookings = lazy(() => import("@/pages/dashboard/Bookings"));
const Leads = lazy(() => import("@/pages/dashboard/Leads"));
const Service = lazy(() => import("@/pages/dashboard/Service"));
const Contracts = lazy(() => import("@/pages/dashboard/Contracts"));

const LandingLayout = () => {
  return (
    <div className="app" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Suspense fallback={<ComponentLoader />}>
        <LandingHeader />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <LandingFooter />
      </Suspense>
    </div>
  );
};

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
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
            <Bookings />
          </Suspense>
        ),
      },
      {
        path: "leads",
        element: (
          <Suspense fallback={<ComponentLoader />}>
            <Leads />
          </Suspense>
        ),
      },
      {
        path: "service",
        element: (
          <Suspense fallback={<ComponentLoader />}>
            <Service />
          </Suspense>
        ),
      },
      {
        path: "contracts",
        element: (
          <Suspense fallback={<ComponentLoader />}>
            <Contracts />
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
