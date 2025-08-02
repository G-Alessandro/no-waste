import { useState, useEffect } from "react";

export default function StoresFilter({
  storesList,
  setSortedStoresList,
  travelModesFilter,
  setTravelModesFilter,
  travelUnitFilter,
  setTravelUnitFilter,
}) {
  const [showStoreFilter, setShowStoreFilter] = useState(false);

  useEffect(() => {
    if (!storesList) return;
    const handleTravelFilters = (travelMode, travelUnit) => {
      const sortedStores = [...storesList];

      function durationToSeconds(duration) {
        const SECONDS_IN = {
          year: 365 * 24 * 60 * 60,
          day: 24 * 60 * 60,
          hour: 60 * 60,
          minute: 60,
          second: 1,
        };

        return (
          (duration.years ?? 0) * SECONDS_IN.year +
          (duration.days ?? 0) * SECONDS_IN.day +
          (duration.hours ?? 0) * SECONDS_IN.hour +
          (duration.minutes ?? 0) * SECONDS_IN.minute +
          (duration.seconds ?? 0) * SECONDS_IN.second
        );
      }

      const formattedStoreValue = (store, travelMode, travelUnit) => {
        let result;

        const route = store?.routes?.[travelMode];

        const storeDistanceUnit = route.distanceMeters.distanceUnit;
        const storeDistance = Number(route.distanceMeters.distance);
        const storeDistanceNoData = route.distanceMeters.distance === "no-data";
        const storeTravelDuration = route.duration;
        const storeTravelDurationNoData = route.duration.duration === "no-data";

        if (travelUnit === "distance") {
          if (storeDistanceNoData) {
            return Infinity;
          } else {
            if (storeDistanceUnit === "km") {
              result = storeDistance * 1000;
            } else if (storeDistanceUnit === "m") {
              result = storeDistance;
            }
          }
        } else if (travelUnit === "time") {
          if (storeTravelDurationNoData) {
            return Infinity;
          } else {
            result = durationToSeconds(storeTravelDuration);
          }
        }
        return result;
      };

      sortedStores.sort((a, b) => {
        const storeA = formattedStoreValue(a, travelMode, travelUnit);
        const storeB = formattedStoreValue(b, travelMode, travelUnit);
        return storeA - storeB;
      });

      setSortedStoresList(sortedStores);
    };

    handleTravelFilters(travelModesFilter, travelUnitFilter);
  }, [storesList, travelModesFilter, travelUnitFilter]);

  return (
    <>
      <button onClick={() => setShowStoreFilter(!showStoreFilter)}>
        Filters
      </button>
      {showStoreFilter && (
        <div>
          <label htmlFor="filter-travel-modes">Shortest route:</label>
          <select
            name="filter-travel-modes"
            id="filter-travel-modes"
            defaultValue="drive"
            onChange={(e) => setTravelModesFilter(e.target.value)}
          >
            <option value="walk">Walking</option>
            <option value="bicycle">Bicycle</option>
            <option value="drive">Car</option>
            <option value="transit">Public Transport</option>
          </select>

          <input
            type="radio"
            value="distance"
            id="travel-unit-distance"
            name="travel-unit"
            onClick={(e) => setTravelUnitFilter(e.target.value)}
            defaultChecked
          />
          <label htmlFor="travel-unit-distance">Distance</label>

          <input
            type="radio"
            value="time"
            id="travel-unit-time"
            name="travel-unit"
            onClick={(e) => setTravelUnitFilter(e.target.value)}
          />
          <label htmlFor="travel-unit-time">Time</label>
        </div>
      )}

      <label htmlFor="store-search">Search</label>
      <input
        type="text"
        onChange={searchHandler}
        name="store-search"
        id="store-search"
      />
    </>
  );
}
