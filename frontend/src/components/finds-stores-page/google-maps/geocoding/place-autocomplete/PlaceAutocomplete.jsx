import { useEffect, useState, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import UserGeolocation from "../../../user-locations/user-geolocation/UserGeolocation";
import style from "./PlaceAutocomplete.module.css";

export default function PlaceAutocomplete({
  userId,
  setError,
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
  setUserLocation,
  setLocationFromGeolocation,
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
    <div className={style.autocompleteContainer}>
      <label htmlFor="geocoding-location">
        {parentComponent === "add-store"
          ? "Store Location"
          : "Find Your Location"}
      </label>
      <input
        ref={inputRef}
        type="text"
        id="geocoding-location"
        name="geocoding-location"
        minLength={1}
        placeholder={
          parentComponent === "add-store"
            ? "Enter the store address"
            : "Enter your address"
        }
        required
      />
      <div className={style.autocompleteBtnContainer}>
        <button
          type="button"
          onClick={deleteLocation}
          disabled={!selectedPlace}
          aria-label="click to cancel your location"
          className={style.autocompleteCancelBtn}
        >
          Cancel
        </button>
        {userId && (
          <button
            onClick={() => setShowSaveLocation(true)}
            aria-label="click to save your location"
            className={style.autocompleteSaveBtn}
            disabled={!selectedPlace}
          >
            Save
          </button>
        )}
        {parentComponent !== "add-store" && (
          <UserGeolocation
            setUserLocation={setUserLocation}
            setLocationFromGeolocation={setLocationFromGeolocation}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
}
