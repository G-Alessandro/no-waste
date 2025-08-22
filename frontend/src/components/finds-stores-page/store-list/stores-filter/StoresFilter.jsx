import { useState, useEffect } from "react";
import StoreSearch from "../store-search/StoreSearch";
import PlusSvg from "/assets/images/svg/stores-filter/plus.svg";
import style from "./StoresFilter.module.css";

export default function StoresFilter({
  storesList,
  setSortedStoresList,
  travelModesFilter,
  setTravelModesFilter,
  travelUnitFilter,
  setTravelUnitFilter,
  setSearchText,
  showAddNewItem,
  setShowAddNewItem,
  showAddNewStore,
  setShowAddNewStore,
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

  const handleAddBtnClick = (addType) => {
    if (addType === "store") {
      setShowAddNewStore(!showAddNewStore);
      setShowAddNewItem(false);
    } else {
      setShowAddNewItem(!showAddNewItem);
      setShowAddNewStore(false);
    }
  };

  return (
    <div>
      <div className={style.filterBtnSearchContainer}>
        <button
          onClick={() => setShowStoreFilter(!showStoreFilter)}
          aria-label="click to filter the stores"
          className={style.filterButton}
        >
          Filters
        </button>
        <StoreSearch setSearchText={setSearchText} />
      </div>

      {showStoreFilter && (
        <div className={style.filterContainer}>
          <div className={style.selectContainer}>
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
          </div>
          <div className={style.inputRadioContainer}>
            <div>
              <input
                type="radio"
                value="distance"
                id="travel-unit-distance"
                name="travel-unit"
                onClick={(e) => setTravelUnitFilter(e.target.value)}
                defaultChecked
              />
              <label htmlFor="travel-unit-distance">Distance</label>
            </div>
            <div>/</div>
            <div>
              <input
                type="radio"
                value="time"
                id="travel-unit-time"
                name="travel-unit"
                onClick={(e) => setTravelUnitFilter(e.target.value)}
              />
              <label htmlFor="travel-unit-time">Time</label>
            </div>
          </div>
        </div>
      )}

      {!showStoreFilter && (
        <div className={style.addBtnContainer}>
          <button
            onClick={() => handleAddBtnClick("store")}
            className={`${style.addBtn} ${
              showAddNewStore ? style.btnClicked : ""
            }`}
          >
            ADD STORE
            <img src={PlusSvg} />
          </button>
          <button
            onClick={() => handleAddBtnClick("item")}
            className={`${style.addBtn} ${
              showAddNewItem ? style.btnClicked : ""
            }`}
          >
            ADD ITEM <img src={PlusSvg} />
          </button>
        </div>
      )}
    </div>
  );
}
