const storeRoutes = async (userLocation, storeLocation) => {
  const travelsMode = ["DRIVE", "BICYCLE", "WALK", "TRANSIT"];
  const routes = {};

  const createBody = (mode) => {
    const body = {
      origin: {
        location: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: storeLocation.latitude,
            longitude: storeLocation.longitude,
          },
        },
      },
      travelMode: mode,
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: "en-US",
      units: "METRIC",
    };

    if (mode === "DRIVE" || mode === "TWO_WHEELER") {
      body.routingPreference = "TRAFFIC_AWARE";
    }
    return body;
  };

  const formattedRouteDistance = (distance) => {
    const distanceNum = Number(distance);
    return distanceNum < 1000
      ? { distance: distanceNum, distanceUnit: "m" }
      : { distance: (distanceNum / 1000).toFixed(0), distanceUnit: "km" };
  };

  const formattedRouteDuration = (time) => {
    const formattedTime = Number(time.slice(0, -1));
    const date = new Date(formattedTime * 1000);
    const years = Math.floor(formattedTime / (365 * 24 * 3600));
    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const values = { years, days, hours, minutes, seconds };
    const routeDuration = {};

    for (const key of Object.keys(values)) {
      const value = values[key];
      if (value !== 0 && key !== "seconds") {
        routeDuration[key] = value;
      }
      if (key === "seconds" && Object.keys(routeDuration).length === 0) {
        routeDuration[key] = value;
      }
    }
    return routeDuration;
  };

  const routesPromises = travelsMode.map(async (mode) => {
    const body = createBody(mode);
    try {
      const response = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error (${mode}): ${response.status} ${err}`);
      }

      const json = await response.json();
      const routeData = json.routes?.[0];

      const route = {
        distanceMeters: routeData?.distanceMeters
          ? formattedRouteDistance(routeData.distanceMeters)
          : { distance: "no-data" },
        duration: routeData?.duration
          ? formattedRouteDuration(routeData.duration)
          : { duration: "no-data" },
        polyline: routeData?.polyline
          ? routeData.polyline
          : { encodedPolyline: "no-data" },
      };

      routes[mode.toLowerCase()] = route;
    } catch (err) {
      console.error(`Compute Routes error (${mode}):`, err.message);
      return { [mode.toLowerCase()]: { error: err.message } };
    }
  });

  await Promise.all(routesPromises);
  return routes;
};

module.exports = storeRoutes;
