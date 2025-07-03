import { useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./place-autocomplete/PlaceAutocomplete";

function Geocoding({
  addingLocationFromMap,
  selectedPlace,
  setSelectedPlace,
  newStoreLocation,
  setNewStoreLocation,
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
          setNewStoreLocation({
            location: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            },
          });
        }
      }
    );
  }, [geocodingService, selectedPlace]);

  return (
    <PlaceAutocomplete
      addingLocationFromMap={addingLocationFromMap}
      geocodingService={geocodingService}
      newStoreLocation={newStoreLocation}
      setSelectedPlace={setSelectedPlace}
      setNewStoreLocation={setNewStoreLocation}
    />
  );
}

export default function GeocodingInput({
  addingLocationFromMap,
  newStoreLocation,
  setNewStoreLocation,
}) {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Geocoding
        addingLocationFromMap={addingLocationFromMap}
        newStoreLocation={newStoreLocation}
        setNewStoreLocation={setNewStoreLocation}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
      />
    </APIProvider>
  );
}
