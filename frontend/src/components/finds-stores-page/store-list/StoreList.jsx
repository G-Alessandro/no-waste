import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../main";
import FoodTypeCounter from "./food-type-counter/FoodTypeCounter";

export default function StoreList({
  userId,
  storesList,
  setStoresList,
  selectedStoreId,
  setSelectedStoreId,
  statusChanged,
  setStatusChanged,
}) {
  const [showDeleteLoader, setShowDeleteLoader] = useState([]);
  const [message, setMessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchStoreItemList = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/stores/stores-list`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          }
        );

        const data = await response.json();
        if (!data) {
          setErrorMessage("No data found");
          setTimeout(() => setErrorMessage(null), 5000);
        } else {
          setStoresList(data.storesList);
        }
      } catch (error) {
        setErrorMessage(error);
        setTimeout(() => setErrorMessage(null), 5000);
        console.log("Error while searching for items:", error);
      }
    };
    fetchStoreItemList();
  }, [statusChanged]);

  useEffect(() => {
    if (storesList && storesList.length > 0) {
      setShowDeleteLoader(Array(storesList.length).fill(false));
    }
  }, [storesList]);

  const handleShowLoader = (index) => {
    setShowDeleteLoader((prevLoader) =>
      prevLoader.map((loader, i) => (i === index ? !loader : loader))
    );
  };

  const handleDeleteStore = async (storeId, index) => {
    handleShowLoader(index);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stores/delete-store`,
        {
          method: "DELETE",
          credentials: "include",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storeId }),
        }
      );
      const data = await response.json();
      if (!data) {
        setErrorMessage("Store not found!");
      } else {
        setMessage(data.message);
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setErrorMessage(error);
      console.log("Error while deleting the store:", error);
    } finally {
      handleShowLoader(index);
      setStatusChanged(!statusChanged);
    }
  };

  return (
    <div>
      {!storesList && <p>Loading Stores...</p>}
      {message && <p aria-live="polite">{message}</p>}
      {errorMessage && <p aria-live="polite">{errorMessage}</p>}
      {storesList &&
        storesList.map((store, index) => {
          return (
            <div key={store.id}>
              <button onClick={() => setSelectedStoreId(store.id)}>
                <h2>{store.name}</h2>
                <FoodTypeCounter
                  freshFoods={store.freshFoods}
                  cannedFoods={store.cannedFoods}
                />
              </button>
              <p>{selectedStoreId}</p>
              <div>
                {userId === store.createdByUserId &&
                  token &&
                  showDeleteLoader[index] === false && (
                    <button onClick={() => handleDeleteStore(store.id, index)}>
                      X
                    </button>
                  )}
                {showDeleteLoader[index] && <div></div>}
                <Link to="/items-list" state={{ store }}>
                  See food list
                </Link>
              </div>
            </div>
          );
        })}
    </div>
  );
}
