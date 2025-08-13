import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import Footer from "../footer/Footer";
import style from "./Registration.module.css";

export default function Registration() {
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMinLengthMessage, setPasswordMinLengthMessage] =
    useState(false);
  const [confirmEmailError, setConfirmEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const formData = {
      firstName: event.target["first-name"].value,
      lastName: event.target["last-name"].value,
      email: event.target.email.value,
      confirmEmail: event.target["confirm-email"].value,
      password: event.target.password.value,
      confirmPassword: event.target["confirm-password"].value,
    };

    const checkEmail = formData.email === formData.confirmEmail;
    const checkPassword = formData.password === formData.confirmPassword;

    if (!checkEmail || !checkPassword) {
      if (!checkEmail) {
        setConfirmEmailError(true);
      }
      if (!checkPassword) {
        setConfirmPasswordError(true);
      }
      setShowLoader(false);
      return;
    }

    setConfirmEmailError(false);
    setConfirmPasswordError(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (data.error) {
        setFetchError(true);
      } else {
        setRegistrationSuccessful(true);
        setTimeout(() => navigate("/login"), 5000);
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
    if (fetchError) {
      timerId = setTimeout(() => setFetchError(false), 3000);
    } else if (registrationSuccessful) {
      timerId = setTimeout(() => setRegistrationSuccessful(false), 3000);
    }
    return () => clearTimeout(timerId);
  }, [fetchError, registrationSuccessful]);

  const handleChange = (e, field) => {
    const value = e.target.value;

    if (field === "email") {
      setEmail(value);
    } else if (field === "confirm-email") {
      setConfirmEmailError(value !== email);
    } else if (field === "password") {
      setPassword(value);
      setPasswordMinLengthMessage(value.length < 8);
    } else if (field === "confirm-password") {
      setConfirmPasswordError(value !== password);
    }
  };

  return (
    <>
      <main className={style.registrationMain}>
        <TopBar topBarLocation={"registration"} />
        {fetchError && (
          <p aria-live="polite" className={style.fetchError}>
            An error occurred during registration
          </p>
        )}
        {registrationSuccessful && (
          <p aria-live="polite" className={style.registrationSuccessful}>
            Registration successful, you will be redirected to the login page
          </p>
        )}
        {!registrationSuccessful && (
          <form onSubmit={handleSubmit} className={style.registrationForm}>
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              minLength={1}
              maxLength={30}
              placeholder="Enter your first name"
              required
            />

            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              minLength={1}
              maxLength={30}
              placeholder="Enter your last name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              minLength={1}
              placeholder="Enter your email"
              onChange={(e) => handleChange(e, "email")}
              required
            />

            <div className={style.labelContainer}>
              <label htmlFor="confirm-email">Confirm Email</label>
              {confirmEmailError && (
                <p
                  aria-live="polite"
                  id="confirm-email-error"
                  className={style.inputRequirements}
                >
                  Emails must be the same*
                </p>
              )}
            </div>

            <input
              type="email"
              id="confirm-email"
              name="confirm-email"
              minLength={1}
              placeholder="Confirm your email"
              onChange={(e) => handleChange(e, "confirm-email")}
              aria-describedby={
                confirmEmailError ? "confirm-email-error" : undefined
              }
              required
            />

            <div className={style.labelContainer}>
              <label htmlFor="password">Password</label>
              {passwordMinLengthMessage && (
                <p
                  aria-live="polite"
                  id="password-length-error"
                  className={style.inputRequirements}
                >
                  Must contain at least 8 characters*
                </p>
              )}
            </div>

            <input
              type="password"
              id="password"
              name="password"
              minLength={8}
              placeholder="Enter your password"
              onChange={(e) => handleChange(e, "password")}
              aria-describedby={
                passwordMinLengthMessage ? "password-length-error" : undefined
              }
              required
            />

            <div className={style.labelContainer}>
              <label htmlFor="confirm-password">Confirm Password</label>
              {confirmPasswordError && (
                <p
                  aria-live="polite"
                  id="passwords-do-not-match-error"
                  className={style.inputRequirements}
                >
                  Passwords must be the same*
                </p>
              )}
            </div>

            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              minLength={8}
              placeholder="Confirm your password"
              onChange={(e) => handleChange(e, "confirm-password")}
              aria-describedby={
                confirmPasswordError
                  ? "passwords-do-not-match-error"
                  : undefined
              }
              required
            />

            {showLoader && (
              <div
                aria-live="assertive"
                aria-label="Registration in progress, please wait"
                className={style.loader}
              ></div>
            )}
            {!showLoader && (
              <button type="submit" className={style.registrationBtn}>
                Sign Up
              </button>
            )}
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
