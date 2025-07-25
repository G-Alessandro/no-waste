import { useEffect, useState, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function PlaceAutocomplete({
  userId,
  addingLocationFromMap,
  setAddingLocationFromMap,
  geocodingService,
  selectedPlace,
  setSelectedPlace,
  newLocation,
  setNewLocation,
  parentComponent,
  setShowSaveLocation,
  setShowUserMarker,
  locationsSelectIsNone,
}) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [locationChanged, setLocationChanged] = useState(false);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    setLocationChanged(!locationChanged);
  }, [newLocation]);

  useEffect(() => {
    if (!selectedPlace) {
      inputRef.current.value = "";
    }
  }, [selectedPlace]);

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
          inputRef.current.focus();
        }
      }
    );
    setAddingLocationFromMap(false);
  }, [locationChanged]);

  const deleteLocation = () => {
    if (inputRef.current.value !== "") {
      if (locationsSelectIsNone === true) {
        setShowUserMarker(false);
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
          parentComponent === "add-store"
            ? "Enter the store location"
            : "Enter your location"
        }
        required
      />
      <button type="button" onClick={deleteLocation} disabled={!selectedPlace}>
        Cancel location
      </button>
      {userId && (
        <button
          onClick={() => setShowSaveLocation(true)}
          disabled={!selectedPlace}
        >
          Save location
        </button>
      )}
    </div>
  );
}
