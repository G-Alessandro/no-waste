import { useState } from "react";
import Geocoding from "../google-maps/geocoding/Geocoding";

export default function AddStore({
  newStoreLocation,
  setNewStoreLocation,
  statusChanged,
  setStatusChanged,
  setMessage,
  setError,
  addingLocationFromMap,
  setAddingLocationFromMap,
}) {
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const formData = {
      storeName: event.target["store-name"].value,
      latitude: newStoreLocation.latitude,
      longitude: newStoreLocation.longitude,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stores/new-store`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const newToken = response.headers.get("Authorization");
      const data = await response.json();

      if (response.ok) {
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }
        setMessage(data.message);
        setTimeout(() => setMessage(null), 2000);
        setNewStoreLocation(null);
        setStatusChanged(!statusChanged);
      }
    } catch (error) {
      setError(error);
      setTimeout(() => setError(null), 3000);
    } finally {
      setShowLoader(false);
      event.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="store-name">Store Name</label>
      <input
        type="text"
        id="store-name"
        name="store-name"
        minLength={1}
        maxLength={30}
        placeholder="Enter the store name"
        required
      />

      <Geocoding
        addingLocationFromMap={addingLocationFromMap}
        newLocation={newStoreLocation}
        setNewLocation={setNewStoreLocation}
        parentComponent={"add-store"}
      />

      {!addingLocationFromMap && (
        <button onClick={() => setAddingLocationFromMap(true)}>
          Click directly on the map
        </button>
      )}

      {addingLocationFromMap && (
        <button onClick={() => setAddingLocationFromMap(false)}>
          Write the address
        </button>
      )}

      {!showLoader && (
        <button type="submit" disabled={!newStoreLocation}>
          ADD STORE
        </button>
      )}
      {showLoader && <div></div>}
      {!newStoreLocation && <p>You need to select a location</p>}
    </form>
  );
}
