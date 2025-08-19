import { useState, useEffect, useRef } from "react";
import DeleteStoreSvg from "/assets/images/svg/store-list/delete-store.svg";
import style from "./UserLocationsList.module.css";

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
  const listRef = useRef(null);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setShowUserLocationsList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      const newToken = response.headers.get("Authorization");
      const data = await response.json();

      if (!data) {
        setError("Location not found!");
      } else {
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }
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
    <div className={style.userLocationsListContainer} ref={listRef}>
      {userLocationsList && (
        <ul>
          {userLocationsList.map((location, index) => {
            return (
              <li key={location.id}>
                <p>{location.name}</p>
                {!showDeleteLoader[index] && (
                  <button
                    onClick={() => handleDeleteUserLocation(location.id, index)}
                    aria-label={`Delete location ${location.name}`}
                    className={style.deleteLocationBtn}
                  >
                    <img src={DeleteStoreSvg} />
                  </button>
                )}
                {showDeleteLoader[index] && (
                  <div className={style.loader}></div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {!userLocationsList && (
        <p className={style.noLocationSaved}>No location saved</p>
      )}
    </div>
  );
}
