import React, { useRef, useEffect, useState } from "react";
import PlusSvg from "/assets/images/svg/stores-filter/plus.svg";
import SearchSvg from "/assets/images/svg/store-search/search.svg";
import style from "./ItemsFilter.module.css";

const numericFilters = [
  { label: "Price", attribute: "price", parameter: "price" },
  {
    label: "Expiration Date",
    attribute: "expiration-date",
    parameter: "expirationDate",
  },
  {
    label: "Days Remaining",
    attribute: "days-remaining",
    parameter: "daysRemaining",
  },
];

export default function ItemsFilter({
  itemsList,
  setItemsList,
  searchText,
  setSearchText,
  typesFilter,
  setTypesFilter,
  selectedType,
  setSelectedType,
  hideItem,
  isMobile,
  showFilter,
  setShowFilter,
  showAddFood,
  setShowAddFood,
}) {
  const [focused, setFocused] = useState(false);
  const selectRefs = useRef({});

  useEffect(() => {
    if (itemsList && itemsList.length > 0) {
      let types = [...new Set(itemsList.map((item) => item.type))];
      if (searchText) {
        const visibleItems = itemsList.filter(
          (item) => !hideItem(item, "search")
        );
        types = [...new Set(visibleItems.map((item) => item.type))];
      }
      types.sort();
      types.unshift("none");
      setTypesFilter(types);
    }
  }, [itemsList, selectedType, searchText]);

  let searchHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const handleNumericFilters = (filterName, selectedValue) => {
    Object.entries(selectRefs.current).forEach(([key, ref]) => {
      if (key !== filterName && ref) {
        ref.value = "none";
      }
    });

    const getComparableValue = (dataToSort, filterName) => {
      if (filterName === "expirationDate") {
        return new Date(dataToSort[filterName]);
      } else {
        return dataToSort[filterName];
      }
    };

    const sortedItems = [...itemsList];
    switch (selectedValue) {
      case "ascending":
        sortedItems.sort(
          (a, b) =>
            getComparableValue(a, filterName) -
            getComparableValue(b, filterName)
        );

        break;
      case "descending":
        sortedItems.sort(
          (a, b) =>
            getComparableValue(b, filterName) -
            getComparableValue(a, filterName)
        );
        break;
      default:
        sortedItems.sort((a, b) => a.id - b.id);
    }
    setItemsList(sortedItems);
  };

  const handleItemsFilterBtnClick = (btnType) => {
    if (btnType === "filter") {
      setShowFilter(!showFilter);
      setShowAddFood(false);
    } else {
      setShowFilter(false);
      setShowAddFood(!showAddFood);
    }
  };

  return (
    <div className={style.itemsFilterContainer}>
      <div className={style.itemsSearchContainer}>
        <input
          type="text"
          onChange={searchHandler}
          placeholder="Enter item name"
          name="items-search"
          id="items-search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <label
          htmlFor="items-search"
          aria-label="items-search"
          className={`${style.searchLabel} ${
            focused ? style.searchLabelFocus : ""
          }`}
        >
          <img src={SearchSvg} />
        </label>
      </div>

      {isMobile && (
        <div className={style.itemsFilterBtnContainer}>
          <button
            onClick={() => handleItemsFilterBtnClick("filter")}
            className={`${style.itemsFilterBtn} ${
              showFilter ? style.btnClicked : ""
            }`}
          >
            FILTER
          </button>
          <button
            onClick={() => handleItemsFilterBtnClick("add-food")}
            className={`${style.itemsFilterAddFoodBtn} ${
              showAddFood ? style.btnClicked : ""
            }`}
          >
            ADD FOOD <img src={PlusSvg} />
          </button>
        </div>
      )}

      <div
        className={`${style.labelInputContainer} ${
          showFilter ? "" : style.hideFilter
        }`}
      >
        <label htmlFor="select-type">Type</label>
        <select
          name="select-type"
          id="select-type"
          defaultValue="none"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {typesFilter.map((type) => {
            return (
              <option value={type} key={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>

      {numericFilters.map((filter) => {
        return (
          <React.Fragment key={filter.parameter}>
            <div
              className={`${style.labelInputContainer} ${
                showFilter ? "" : style.hideFilter
              }`}
            >
              <label htmlFor={`items-${filter.attribute}`}>
                {filter.label}
              </label>
              <select
                name={`items-${filter.attribute}`}
                id={`items-${filter.attribute}`}
                onChange={(e) =>
                  handleNumericFilters(filter.parameter, e.target.value)
                }
                ref={(el) => (selectRefs.current[filter.parameter] = el)}
                defaultValue="none"
              >
                <option value="none">None</option>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
