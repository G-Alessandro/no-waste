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
  showSaveLocation,
  setShowSaveLocation,
  setShowUserMarker,
  locationsSelectIsNone,
  setUserLocation,
  setLocationFromGeolocation,
  statusChanged,
}) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [locationChanged, setLocationChanged] = useState(false);
  const [autocompleteInput, setAutocompleteInput] = useState(null);
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
      setAutocompleteInput(placeAutocomplete.getPlace().formatted_address);
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

  const handleDeleteLocation = () => {
    if (inputRef.current.value !== "") {
      if (locationsSelectIsNone === true) {
        setShowUserMarker(false);
      }
      if (parentComponent === "add-store") {
        setNewLocation(null);
      }
      setSelectedPlace(null);
      setAutocompleteInput(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (!autocompleteInput && selectedPlace) {
      if (locationsSelectIsNone === true) {
        setShowUserMarker(false);
      }
      if (parentComponent === "add-store") {
        setNewLocation(null);
      }
      setSelectedPlace(null);
    }
  }, [autocompleteInput]);

  useEffect(() => {
    if (autocompleteInput) {
      setAutocompleteInput(null);
    }
  }, [statusChanged]);

  return (
    <div
      className={` ${
        showSaveLocation
          ? style.hideAutocompleteContainer
          : style.autocompleteContainer
      }`}
    >
      <div className={style.labelContainer}>
        <label
          htmlFor="geocoding-location"
          className={parentComponent === "add-store" ? style.addStore : ""}
        >
          {parentComponent === "add-store"
            ? "Store Location"
            : "Find Your Location"}
        </label>

        {parentComponent === "add-store" && !autocompleteInput && (
          <p>Select a valid location *</p>
        )}
      </div>

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
        className={
          parentComponent !== "add-store"
            ? style.autocompleteInput
            : style.autocompleteInputStore
        }
        required
      />

      <div className={style.autocompleteBtnContainer}>
        <button
          type="button"
          onClick={handleDeleteLocation}
          disabled={!selectedPlace}
          aria-label="click to delete the selected location"
          className={style.autocompleteCancelBtn}
        >
          Cancel
        </button>

        {parentComponent === "add-store" && (
          <button
            type="button"
            onClick={() => setAddingLocationFromMap(!addingLocationFromMap)}
            className={`${style.addLocationFromMapBtn} ${
              addingLocationFromMap ? style.write : ""
            }`}
          >
            {addingLocationFromMap
              ? "Write the address"
              : "Click directly on the map"}
          </button>
        )}

        {userId && (
          <button
            onClick={() => setShowSaveLocation(true)}
            aria-label="click to open the location saving screen"
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
