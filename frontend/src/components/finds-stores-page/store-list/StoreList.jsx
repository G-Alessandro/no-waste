import { useState, useEffect } from "react";
import StoresFilter from "./stores-filter/StoresFilter";
import StoreSearch from "./store-search/StoreSearch";
import StoreRoutes from "./store-routes/StoreRoutes";
import FoodTypeCounter from "./food-type-counter/FoodTypeCounter";
import DeleteStore from "./delete-store/DeleteStore";
import style from "./StoreList.module.css";

export default function StoreList({
  userId,
  storesList,
  setStoresList,
  sortedStoresList,
  setSortedStoresList,
  userLocation,
  selectedStore,
  setSelectedStore,
  statusChanged,
  setStatusChanged,
}) {
  const [searchText, setSearchText] = useState(null);
  const [travelModesFilter, setTravelModesFilter] = useState("drive");
  const [travelUnitFilter, setTravelUnitFilter] = useState("distance");
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
      routes: store.routes,
    });
  };

  return (
    <div className={style.storeListContainer}>
      {!storesList && <p>Loading Stores...</p>}
      {message && <p aria-live="polite">{message}</p>}
      {errorMessage && <p aria-live="polite">{errorMessage}</p>}
      {storesList && (
        <StoresFilter
          storesList={storesList}
          setSortedStoresList={setSortedStoresList}
          travelModesFilter={travelModesFilter}
          travelUnitFilter={travelUnitFilter}
          setTravelModesFilter={setTravelModesFilter}
          setTravelUnitFilter={setTravelUnitFilter}
        />
      )}
      <StoreSearch setSearchText={setSearchText} />
      <div className={style.storeList}>
        {sortedStoresList &&
          sortedStoresList
            .filter(
              (store) =>
                !searchText ||
                store.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((store, index) => {
              return (
                <div key={store.id} className={style.storeCard}>
                  <button
                    onClick={() => handleStoreSelect(store)}
                    className={`${style.storeBtn} ${
                      selectedStore?.storeId === store.id
                        ? style.storeBtnClicked
                        : ""
                    }`}
                  >
                    <h2>{store.name}</h2>
                    <StoreRoutes routes={store.routes} />
                    <FoodTypeCounter
                      freshFoods={store.freshFoods}
                      cannedFoods={store.cannedFoods}
                    />
                  </button>

                  <DeleteStore
                    userId={userId}
                    store={store}
                    index={index}
                    showDeleteLoader={showDeleteLoader}
                    setShowDeleteLoader={setShowDeleteLoader}
                    setMessage={setMessage}
                    setErrorMessage={setErrorMessage}
                    setStatusChanged={setStatusChanged}
                    statusChanged={statusChanged}
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
}
