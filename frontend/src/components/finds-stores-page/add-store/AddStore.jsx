import { useContext } from "react";
import { AuthContext } from "../../../main";

export default function AddStore({
  userId,
  newStoreLatitude,
  newStoreLongitude,
  setMessage,
  setError,
}) {
  const { token } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      storeName: event.target["store-name"].value,
      latitude: newStoreLatitude,
      longitude: newStoreLongitude,
      userId: userId,
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
      }
    } catch (error) {
      setError(error);
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
      <button type="submit">ADD STORE</button>
    </form>
  );
}
