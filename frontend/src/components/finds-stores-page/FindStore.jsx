import { useState, useEffect } from "react";
import TopBar from "../top-bar/TopBar";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const [showStoreList, setShowStoreList] = useState(true);
  const [showUserLocations, setShowUserLocations] = useState(true);
  const [showCustomMap, setShowCustomMap] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowUserLocations(false);
    }
  }, [isMobile]);

  useEffect(() => {
    let timerId;
    if (message) {
      timerId = setTimeout(() => setMessage(null), 5000);
    } else if (error) {
      timerId = setTimeout(() => setError(null), 5000);
    }
    return () => clearTimeout(timerId);
  }, [message, error]);

  const handleShowUserLocationsOptionsClick = () => {
    setShowUserLocations(!showUserLocations);
    setShowCustomMap(!showCustomMap);
  };

  return (
    <>
      <main className={style.findStoreMain}>
        <TopBar setUserId={setUserId} topBarLocation={"finds-stores"} />
        <div className={style.sectionContainer}>
          {message && (
            <p aria-live="polite" className={style.message}>
              {message}
            </p>
          )}
          {error && (
            <p aria-live="polite" className={style.error}>
              {error}
            </p>
          )}

          <section
            aria-labelledby="store-management-heading"
            className={style.storeSection}
            style={isMobile ? { display: showStoreList ? "flex" : "none" } : {}}
          >
            <h2 id="store-management-heading" className={style.srOnly}>
              Manage the addition of new stores, items and view current stores
            </h2>
            <StoreList
              userId={userId}
              storesList={storesList}
              setStoresList={setStoresList}
              sortedStoresList={sortedStoresList}
              setSortedStoresList={setSortedStoresList}
              userLocation={userLocation}
              newStoreLocation={newStoreLocation}
              setNewStoreLocation={setNewStoreLocation}
              addingLocationFromMap={addingLocationFromMap}
              setAddingLocationFromMap={setAddingLocationFromMap}
              setMessage={setMessage}
              setError={setError}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              statusChanged={statusChanged}
              setStatusChanged={setStatusChanged}
            />
          </section>

          <div
            className={`${style.mobileDropdown}  ${
              showStoreList ? style.mobileDropdown : style.mobileDropdownLeft
            }`}
          >
            <button
              onClick={() => setShowStoreList(!showStoreList)}
              className={`${style.mobileDropdownBtn}  ${
                showStoreList ? "" : style.mobileDropdownLeftBtn
              } 
               ${
                 addingLocationFromMap ? (showStoreList ? style.blink : "") : ""
               }
              ${
                newStoreLocation &&
                showStoreList === false &&
                addingLocationFromMap === false
                  ? style.blink
                  : ""
              }
              `}
            >
              {showStoreList ? "SEE THE MAP" : "SEE THE STORE LIST"}
            </button>
          </div>

          <section
            aria-labelledby="map-section-heading"
            className={style.mapSection}
            style={
              isMobile ? { display: !showStoreList ? "flex" : "none" } : {}
            }
          >
            <h2 id="map-section-heading" className={style.srOnly}>
              Map and user location
            </h2>

            {isMobile && (
              <button
                className={style.showUserLocationsOptionBtn}
                onClick={() => handleShowUserLocationsOptionsClick()}
              >
                {showUserLocations ? "CLOSE OPTIONS" : " SHOW LOCATIONS OPTION"}
              </button>
            )}

            {showUserLocations && (
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
            )}
            {showCustomMap && (
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
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
