import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export default function NewStoreMarker({ setNewStoreLocation }) {
  const map = useMap();

  useEffect(() => {
    const listener = map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setNewStoreLocation({ location: { lat, lng } });
    });
    return () => listener.remove();
  }, [map, setNewStoreLocation]);

  return null;
}
