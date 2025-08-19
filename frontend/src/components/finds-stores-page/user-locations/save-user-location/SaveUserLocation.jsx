import { useState } from "react";
import style from "./SaveUserLocation.module.css";

export default function SaveUserLocation({
  userId,
  setError,
  setMessage,
  userLocation,
  userLocationStatusChanged,
  setUserLocationStatusChanged,
  setShowSaveLocation,
  setSelectDefaultValue,
  setSelectedPlace,
}) {
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const formData = {
      userId: userId,
      locationName: event.target["location-name"].value,
      locationLatitude: userLocation.latitude,
      locationLongitude: userLocation.longitude,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/new-user-location`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setSelectedPlace(null);
        setShowSaveLocation(false);
        setMessage(data.message);
        setSelectDefaultValue(
          `${parseFloat(userLocation.latitude)},${parseFloat(
            userLocation.longitude
          )}`
        );
        setUserLocationStatusChanged(!userLocationStatusChanged);
      }
    } catch (error) {
      setError(error);
    } finally {
      setShowLoader(false);
      event.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.saveUserLocationForm}>
      <label htmlFor="location-name">Location Name</label>
      <input
        type="text"
        id="location-name"
        name="location-name"
        minLength={1}
        maxLength={30}
        placeholder="Choose the location name"
        required
      />
      {!showLoader && (
        <div>
          <button
            onClick={() => setShowSaveLocation(false)}
            type="button"
            aria-label="click to close the location saving screen"
          >
            Cancel
          </button>
          <button type="submit" aria-label="click to save the location">
            Save
          </button>
        </div>
      )}
      {showLoader && <div></div>}
    </form>
  );
}
