import { useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./place-autocomplete/PlaceAutocomplete";

function GeocodingInput({
  userId,
  setError,
  addingLocationFromMap,
  setAddingLocationFromMap,
  newLocation,
  setNewLocation,
  selectedPlace,
  setSelectedPlace,
  setSelectDefaultValue,
  parentComponent,
  showSaveLocation,
  setShowSaveLocation,
  setShowUserMarker,
  locationsSelectIsNone,
  setLocationsSelectIsNone,
  setUserLocation,
  setLocationFromGeolocation,
  newStoreLocation,
}) {
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] = useState(null);

  useEffect(() => {
    if (!geocodingApiLoaded) return;
    setGeocodingService(new window.google.maps.Geocoder());
  }, [geocodingApiLoaded]);

  useEffect(() => {
    if (!geocodingService || !selectedPlace) return;
    const formattedAddress = selectedPlace.formatted_address;

    geocodingService.geocode(
      { address: formattedAddress },
      (results, status) => {
        if (results && status === "OK") {
          if (parentComponent === "user-locations") {
            setSelectDefaultValue("none");
            setLocationsSelectIsNone(true);
          }
          setNewLocation({
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng(),
          });
        }
      }
    );
  }, [geocodingService, selectedPlace]);

  return (
    <PlaceAutocomplete
      userId={userId}
      setError={setError}
      addingLocationFromMap={addingLocationFromMap}
      setAddingLocationFromMap={setAddingLocationFromMap}
      geocodingService={geocodingService}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      newLocation={newLocation}
      setNewLocation={setNewLocation}
      parentComponent={parentComponent}
      showSaveLocation={showSaveLocation}
      setShowSaveLocation={setShowSaveLocation}
      setShowUserMarker={setShowUserMarker}
      locationsSelectIsNone={locationsSelectIsNone}
      setUserLocation={setUserLocation}
      setLocationFromGeolocation={setLocationFromGeolocation}
      newStoreLocation={newStoreLocation}
    />
  );
}

export default function Geocoding({
  userId,
  setError,
  addingLocationFromMap,
  setAddingLocationFromMap,
  newLocation,
  setNewLocation,
  parentComponent,
  setSelectDefaultValue,
  showSaveLocation,
  setShowSaveLocation,
  setShowUserMarker,
  selectedPlace,
  setSelectedPlace,
  locationsSelectIsNone,
  setLocationsSelectIsNone,
  setUserLocation,
  setLocationFromGeolocation,
  newStoreLocation,
}) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GeocodingInput
        userId={userId}
        setError={setError}
        addingLocationFromMap={addingLocationFromMap}
        setAddingLocationFromMap={setAddingLocationFromMap}
        newLocation={newLocation}
        setNewLocation={setNewLocation}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        setSelectDefaultValue={setSelectDefaultValue}
        parentComponent={parentComponent}
        showSaveLocation={showSaveLocation}
        setShowSaveLocation={setShowSaveLocation}
        setShowUserMarker={setShowUserMarker}
        locationsSelectIsNone={locationsSelectIsNone}
        setLocationsSelectIsNone={setLocationsSelectIsNone}
        setUserLocation={setUserLocation}
        setLocationFromGeolocation={setLocationFromGeolocation}
        newStoreLocation={newStoreLocation}
      />
    </APIProvider>
  );
}
