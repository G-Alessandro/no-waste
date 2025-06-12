import { useState } from "react";

export default function AddStore({
  newStoreLatitude,
  newStoreLongitude,
  statusChanged,
  setStatusChanged,
  setMessage,
  setError,
}) {
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const formData = {
      storeName: event.target["store-name"].value,
      latitude: newStoreLatitude,
      longitude: newStoreLongitude,
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
      {!showLoader && (
        <button
          type="submit"
          disabled={!newStoreLatitude || !newStoreLongitude}
        >
          ADD STORE
        </button>
      )}
      {showLoader && <div></div>}
      {!newStoreLatitude && !newStoreLongitude && (
        <p>You need to select a location on google-maps</p>
      )}
    </form>
  );
}
