import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../top-bar/TopBar.jsx";
import Footer from "../footer/Footer.jsx";
import style from "./Login.module.css";

export default function Login() {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event, type) => {
    event.preventDefault();
    setShowLoader(true);

    const isLogin = type === "login";
    const route = isLogin ? "login" : "demo-account";
    const method = isLogin ? "POST" : "GET";

    const formData = isLogin
      ? JSON.stringify({
          email: event.target.email.value,
          password: event.target.password.value,
        })
      : undefined;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/${route}`,
        {
          method: method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.error) {
        setLoginError(true);
      } else {
        setLoginSuccessful(true);
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
      setFetchError(true);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    let timerId;
    if (loginError) {
      timerId = setTimeout(() => setLoginError(false), 3000);
    } else if (fetchError) {
      timerId = setTimeout(() => setFetchError(false), 3000);
    }
    return () => clearTimeout(timerId);
  }, [loginError, fetchError]);

  useEffect(() => {
    if (loginSuccessful) {
      setTimeout(() => navigate("/finds-stores"), 3000);
    }
  }, [loginSuccessful]);

  return (
    <main>
      <TopBar />
      {loginSuccessful && (
        <div aria-live="polite" className={style.loginSuccessful}>
          <p>
            Login successful, you will be redirected to the page to find stores
            near you
          </p>
        </div>
      )}
      {!loginSuccessful && (
        <form
          onSubmit={(event) => handleSubmit(event, "login")}
          className={style.loginForm}
        >
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" minLength={1} required />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            minLength={8}
            required
          />
          {showLoader && (
            <div
              aria-live="assertive"
              aria-label="Logging in, please wait..."
              className={style.loader}
            ></div>
          )}
          {!showLoader && (
            <button type="submit" className={style.loginBtn}>
              Login
            </button>
          )}
          {!showLoader && (
            <button
              onClick={(event) => handleSubmit(event, "demo-account")}
              className={style.tryDemoAccountBtn}
            >
              Try a demo account
            </button>
          )}
        </form>
      )}
      {loginError && (
        <div aria-live="polite" className={style.loginError}>
          <p>Incorrect email or password</p>
        </div>
      )}
      {fetchError && (
        <div className={style.fetchError}>
          <p>An error occurred while logging in.</p>
        </div>
      )}
      <Footer />
    </main>
  );
}
