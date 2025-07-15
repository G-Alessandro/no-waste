import { useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./place-autocomplete/PlaceAutocomplete";

function GeocodingInput({
  addingLocationFromMap,
  previousUserLocation,
  setPreviousUserLocation,
  newLocation,
  setNewLocation,
  selectedPlace,
  setSelectedPlace,
  setSelectDefaultValue,
  parentComponent,
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
            setPreviousUserLocation({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            });
            setSelectDefaultValue("none");
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
      addingLocationFromMap={addingLocationFromMap}
      previousUserLocation={previousUserLocation}
      geocodingService={geocodingService}
      setSelectedPlace={setSelectedPlace}
      newLocation={newLocation}
      setNewLocation={setNewLocation}
      parentComponent={parentComponent}
    />
  );
}

export default function Geocoding({
  addingLocationFromMap,
  previousUserLocation,
  setPreviousUserLocation,
  newLocation,
  setNewLocation,
  parentComponent,
  setSelectDefaultValue,
}) {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GeocodingInput
        addingLocationFromMap={addingLocationFromMap}
        previousUserLocation={previousUserLocation}
        setPreviousUserLocation={setPreviousUserLocation}
        newLocation={newLocation}
        setNewLocation={setNewLocation}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        setSelectDefaultValue={setSelectDefaultValue}
        parentComponent={parentComponent}
      />
    </APIProvider>
  );
}
