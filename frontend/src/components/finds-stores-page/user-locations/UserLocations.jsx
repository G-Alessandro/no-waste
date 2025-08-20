import { useState, useRef } from "react";
import Geocoding from "../google-maps/geocoding/Geocoding.jsx";
import UserLocationsSelect from "./user-locations-select/UserLocationsSelect.jsx";
import SaveUserLocation from "./save-user-location/SaveUserLocation.jsx";
import UserLocationsList from "./user-locations-list/UserLocationsList.jsx";
import UserTravelModes from "./user-travel-modes/UserTravelModes.jsx";
import style from "./UserLocations.module.css";

export default function UserLocations({
  userId,
  setMessage,
  setError,
  userLocation,
  setUserLocation,
  setShowUserMarker,
  travelMode,
  setTravelMode,
}) {
  const [userLocationStatusChanged, setUserLocationStatusChanged] =
    useState(false);
  const [selectDefaultValue, setSelectDefaultValue] = useState(
    `${parseFloat(import.meta.env.VITE_DEFAULT_LATITUDE)},${parseFloat(
      import.meta.env.VITE_DEFAULT_LONGITUDE
    )}`
  );
  const [userLocationsList, setUserLocationsList] = useState([]);
  const [showSaveLocation, setShowSaveLocation] = useState(false);
  const [showUserLocationsList, setShowUserLocationsList] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [locationsSelectIsNone, setLocationsSelectIsNone] = useState(false);
  const [locationFromGeolocation, setLocationFromGeolocation] = useState(false);
  const showLocationsListBtn = useRef(null);

  return (
    <section className={style.userLocationsSection}>
      <Geocoding
        userId={userId}
        setError={setError}
        addingLocationFromMap={locationFromGeolocation}
        setAddingLocationFromMap={setLocationFromGeolocation}
        newLocation={userLocation}
        setNewLocation={setUserLocation}
        setSelectDefaultValue={setSelectDefaultValue}
        parentComponent={"user-locations"}
        showSaveLocation={showSaveLocation}
        setShowSaveLocation={setShowSaveLocation}
        setShowUserMarker={setShowUserMarker}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        locationsSelectIsNone={locationsSelectIsNone}
        setLocationsSelectIsNone={setLocationsSelectIsNone}
        setUserLocation={setUserLocation}
        setLocationFromGeolocation={setLocationFromGeolocation}
      />
      {userId && showSaveLocation && (
        <SaveUserLocation
          userId={userId}
          setError={setError}
          setMessage={setMessage}
          userLocation={userLocation}
          userLocationStatusChanged={userLocationStatusChanged}
          setUserLocationStatusChanged={setUserLocationStatusChanged}
          setShowSaveLocation={setShowSaveLocation}
          setSelectDefaultValue={setSelectDefaultValue}
          setSelectedPlace={setSelectedPlace}
        />
      )}
      <div className={style.userLocationsContainer}>
        <UserLocationsSelect
          userId={userId}
          setError={setError}
          setUserLocationsList={setUserLocationsList}
          userLocationStatusChanged={userLocationStatusChanged}
          selectDefaultValue={selectDefaultValue}
          setSelectDefaultValue={setSelectDefaultValue}
          setUserLocation={setUserLocation}
          userLocationsList={userLocationsList}
          showUserLocationsList={showUserLocationsList}
          setShowUserLocationsList={setShowUserLocationsList}
          setShowUserMarker={setShowUserMarker}
          setLocationsSelectIsNone={setLocationsSelectIsNone}
          showLocationsListBtn={showLocationsListBtn}
        />

        {showUserLocationsList && (
          <UserLocationsList
            setMessage={setMessage}
            setError={setError}
            userLocationsList={userLocationsList}
            setShowUserLocationsList={setShowUserLocationsList}
            userLocationStatusChanged={userLocationStatusChanged}
            setUserLocationStatusChanged={setUserLocationStatusChanged}
            setShowUserMarker={setShowUserMarker}
            setSelectDefaultValue={setSelectDefaultValue}
            showLocationsListBtn={showLocationsListBtn}
          />
        )}
      </div>
      <UserTravelModes travelMode={travelMode} setTravelMode={setTravelMode} />
    </section>
  );
}
