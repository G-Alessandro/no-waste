import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import StoreMarkers from "./store-markers/StoreMarkers";
import NewStoreMarker from "./new-store-marker/NewStoreMarker";
import Polyline from "./polyline/Polyline";
import style from "./CustomMap.module.css";

export default function MapComponent({
  selectedStore,
  setSelectedStore,
  userLocation,
  storesList,
  newStoreLocation,
  setNewStoreLocation,
  addingLocationFromMap,
  showUserMarker,
  setShowUserMarker,
  travelMode,
}) {
  const [userMarker, setUserMarker] = useState({
    location: {
      lat: parseFloat(import.meta.env.VITE_DEFAULT_LATITUDE),
      lng: parseFloat(import.meta.env.VITE_DEFAULT_LONGITUDE),
    },
  });
  const [mapCenter, setMapCenter] = useState(userMarker.location);
  const [mapZoom, setMapZoom] = useState(13);
  const [encodedPolyline, setEncodedPolyline] = useState(null);

  useEffect(() => {
    if (userLocation) {
      setUserMarker({
        location: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        },
      });
      setMapZoom(13);
      setShowUserMarker(true);
    }
  }, [userLocation]);

  useEffect(() => {
    setMapCenter(userMarker.location);
  }, [userMarker]);

  useEffect(() => {
    const polyline =
      selectedStore?.routes?.[travelMode]?.polyline?.encodedPolyline;
    if (polyline) {
      setEncodedPolyline(polyline);
    }
  }, [selectedStore, travelMode]);

  useEffect(() => {
    if (newStoreLocation) {
      setMapCenter({
        lat: newStoreLocation.latitude,
        lng: newStoreLocation.longitude,
      });
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
    <div
      className={`${style.mapContainer} ${
        addingLocationFromMap ? style.addLocationFromMap : ""
      }`}
    >
      {userLocation && selectedStore && travelMode && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${selectedStore.location.lat},${selectedStore.location.lng}&travelmode=${travelMode}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Directions
        </a>
      )}
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
            {encodedPolyline &&
              userMarker &&
              selectedStore &&
              showUserMarker && (
                <Polyline
                  encodedPolyline={encodedPolyline}
                  userMarker={userMarker.location}
                  storeMarker={selectedStore.location}
                />
              )}

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
              <AdvancedMarker
                position={{
                  lat: newStoreLocation.latitude,
                  lng: newStoreLocation.longitude,
                }}
              >
                <Pin
                  background="#a8e992"
                  glyphColor="#000"
                  borderColor="#000"
                />
              </AdvancedMarker>
            )}

            {showUserMarker && (
              <AdvancedMarker position={userMarker.location}>
                <Pin
                  background={"#ff5406"}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      )}
    </div>
  );
}
