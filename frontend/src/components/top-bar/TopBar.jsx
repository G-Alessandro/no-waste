import { useState, useEffect } from "react";
import SiteLinks from "./site-links/SiteLinks";

export default function TopBar({ setUserId, topBarLocation }) {
  const [userData, setUserData] = useState(null);

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
          setUserId(data.userData.id);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <SiteLinks
        userData={userData}
        setUserData={setUserData}
        setUserId={setUserId}
        topBarLocation={topBarLocation}
      />
    </>
  );
}
