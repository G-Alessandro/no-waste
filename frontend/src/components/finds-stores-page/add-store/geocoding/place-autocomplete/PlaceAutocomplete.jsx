import { useEffect, useState, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function PlaceAutocomplete({
  addingLocationFromMap,
  geocodingService,
  setSelectedPlace,
  newStoreLocation,
  setNewStoreLocation,
}) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

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
    if (!addingLocationFromMap || !geocodingService || !newStoreLocation)
      return;

    const newStoreLatLng = {
      lat: newStoreLocation.location.lat,
      lng: newStoreLocation.location.lng,
    };

    geocodingService.geocode(
      { location: newStoreLatLng },
      (results, status) => {
        if (results && status === "OK") {
          inputRef.current.value = results[0].formatted_address;
        }
      }
    );
  }, [newStoreLocation]);

  const deleteLocation = () => {
    setNewStoreLocation(null);
    setSelectedPlace(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="autocomplete-container">
      <label htmlFor="geocoding-location">Store location</label>
      <input
        ref={inputRef}
        type="text"
        id="geocoding-location"
        name="geocoding-location"
        minLength={1}
        placeholder="Enter the store location"
        required
      />
      <button type="button" onClick={deleteLocation}>
        Cancel location
      </button>
    </div>
  );
}
