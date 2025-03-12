import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
