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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);

    const formData = JSON.stringify({
      email: event.target.email.value,
      password: event.target.password.value,
    });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/login`,
        {
          method: "POST",
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
    <>
      <main className={style.loginMain}>
        <TopBar topBarLocation={"login"} />
        {loginSuccessful && (
          <p aria-live="polite" className={style.loginSuccessful}>
            Login successful, you will be redirected to the page to find stores
            near you
          </p>
        )}
        {loginError && (
          <p aria-live="polite" className={style.loginError}>
            Incorrect email or password
          </p>
        )}
        {fetchError && (
          <p aria-live="polite" className={style.fetchError}>
            An error occurred while logging in
          </p>
        )}

        {!loginSuccessful && (
          <form
            onSubmit={(event) => handleSubmit(event)}
            className={style.loginForm}
          >
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              minLength={1}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={8}
              placeholder="Enter your password"
              required
            />
            {showLoader && (
              <div
                aria-live="assertive"
                aria-label="Logging in, please wait"
                className={style.loader}
              ></div>
            )}
            {!showLoader && (
              <button type="submit" className={style.loginBtn}>
                Login
              </button>
            )}
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
