import { useState, useEffect } from "react";
import TopBar from "../top-bar/TopBar";
import AddStore from "./add-store/AddStore.jsx";
import AddStoreItem from "./add-store-item/AddStoreItem.jsx";
import StoreList from "./store-list/StoreList.jsx";
import UserLocations from "./user-locations/UserLocations.jsx";
import CustomMap from "./google-maps/CustomMap.jsx";
import Footer from "../footer/Footer";
import style from "./FindStore.module.css";

export default function FindStore() {
  const [userId, setUserId] = useState(null);
  const [storesList, setStoresList] = useState(null);
  const [sortedStoresList, setSortedStoresList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newStoreLocation, setNewStoreLocation] = useState(null);
  const [addingNewStore, setAddingNewStore] = useState(false);
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [addingLocationFromMap, setAddingLocationFromMap] = useState(false);
  const [travelMode, setTravelMode] = useState("drive");
  const [statusChanged, setStatusChanged] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: parseFloat(import.meta.env.VITE_DEFAULT_LATITUDE),
    longitude: parseFloat(import.meta.env.VITE_DEFAULT_LONGITUDE),
  });
  const [showUserMarker, setShowUserMarker] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timerId;
    if (message) {
      timerId = setTimeout(() => setMessage(null), 5000);
    } else if (error) {
      timerId = setTimeout(() => setError(null), 5000);
    }
    return () => clearTimeout(timerId);
  }, [message, error]);

  return (
    <main className={style.FindStoreContainer}>
      <TopBar setUserId={setUserId} />
      <section>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        {userId && (
          <>
            <button onClick={() => setAddingNewStore(!addingNewStore)}>
              ADD STORE
            </button>
            {addingNewStore && (
              <AddStore
                newStoreLocation={newStoreLocation}
                setNewStoreLocation={setNewStoreLocation}
                setAddingNewStore={setAddingNewStore}
                statusChanged={statusChanged}
                setStatusChanged={setStatusChanged}
                setMessage={setMessage}
                setError={setError}
                addingLocationFromMap={addingLocationFromMap}
                setAddingLocationFromMap={setAddingLocationFromMap}
              />
            )}
            <button onClick={() => setAddingNewItem(!addingNewItem)}>
              ADD ITEM
            </button>
            {storesList && addingNewItem && (
              <AddStoreItem
                statusChanged={statusChanged}
                setStatusChanged={setStatusChanged}
                userId={userId}
                storesList={storesList}
                setMessage={setMessage}
                setError={setError}
              />
            )}
          </>
        )}
        <StoreList
          userId={userId}
          storesList={storesList}
          setStoresList={setStoresList}
          sortedStoresList={sortedStoresList}
          setSortedStoresList={setSortedStoresList}
          userLocation={userLocation}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          statusChanged={statusChanged}
          setStatusChanged={setStatusChanged}
        />
      </section>
      <section>
        <UserLocations
          userId={userId}
          setMessage={setMessage}
          setError={setError}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          setShowUserMarker={setShowUserMarker}
          travelMode={travelMode}
          setTravelMode={setTravelMode}
        />
        <CustomMap
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          userLocation={userLocation}
          storesList={storesList}
          newStoreLocation={newStoreLocation}
          setNewStoreLocation={setNewStoreLocation}
          addingLocationFromMap={addingLocationFromMap}
          showUserMarker={showUserMarker}
          setShowUserMarker={setShowUserMarker}
          travelMode={travelMode}
        />
      </section>
      <Footer />
    </main>
  );
}
