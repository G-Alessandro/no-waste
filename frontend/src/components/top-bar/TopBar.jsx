import { useState, useEffect } from "react";
import SiteLinks from "./site-links/SiteLinks";
import style from "./TopBar.module.css";

export default function TopBar({ setUserId, topBarLocation }) {
  const [userData, setUserData] = useState(null);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/authentication/user-data`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const newToken = response.headers.get("Authorization");
        const data = await response.json();

        if (response.ok) {
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
          }
          setUserData(data.userData);
          if (topBarLocation === "finds-stores") {
            setUserId(data.userData.id);
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [loginSuccessful]);

  useEffect(() => {
    let timerId;
    if (logoutMessage) {
      timerId = setTimeout(() => setLogoutMessage(null), 3000);
    } else if (fetchError) {
      timerId = setTimeout(() => setFetchError(false), 3000);
    } else if (loginSuccessful) {
      timerId = setTimeout(() => setLoginSuccessful(false), 3000);
    }
    return () => clearTimeout(timerId);
  }, [logoutMessage, fetchError, loginSuccessful]);

  return (
    <>
      <SiteLinks
        userData={userData}
        setUserData={setUserData}
        setUserId={setUserId}
        topBarLocation={topBarLocation}
        setLogoutMessage={setLogoutMessage}
        loginSuccessful={loginSuccessful}
        setLoginSuccessful={setLoginSuccessful}
        setFetchError={setFetchError}
      />
      {loginSuccessful && (
        <p aria-live="polite" className={style.loginSuccessful}>
          Login successful, you will be redirected to the page to find stores
          near you
        </p>
      )}
      {logoutMessage && (
        <p aria-live="polite" className={style.logoutMessage}>
          {logoutMessage}
        </p>
      )}
      {fetchError && (
        <p aria-live="polite" className={style.fetchError}>
          An error occurred while logging in
        </p>
      )}
    </>
  );
}
