import { useState } from "react";
import UserGeolocation from "./user-geolocation/UserGeolocation.jsx";
import Geocoding from "../google-maps/geocoding/Geocoding.jsx";
import UserLocationsSelect from "./user-locations-select/UserLocationsSelect.jsx";
import SaveUserLocation from "./save-user-location/SaveUserLocation.jsx";
import UserLocationsList from "./user-locations-list/UserLocationsList.jsx";
import UserTravelModes from "./user-travel-modes/UserTravelModes.jsx";

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

  return (
    <section>
      <div>
        <UserGeolocation
          setUserLocation={setUserLocation}
          setLocationFromGeolocation={setLocationFromGeolocation}
        />
        <Geocoding
          userId={userId}
          addingLocationFromMap={locationFromGeolocation}
          setAddingLocationFromMap={setLocationFromGeolocation}
          newLocation={userLocation}
          setNewLocation={setUserLocation}
          setSelectDefaultValue={setSelectDefaultValue}
          parentComponent={"user-locations"}
          setShowSaveLocation={setShowSaveLocation}
          setShowUserMarker={setShowUserMarker}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          locationsSelectIsNone={locationsSelectIsNone}
          setLocationsSelectIsNone={setLocationsSelectIsNone}
        />
      </div>

      {userId && showSaveLocation && (
        <div>
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
        </div>
      )}
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
        />
      )}

      <UserTravelModes travelMode={travelMode} setTravelMode={setTravelMode} />
    </section>
  );
}
