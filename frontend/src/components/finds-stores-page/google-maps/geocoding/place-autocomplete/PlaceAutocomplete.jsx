import { useEffect, useState, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function PlaceAutocomplete({
  addingLocationFromMap,
  previousUserLocation,
  geocodingService,
  setSelectedPlace,
  newLocation,
  setNewLocation,
  parentComponent,
}) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [locationChanged, setLocationChanged] = useState(false);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (parentComponent === "add-store") {
      setLocationChanged(!locationChanged);
    }
  }, [newLocation]);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener("place_changed", () => {
      setSelectedPlace(placeAutocomplete.getPlace());
    });
  }, [setSelectedPlace, placeAutocomplete]);

  useEffect(() => {
    if (!addingLocationFromMap || !geocodingService || !newLocation) return;

    const newLocationLatLng = {
      lat: newLocation.latitude,
      lng: newLocation.longitude,
    };

    geocodingService.geocode(
      { location: newLocationLatLng },
      (results, status) => {
        if (results && status === "OK") {
          inputRef.current.value = results[0].formatted_address;
        }
      }
    );
  }, [locationChanged]);

  const deleteLocation = () => {
    if (inputRef.current.value !== "") {
      if (previousUserLocation) {
        setNewLocation({
          latitude: previousUserLocation.latitude,
          longitude: previousUserLocation.longitude,
        });
      }
      if (parentComponent === "add-store") {
        setNewLocation(null);
      }
      setSelectedPlace(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="autocomplete-container">
      <label htmlFor="geocoding-location">
        {parentComponent === "add-store" ? "Store Location" : "Your Location"}
      </label>
      <input
        ref={inputRef}
        type="text"
        id="geocoding-location"
        name="geocoding-location"
        minLength={1}
        placeholder={
          parentComponent === "add-store" ? "Enter the store location" : "Enter your location"
        }
        required
      />
      <button type="button" onClick={deleteLocation}>
        Cancel location
      </button>
    </div>
  );
}
