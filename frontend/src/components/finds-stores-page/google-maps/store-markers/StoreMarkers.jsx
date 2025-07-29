import { useEffect, useState } from "react";
import {
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import StoreRoutes from "../../store-list/store-routes/StoreRoutes";
import FoodTypeCounter from "../../store-list/food-type-counter/FoodTypeCounter";

export default function StoreMarkers({
  storesList,
  selectedStore,
  setSelectedStore,
}) {
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  useEffect(() => {
    if (!geocodingApiLoaded) return;
    setGeocodingService(new window.google.maps.Geocoder());
  }, [geocodingApiLoaded]);

  const handleClick = (store) => {
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

  useEffect(() => {
    if (!geocodingService || !selectedStore) return;

    const newStoreLatLng = {
      lat: selectedStore.location.lat,
      lng: selectedStore.location.lng,
    };

    geocodingService.geocode(
      { location: newStoreLatLng },
      (results, status) => {
        if (results && status === "OK") {
          const storeAddress = results[0].formatted_address;
          setStoreInfo({
            storeName: selectedStore.storeName,
            freshFoods: selectedStore.freshFoods,
            cannedFoods: selectedStore.cannedFoods,
            storeAddress,
            routes: selectedStore.routes,
          });

          setInfoWindowShown(true);
        }
      }
    );
  }, [selectedStore]);

  return (
    <>
      {storesList.map((store) => (
        <AdvancedMarker
          key={store.id}
          position={{
            lat: store.latitude,
            lng: store.longitude,
          }}
          clickable={true}
          onClick={() => handleClick(store)}
        >
          <Pin
            background={"#b7dbff"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}

      {infoWindowShown && selectedStore && storeInfo && (
        <InfoWindow
          position={selectedStore.location}
          pixelOffset={[0, -30]}
          onClose={() => setInfoWindowShown(false)}
        >
          <h2>{storeInfo.storeName}</h2>
          <StoreRoutes routes={storeInfo.routes} />
          <FoodTypeCounter
            freshFoods={storeInfo.freshFoods}
            cannedFoods={storeInfo.cannedFoods}
          />
          <p>{storeInfo.storeAddress}</p>
        </InfoWindow>
      )}
    </>
  );
}
