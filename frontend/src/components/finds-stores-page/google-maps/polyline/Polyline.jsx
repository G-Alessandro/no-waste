import { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

export default function Polyline({ encodedPolyline, userMarker, storeMarker }) {
  const map = useMap();
  const geometryLib = useMapsLibrary("geometry");

  useEffect(() => {
    if (!map || !geometryLib || !encodedPolyline) {
      return;
    }

    const path = geometryLib.encoding.decodePath(encodedPolyline);

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    polyline.setMap(map);

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userMarker);
    bounds.extend(storeMarker);

    map.fitBounds(bounds);

    return () => {
      polyline.setMap(null);
    };
  }, [map, geometryLib, encodedPolyline]);

  return null;
}
