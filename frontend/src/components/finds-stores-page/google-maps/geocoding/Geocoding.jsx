import { useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./place-autocomplete/PlaceAutocomplete";

function GeocodingInput({
  userId,
  addingLocationFromMap,
  setAddingLocationFromMap,
  newLocation,
  setNewLocation,
  selectedPlace,
  setSelectedPlace,
  setSelectDefaultValue,
  parentComponent,
  setShowSaveLocation,
  setShowUserMarker,
  locationsSelectIsNone,
  setLocationsSelectIsNone,
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
      addingLocationFromMap={addingLocationFromMap}
      setAddingLocationFromMap={setAddingLocationFromMap}
      geocodingService={geocodingService}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      newLocation={newLocation}
      setNewLocation={setNewLocation}
      parentComponent={parentComponent}
      setShowSaveLocation={setShowSaveLocation}
      setShowUserMarker={setShowUserMarker}
      locationsSelectIsNone={locationsSelectIsNone}
    />
  );
}

export default function Geocoding({
  userId,
  addingLocationFromMap,
  setAddingLocationFromMap,
  newLocation,
  setNewLocation,
  parentComponent,
  setSelectDefaultValue,
  setShowSaveLocation,
  setShowUserMarker,
  selectedPlace,
  setSelectedPlace,
  locationsSelectIsNone,
  setLocationsSelectIsNone,
}) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GeocodingInput
        userId={userId}
        addingLocationFromMap={addingLocationFromMap}
        setAddingLocationFromMap={setAddingLocationFromMap}
        newLocation={newLocation}
        setNewLocation={setNewLocation}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        setSelectDefaultValue={setSelectDefaultValue}
        parentComponent={parentComponent}
        setShowSaveLocation={setShowSaveLocation}
        setShowUserMarker={setShowUserMarker}
        locationsSelectIsNone={locationsSelectIsNone}
        setLocationsSelectIsNone={setLocationsSelectIsNone}
      />
    </APIProvider>
  );
}
