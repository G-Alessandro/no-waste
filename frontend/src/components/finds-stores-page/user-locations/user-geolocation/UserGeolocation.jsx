import style from "./UserGeolocation.module.css";

export default function UserGeolocation({
  setUserLocation,
  setLocationFromGeolocation,
  setError,
}) {
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
      setError("Geolocation is not supported by this browser");
      console.error("Geolocation is not supported by this browser.");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <button
      aria-label="click to find your location using geolocation"
      onClick={getUserLocation}
      className={style.userGeolocationBtn}
    >
      Geolocation
    </button>
  );
}
