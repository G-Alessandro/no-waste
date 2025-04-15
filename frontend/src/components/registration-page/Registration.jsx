import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import Footer from "../footer/Footer";

export default function Registration() {
  const [registrationError, setRegistrationError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
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

      if (!response.ok) {
        setRegistrationError(data.error);
      } else {
        setRegistrationSuccessful(true);
        setTimeout(() => navigate("/login"), 5000);
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
      setRegistrationError(error);
    } finally {
      setShowLoader(false);
    }
  };

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
    <main>
      <TopBar />
      {registrationSuccessful && (
        <div aria-live="polite">
          <p>
            Registration successful, you will be redirected to the login page
          </p>
        </div>
      )}
      {registrationError && (
        <div aria-live="polite">
          <p>{registrationError}</p>
        </div>
      )}
      {!registrationSuccessful && (
        <form onSubmit={handleSubmit}>
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

          <label htmlFor="confirm-email">Confirm Email</label>
          <input
            type="email"
            id="confirm-email"
            name="confirm-email"
            minLength={1}
            placeholder="Confirm your email"
            onChange={(e) => handleChange(e, "confirm-email")}
            required
          />

          {confirmEmailError && (
            <div aria-live="polite">
              <p>Emails must be the same</p>
            </div>
          )}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={8}
            placeholder="Enter your password"
            onChange={(e) => handleChange(e, "password")}
            required
          />
          {passwordMinLengthMessage && (
            <div aria-live="polite">
              <p>Must contain at least 8 characters</p>
            </div>
          )}

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            minLength={8}
            placeholder="Confirm your password"
            onChange={(e) => handleChange(e, "confirm-password")}
            required
          />

          {confirmPasswordError && (
            <div aria-live="polite">
              <p>Passwords must be the same</p>
            </div>
          )}

          {showLoader && (
            <div
              aria-live="assertive"
              aria-label="Registration in progress, please wait..."
            ></div>
          )}
          {!showLoader && <button type="submit">Sign Up</button>}
        </form>
      )}
      <Footer />
    </main>
  );
}
