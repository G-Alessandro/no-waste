import { useState } from "react";
import style from "./UserDataLogout.module.css";

export default function UserDataLogout({
  userData,
  setUserData,
  setUserId,
  setLogoutMessage,
  handleMobileLinkClick,
  topBarLocation,
}) {
  const [showLoader, setShowLoader] = useState(false);

  const handleLogout = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/logout`,
        {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: localStorage.getItem("accessToken"),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setLogoutMessage(data.error);
      } else {
        localStorage.removeItem("accessToken");
        setUserData(null);
        if (topBarLocation === "finds-stores") {
          setUserId(null);
        }
        setLogoutMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
      handleMobileLinkClick();
      setTimeout(() => setLogoutMessage(null), 5000);
    }
  };

  return (
    <>
      {userData && (
        <div className={style.userDataLogoutContainer}>
          <li className={style.userData}>
            <p>{`${userData.firstName} ${userData.lastName}`}</p>
          </li>
          <li>
            {!showLoader && (
              <button
                onClick={handleLogout}
                type="button"
                className={style.logoutBtn}
              >
                logout
              </button>
            )}
            {showLoader && (
              <div
                aria-live="polite"
                aria-label="Logging out, please wait..."
                className={style.loader}
              ></div>
            )}
          </li>
        </div>
      )}
    </>
  );
}
