import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import StoreMarkers from "./store-markers/StoreMarkers";
import NewStoreMarker from "./new-store-marker/NewStoreMarker";
import style from "./CustomMap.module.css";

export default function MapComponent({
  selectedStore,
  setSelectedStore,
  userLocation,
  storesList,
  newStoreLocation,
  setNewStoreLocation,
  addingLocationFromMap,
}) {
  const [userMarker, setUserMarker] = useState({
    location: { lat: 39.03922, lng: 125.76252 },
  });
  const [mapCenter, setMapCenter] = useState(userMarker.location);

  useEffect(() => {
    if (userLocation) {
      setUserMarker({
        location: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        },
      });
    }
  }, [userLocation]);

  useEffect(() => {
    setMapCenter(userMarker.location);
  }, [userMarker]);

  useEffect(() => {
    if (selectedStore) {
      setMapCenter(selectedStore.location);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (newStoreLocation) {
      setMapCenter(newStoreLocation.location);
    }
    if (!newStoreLocation) {
      if (userLocation) {
        setUserMarker({
          location: {
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          },
        });
      }
      if (!userLocation) {
        setMapCenter(userMarker.location);
      }
    }
  }, [newStoreLocation]);

  return (
    <div className={style.mapContainer}>
      {userMarker && (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            defaultZoom={13}
            center={mapCenter}
          >
            {storesList && (
              <StoreMarkers
                storesList={storesList}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
              />
            )}

            {addingLocationFromMap && (
              <NewStoreMarker setNewStoreLocation={setNewStoreLocation} />
            )}

            {newStoreLocation && (
              <AdvancedMarker position={newStoreLocation.location}>
                <Pin
                  background="#a8e992"
                  glyphColor="#000"
                  borderColor="#000"
                />
              </AdvancedMarker>
            )}

            <AdvancedMarker position={userMarker.location}>
              <Pin
                background={"#ff5406"}
                glyphColor={"#000"}
                borderColor={"#000"}
              />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      )}
    </div>
  );
}
