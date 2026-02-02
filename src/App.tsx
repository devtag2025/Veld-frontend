import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Home from "./pages/Home";
import "./App.css";


import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const Layout = () => {
  
  return (
    <div className="app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    
    ],
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
