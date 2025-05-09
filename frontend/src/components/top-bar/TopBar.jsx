import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../main.jsx";

export default function TopBar({ setUserId }) {
  const [userData, setUserData] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(null);
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/authentication/user-data`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!data) {
          console.log("No data found");
        } else {
          setUserData(data.userData);
          setUserId(data.userData.id);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

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
        setToken(null);
        setLogoutMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
      setTimeout(() => setLogoutMessage(null), 5000);
    }
  };

  return (
    <header>
      <Link>
        <h1>NoWaste</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/finds-stores">FINDS STORES</Link>
          </li>
          {!userData && (
            <>
              <li>
                <Link to="/login">SIGN-IN</Link>
              </li>
              <li>
                <Link to="/registration">SIGN-UP</Link>
              </li>
            </>
          )}
          {userData && (
            <>
              <li>
                <p>{`${userData.firstName} ${userData.lastName}`}</p>
              </li>
              <li>
                {!showLoader && (
                  <button onClick={handleLogout} type="button">
                    Logout
                  </button>
                )}
                {showLoader && (
                  <div
                    aria-live="polite"
                    aria-label="Logging out, please wait..."
                  ></div>
                )}
              </li>
            </>
          )}
        </ul>
        {logoutMessage && <p aria-live="polite">{logoutMessage}</p>}
      </nav>
    </header>
  );
}
