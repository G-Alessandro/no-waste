import { useState } from "react";
import TopBar from "../top-bar/TopBar";
import AddStore from "./add-store/AddStore.jsx";
import AddStoreItem from "./add-store-item/AddStoreItem.jsx";
import StoreList from "./store-list/StoreList.jsx";
import UserGeolocation from "./user-geolocation/UserGeolocation.jsx";
import CustomMap from "./google-maps/CustomMap.jsx";
import Footer from "../footer/Footer";
import style from "./FindStore.module.css";

export default function FindStore() {
  const [userId, setUserId] = useState(null);
  const [storesList, setStoresList] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newStoreLocation, setNewStoreLocation] = useState(null);
  const [addingNewStore, setAddingNewStore] = useState(false);
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [addingLocationFromMap, setAddingLocationFromMap] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          statusChanged={statusChanged}
          setStatusChanged={setStatusChanged}
        />
        <UserGeolocation setUserLocation={setUserLocation} />
      </section>
      <section>
        <CustomMap
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          userLocation={userLocation}
          storesList={storesList}
          newStoreLocation={newStoreLocation}
          setNewStoreLocation={setNewStoreLocation}
          addingLocationFromMap={addingLocationFromMap}
        />
      </section>
      <Footer />
    </main>
  );
}
