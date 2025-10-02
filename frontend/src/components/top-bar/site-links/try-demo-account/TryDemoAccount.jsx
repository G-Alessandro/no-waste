import { useState } from "react";
import { useNavigate } from "react-router";
import style from "./TryDemoAccount.module.css";

export default function TryDemoAccount({
  setLoginError,
  topBarLocation,
  setLoginSuccessful,
  setDemoLoginSuccessful,
  setFetchError,
  handleMobileLinkClick,
}) {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/demo-account`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );

      const data = await response.json();
      if (data.error) {
        setLoginError(true);
      } else {
        setLoginSuccessful(true);
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        handleMobileLinkClick();
        if (topBarLocation === "login" || topBarLocation === "registration") {
          setDemoLoginSuccessful(true);
          navigate("/finds-stores", { replace: true });
        }
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
      setFetchError(true);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className={style.tryDemoAccountBtnContainer}>
      {showLoader && (
        <div
          aria-live="assertive"
          aria-label="Logging in with the demo account, please wait"
          className={style.loader}
        ></div>
      )}
      {!showLoader && (
        <button
          onClick={(event) => handleSubmit(event)}
          className={style.tryDemoAccountBtn}
        >
          Try a demo account
        </button>
      )}
    </div>
  );
}
