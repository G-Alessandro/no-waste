import React, { StrictMode, createContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.jsx";

export const AuthContext = createContext(null);
export const statusContext = createContext(null);

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <Router />
    </AuthContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
