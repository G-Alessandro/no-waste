import { useState, useEffect } from "react";

export default function UserLocationsList({
  setMessage,
  setError,
  userLocationsList,
  setShowUserLocationsList,
  userLocationStatusChanged,
  setUserLocationStatusChanged,
  setShowUserMarker,
  setSelectDefaultValue,
}) {
  const [showDeleteLoader, setShowDeleteLoader] = useState([]);

  useEffect(() => {
    if (userLocationsList && userLocationsList.length > 0) {
      setShowDeleteLoader(Array(userLocationsList.length).fill(false));
    }
  }, [userLocationsList]);

  const handleShowLoader = (index) => {
    setShowDeleteLoader((prevLoader) =>
      prevLoader.map((loader, i) => (i === index ? !loader : loader))
    );
  };

  const handleDeleteUserLocation = async (locationId, index) => {
    handleShowLoader(index);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/delete-user-location`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({ locationId }),
        }
      );

      const data = await response.json();

      if (!data) {
        setError("Location not found!");
      } else {
        setMessage(data.message);
        setShowUserMarker(false);
        setSelectDefaultValue("none");
      }
    } catch (error) {
      setError(error);
      console.log("Error while deleting the location:", error);
    } finally {
      handleShowLoader(index);
      setUserLocationStatusChanged(!userLocationStatusChanged);
    }
  };

  return (
    <div>
      <button onClick={() => setShowUserLocationsList(false)}>X</button>
      {userLocationsList && (
        <ul>
          {userLocationsList.map((location, index) => {
            return (
              <li key={location.id}>
                {location.name}
                {!showDeleteLoader[index] && (
                  <button
                    onClick={() => handleDeleteUserLocation(location.id, index)}
                    aria-label={`Delete location ${location.name}`}
                  >
                    Delete
                  </button>
                )}
                {showDeleteLoader[index] && <div></div>}
              </li>
            );
          })}
        </ul>
      )}
      {!userLocationsList && <p>No personal location saved</p>}
    </div>
  );
}
