import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import FindStores from "./components/finds-stores-page/FindStore.jsx";
import Registration from "./components/registration-page/Registration.jsx";
import Login from "./components/login-page/Login.jsx";

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
    {
      path: "/registration",
      element: <Registration />,
    },
    { path: "/login", element: <Login /> },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
