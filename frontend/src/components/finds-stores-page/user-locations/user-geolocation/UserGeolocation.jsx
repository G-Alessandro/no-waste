import { useState } from "react";

export default function UserGeolocation({
  setUserLocation,
  setLocationFromGeolocation,
}) {
  const [geolocationError, setGeolocationError] = useState(false);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLocationFromGeolocation(true);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        options
      );
    } else {
      setGeolocationError(true);
      console.error("Geolocation is not supported by this browser.");
      setTimeout(() => setGeolocationError(false), 5000);
    }
  };

  return (
    <div>
      <button onClick={getUserLocation}>Use Geolocation</button>
      {geolocationError && (
        <p aria-live="polite">Geolocation is not supported by this browser</p>
      )}
    </div>
  );
}
