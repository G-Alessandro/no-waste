import { useState, useContext } from "react";
import { AuthContext } from "../../../main";

export default function AddStore({
  newStoreLatitude,
  newStoreLongitude,
  statusChanged,
  setStatusChanged,
  setMessage,
  setError,
}) {
  const { token } = useContext(AuthContext);
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
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
