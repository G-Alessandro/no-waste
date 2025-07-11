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
    location: {
      lat: parseFloat(import.meta.env.VITE_DEFAULT_LATITUDE),
      lng: parseFloat(import.meta.env.VITE_DEFAULT_LONGITUDE),
    },
  });

  const [mapCenter, setMapCenter] = useState(userMarker.location);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    if (userLocation) {
      setUserMarker({
        location: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        },
      });
      setMapZoom(13);
    }
  }, [userLocation]);

  useEffect(() => {
    setMapCenter(userMarker.location);
  }, [userMarker]);

  useEffect(() => {
    if (selectedStore) {
      setMapCenter(selectedStore.location);
      setMapZoom(13);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (newStoreLocation) {
      setMapCenter(newStoreLocation.location);
      setMapZoom(13);
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
            zoom={mapZoom}
            center={mapCenter}
            onCameraChanged={(ev) => {
              setMapCenter(ev.detail.center);
              setMapZoom(ev.detail.zoom);
            }}
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
