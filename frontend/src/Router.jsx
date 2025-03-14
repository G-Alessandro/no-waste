import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import FindStores from "./components/finds-stores-page/FindStore.jsx";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/finds-stores",
      element: <FindStores />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
