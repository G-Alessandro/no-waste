import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../top-bar/TopBar.jsx";
import Footer from "../footer/Footer.jsx";

export default function Login({ setError }) {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [loginError, setLoginError] = useState(false);
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
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoginError(true);
      } else {
        setLoginSuccessful(true);
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
      setError(error);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (loginSuccessful) {
      setTimeout(() => navigate("/finds-stores"), 5000);
    }
  }, [loginSuccessful]);

  return (
    <main>
      {loginSuccessful && (
        <div aria-live="polite">
          <p>
            Login successful, you will be redirected to the page to find stores
            near you
          </p>
        </div>
      )}
      <TopBar />
      {!loginSuccessful && (
        <form onSubmit={(event) => handleSubmit(event, "login")}>
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

          {loginError && (
            <div aria-live="polite">
              <p>Incorrect email or password</p>
            </div>
          )}

          {showLoader && (
            <div
              aria-live="assertive"
              aria-label="Logging in, please wait..."
            ></div>
          )}
          {!showLoader && <button type="submit">Login</button>}
          {!showLoader && (
            <button onClick={(event) => handleSubmit(event, "demo-account")}>
              Try a demo account
            </button>
          )}
        </form>
      )}
      <Footer />
    </main>
  );
}
