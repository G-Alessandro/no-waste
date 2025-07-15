import { useState, useEffect } from "react";
import UserGeolocation from "./user-geolocation/UserGeolocation.jsx";
import Geocoding from "../google-maps/geocoding/Geocoding.jsx";
import SaveUserLocation from "./save-user-location/SaveUserLocation.jsx";

export default function UserLocations({
  userId,
  setMessage,
  setError,
  userLocation,
  setUserLocation,
}) {
  const [userLocationStatusChanged, setUserLocationStatusChanged] =
    useState(false);
  const [selectDefaultValue, setSelectDefaultValue] = useState(
    `${parseFloat(import.meta.env.VITE_DEFAULT_LATITUDE)},${parseFloat(
      import.meta.env.VITE_DEFAULT_LONGITUDE
    )}`
  );
  const [previousUserLocation, setPreviousUserLocation] = useState(null);
  const [userLocationsArray, setUserLocationsArray] = useState(null);
  const [showSaveLocation, setShowSaveLocation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user-location/${userId}`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          }
        );

        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setUserLocationsArray(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [userLocationStatusChanged]);

  const handleLocationChange = (event) => {
    const value = event.target.value;
    setSelectDefaultValue(event.target.value);
    if (value === "none") {
      setUserLocation({
        latitude: previousUserLocation.latitude,
        longitude: previousUserLocation.longitude,
      });
    } else {
      const [latitude, longitude] = value.split(",");
      setPreviousUserLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
      setUserLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }
  };

  return (
    <section>
      {!showSaveLocation && (
        <div>
          <UserGeolocation setUserLocation={setUserLocation} />
          <Geocoding
            addingLocationFromMap={true}
            previousUserLocation={previousUserLocation}
            setPreviousUserLocation={setPreviousUserLocation}
            newLocation={userLocation}
            setNewLocation={setUserLocation}
            setSelectDefaultValue={setSelectDefaultValue}
            parentComponent={"user-locations"}
          />
          <button onClick={() => setShowSaveLocation(true)}>
            Save location
          </button>
        </div>
      )}

      {showSaveLocation && (
        <div>
          <SaveUserLocation
            userId={userId}
            setError={setError}
            setMessage={setMessage}
            userLocationStatusChanged={userLocationStatusChanged}
            setUserLocationStatusChanged={setUserLocationStatusChanged}
            setShowSaveLocation={setShowSaveLocation}
          />
        </div>
      )}

      <label htmlFor="user-locations">Your Locations</label>
      <select
        id="user-locations"
        name="user-locations"
        value={selectDefaultValue}
        onChange={handleLocationChange}
      >
        <option value="none">None</option>
        <option
          value={`${parseFloat(
            import.meta.env.VITE_DEFAULT_LATITUDE
          )},${parseFloat(import.meta.env.VITE_DEFAULT_LONGITUDE)}`}
        >
          Default
        </option>
        {userLocationsArray &&
          userLocationsArray.map((location) => {
            <option
              key={location.id}
              value={`${location.latitude},${location.longitude}`}
            >
              {location.name}
            </option>;
          })}
      </select>
    </section>
  );
}
