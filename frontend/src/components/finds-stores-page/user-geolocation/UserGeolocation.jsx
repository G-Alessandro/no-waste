import { useState } from "react";

export default function UserGeolocation({ setUserLocation }) {
  const [geolocationError, setGeolocationError] = useState(false);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      setGeolocationError(true);
      console.error("Geolocation is not supported by this browser.");
      setTimeout(() => setGeolocationError(false), 5000);
    }
  };

  return (
    <div>
      <button onClick={getUserLocation}>Find your location</button>
      {geolocationError && (
        <p aria-live="polite">Geolocation is not supported by this browser</p>
      )}
    </div>
  );
}
