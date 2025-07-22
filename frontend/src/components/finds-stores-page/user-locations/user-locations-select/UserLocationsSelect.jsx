import { useEffect } from "react";

export default function UserLocationsSelect({
  userId,
  setError,
  setUserLocationsList,
  userLocationStatusChanged,
  selectDefaultValue,
  setSelectDefaultValue,
  setUserLocation,
  userLocationsList,
  showUserLocationsList,
  setShowUserLocationsList,
  setShowUserMarker,
  setLocationsSelectIsNone,
}) {
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/user-locations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
          }
        );

        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setUserLocationsList(data.userLocations);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [userLocationStatusChanged, userId]);

  const handleLocationChange = (event) => {
    const value = event.target.value;
    setSelectDefaultValue(event.target.value);
    if (value === "none") {
      setShowUserMarker(false);
      setLocationsSelectIsNone(true);
    } else {
      setLocationsSelectIsNone(false);
      const [latitude, longitude] = value.split(",");
      setUserLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }
  };

  return (
    <>
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
        {userLocationsList &&
          userLocationsList.map((location) => {
            return (
              <option
                key={location.id}
                value={`${location.latitude},${location.longitude}`}
              >
                {location.name}
              </option>
            );
          })}
      </select>
      {userId && (
        <button
          onClick={() => setShowUserLocationsList(!showUserLocationsList)}
        >
          Location List
        </button>
      )}
    </>
  );
}
