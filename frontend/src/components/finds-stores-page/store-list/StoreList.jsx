import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FoodTypeCounter from "./food-type-counter/FoodTypeCounter";
import style from "./StoreList.module.css";

export default function StoreList({
  userId,
  storesList,
  setStoresList,
  userLocation,
  selectedStore,
  setSelectedStore,
  statusChanged,
  setStatusChanged,
}) {
  const [showDeleteLoader, setShowDeleteLoader] = useState([]);
  const [message, setMessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  
  useEffect(() => {
    const fetchStoreItemList = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/stores/stores-list/${
            userLocation.latitude
          }/${userLocation.longitude}`,
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
  }, [statusChanged, userLocation]);

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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storeId }),
        }
      );

      const newToken = response.headers.get("Authorization");
      const data = await response.json();

      if (!data) {
        setErrorMessage("Store not found!");
      } else {
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }
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

  const handleStoreSelect = (store) => {
    setSelectedStore({
      storeId: store.id,
      storeName: store.name,
      location: {
        lat: store.latitude,
        lng: store.longitude,
      },
      freshFoods: store.freshFoods,
      cannedFoods: store.cannedFoods,
    });
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
              <button
                onClick={() => handleStoreSelect(store)}
                className={
                  selectedStore?.storeId === store.id
                    ? style.storeButtonClicked
                    : style.storeButton
                }
              >
                <h2>{store.name}</h2>
                <FoodTypeCounter
                  freshFoods={store.freshFoods}
                  cannedFoods={store.cannedFoods}
                />
              </button>
              <div>
                {userId === store.createdByUserId &&
                  localStorage.getItem("accessToken") &&
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
