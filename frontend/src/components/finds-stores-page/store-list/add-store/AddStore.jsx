import { useState } from "react";
import Geocoding from "../../google-maps/geocoding/Geocoding";
import style from "./AddStore.module.css";

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
  const [storeNameInput, setStoreNameInput] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

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
        setStoreNameInput("");
        setNewStoreLocation(null);
        setSelectedPlace(null);
        setAddingLocationFromMap(false);
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
    <>
      <form onSubmit={handleSubmit} className={style.addStoreFrom}>
        <div>
          <div>
            <label htmlFor="store-name">Store Name</label>
            {(storeNameInput.length === 0 || storeNameInput.length > 30) && (
              <p>required characters 1 max 30 *</p>
            )}
          </div>
          <input
            type="text"
            id="store-name"
            name="store-name"
            minLength={1}
            maxLength={30}
            placeholder="Enter the store name"
            onChange={(e) => setStoreNameInput(e.target.value)}
            required
          />

          <Geocoding
            addingLocationFromMap={addingLocationFromMap}
            setAddingLocationFromMap={setAddingLocationFromMap}
            newLocation={newStoreLocation}
            setNewLocation={setNewStoreLocation}
            parentComponent={"add-store"}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            newStoreLocation={newStoreLocation}
            statusChanged={statusChanged}
          />
          {!showLoader && (
            <button
              type="submit"
              disabled={
                !newStoreLocation ||
                !selectedPlace ||
                storeNameInput.length === 0
              }
            >
              ADD STORE
            </button>
          )}
          {showLoader && (
            <div className={style.loader} role="status">
              <span className="sr-only">Adding new store, please wait</span>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
